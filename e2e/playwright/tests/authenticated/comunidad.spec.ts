import { test, expect, skipIfNoAdminCreds, loginAsAdmin, testRunId } from '../fixtures/admin-auth';

/**
 * End-to-end coverage of the Comunidad forum (create/reply/delete a thread) against the real
 * backend (see tests/fixtures/admin-auth.ts). Every thread this spec creates is deleted before
 * the test ends.
 */
test.describe('Comunidad — Foro de Debate', () => {
  test.beforeEach(async ({ page }) => {
    skipIfNoAdminCreds();
    await loginAsAdmin(page);
    await page.goto('/comunidad');
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

    try {
      // Reply.
      await threadCard.getByPlaceholder('Escribe una respuesta...').fill(replyText);
      await threadCard.getByRole('button', { name: 'Enviar respuesta' }).click();
      await expect(threadCard.getByText(replyText)).toBeVisible();
    } finally {
      // Delete — cleans up regardless of whether the reply assertion above passed.
      await threadCard.getByRole('button', { name: 'Eliminar tema' }).click();
      await page.getByRole('button', { name: 'Sí, eliminar' }).click();
      await expect(page.locator('.copa-card').filter({ hasText: title })).toHaveCount(0);
    }
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
