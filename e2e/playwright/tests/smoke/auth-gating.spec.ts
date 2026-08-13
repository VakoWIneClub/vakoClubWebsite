import { test, expect } from '../fixtures/test';

/**
 * ProtectedRoute (src/components/ProtectedRoute.jsx) does not redirect —
 * it renders an inline "sign up / log in" gate on the same URL. These specs
 * pin that contract for every route wrapped in <ProtectedRoute> in App.jsx.
 */
const protectedPages = [
  '/guia',
  '/guia/crear',
  '/perfil',
  '/perfil/suscripcion',
  '/noticias/crear',
  '/eventos/crear',
];

for (const path of protectedPages) {
  test(`${path} shows the sign-up gate for an unauthenticated visitor`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: /descorcha un mundo de sabores/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /registrarse gratis/i })).toHaveAttribute('href', '/suscripcion');
    await expect(page.getByRole('link', { name: /ya tengo cuenta/i })).toHaveAttribute('href', '/login');
  });
}

test('the "Ya tengo cuenta" gate CTA leads to the login form', async ({ page }) => {
  await page.goto('/perfil');
  await page.getByRole('link', { name: /ya tengo cuenta/i }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
});
