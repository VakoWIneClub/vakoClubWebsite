import { test, expect, skipIfNoAdminCreds, loginAsAdmin, testRunId } from '../fixtures/admin-auth';

/**
 * End-to-end coverage of the Eventos admin CRUD flow against the real backend (see
 * tests/fixtures/admin-auth.ts). There is no separate test environment yet — only production —
 * so every event this spec creates is tracked in `eventUrl` and deleted in `afterEach`, not just
 * inline after the assertions. That way cleanup still runs even if a step between creation and
 * the old inline cleanup throws.
 */
test.describe('Eventos — admin event CRUD', () => {
  let eventUrl: string | null = null;

  test.beforeEach(async ({ page }) => {
    skipIfNoAdminCreds();
    await loginAsAdmin(page);
  });

  test.afterEach(async ({ page }) => {
    if (!eventUrl) return;
    // eventUrl is only ever set after creation is confirmed, and the test body never deletes its
    // own event — so it's guaranteed to still exist here. Deliberately no isVisible()-style soft
    // check: that's a one-shot, non-retrying read that can catch the page mid-render under load
    // and wrongly conclude there's nothing to clean up, silently leaving real data behind with no
    // failure to signal it. expect(...).toBeVisible() retries instead, and if the button
    // genuinely isn't there, this hook SHOULD fail loudly rather than skip.
    //
    // Delete from the detail page directly — unlike Noticias, Eventos exposes delete there.
    await page.goto(eventUrl);
    const eliminarButton = page.getByRole('button', { name: 'Eliminar' });
    await expect(eliminarButton).toBeVisible();
    await eliminarButton.click();
    await page.getByRole('button', { name: 'Sí, eliminar' }).click();
    await expect(page).toHaveURL(/\/eventos$/);
    eventUrl = null;
  });

  test('create, edit, and delete an event', async ({ page }) => {
    const runId = testRunId();
    const title = `E2E Test Event ${runId}`;
    const updatedLocation = `Updated Venue ${runId}`;

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
    // Recorded immediately so afterEach can always find and delete it, even if an assertion
    // below throws.
    eventUrl = page.url();

    // Edit: change the location and confirm the change persists.
    await page.getByRole('link', { name: 'Editar Evento' }).click();
    await expect(page).toHaveURL(/\/eventos\/editar\//);
    const locationInput = page.locator('#location');
    await expect(locationInput).toHaveValue('Test Venue');
    await locationInput.fill(updatedLocation);
    await page.getByRole('button', { name: 'Guardar Cambios' }).click();

    await expect(page).toHaveURL(/\/eventos\/[^/]+$/);
    await expect(page.getByText(updatedLocation)).toBeVisible();

    // Must also show up in the public list (default view — upcoming events only).
    await page.goto('/eventos');
    await expect(page.getByRole('heading', { name: title, level: 3 })).toBeVisible();
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
