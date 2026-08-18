import { test, expect, skipIfNoAdminCreds, loginAsAdmin, testRunId } from '../fixtures/admin-auth';

/**
 * End-to-end coverage of the Comunidad forum (create/reply/delete a thread) against the real
 * backend (see tests/fixtures/admin-auth.ts). There is no separate test environment yet — only
 * production — so every thread this spec creates is tracked in `threadTitle` and deleted in
 * `afterEach`, not just inline after the assertions. That way cleanup still runs even if a step
 * between creation and the old inline cleanup throws.
 */
test.describe('Comunidad — Foro de Debate', () => {
  let threadTitle: string | null = null;

  test.beforeEach(async ({ page }) => {
    skipIfNoAdminCreds();
    await loginAsAdmin(page);
    await page.goto('/comunidad');
  });

  test.afterEach(async ({ page }) => {
    if (!threadTitle) return;
    // threadTitle is only ever set after creation is confirmed, and the test body never deletes
    // its own thread — so it's guaranteed to still exist here. Deliberately no isVisible()-style
    // soft check: that's a one-shot, non-retrying read that can catch the page mid-render under
    // load and wrongly conclude there's nothing to clean up, silently leaving real data behind
    // with no failure to signal it. expect(...).toBeVisible() retries instead, and if the card
    // genuinely isn't there, this hook SHOULD fail loudly rather than skip.
    await page.goto('/comunidad');
    const threadCard = page.locator('.copa-card').filter({ hasText: threadTitle }).first();
    await expect(threadCard).toBeVisible();
    await threadCard.getByRole('button', { name: 'Eliminar tema' }).click();
    await page.getByRole('button', { name: 'Sí, eliminar' }).click();
    await expect(page.locator('.copa-card').filter({ hasText: threadTitle })).toHaveCount(0);
    threadTitle = null;
  });

  test('create a thread, reply to it, then delete it', async ({ page }) => {
    const runId = testRunId();
    const title = `E2E Test Thread ${runId}`;
    const category = 'E2E';
    const message = `E2E test message ${runId}`;
    const replyText = `E2E test reply ${runId}`;

    await page.getByRole('button', { name: 'Iniciar Conversación' }).click();
    await page.locator('#title').fill(title);
    await page.locator('#category').fill(category);
    await page.locator('#content').fill(message);
    await page.getByRole('button', { name: 'Publicar Tema' }).click();

    // New threads sort first (created_at desc), so the card should be the top one immediately —
    // no need to page through "Mostrar Más Conversaciones".
    const threadCard = page.locator('.copa-card').filter({ hasText: title }).first();
    await expect(threadCard).toBeVisible();
    await expect(threadCard.getByText(message)).toBeVisible();
    // Recorded immediately so afterEach can always find and delete it, even if an assertion
    // below throws.
    threadTitle = title;

    // Reply.
    await threadCard.getByPlaceholder('Escribe una respuesta...').fill(replyText);
    await threadCard.getByRole('button', { name: 'Enviar respuesta' }).click();
    await expect(threadCard.getByText(replyText)).toBeVisible();
  });

  test('rejects a whitespace-only thread instead of creating a blank one', async ({ page }) => {
    await page.getByRole('button', { name: 'Iniciar Conversación' }).click();
    await page.locator('#title').fill('   ');
    await page.locator('#category').fill('   ');
    await page.locator('#content').fill('   ');
    await page.getByRole('button', { name: 'Publicar Tema' }).click();

    await expect(page.getByText('Campos incompletos', { exact: true })).toBeVisible();
    // The form must still be open — a successful submit closes it (setShowForm(false)).
    await expect(page.getByRole('button', { name: 'Publicar Tema' })).toBeVisible();
  });
});

test.describe('Comunidad — Miembros del Club', () => {
  test.beforeEach(async ({ page }) => {
    skipIfNoAdminCreds();
    await loginAsAdmin(page);
    await page.goto('/comunidad?tab=miembros');
  });

  test('search filters the member grid', async ({ page }) => {
    const searchBox = page.getByPlaceholder('Buscar miembros por nombre...');
    await searchBox.fill('this-name-should-not-match-anyone-zzz');
    await expect(page.getByText('No se encontraron miembros')).toBeVisible();

    await searchBox.fill('');
    // Clearing the search must restore the full, unfiltered member grid.
    await expect(page.getByText('No se encontraron miembros')).toHaveCount(0);
  });
});
