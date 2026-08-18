import { test, expect } from '../fixtures/test';

/**
 * NOTE: src/components/contacto/ContactForm.jsx exists in the codebase but is
 * not imported by src/pages/Contacto.jsx — the live page has no contact form,
 * only a hero and ContactInfo links (no FAQ section either). These smoke
 * checks cover what actually renders; see the QA notes shared alongside this
 * suite.
 */
test.describe('Contacto page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contacto');
  });

  test('renders the hero and contact channels', async ({ page }) => {
    // The footer also links to Instagram/email, so channel assertions are
    // scoped to <main> to avoid matching the footer's duplicate links.
    const main = page.getByRole('main');
    await expect(page.getByRole('heading', { name: 'Hablemos de Vino' })).toBeVisible();
    await expect(main.getByRole('link', { name: /email/i })).toHaveAttribute('href', 'mailto:info@vakoclub.com');
    await expect(main.getByRole('link', { name: /instagram/i })).toHaveAttribute('href', 'https://www.instagram.com/vakoclub');
  });
});
