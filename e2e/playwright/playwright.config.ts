import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Minimal, dependency-free .env loader (no `dotenv` package in this project's devDependencies).
 * Used for E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD, which authenticated specs read to log in as an
 * admin against the real Supabase backend (there is no separate test/staging project — see
 * tests/fixtures/admin-auth.ts). The file itself is gitignored (matches the root .gitignore's
 * `.env` pattern); CI supplies the same two vars as repository secrets instead.
 */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(path.resolve(__dirname, '.env'));

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Default is 30s. Bumped up because every test here hits the real (unmocked) Supabase backend —
   * under local resource contention, a tight timeout is more likely to cut a test off mid-flight,
   * skipping its afterEach cleanup and leaving test data behind in production. */
  timeout: 45 * 1000,
  /* Default is 5s. Same reasoning as the test timeout above — web-first assertions like
   * expect(page).toHaveURL(...) need more retry headroom against a real backend under load. */
  expect: { timeout: 10 * 1000 },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [
        // 'blob' lets the CI workflow merge per-shard results into one HTML report.
        ['blob', { outputDir: 'blob-report' }],
        ['allure-playwright', { resultsDir: 'allure-results' }],
        // Annotates failures directly on the GitHub Actions run.
        ['github'],
      ]
    : [
        ['html', { open: 'never' }],
        ['allure-playwright', { resultsDir: 'allure-results' }],
        ['list'],
      ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Only Chromium is exercised for now. Add projects back here (e.g.
    // 'webkit', 'firefox') if cross-browser coverage is needed later.

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run the app's Vite dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    cwd: '../..',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
