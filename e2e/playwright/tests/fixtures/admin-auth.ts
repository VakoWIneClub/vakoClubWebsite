import { test, expect } from './test';

/**
 * Shared helper for specs that need to act as a signed-in admin. There is no separate
 * test/staging Supabase project — these specs authenticate against the real backend using
 * credentials from E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD (see e2e/playwright/.env locally,
 * gitignored; CI supplies the same two vars as repository secrets). Every spec that creates
 * data through this helper MUST delete what it created before the test ends, since there is no
 * separate database to reset between runs.
 */
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

export function skipIfNoAdminCreds() {
  test.skip(
    !ADMIN_EMAIL || !ADMIN_PASSWORD,
    'Set E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD (e2e/playwright/.env locally, or repo secrets in CI) to run this spec.'
  );
}

export async function loginAsAdmin(page) {
  await page.goto('/login');
  await page.locator('#email').fill(ADMIN_EMAIL);
  await page.locator('#password').fill(ADMIN_PASSWORD);
  await page.getByRole('main').getByRole('button', { name: 'Iniciar Sesión' }).click();
  // Login redirects to /perfil by default (see Login.jsx's `from` fallback) — waiting for it
  // confirms the session actually established before the test proceeds.
  await expect(page).toHaveURL(/\/perfil$/);
}

// A short, hard-to-collide-with suffix so parallel/rerun test data never collides with real
// content or with itself across retries.
export const testRunId = () => `e2e-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export { test, expect };
