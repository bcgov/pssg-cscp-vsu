import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup: warm up the server by loading each form route once.
 * This prevents cold-start 404s from the test environment server.
 */
export default async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  if (!baseURL) return;

  const routes = ['notification_application', 'vtf_application', 'vtf_reimbursement'];

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const route of routes) {
    try {
      await page.goto(`${baseURL}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    } catch {
      // warm-up is best-effort — ignore failures
    }
  }

  await browser.close();
}
