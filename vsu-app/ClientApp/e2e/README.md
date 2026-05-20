# VSU Web Forms – Playwright E2E Test Documentation

## Overview

End-to-end tests for the **Victim Safety Unit Web Forms** application.  
Tests are written using [Playwright](https://playwright.dev/) and cover three forms:

| Form                     | Route                       | Purpose                                               |
| ------------------------ | --------------------------- | ----------------------------------------------------- |
| Notification Application | `/notification_application` | Apply for ongoing VSU notifications about an offender |
| VTF Application          | `/vtf_application`          | Apply for Victim Travel Fund funding                  |
| VTF Reimbursement        | `/vtf_reimbursement`        | Claim reimbursement after approved VTF travel         |

---

## Form Analysis

### 1. Notification Application (`/notification_application`)

**Stepper steps (linear):**

| # | Step | Key fields / notes |
| --- | --- | --- |
| 0 | Overview | Info + Collection Notice. CTA: **START APPLICATION** |
| 1 | Case Information | Victim first/last name*, birth date*, court file #_, court location_; accused info (optional) |
| 2 | Applicant Information | Applicant type\* (Victim / Civil Protected Party / Parent / Other Family Member); personal details |
| 3 | Notification Recipient & Details | Who receives notifications (radio); designate/VSW details; notification type checkboxes |
| 4 | Declaration & Authorization | Declaration checkbox*, full name*, date*, digital signature*; optional CSC/PBC forwarding checkboxes |
| 5 | Confirmation | Confirmation number displayed; print view option |

**Key behaviours:**

- Health guard redirects to `/outage` if the backend is unhealthy.
- CONTINUE button is disabled while the form is submitting (spinner visible).
- BACK button not shown on step 0 or on the Confirmation step.
- Validation summary appears at the bottom of the page when required fields are missed.

---

### 2. VTF Application (`/vtf_application`)

**Stepper steps (linear):**

| # | Step | Key fields / notes |
| --- | --- | --- |
| 0 | Overview | Eligibility questions (offence list, proceedings impact outcome*, travel 100 km*); CTA: **START APPLICATION** |
| 1 | Applicant Information | Applicant type\* (Victim / VSW / Support Person / Immediate Family Member); personal info, address |
| 2 | Case Information | Victim info (can copy from Applicant); court file #_, court location_; offence checkboxes |
| 3 | Travel Information | Expense types (accommodation, meals, transportation checkboxes\*); court date |
| 4 | Declaration & Authorization | Declaration checkbox*, full name*, date*, digital signature* |
| 5 | Confirmation | Confirmation number; print view option |

**Key behaviours:**

- Overview eligibility questions (`proceedingsImpactOutcome`, `travelMoreThan100KM`) are required.
- "Victim's name same as Applicant" checkbox auto-fills Case Information from Applicant Information.
- VSW applicant type reveals manager info fields.

---

### 3. VTF Reimbursement (`/vtf_reimbursement`)

**Stepper steps (linear):**

| # | Step | Key fields / notes |
| --- | --- | --- |
| 0 | VTF Case Information | VTF Case #_, birth date_, first name*, last name* — validated against CRM |
| 1 | Travel Information & Expenses | Contact info changed?; travel dates (purpose*, from*, to\*); transportation expenses (type select); meals (B/L/D); accommodation |
| 2 | Declaration & Authorization | Declaration checkbox*, full name*, date*, signature*; file upload for receipts; sub-total; travel advance; total claim |
| 3 | Confirmation | Confirmation number; print view option |

**Key behaviours:**

- Step 0 performs a **CRM case lookup** — the test cannot proceed past this step without a valid case # and matching birth date in the target environment.
- First CTA button is **START FORM** (not START APPLICATION).
- Pre-approved expenses may be pre-filled when case data is loaded.
- Expense rates for mileage, meals, are loaded from the API at runtime.

---

## Test Cases

### Notification Application

| ID       | Category     | Description                                                     |
| -------- | ------------ | --------------------------------------------------------------- |
| TC-NA-01 | Smoke        | Page loads, correct title and structure                         |
| TC-NA-02 | Smoke        | Stepper shows all 5 steps in correct order                      |
| TC-NA-03 | Smoke        | Overview displays info content and Collection Notice            |
| TC-NA-04 | Smoke        | Additional info banner shows contact details                    |
| TC-NA-05 | Navigation   | START APPLICATION → Case Information                            |
| TC-NA-06 | Navigation   | BACK from Case Information → Overview                           |
| TC-NA-07 | Validation   | Continuing from empty Case Information shows validation summary |
| TC-NA-08 | Validation   | First Name required error                                       |
| TC-NA-09 | Validation   | Last Name required error                                        |
| TC-NA-10 | Validation   | Birth Date required error                                       |
| TC-NA-11 | Validation   | Court file # and location required errors                       |
| TC-NA-12 | Navigation   | Filled Case Information → Applicant Information                 |
| TC-NA-13 | Form content | Applicant Information shows Notification-specific types         |
| TC-NA-14 | Validation   | No applicant type selected → required error                     |

### VTF Application

| ID        | Category     | Description                                              |
| --------- | ------------ | -------------------------------------------------------- |
| TC-VTA-01 | Smoke        | Page loads, correct title and structure                  |
| TC-VTA-02 | Smoke        | Stepper shows all 5 steps                                |
| TC-VTA-03 | Smoke        | Overview shows eligibility content and Collection Notice |
| TC-VTA-04 | Smoke        | Overview contains offence eligibility question           |
| TC-VTA-05 | Smoke        | Additional info banner shows contact details             |
| TC-VTA-06 | Navigation   | START APPLICATION → Applicant Information                |
| TC-VTA-07 | Navigation   | BACK from Applicant Information → Overview               |
| TC-VTA-08 | Validation   | Overview with no eligibility answers → validation error  |
| TC-VTA-09 | Form content | Applicant Information shows VTF-specific applicant types |
| TC-VTA-10 | Validation   | Empty Applicant Information → required error             |
| TC-VTA-11 | Navigation   | Filled Applicant Information → Case Information          |
| TC-VTA-12 | Form content | Case Information shows victim + court fields             |
| TC-VTA-13 | Form content | "Same as Applicant" checkbox present on Case Information |

### VTF Reimbursement

| ID        | Category     | Description                                              |
| --------- | ------------ | -------------------------------------------------------- |
| TC-VTR-01 | Smoke        | Page loads, correct title and structure                  |
| TC-VTR-02 | Smoke        | Stepper shows 3 steps                                    |
| TC-VTR-03 | Smoke        | Collection Notice visible                                |
| TC-VTR-04 | Smoke        | VTF Case #, Birth Date, First/Last Name fields present   |
| TC-VTR-05 | Smoke        | Additional info banner shows contact details             |
| TC-VTR-06 | Smoke        | Funding limit ($3,000) and 90-day info visible           |
| TC-VTR-07 | Validation   | Empty form → validation summary                          |
| TC-VTR-08 | Validation   | VTF Case # required error                                |
| TC-VTR-09 | Validation   | Birth Date required error                                |
| TC-VTR-10 | Validation   | First Name required error                                |
| TC-VTR-11 | Validation   | Last Name required error                                 |
| TC-VTR-12 | Validation   | Partial input (case # only) still shows birth date error |
| TC-VTR-13 | Navigation   | Travel Information visible (**@requires-valid-case**)    |
| TC-VTR-14 | Form content | START FORM button present on first step                  |

---

## Project Structure

```
vsu-app/ClientApp/
├── playwright.config.ts          ← Playwright config (multi-env)
├── e2e/
│   ├── tests/
│   │   ├── notification-application.spec.ts
│   │   ├── vtf-application.spec.ts
│   │   └── vtf-reimbursement.spec.ts
│   ├── utils/
│   │   └── test-helpers.ts       ← Shared helpers and locators
│   └── README.md                 ← This file
```

---

## Running Tests

### Prerequisites

```bash
# Install dependencies (one-time)
npm install

# Install Playwright browsers (one-time)
npx playwright install chromium
```

### Commands

| Command              | Target environment | Base URL                                     |
| -------------------- | ------------------ | -------------------------------------------- |
| `npm run e2e`        | localhost          | `http://localhost:4200`                      |
| `npm run e2e:dev`    | dev                | `https://dev.justice.gov.bc.ca/vsuwebforms`  |
| `npm run e2e:test`   | test               | `https://test.justice.gov.bc.ca/vsuwebforms` |
| `npm run e2e:report` | —                  | Opens last HTML report                       |

You can also override the base URL directly:

```bash
BASE_URL=https://custom.example.com npx playwright test
```

### Run a single spec file

```bash
npx playwright test e2e/tests/notification-application.spec.ts
```

### Run by test name pattern

```bash
npx playwright test --grep "TC-NA"
```

### Run against the test environment with a visible browser

```bash
TEST_ENV=test npx playwright test --headed
```

### CI

Set environment variable `CI=true` to enable:

- `forbidOnly` (no `.only` in CI)
- 2 retries on failure
- 1 worker (sequential)

---

## Environments

| Name      | TEST_ENV value | Base URL                                     |
| --------- | -------------- | -------------------------------------------- |
| Localhost | `localhost`    | `http://localhost:4200`                      |
| Dev       | `dev`          | `https://dev.justice.gov.bc.ca/vsuwebforms`  |
| Test      | `test`         | `https://test.justice.gov.bc.ca/vsuwebforms` |

> **Note:** The Dev environment URL is an assumption based on the Test URL pattern.  
> Verify and update `BASE_URLS.dev` in `playwright.config.ts` if it differs.

---

## Known Limitations

1. **VTF Reimbursement – step progression**: Advancing past the first step requires a valid VTF Case # and matching Birth Date in the CRM of the target environment. Tests beyond TC-VTR-14 that need to reach the Travel Expenses step are tagged `@requires-valid-case` and skipped by default.

2. **No form submission**: Tests intentionally stop before the SUBMIT button to avoid creating real records in CRM. Add a dedicated test environment with a mock/stub API to cover the submission and confirmation flows.

3. **Signature fields**: The digital signature pad cannot be automated with standard Playwright APIs without custom canvas interaction. These fields are not covered by the current test suite.

4. **File upload**: The receipt upload on the Reimbursement Declaration step requires a file. This is not covered by the current test suite.
