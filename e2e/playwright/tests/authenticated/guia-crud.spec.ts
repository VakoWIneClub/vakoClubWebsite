import { test, expect, skipIfNoAdminCreds, loginAsAdmin, testRunId } from '../fixtures/admin-auth';

/**
 * End-to-end coverage of the Guía admin CRUD flow against the real backend (see
 * tests/fixtures/admin-auth.ts). There is no separate test environment yet — only production —
 * so every winery this spec creates is tracked in `wineryUrl` and deleted in `afterEach`, not
 * just inline after the assertions. That way cleanup still runs even if a step between creation
 * and the old inline cleanup throws.
 */
test.describe('Guía — admin winery CRUD', () => {
  let wineryUrl: string | null = null;

  test.beforeEach(async ({ page }) => {
    skipIfNoAdminCreds();
    await loginAsAdmin(page);
  });

  test.afterEach(async ({ page }) => {
    if (!wineryUrl) return;
    // wineryUrl is only ever set after creation is confirmed, and the test body never deletes
    // its own winery — so it's guaranteed to still exist here. Deliberately no isVisible()-style
    // soft check: that's a one-shot, non-retrying read that can catch the page mid-render under
    // load and wrongly conclude there's nothing to clean up, silently leaving real data behind
    // with no failure to signal it. expect(...).toBeVisible() retries instead, and if the button
    // genuinely isn't there, this hook SHOULD fail loudly rather than skip.
    await page.goto(wineryUrl);
    const eliminarButton = page.getByRole('button', { name: 'Eliminar' });
    await expect(eliminarButton).toBeVisible();
    await eliminarButton.click();
    await page.getByRole('button', { name: 'Sí, eliminar' }).click();
    await expect(page).toHaveURL(/\/guia$/);
    wineryUrl = null;
  });

  test('create, edit, and delete a winery', async ({ page }) => {
    const runId = testRunId();
    const title = `E2E Test Winery ${runId}`;
    const updatedCity = `Updated City ${runId}`;

    await page.goto('/guia/crear');
    await page.locator('#title').fill(title);
    await page.locator('#country').fill('Testland');
    await page.locator('#city').fill('Test City');
    // Address is deliberately left blank — filling it would trigger a real geocoding call to
    // Nominatim on save, which is unnecessary network traffic/flakiness for this spec.
    await page.getByRole('button', { name: 'Publicar' }).click();

    // WineryEditor navigates to /guia/:slug on success.
    await expect(page).toHaveURL(/\/guia\/[^/]+$/);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    // Recorded immediately so afterEach can always find and delete it, even if an assertion
    // below throws.
    wineryUrl = page.url();

    // Edit: change the city and confirm the change persists.
    await page.getByRole('link', { name: 'Editar' }).click();
    await expect(page).toHaveURL(/\/guia\/editar\//);
    const cityInput = page.locator('#city');
    await expect(cityInput).toHaveValue('Test City');
    await cityInput.fill(updatedCity);
    await page.getByRole('button', { name: 'Guardar' }).click();

    await expect(page).toHaveURL(/\/guia\/[^/]+$/);
    await expect(page.getByText(updatedCity)).toBeVisible();

    // The winery must also show up in the public list.
    await page.goto('/guia');
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  });

  test('the create form rejects missing required fields', async ({ page }) => {
    await page.goto('/guia/crear');
    await page.getByRole('button', { name: 'Publicar' }).click();

    await expect(page.getByText('El nombre es obligatorio')).toBeVisible();
    await expect(page.getByText('El país es obligatorio')).toBeVisible();
    await expect(page.getByText('La ciudad es obligatoria')).toBeVisible();
    // Must not navigate away — no winery should have been created.
    await expect(page).toHaveURL(/\/guia\/crear$/);
  });
});
