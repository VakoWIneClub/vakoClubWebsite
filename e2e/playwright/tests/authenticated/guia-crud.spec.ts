import { test, expect, skipIfNoAdminCreds, loginAsAdmin, testRunId } from '../fixtures/admin-auth';

/**
 * End-to-end coverage of the Guía admin CRUD flow against the real backend (see
 * tests/fixtures/admin-auth.ts). Every winery this spec creates is deleted before the test ends.
 */
test.describe('Guía — admin winery CRUD', () => {
  test.beforeEach(async ({ page }) => {
    skipIfNoAdminCreds();
    await loginAsAdmin(page);
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
    const wineryUrl = page.url();

    try {
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
    } finally {
      // Delete: clean up regardless of whether the edit assertions above passed.
      await page.goto(wineryUrl);
      const eliminarButton = page.getByRole('button', { name: 'Eliminar' });
      if (await eliminarButton.isVisible().catch(() => false)) {
        await eliminarButton.click();
        await page.getByRole('button', { name: 'Sí, eliminar' }).click();
        await expect(page).toHaveURL(/\/guia$/);
        await expect(page.getByRole('heading', { name: title })).toHaveCount(0);
      }
    }
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
