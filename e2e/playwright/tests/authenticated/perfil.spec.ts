import { test, expect, skipIfNoAdminCreds, loginAsAdmin, testRunId } from '../fixtures/admin-auth';

/**
 * End-to-end coverage of the Perfil edit form against the real backend and the real admin
 * account (see tests/fixtures/admin-auth.ts) — there is no throwaway test user. The persistence
 * test captures the account's original bio/interest_topic, changes them, verifies the change
 * survives a reload (proving it round-tripped through the DB, not just local state), then
 * restores the original values so the real account isn't left permanently modified.
 */
test.describe('Perfil — profile edit form', () => {
  test.beforeEach(async ({ page }) => {
    skipIfNoAdminCreds();
    await loginAsAdmin(page);
    await page.goto('/perfil');
  });

  test('saving a change persists across a reload, and the original value is restored after', async ({ page }) => {
    const runId = testRunId();
    const testBio = `E2E test bio ${runId}`;

    const bioField = page.locator('#bio');
    const originalBio = await bioField.inputValue();

    try {
      await bioField.fill(testBio);
      await page.getByRole('button', { name: 'Guardar Cambios' }).click();
      await expect(page.getByText('Perfil Guardado', { exact: true })).toBeVisible();

      // Reload and re-fetch from the server — confirms the save actually persisted, not just
      // the in-memory form state.
      await page.reload();
      await expect(page.locator('#bio')).toHaveValue(testBio);
    } finally {
      await page.locator('#bio').fill(originalBio);
      await page.getByRole('button', { name: 'Guardar Cambios' }).click();
      await expect(page.getByText('Perfil Guardado', { exact: true })).toBeVisible();
    }
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
