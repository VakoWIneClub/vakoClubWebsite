import { test, expect } from '../fixtures/test';

const navLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Noticias', path: '/noticias' },
  { name: 'Tienda', path: '/tienda' },
  { name: 'Eventos', path: '/eventos' },
  { name: 'Comunidad', path: '/comunidad' },
  { name: 'Contacto', path: '/contacto' },
];

test.describe('Desktop navbar', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  for (const { name, path } of navLinks) {
    test(`navigating to "${name}" via the navbar goes to ${path}`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('navigation').getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    });
  }

  test('logo link returns to the home page', async ({ page }) => {
    await page.goto('/contacto');
    await page.getByRole('navigation').getByRole('link').first().click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('Mobile navbar', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hamburger menu opens and navigates to a page', async ({ page }) => {
    await page.goto('/');
    // The toggle button has no accessible name (icon-only, no aria-label),
    // so it's targeted structurally as the first visible button in the navbar.
    await page.getByRole('navigation').getByRole('button').first().click();
    await page.getByRole('navigation').getByRole('link', { name: 'Contacto', exact: true }).click();
    await expect(page).toHaveURL(/\/contacto$/);
  });
});
