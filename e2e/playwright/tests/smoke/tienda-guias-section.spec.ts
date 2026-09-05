import { test, expect } from '../fixtures/test';

/**
 * Regression coverage for a real bug found in a full-site audit: the "Quiero esta guía" button
 * for "El Mundo de la Copa" called the checkout API directly without a `lang` field, always
 * shipping the Spanish PDF regardless of the visitor's language — only the title/image links
 * went through the language-selection landing page. The button must now route through that
 * landing page too, the only place that actually sends `lang` to the checkout session.
 */
test.describe('Tienda — guías grid', () => {
  test('"Quiero esta guía" routes through the language-selection landing, not straight to checkout', async ({ page }) => {
    await page.goto('/tienda');

    const card = page.locator('.copa-card').filter({ hasText: 'El Mundo de la Copa' });
    const ctaLink = card.getByRole('link', { name: 'Quiero esta guía' });
    await expect(ctaLink).toHaveAttribute('href', '/tienda/el-mundo-de-la-copa');

    await ctaLink.click();
    await expect(page).toHaveURL(/\/tienda\/el-mundo-de-la-copa$/);
  });

  test('"Avísame" still opens the notify dialog for a not-yet-available guide', async ({ page }) => {
    await page.goto('/tienda');

    const card = page.locator('.copa-card').filter({ hasText: 'Guía del Vino Francés' });
    await card.getByRole('button', { name: 'Avísame' }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
