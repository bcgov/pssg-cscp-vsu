import { defineConfig, devices } from '@playwright/test';

/**
 * VSU Web Forms - Playwright E2E Test Configuration
 *
 * Environment selection (cross-platform, no env vars needed):
 *   npm run e2e             → localhost (http://localhost:4200)
 *   npm run e2e:dev         → dev       (https://dev.justice.gov.bc.ca/vsuwebforms)
 *   npm run e2e:test        → test      (https://test.justice.gov.bc.ca/vsuwebforms)
 *
 * Or target a specific env directly:
 *   npx playwright test --project=localhost
 *   npx playwright test --project=dev
 *   npx playwright test --project=test
 *
 * Or override the URL entirely:
 *   BASE_URL=http://localhost:4200 npx playwright test --project=localhost
 */

const BASE_URLS: Record<string, string> = {
  localhost: 'http://localhost:4200/',
  dev: 'https://dev.justice.gov.bc.ca/vsuwebforms/',
  test: 'https://test.justice.gov.bc.ca/vsuwebforms/'
};

export default defineConfig({
  testDir: './e2e/tests',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Angular apps may need a bit more time to bootstrap
    actionTimeout: 15_000,
    navigationTimeout: 45_000
  },
  expect: {
    // Allow up to 15 s for Angular to update the page title / render content
    timeout: 15_000
  },

  projects: [
    {
      name: 'localhost',
      use: { baseURL: process.env.BASE_URL ?? BASE_URLS.localhost, ...devices['Desktop Chrome'] }
    },
    {
      name: 'dev',
      use: { baseURL: process.env.BASE_URL ?? BASE_URLS.dev, ...devices['Desktop Chrome'] }
    },
    {
      name: 'test',
      use: { baseURL: process.env.BASE_URL ?? BASE_URLS.test, ...devices['Desktop Chrome'] }
    }
  ]
});
