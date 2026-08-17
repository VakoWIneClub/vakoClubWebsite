import { test, expect } from '@playwright/test';

/**
 * Regression coverage for a real incident: a paid checkout returned the buyer to the site
 * without downloading or emailing the guide (Tienda.jsx imported CompraResultBanner but never
 * rendered it, and the landing page didn't handle the Stripe return at all). Stripe itself can't
 * be driven in an automated test, so these mock /api/verify-session and /api/download-guide at
 * the network boundary and exercise exactly the client-side path that was broken: reading
 * ?compra=exito&session_id=... on return, verifying the session, and getting the PDF to the
 * buyer's device (auto-download, with a manual "Descargar guía" link as a backup).
 *
 * Deliberately uses the plain @playwright/test (not fixtures/test.ts): the landing page has its
 * own language + 18+ gate instead of the site-wide AgeVerificationPopup, so both are seeded here.
 */
const SESSION_ID = 'cs_test_copa_purchase_123';
const DOWNLOAD_URL = `/api/download-guide?session_id=${SESSION_ID}`;
const GUIDE_FILENAME = 'El Mundo de la Copa - Vako Club.pdf';

const mockVerifySession = (page, body) =>
  page.route('**/api/verify-session*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
  );

const mockDownloadGuide = (page) =>
  page.route('**/api/download-guide*', (route) =>
    route.fulfill({
      status: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': `attachment; filename="${GUIDE_FILENAME}"`,
      },
      body: '%PDF-1.4 fake guide content for e2e test',
    })
  );

test.describe('El mundo de la copa — post-purchase download', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('copa-landing-gate-passed', 'true');
      window.localStorage.setItem('copa-landing-lang', 'es');
      window.localStorage.setItem('ageVerified', 'true');
    });
  });

  test('a paid session downloads the PDF automatically and keeps a manual fallback link', async ({ page }) => {
    await mockVerifySession(page, { paid: true, guideName: 'El Mundo de la Copa', downloadUrl: DOWNLOAD_URL });
    await mockDownloadGuide(page);

    const downloadPromise = page.waitForEvent('download');
    // waitUntil: 'commit' — the app's own auto-download effect fires a second top-level
    // navigation (intercepted as a download) before the first navigation's 'load' event would
    // otherwise fire, which leaves the default 'load' wait hanging.
    await page.goto(`/tienda/el-mundo-de-la-copa?compra=exito&session_id=${SESSION_ID}`, { waitUntil: 'commit' });

    // The whole point of the fix: no extra click needed, the guide lands on the device.
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(GUIDE_FILENAME);

    await expect(page.getByText('¡Gracias por tu compra!')).toBeVisible();
    const backupLink = page.getByRole('link', { name: 'Descargar guía' });
    await expect(backupLink).toBeVisible();
    await expect(backupLink).toHaveAttribute('href', DOWNLOAD_URL);
  });

  test('an unpaid/invalid session shows an error instead of silently doing nothing', async ({ page }) => {
    await mockVerifySession(page, { paid: false });

    await page.goto(`/tienda/el-mundo-de-la-copa?compra=exito&session_id=${SESSION_ID}`);

    await expect(page.getByText('No pudimos confirmar el pago')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Descargar guía' })).toHaveCount(0);
  });

  test('a cancelled checkout shows the cancellation message, not a payment error', async ({ page }) => {
    await page.goto('/tienda/el-mundo-de-la-copa?compra=cancelada');

    await expect(page.getByText('Compra cancelada')).toBeVisible();
    await expect(page.getByText('No pudimos confirmar el pago')).toHaveCount(0);
  });

  test('a normal visit with no ?compra param shows no purchase banner at all', async ({ page }) => {
    await page.goto('/tienda/el-mundo-de-la-copa');

    await expect(page.getByText('¡Gracias por tu compra!')).toHaveCount(0);
    await expect(page.getByText('Compra cancelada')).toHaveCount(0);
  });

  test('the generic /tienda entry point also surfaces the download after a successful payment', async ({ page }) => {
    // Covers the exact regression: CompraResultBanner was imported in Tienda.jsx but never
    // rendered, so this path silently showed nothing to a paying customer.
    await mockVerifySession(page, { paid: true, guideName: 'El Mundo de la Copa', downloadUrl: DOWNLOAD_URL });

    await page.goto(`/tienda?compra=exito&session_id=${SESSION_ID}`);

    await expect(page.getByText(/Gracias por tu compra/)).toBeVisible();
    await expect(page.getByRole('link', { name: /Descargar guía/i })).toBeVisible();
  });
});
