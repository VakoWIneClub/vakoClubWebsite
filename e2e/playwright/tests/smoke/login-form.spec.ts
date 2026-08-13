import { test, expect } from '../fixtures/test';

test.describe('Login form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // The navbar also renders an "Iniciar Sesión" link/button on this page, so
  // every form assertion is scoped to <main> to avoid ambiguous matches.
  const submitButton = (page) => page.getByRole('main').getByRole('button', { name: 'Iniciar Sesión' });

  test('renders email, password and submit control', async ({ page }) => {
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(submitButton(page)).toBeVisible();
    await expect(page.getByRole('link', { name: /reg[ií]strate gratis/i })).toHaveAttribute('href', '/suscripcion');
  });

  test('rejects submission with empty fields', async ({ page }) => {
    await submitButton(page).click();
    await expect(page.getByText('El correo electrónico es obligatorio.')).toBeVisible();
    await expect(page.getByText('La contraseña es obligatoria.')).toBeVisible();
  });

  test('rejects a malformed email', async ({ page }) => {
    // "test@test" satisfies the input's native type="email" constraint (so the
    // browser lets the submit through) but fails the app's stricter regex,
    // which requires a dot after the "@".
    await page.locator('#email').fill('test@test');
    await page.locator('#password').fill('somepassword');
    await submitButton(page).click();
    await expect(page.getByText('El correo electrónico no es válido.')).toBeVisible();
  });

  test('password visibility toggle switches the input type', async ({ page }) => {
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await page.locator('#password').locator('..').getByRole('button').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
