import { test, expect } from '@playwright/test';

/**
 * The hero cover art was a single Spanish-only image regardless of the selected language. Each
 * language now has its own cover file; this guards against silently falling back to the wrong
 * one when a language is picked.
 *
 * Deliberately uses the plain @playwright/test (not fixtures/test.ts): the landing page has its
 * own language + 18+ gate instead of the site-wide AgeVerificationPopup.
 */
// Keyed by the button's accessible name (aria-label={LANG_NAMES[code]} in the component),
// not the two-letter code shown as its visible text.
const COVER_BY_LANG_NAME = {
  Español: '/images/guias/el-mundo-de-la-copa-tapa.jpg',
  English: '/images/guias/el-mundo-de-la-copa-tapa-en.jpg',
  Português: '/images/guias/el-mundo-de-la-copa-tapa-pt.png',
};

test.describe('El mundo de la copa — cover art follows the selected language', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('copa-landing-gate-passed', 'true');
      window.localStorage.setItem('copa-landing-lang', 'es');
    });
  });

  for (const [langName, expectedSrc] of Object.entries(COVER_BY_LANG_NAME)) {
    test(`shows the ${langName} cover when ${langName} is selected`, async ({ page }) => {
      await page.goto('/tienda/el-mundo-de-la-copa');
      await page.getByRole('navigation', { name: /Language/i }).getByRole('button', { name: langName }).click();

      const cover = page.locator('img[alt*="Vako Club"]').first();
      await expect(cover).toHaveAttribute('src', expectedSrc);
      // The image must actually resolve (not a 404 for a mistyped filename).
      const response = await page.request.get(expectedSrc);
      expect(response.ok()).toBeTruthy();
    });
  }
});
