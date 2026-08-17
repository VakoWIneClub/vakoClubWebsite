import { test, expect } from '../fixtures/test';

/**
 * One entry per publicly reachable route (see src/App.jsx). Each page must
 * respond, render its Navbar/Footer chrome and set the title defined in its
 * <Helmet>. This is the floor: "the app didn't crash and shipped the right page."
 */
const publicPages = [
  { path: '/', title: 'Vako Club - Tu Comunidad de Vinos' },
  { path: '/noticias', title: 'Noticias del Vino - Vako Club' },
  { path: '/eventos', title: 'Eventos de Vino - Vako Club' },
  { path: '/comunidad', title: 'Comunidad - Vako Club' },
  { path: '/tienda', title: 'Tienda Exclusiva - Vako Club | Guías, Vinos, Arte y Accesorios' },
  { path: '/contacto', title: 'Contacto - Vako Club' },
  { path: '/suscripcion', title: 'Suscripción - Vako Club' },
  { path: '/login', title: 'Iniciar Sesión - Vako Club' },
  { path: '/terminos', title: 'Términos y Condiciones - Vako Club' },
  { path: '/politica-privacidad', title: 'Política de Privacidad - Vako Club' },
  { path: '/sobre-nosotros', title: 'Sobre Nosotros - Vako Club' },
];

for (const { path, title } of publicPages) {
  test(`${path} loads and renders`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.ok(), `${path} should respond with a 2xx/3xx status`).toBeTruthy();

    await expect(page).toHaveTitle(title);
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
}

test('unknown routes do not crash the app', async ({ page }) => {
  const response = await page.goto('/esta-ruta-no-existe');
  expect(response?.ok()).toBeTruthy();
  // No catch-all route is declared in App.jsx, so React Router renders nothing
  // for the <main> content — the chrome (Navbar/Footer) must still render.
  await expect(page.locator('nav')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
});
