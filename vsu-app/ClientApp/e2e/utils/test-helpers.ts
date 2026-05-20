import { Locator, Page, expect } from '@playwright/test';

/**
 * Shared helpers for VSU Web Forms e2e tests.
 */

// ──────────────────────────────────────────────
// Route helpers
// ──────────────────────────────────────────────

export const ROUTES = {
  notificationApplication: 'notification_application',
  vtfApplication: 'vtf_application',
  vtfReimbursement: 'vtf_reimbursement'
} as const;

// ──────────────────────────────────────────────
// Common assertions
// ──────────────────────────────────────────────

/** Assert the BC Government header and VSU banner are visible. */
export async function expectPageChrome(page: Page) {
  await expect(page.getByRole('banner').first()).toBeVisible();
  await expect(page.locator('text=Victim Safety Unit').first()).toBeVisible();
}

/** Assert the validation error summary is visible. */
export async function expectValidationSummary(page: Page) {
  await expect(page.locator('text=There are errors with some fields on this page')).toBeVisible();
}

/** Assert the validation error summary is NOT visible. */
export async function expectNoValidationSummary(page: Page) {
  await expect(page.locator('text=There are errors with some fields on this page')).toBeHidden();
}

// ──────────────────────────────────────────────
// Navigation helpers
// ──────────────────────────────────────────────

/** Click the primary action button on the current step. */
export async function clickContinue(page: Page) {
  await page.getByRole('button', { name: /CONTINUE|START APPLICATION|START FORM/ }).click();
}

/** Click the BACK button (the form navigation back, not "GO BACK TO VSU HOME"). */
export async function clickBack(page: Page) {
  // The form BACK button has class "continue-btn"; "GO BACK TO VSU HOME" does not.
  await page.locator('button.continue-btn', { hasText: 'BACK' }).click();
}

/** Click the SUBMIT button. */
export async function clickSubmit(page: Page) {
  await page.getByRole('button', { name: 'SUBMIT' }).click();
}

// ──────────────────────────────────────────────
// Form fill helpers
// ──────────────────────────────────────────────

/**
 * Fill a text input identified by the visible label text above it.
 * Relies on the app-field component rendering a <section class="app-field"> with a <label>.
 */
export async function fillField(page: Page, labelText: string, value: string) {
  await page.locator('section.app-field').filter({ hasText: labelText }).locator('input, textarea').first().fill(value);
}

/**
 * Fill the three required radio-button questions in the VTF Application Overview step.
 * Must be called before clicking START APPLICATION on that form.
 */
export async function fillVTFOverviewEligibility(page: Page) {
  // Select "Yes" (first radio) for each of the three required questions
  await page.locator('input[name="proceedingsImpactOutcome"]').first().check();
  await page.locator('input[name="travelMoreThan100KM"]').first().check();
  await page.locator('input[name="notCoveredByOtherSources"]').first().check();
}

/**
 * Fill all required fields on the VTF Application "Applicant Information" step (Victim type).
 * Requires: applicantType, firstName, lastName, birthDate, address (line1/city/postalCode),
 * and at least one contact method.
 */
export async function fillVTFApplicantInfoVictim(page: Page) {
  // Select "Victim" as applicant type
  await page.getByText('Victim', { exact: true }).click();

  // Personal info
  await fillField(page, 'First Name', 'Alice');
  await fillField(page, 'Last Name', 'Smith');

  // Birth date
  const birthDateRow = page.locator('app-date-field').first();
  await selectDateDropdowns(birthDateRow, '10', 'March', '1990');

  // Mailing address (required fields; province=BC and country=Canada are pre-filled)
  await page.locator('input[formcontrolname="line1"]').fill('123 Main St');
  // City uses an async typeahead; type and press Escape to keep typed value
  await page.locator('input[formcontrolname="city"]').fill('Vancouver');
  await page.keyboard.press('Escape');
  await page.locator('input[formcontrolname="postalCode"]').fill('V5K0A1');

  // Contact method: select Telephone via "Preferred Method of Contact 1" dropdown and fill number
  await page
    .locator('section.app-field')
    .filter({ hasText: 'Preferred Method of Contact 1' })
    .locator('select')
    .selectOption({ label: 'Telephone' });
  const phoneInput = page.locator('section.app-field').filter({ hasText: 'Telephone Number' }).locator('input').first();
  await phoneInput.fill('6045550100');
  await phoneInput.press('Tab'); // trigger change event to update atLeastOneContactMethod validator
  // "May we leave a detailed message?" is required — select Yes
  await page.locator('section').filter({ hasText: 'May we leave a detailed' }).getByLabel('Yes').first().click();
}

/**
 * Fill all required fields on the Notification Application "Case Information" step.
 * Requires: victim firstName/lastName/birthDate, courtFileNumber/courtLocation,
 * accused firstName/lastName/accusedRelationship.
 */
export async function fillNotificationCaseInfo(page: Page) {
  // Victim info (use formcontrolname to avoid ambiguity with Accused section)
  await page.locator('input[formcontrolname="firstName"]').fill('Jane');
  await page.locator('input[formcontrolname="lastName"]').fill('Doe');
  const birthDateRow = page.locator('app-date-field').first();
  await selectDateDropdowns(birthDateRow, '15', 'January', '1985');

  // Court information (first court info row; formcontrolname is in nested FormArray)
  await page.locator('input[formcontrolname="courtFileNumber"]').fill('CF-12345');
  await page.locator('input[formcontrolname="courtLocation"]').fill('Vancouver');

  // Accused info (required fields)
  await page.locator('input[formcontrolname="accusedFirstName"]').fill('John');
  await page.locator('input[formcontrolname="accusedLastName"]').fill('Smith');
  await page.locator('select[formcontrolname="accusedRelationship"]').selectOption('Stranger');
}

/** Select a date using the day/month/year dropdowns rendered by app-date-field. */
export async function selectDateDropdowns(container: Locator, day: string, month: string, year: string) {
  const selects = container.locator('select');
  await selects.nth(0).selectOption(day);
  await selects.nth(1).selectOption(month);
  await selects.nth(2).selectOption(year);
}

/** Click a radio button by its visible label text. */
export async function selectRadio(page: Page, labelText: string) {
  await page.getByText(labelText, { exact: true }).click();
}
