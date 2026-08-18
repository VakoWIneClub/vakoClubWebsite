import { test, expect, skipIfNoAdminCreds, loginAsAdmin, testRunId } from '../fixtures/admin-auth';

/**
 * End-to-end coverage of the Noticias admin CRUD flow, plus comments, against the real backend
 * (see tests/fixtures/admin-auth.ts). Every article this spec creates is deleted before the test
 * ends.
 */
test.describe('Noticias — admin article CRUD', () => {
  test.beforeEach(async ({ page }) => {
    skipIfNoAdminCreds();
    await loginAsAdmin(page);
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

    try {
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

      // New articles sort first (created_at desc), so it must appear at the top of the list
      // without needing to paginate.
      await page.goto('/noticias');
      await expect(page.getByRole('heading', { name: updatedTitle, level: 3 })).toBeVisible();
    } finally {
      // Delete: clean up regardless of whether the assertions above passed. The delete control
      // only exists on the list page's card overlay, not the article detail page itself.
      await page.goto('/noticias');
      const card = page.locator('div.relative.group').filter({ has: page.getByRole('heading', { name: updatedTitle, level: 3 }) });
      if (await card.isVisible().catch(() => false)) {
        await card.getByRole('button', { name: 'Eliminar artículo' }).click();
        await page.getByRole('button', { name: 'Sí, eliminar' }).click();
        await expect(page.getByRole('heading', { name: updatedTitle, level: 3 })).toHaveCount(0);
      }
    }
  });

  test('the create form rejects an empty title and empty content', async ({ page }) => {
    await page.goto('/noticias/crear');
    await page.getByRole('button', { name: 'Publicar' }).click();

    await expect(page.getByText('El título es obligatorio')).toBeVisible();
    await expect(page.getByText('El contenido no puede estar vacío')).toBeVisible();
    await expect(page).toHaveURL(/\/noticias\/crear$/);
  });
});
