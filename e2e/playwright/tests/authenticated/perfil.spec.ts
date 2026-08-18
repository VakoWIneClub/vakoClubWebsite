import { test, expect, skipIfNoAdminCreds, loginAsAdmin, testRunId } from '../fixtures/admin-auth';

/**
 * End-to-end coverage of the Perfil edit form against the real backend and the real admin
 * account (see tests/fixtures/admin-auth.ts) — there is no throwaway test user and no separate
 * test environment, only production. `beforeEach` captures the account's original bio before
 * each test touches anything, and `afterEach` unconditionally restores it, so the real account is
 * never left modified even if a test throws partway through.
 */
test.describe('Perfil — profile edit form', () => {
  // playwright.config.ts sets fullyParallel: true, which can split a single file's tests across
  // separate worker processes. Every test here reads/writes the SAME real account's bio field —
  // unlike the other authenticated specs, which each create their own uniquely-named entity, this
  // one has no per-test isolation. Running two of these concurrently raced in practice: one worker
  // captured the other's in-flight test bio as "original" and wrote it back over the real value.
  // Serial mode forces both tests into the same worker, in order, closing that race for good.
  test.describe.configure({ mode: 'serial' });

  let originalBio: string | null = null;

  test.beforeEach(async ({ page }) => {
    skipIfNoAdminCreds();
    await loginAsAdmin(page);
    await page.goto('/perfil');
    originalBio = await page.locator('#bio').inputValue();
  });

  test.afterEach(async ({ page }) => {
    if (originalBio === null) return;
    await page.goto('/perfil');
    await page.locator('#bio').fill(originalBio);
    await page.getByRole('button', { name: 'Guardar Cambios' }).click();
    await expect(page.getByText('Perfil Guardado', { exact: true })).toBeVisible();
    originalBio = null;
  });

  test('saving a change persists across a reload', async ({ page }) => {
    const runId = testRunId();
    const testBio = `E2E test bio ${runId}`;

    await page.locator('#bio').fill(testBio);
    await page.getByRole('button', { name: 'Guardar Cambios' }).click();
    await expect(page.getByText('Perfil Guardado', { exact: true })).toBeVisible();

    // Reload and re-fetch from the server — confirms the save actually persisted, not just
    // the in-memory form state. The original bio is restored by afterEach above.
    await page.reload();
    await expect(page.locator('#bio')).toHaveValue(testBio);
  });

  test('bio and interest_topic reject input over their length limit', async ({ page }) => {
    // handleInputChange does `if (value.length > 150) return` — since page.fill() sets the
    // whole value in one native "input" event (not real keystroke-by-keystroke typing), a single
    // over-limit .fill() is rejected in full rather than truncated, leaving the field unchanged.
    // Either way, the DOM value must never exceed the limit.
    const bioField = page.locator('#bio');
    await bioField.fill('x'.repeat(200));
    expect((await bioField.inputValue()).length).toBeLessThanOrEqual(150);

    const interestField = page.locator('#interest_topic');
    await interestField.fill('x'.repeat(40));
    expect((await interestField.inputValue()).length).toBeLessThanOrEqual(20);

    // Deliberately never saved (no "Guardar Cambios" click) — nothing was persisted.
  });
});
