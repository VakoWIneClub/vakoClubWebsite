import { test, expect, skipIfNoAdminCreds, loginAsAdmin, testRunId } from '../fixtures/admin-auth';

/**
 * End-to-end coverage of the Noticias admin CRUD flow, plus comments, against the real backend
 * (see tests/fixtures/admin-auth.ts). There is no separate test environment yet — only
 * production — so every article this spec creates is tracked in `articleTitle` and deleted in
 * `afterEach`, not just inline after the assertions. That way cleanup still runs even if a step
 * between creation and the old inline cleanup throws.
 *
 * Tracked by TITLE, not slug: ArticleEditor regenerates the article's slug from its title on
 * save (unlike Eventos, whose slug is fixed at creation), so a slug captured once at creation
 * would go stale the moment the test renames the article, leaving afterEach looking up a URL
 * that no longer exists ("Artículo no encontrado") and silently skipping cleanup. `articleTitle`
 * is instead updated to track whatever title is currently expected to be live.
 */
test.describe('Noticias — admin article CRUD', () => {
  let articleTitle: string | null = null;

  test.beforeEach(async ({ page }) => {
    skipIfNoAdminCreds();
    await loginAsAdmin(page);
  });

  test.afterEach(async ({ page }) => {
    if (!articleTitle) return;
    // articleTitle is only ever set (or updated) after a state change is confirmed, and the test
    // body never deletes its own article — so a card with this title is guaranteed to still
    // exist here. Deliberately no isVisible()-style soft check: that's a one-shot, non-retrying
    // read that can catch the page mid-render under load and wrongly conclude there's nothing to
    // clean up, silently leaving real data behind with no failure to signal it.
    // expect(...).toBeVisible() retries instead, and if the card genuinely isn't there, this hook
    // SHOULD fail loudly rather than skip. The delete control only exists on the list page's card
    // overlay, not the article detail page itself.
    await page.goto('/noticias');
    const card = page.locator('div.relative.group').filter({ has: page.getByRole('heading', { name: articleTitle, level: 3 }) });
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: 'Eliminar artículo' }).click();
    await page.getByRole('button', { name: 'Sí, eliminar' }).click();
    await expect(page.getByRole('heading', { name: articleTitle, level: 3 })).toHaveCount(0);
    articleTitle = null;
  });

  test('create, comment on, edit, and delete an article', async ({ page }) => {
    const runId = testRunId();
    const title = `E2E Test Article ${runId}`;
    const updatedTitle = `${title} (edited)`;
    const commentText = `E2E test comment ${runId}`;

    await page.goto('/noticias/crear');
    await page.locator('#title').fill(title);
    await page.locator('.ql-editor').click();
    await page.keyboard.type('Contenido de prueba generado por un test automatizado end-to-end.');
    await page.getByRole('button', { name: 'Publicar' }).click();

    // ArticleEditor navigates to /noticias/:slug on success.
    await expect(page).toHaveURL(/\/noticias\/[^/]+$/);
    await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible();
    // Recorded immediately so afterEach can always find and delete it, even if an assertion
    // below throws.
    articleTitle = title;

    // Comment: post one, confirm it renders, then delete it.
    const commentBox = page.getByPlaceholder('Escribe tu comentario aquí...');
    await commentBox.fill(commentText);
    await page.getByRole('button', { name: 'Enviar Comentario' }).click();
    await expect(page.getByText(commentText)).toBeVisible();
    await page.getByRole('button', { name: 'Eliminar comentario' }).click();
    await expect(page.getByText(commentText)).toHaveCount(0);

    // Edit: change the title and confirm the change persists.
    await page.getByRole('link', { name: 'Editar Artículo' }).click();
    await expect(page).toHaveURL(/\/noticias\/editar\//);
    const titleInput = page.locator('#title');
    await expect(titleInput).toHaveValue(title);
    await titleInput.fill(updatedTitle);
    await page.getByRole('button', { name: 'Guardar Cambios' }).click();

    await expect(page).toHaveURL(/\/noticias\/[^/]+$/);
    await expect(page.getByRole('heading', { name: updatedTitle, level: 1 })).toBeVisible();
    // The rename is confirmed live — update the tracked title so afterEach looks for the right
    // card (a stale pre-rename title would no longer match anything).
    articleTitle = updatedTitle;

    // New articles sort first (created_at desc), so it must appear at the top of the list
    // without needing to paginate.
    await page.goto('/noticias');
    await expect(page.getByRole('heading', { name: updatedTitle, level: 3 })).toBeVisible();
  });

  test('the create form rejects an empty title and empty content', async ({ page }) => {
    await page.goto('/noticias/crear');
    await page.getByRole('button', { name: 'Publicar' }).click();

    await expect(page.getByText('El título es obligatorio')).toBeVisible();
    await expect(page.getByText('El contenido no puede estar vacío')).toBeVisible();
    await expect(page).toHaveURL(/\/noticias\/crear$/);
  });
});
