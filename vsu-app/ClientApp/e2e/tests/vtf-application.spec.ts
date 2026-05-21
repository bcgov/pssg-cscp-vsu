import { expect, test } from '@playwright/test';
import {
  ROUTES,
  clickBack,
  clickContinue,
  expectNoValidationSummary,
  expectPageChrome,
  expectValidationSummary,
  fillVTFApplicantInfoVictim,
  fillVTFOverviewEligibility
} from '../utils/test-helpers';

/**
 * Victim Travel Fund Application Form – E2E Tests
 *
 * Form URL: /vtf_application
 * Steps:
 *   0 – Overview (eligibility questions)
 *   1 – Applicant Information
 *   2 – Case Information
 *   3 – Travel Information
 *   4 – Declaration & Authorization
 *   5 – Confirmation (after submit)
 *
 * NOTE: Tests do NOT submit the form to avoid creating records in CRM.
 *       Validation and navigation are tested up to the Declaration step.
 */

test.describe('VTF Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.vtfApplication, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Victim Travel Fund Application Form/);
    await expect(page.getByRole('heading', { name: 'Victim Travel Fund Application Form', level: 3 })).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Smoke tests
  // ──────────────────────────────────────────

  test('TC-VTA-01: page loads with correct title and structure', async ({ page }) => {
    await expectPageChrome(page);
    await expect(page.getByRole('heading', { name: 'Victim Travel Fund Application Form', level: 3 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Overview', level: 1 })).toBeVisible();
  });

  test('TC-VTA-02: stepper shows all expected steps in correct order', async ({ page }) => {
    const steps = [
      'Overview',
      'Applicant Information',
      'Case Information',
      'Travel Information',
      'Declaration & Authorization'
    ];
    for (const step of steps) {
      await expect(page.getByRole('button', { name: step, exact: false })).toBeVisible();
    }
  });

  test('TC-VTA-03: Overview shows eligibility content and Collection Notice', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Collection Notice', level: 3 })).toBeVisible();
    await expect(page.getByText('$3,000.00').first()).toBeVisible();
    await expect(page.getByText('Victim Travel Fund provides funding')).toBeVisible();
  });

  test('TC-VTA-04: Overview contains the offence eligibility question', async ({ page }) => {
    await expect(page.getByText('Does the criminal charge fall under one of these offences?')).toBeVisible();
  });

  test('TC-VTA-05: additional info banner shows contact details', async ({ page }) => {
    await expect(page.getByText('604-660-0316')).toBeVisible();
    await expect(page.getByRole('link', { name: 'vsusg@gov.bc.ca' })).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Navigation – Overview (Step 0) → Applicant Information (Step 1)
  // ──────────────────────────────────────────

  test('TC-VTA-06: START APPLICATION from Overview navigates to Applicant Information', async ({ page }) => {
    await fillVTFOverviewEligibility(page);
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await expect(page.getByRole('heading', { name: 'Applicant Information', level: 1 })).toBeVisible();
  });

  test('TC-VTA-07: BACK from Applicant Information returns to Overview', async ({ page }) => {
    await fillVTFOverviewEligibility(page);
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await expect(page.getByRole('heading', { name: 'Applicant Information', level: 1 })).toBeVisible();
    await clickBack(page);
    await expect(page.getByRole('heading', { name: 'Overview', level: 1 })).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Validation – Overview (Step 0)
  // ──────────────────────────────────────────

  test('TC-VTA-08: validation error appears when proceeding with no eligibility answers', async ({ page }) => {
    await expectNoValidationSummary(page);
    await clickContinue(page);
    await expectValidationSummary(page);
  });

  // ──────────────────────────────────────────
  // Applicant Information (Step 1)
  // ──────────────────────────────────────────

  test('TC-VTA-09: Applicant Information shows all VTF-specific applicant types', async ({ page }) => {
    await fillVTFOverviewEligibility(page);
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await expect(page.getByRole('heading', { name: 'Applicant Information', level: 1 })).toBeVisible();
    // VTF-specific types
    await expect(page.getByText('Victim', { exact: true })).toBeVisible();
    await expect(page.getByText('Victim Service Worker')).toBeVisible();
    await expect(page.getByText('Support Person')).toBeVisible();
    await expect(page.getByText('Immediate family member of the deceased victim')).toBeVisible();
  });

  test('TC-VTA-10: validation error on empty Applicant Information', async ({ page }) => {
    await fillVTFOverviewEligibility(page);
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await clickContinue(page);
    await expectValidationSummary(page);
    await expect(page.getByText('Please select one')).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Navigation – Applicant Information (Step 1) → Case Information (Step 2)
  // ──────────────────────────────────────────

  test('TC-VTA-11: selecting Victim type and filling required fields advances to Case Information', async ({
    page
  }) => {
    await fillVTFOverviewEligibility(page);
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await fillVTFApplicantInfoVictim(page);
    await clickContinue(page);
    await expect(page.getByRole('heading', { name: 'Case Information', level: 1 })).toBeVisible();
  });

  // ──────────────────────────────────────────
  // Case Information (Step 2)
  // ──────────────────────────────────────────

  test('TC-VTA-12: Case Information shows victim name fields and court file fields', async ({ page }) => {
    await fillVTFOverviewEligibility(page);
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await fillVTFApplicantInfoVictim(page);
    await clickContinue(page);

    await expect(page.getByRole('heading', { name: 'Case Information', level: 1 })).toBeVisible();
    await expect(page.getByText('Court File Number')).toBeVisible();
    await expect(page.getByText('Court Location')).toBeVisible();
    await expect(page.getByText('Offences')).toBeVisible();
  });

  test('TC-VTA-13: Case Information shows "same as applicant" checkbox', async ({ page }) => {
    await fillVTFOverviewEligibility(page);
    await page.getByRole('button', { name: 'START APPLICATION' }).click();
    await fillVTFApplicantInfoVictim(page);
    await clickContinue(page);

    await expect(
      page.getByText("Select if the Victim's name is the same as Applicant", { exact: false }).first()
    ).toBeVisible();
  });
});
