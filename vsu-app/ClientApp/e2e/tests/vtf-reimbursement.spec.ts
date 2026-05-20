import { expect, test } from '@playwright/test';
import {
  ROUTES,
  clickContinue,
  expectNoValidationSummary,
  expectPageChrome,
  expectValidationSummary
} from '../utils/test-helpers';

/**
 * Victim Travel Fund Reimbursement Form – E2E Tests
 *
 * Form URL: /vtf_reimbursement
 * Steps:
 *   0 – VTF Case Information  (case # + birth date lookup against CRM)
 *   1 – Travel Information & Expenses
 *   2 – Declaration & Authorization
 *   3 – Confirmation (after submit)
 *
 * IMPORTANT: Step 0 performs a CRM case lookup.  Advancing past this step
 * requires a valid VTF Case # and matching Birth Date in the target environment.
 * Tests marked with @requires-valid-case need real test data.
 * All other tests validate UI structure and front-end validation only.
 *
 * NOTE: Tests do NOT submit the form to avoid creating records in CRM.
 */

test.describe('VTF Reimbursement', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.vtfReimbursement, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Victim Travel Fund Reimbursement Form/);
    await expect(page.getByRole('heading', { name: 'Victim Travel Fund Reimbursement Form', level: 3 })).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Smoke tests
  // ──────────────────────────────────────────

  test('TC-VTR-01: page loads with correct title and structure', async ({ page }) => {
    await expectPageChrome(page);
    await expect(page.getByRole('heading', { name: 'Victim Travel Fund Reimbursement Form', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Case Information', level: 1 })).toBeVisible();
  });

  test('TC-VTR-02: stepper shows the three expected steps', async ({ page }) => {
    const steps = ['VTF Case Information', 'Travel Information & Expenses', 'Declaration & Authorization'];
    for (const step of steps) {
      await expect(page.getByRole('button', { name: step, exact: false })).toBeVisible();
    }
  });

  test('TC-VTR-03: Case Information shows Collection Notice', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Collection Notice', level: 3 })).toBeVisible();
    await expect(page.getByText('$3,000.00')).toBeVisible();
  });

  test('TC-VTR-04: Case Information displays VTF Case # and Birth Date fields', async ({ page }) => {
    await expect(page.getByText('VTF Case #')).toBeVisible();
    await expect(page.getByText('Birth Date')).toBeVisible();
    await expect(page.getByText('First Name')).toBeVisible();
    await expect(page.getByText('Last Name')).toBeVisible();
  });

  test('TC-VTR-05: additional info banner shows contact details', async ({ page }) => {
    await expect(page.getByText('604-660-0316')).toBeVisible();
    await expect(page.getByRole('link', { name: 'vsusg@gov.bc.ca' })).toBeVisible();
  });

  test('TC-VTR-06: page shows funding limit and 90-day submission info', async ({ page }) => {
    await expect(page.getByText('$3,000.00')).toBeVisible();
    await expect(page.getByText('90 days')).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Validation – VTF Case Information (Step 0)
  // ──────────────────────────────────────────

  test('TC-VTR-07: validation errors appear when continuing with empty Case Information', async ({ page }) => {
    await expectNoValidationSummary(page);
    await clickContinue(page);
    await expectValidationSummary(page);
  });

  test('TC-VTR-08: required field errors shown for VTF Case #', async ({ page }) => {
    await clickContinue(page);
    await expect(page.getByText('Please enter your vtf case number')).toBeVisible();
  });

  test('TC-VTR-09: required field errors shown for Birth Date', async ({ page }) => {
    await clickContinue(page);
    await expect(page.getByText('Please enter your birth date')).toBeVisible();
  });

  test('TC-VTR-10: required field errors shown for First Name', async ({ page }) => {
    await clickContinue(page);
    await expect(page.getByText('Please enter your first name')).toBeVisible();
  });

  test('TC-VTR-11: required field errors shown for Last Name', async ({ page }) => {
    await clickContinue(page);
    await expect(page.getByText('Please enter your last name')).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Partial input – Case # format
  // ──────────────────────────────────────────

  test('TC-VTR-12: entering only VTF Case # still shows birth date error', async ({ page }) => {
    const caseInput = page.locator('input').first();
    await caseInput.fill('VTF-9999-INVALID');
    await clickContinue(page);
    await expect(page.getByText('Please enter your birth date')).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Travel Information & Expenses (Step 1)
  // Note: requires a valid case lookup to reach this step.
  // The tests below are tagged so they can be skipped when no test data exists.
  // ──────────────────────────────────────────

  test('TC-VTR-13: Travel Information shows transportation expense types @requires-valid-case', async ({ page }) => {
    // This test requires valid test data; skip in environments without known VTF cases.
    test.skip(true, 'Requires a valid VTF Case # and Birth Date for the target environment');
  });

  // ──────────────────────────────────────────
  // Navigation helpers
  // ──────────────────────────────────────────

  test('TC-VTR-14: START FORM button is present on first step', async ({ page }) => {
    // Reimbursement form uses "START FORM" for the first CONTINUE action
    await expect(page.getByRole('button', { name: /START FORM|CONTINUE/ })).toBeVisible();
  });
});
