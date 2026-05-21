import { expect, test } from '@playwright/test';
import {
  ROUTES,
  clickBack,
  clickContinue,
  expectNoValidationSummary,
  expectPageChrome,
  expectValidationSummary,
  fillNotificationCaseInfo
} from '../utils/test-helpers';

/**
 * Notification Application Form – E2E Tests
 *
 * Form URL: /notification_application
 * Steps:
 *   0 – Overview
 *   1 – Case Information
 *   2 – Applicant Information
 *   3 – Notification Recipient & Details
 *   4 – Declaration & Authorization
 *   5 – Confirmation (after submit)
 *
 * NOTE: Tests do NOT submit the form to avoid creating records in CRM.
 *       Validation and navigation are tested up to the Declaration step.
 */

test.describe('Notification Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.notificationApplication, { waitUntil: 'domcontentloaded' });
    // Wait for Angular to bootstrap and set the page title
    await expect(page).toHaveTitle(/Notification Application Form/);
    // Confirm the form heading is also visible before each test
    await expect(page.getByRole('heading', { name: 'Notification Application Form', level: 3 })).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Smoke tests
  // ──────────────────────────────────────────

  test('TC-NA-01: page loads with correct title and structure', async ({ page }) => {
    await expectPageChrome(page);
    await expect(page.getByRole('heading', { name: 'Notification Application Form', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Overview', level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Overview', exact: false })).toBeVisible();
  });

  test('TC-NA-02: stepper shows all expected steps in correct order', async ({ page }) => {
    const steps = [
      'Overview',
      'Case Information',
      'Applicant Information',
      'Notification Recipient & Details',
      'Declaration & Authorization'
    ];
    for (const step of steps) {
      await expect(page.getByRole('button', { name: step, exact: false })).toBeVisible();
    }
  });

  test('TC-NA-03: Overview displays informational content and collection notice', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Collection Notice', level: 3 })).toBeVisible();
    await expect(page.getByText('Victim Safety Unit (VSU)')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Victims of Crime Act' })).toBeVisible();
  });

  test('TC-NA-04: additional info banner shows contact details', async ({ page }) => {
    await expect(page.getByText('604-660-0316')).toBeVisible();
    await expect(page.getByRole('link', { name: 'vsusg@gov.bc.ca' })).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Navigation – Step 0 → Step 1
  // ──────────────────────────────────────────

  test('TC-NA-05: START APPLICATION navigates to Case Information', async ({ page }) => {
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await expect(page.getByRole('heading', { name: 'Case Information', level: 1 })).toBeVisible();
  });

  test('TC-NA-06: BACK from Case Information returns to Overview', async ({ page }) => {
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await expect(page.getByRole('heading', { name: 'Case Information', level: 1 })).toBeVisible();
    await clickBack(page);
    await expect(page.getByRole('heading', { name: 'Overview', level: 1 })).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Validation – Case Information (Step 1)
  // ──────────────────────────────────────────

  test('TC-NA-07: validation errors appear when continuing from empty Case Information', async ({ page }) => {
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await expectNoValidationSummary(page);
    await clickContinue(page);
    await expectValidationSummary(page);
  });

  test('TC-NA-08: Case Information shows required field error for First Name', async ({ page }) => {
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await clickContinue(page);
    await expect(page.getByText('Please enter your first name')).toBeVisible();
  });

  test('TC-NA-09: Case Information shows required field error for Last Name', async ({ page }) => {
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await clickContinue(page);
    await expect(page.getByText('Please enter your last name')).toBeVisible();
  });

  test('TC-NA-10: Case Information shows required field error for Birth Date', async ({ page }) => {
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await clickContinue(page);
    await expect(page.getByText('Please enter your birth date')).toBeVisible();
  });

  test('TC-NA-11: Case Information shows required field errors for Court Information', async ({ page }) => {
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await clickContinue(page);
    await expect(page.getByText('Please enter the court file number')).toBeVisible();
    await expect(page.getByText('Please enter a court location')).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Navigation – Case Information (Step 1) → Applicant Information (Step 2)
  // ──────────────────────────────────────────

  test('TC-NA-12: filled Case Information advances to Applicant Information', async ({ page }) => {
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await fillNotificationCaseInfo(page);
    await clickContinue(page);
    await expect(page.getByRole('heading', { name: 'Applicant Information', level: 1 })).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Applicant Information (Step 2)
  // ──────────────────────────────────────────

  test('TC-NA-13: Applicant Information shows "I am the" radio options for Notification form', async ({ page }) => {
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await fillNotificationCaseInfo(page);
    await clickContinue(page);

    await expect(page.getByRole('heading', { name: 'Applicant Information', level: 1 })).toBeVisible();
    await expect(page.getByText('Victim', { exact: true })).toBeVisible();
    await expect(page.getByText('Civil Protected Party', { exact: true })).toBeVisible();
    await expect(page.getByText("Victim's Parent / Guardian", { exact: true })).toBeVisible();
    await expect(page.getByText('Other Family Member', { exact: true })).toBeVisible();
  });

  test('TC-NA-14: validation error appears when no applicant type is selected', async ({ page }) => {
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await fillNotificationCaseInfo(page);
    await clickContinue(page);

    await clickContinue(page);
    await expectValidationSummary(page);
    await expect(page.getByText('Please select one')).toBeVisible();
  });
});
