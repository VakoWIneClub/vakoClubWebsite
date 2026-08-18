import { test, expect, skipIfNoAdminCreds, loginAsAdmin, testRunId } from '../fixtures/admin-auth';

/**
 * End-to-end coverage of the Eventos admin CRUD flow against the real backend (see
 * tests/fixtures/admin-auth.ts). Every event this spec creates is deleted before the test ends.
 */
test.describe('Eventos — admin event CRUD', () => {
  test.beforeEach(async ({ page }) => {
    skipIfNoAdminCreds();
    await loginAsAdmin(page);
  });

  test('create and delete an event', async ({ page }) => {
    const runId = testRunId();
    const title = `E2E Test Event ${runId}`;

    await page.goto('/eventos/crear');
    await page.locator('#title').fill(title);
    await page.locator('.ql-editor').click();
    await page.keyboard.type('Detalles de prueba generados por un test automatizado end-to-end.');
    // A year out, so this never accidentally shows up as a "Finalizado" past event.
    await page.locator('#event_date').fill('2027-06-15T18:00');
    await page.locator('#location').fill('Test Venue');
    await page.locator('#country').fill('Testland');
    await page.locator('#city').fill('Test City');
    await page.getByRole('button', { name: 'Publicar Evento' }).click();

    // EventoEditor navigates to /eventos/:slug on success.
    await expect(page).toHaveURL(/\/eventos\/[^/]+$/);
    await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible();
    const eventUrl = page.url();

    try {
      // Must also show up in the public list (default view — upcoming events only).
      await page.goto('/eventos');
      await expect(page.getByRole('heading', { name: title, level: 3 })).toBeVisible();
    } finally {
      // Delete from the detail page directly — unlike Noticias, Eventos exposes delete there.
      await page.goto(eventUrl);
      const eliminarButton = page.getByRole('button', { name: 'Eliminar' });
      if (await eliminarButton.isVisible().catch(() => false)) {
        await eliminarButton.click();
        await page.getByRole('button', { name: 'Sí, eliminar' }).click();
        await expect(page).toHaveURL(/\/eventos$/);
      }
    }
  });

  // KNOWN BUG (not fixable from application code — see EventoEditor.jsx's update call, which is
  // byte-for-byte identical to the working WineryEditor/ArticleEditor pattern): saving an edit to
  // ANY event, real or test-created, silently updates 0 rows in the DB and surfaces a "multiple
  // (or no) rows returned" error. Confirmed against a real pre-existing production event, not
  // just test data. Root cause is almost certainly a Supabase RLS UPDATE policy on the `events`
  // table that never matches for admins (leading hypothesis: it checks role = 'admin' without
  // 'superadmin', the same gap `isAdminUser()` was added to fix client-side — or it references an
  // ownership column `events` doesn't have). Needs a Supabase Dashboard policy fix, tracked
  // separately. test.fail() below flips the pass/fail expectation: this test SHOULD fail today;
  // once the RLS policy is fixed it will start passing, which Playwright reports as an unexpected
  // pass — the signal to remove this annotation.
  test('editing an event persists the change', async ({ page }) => {
    test.fail(true, 'Known RLS bug on the events table UPDATE policy — see comment above.');

    const runId = testRunId();
    const title = `E2E Test Event ${runId}`;
    const updatedLocation = `Updated Venue ${runId}`;

    await page.goto('/eventos/crear');
    await page.locator('#title').fill(title);
    await page.locator('.ql-editor').click();
    await page.keyboard.type('Detalles de prueba generados por un test automatizado end-to-end.');
    await page.locator('#event_date').fill('2027-06-15T18:00');
    await page.locator('#location').fill('Test Venue');
    await page.locator('#country').fill('Testland');
    await page.locator('#city').fill('Test City');
    await page.getByRole('button', { name: 'Publicar Evento' }).click();

    await expect(page).toHaveURL(/\/eventos\/[^/]+$/);
    const eventUrl = page.url();

    try {
      await page.getByRole('link', { name: 'Editar Evento' }).click();
      await expect(page).toHaveURL(/\/eventos\/editar\//);
      await page.locator('#location').fill(updatedLocation);
      await page.getByRole('button', { name: 'Guardar Cambios' }).click();

      await expect(page).toHaveURL(/\/eventos\/[^/]+$/);
      await expect(page.getByText(updatedLocation)).toBeVisible();
    } finally {
      await page.goto(eventUrl);
      const eliminarButton = page.getByRole('button', { name: 'Eliminar' });
      if (await eliminarButton.isVisible().catch(() => false)) {
        await eliminarButton.click();
        await page.getByRole('button', { name: 'Sí, eliminar' }).click();
        await expect(page).toHaveURL(/\/eventos$/);
      }
    }
  });

  test('the create form rejects missing required fields', async ({ page }) => {
    await page.goto('/eventos/crear');
    await page.getByRole('button', { name: 'Publicar Evento' }).click();

    await expect(page.getByText('El título es obligatorio')).toBeVisible();
    await expect(page.getByText('La descripción es obligatoria')).toBeVisible();
    await expect(page.getByText('La fecha es obligatoria')).toBeVisible();
    await expect(page.getByText('El lugar es obligatorio')).toBeVisible();
    await expect(page).toHaveURL(/\/eventos\/crear$/);
  });
});
