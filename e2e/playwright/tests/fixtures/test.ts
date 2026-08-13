import { test as base, expect } from '@playwright/test';

/**
 * Base test extended to skip the age-verification gate (AgeVerificationPopup),
 * which otherwise blocks every page behind a modal 2s after load. Every smoke
 * spec except age-verification.spec.ts should import `test`/`expect` from here.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('ageVerified', 'true');
    });
    await use(page);
  },
});

export { expect };
