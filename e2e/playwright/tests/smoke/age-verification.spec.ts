import { test, expect } from '@playwright/test';

/**
 * Deliberately uses the plain @playwright/test (not fixtures/test.ts), since
 * every other smoke spec pre-seeds localStorage to skip this exact gate.
 */
test.describe('Age verification gate', () => {
  test('blocks the page until the visitor confirms their age', async ({ page }) => {
    await page.goto('/');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Verificación de Edad')).toBeVisible();

    const acceptButton = page.getByRole('button', { name: 'Aceptar' });
    await expect(acceptButton).toBeDisabled();

    await page.getByRole('checkbox', { name: /tengo la edad necesaria/i }).check();
    await expect(acceptButton).toBeEnabled();

    await acceptButton.click();
    await expect(dialog).toBeHidden();
  });

  test('remembers acceptance across a reload', async ({ page }) => {
    test.setTimeout(45000);
    await page.goto('/');
    await page.getByRole('checkbox', { name: /tengo la edad necesaria/i }).check();
    await page.getByRole('button', { name: 'Aceptar' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();

    await page.reload();
    // Vite's dev-server HMR socket stays open indefinitely, so 'networkidle'
    // never resolves here — a plain wait is used instead to outlast the
    // popup's 2s delayed setTimeout.
    await page.waitForTimeout(2500);
    await expect(page.getByRole('dialog')).toBeHidden();
  });
});
