import { test, expect } from '../fixtures/test';

/**
 * Regression coverage for two changes shipped together:
 *
 * 1. The cart popup used to only list guides already added — adding another one meant closing
 *    the popup and going back to that guide's own landing. It now lists every guide in the
 *    catalog with a checkbox, so a visitor can add (or remove) guides without leaving the popup.
 *
 * 2. The volume discount used to give one free guide per every complete group of 3 (llevando 6
 *    habría regalado 2). It's now a single discount per purchase from 3 guides on — llevando 3 se
 *    pagan 2, llevando 4 se pagan 3, y así sucesivamente, siempre una sola guía gratis. See
 *    api/_lib/catalog.js (aplicarPromo3x2, the real charge) and src/contexts/CartContext.jsx
 *    (calcularPromo3x2, the display-only mirror).
 */
test.describe('Carrito — checklist de guías y oferta por volumen', () => {
  test('agregar y sacar guías desde el checklist del popup actualiza el carrito', async ({ page }) => {
    await page.goto('/tienda/guia-vino-frances');
    await page.getByRole('button', { name: 'Agregar al carrito — USD 14.99' }).first().click();
    await page.getByRole('button', { name: /Ver carrito/ }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Guías disponibles')).toBeVisible();

    const rowEspanol = dialog.locator('label').filter({ hasText: 'Guía del Vino Español' });
    const rowFrances = dialog.locator('label').filter({ hasText: 'Guía del Vino Francés' });
    await expect(rowFrances.getByRole('checkbox')).toBeChecked();
    await expect(rowEspanol.getByRole('checkbox')).not.toBeChecked();

    await rowEspanol.getByRole('checkbox').click();
    await expect(rowEspanol.getByRole('checkbox')).toBeChecked();
    await expect(page.getByRole('button', { name: /Pagar todo/ })).toContainText('USD 29.98');

    // Destildar la saca del carrito igual que el botón "quitar" de antes.
    await rowEspanol.getByRole('checkbox').click();
    await expect(rowEspanol.getByRole('checkbox')).not.toBeChecked();
    await expect(page.getByRole('button', { name: /Pagar todo/ })).toContainText('USD 14.99');
  });

  test('a partir de 3 guías se regala exactamente una, sin importar cuántas más se agreguen', async ({ page }) => {
    await page.goto('/tienda/guia-vino-frances');
    await page.getByRole('button', { name: 'Agregar al carrito — USD 14.99' }).first().click();
    await page.getByRole('button', { name: /Ver carrito/ }).click();
    const dialog = page.getByRole('dialog');

    // exact: true porque, sin eso, el texto es case-insensitive y matchea también "sale
    // gratis." del banner de la oferta arriba, no solo el badge "GRATIS" de una línea.
    await dialog.locator('label').filter({ hasText: 'Guía del Vino Español' }).getByRole('checkbox').click();
    // Con 2 guías todavía no hay descuento.
    await expect(page.getByRole('button', { name: /Pagar todo/ })).toContainText('USD 29.98');
    await expect(dialog.getByText('GRATIS', { exact: true })).toHaveCount(0);

    await dialog.locator('label').filter({ hasText: 'Guía del Vino Argentino' }).getByRole('checkbox').click();
    // Con 3, se regala una sola — USD 29.98 (2 × 14.99), no USD 14.99.
    await expect(page.getByRole('button', { name: /Pagar todo/ })).toContainText('USD 29.98');
    await expect(dialog.getByText('GRATIS', { exact: true })).toHaveCount(1);

    await dialog.locator('label').filter({ hasText: 'El Mundo de la Copa' }).getByRole('checkbox').click();
    // Con 4 sigue siendo una sola gratis — USD 44.97 (3 × 14.99), no USD 29.98 (que sería 2 gratis).
    await expect(page.getByRole('button', { name: /Pagar todo/ })).toContainText('USD 44.97');
    await expect(dialog.getByText('GRATIS', { exact: true })).toHaveCount(1);
  });
});
