# DST Impact Assessment Report — COAST VSU OpenShift Applications

**Date:** 2026-08-11  
**Scope:** `pssg-cscp-vsu` — `vsu-app` (public-facing Angular + .NET API) and `vsu-cornet` (internal Angular + legacy .NET)  
**Trigger:** BC Legislature introduced legislation to eliminate Daylight Saving Time. All time-sensitive application logic must be audited for DST dependency and remediated where required.

---

## Executive Summary

The codebase was scanned for all date/time handling across the frontend (TypeScript/Angular), backend (.NET API), OpenShift infrastructure, and Dataverse integration layers. **One confirmed DST-sensitive defect was found and remediated.** All remaining date/time usages were assessed and determined to be either already UTC-safe or correctly scoped to calendar-date semantics where local time is the appropriate behaviour.

---

## Scan Scope

| Area                  | Files Examined                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| Frontend (TypeScript) | `vsu-app/ClientApp/**/*.ts`, `vsu-cornet/ClientApp/**/*.ts`                                         |
| Backend (C#)          | `vsu-app/Controllers/*.cs`, `vsu-app/Models/**/*.cs`, `vsu-app/Services/*.cs`, `vsu-app/Program.cs` |
| Data mapping          | `vsu-app/Models/Mapping/DynamicsDtoMapping.cs`                                                      |
| Dataverse messages    | `Database/Messages/*.cs`                                                                            |
| Infrastructure        | `vsu-app/openshift/**`, `openshift/Dockerfile*`, `.github/workflows/*.yml`                          |
| Configuration         | `appsettings.json`, `appsettings.Development.json`                                                  |

---

## Finding 1 — REMEDIATED

### Outage Banner: DST-Sensitive Timezone Comparison

|              |                                                          |
| ------------ | -------------------------------------------------------- |
| **File**     | `vsu-app/ClientApp/src/app/store/configuration.store.ts` |
| **Severity** | High                                                     |
| **Status**   | ✅ Fixed                                                 |

**Description**

The `showAnnouncementBanner` computed signal compared the current time against the configured outage window using `moment-timezone` with an explicit `America/Vancouver` offset:

```typescript
// BEFORE — DST-sensitive
import moment from 'moment-timezone';

const current = moment().tz('America/Vancouver');
const start = moment(startDate).tz('America/Vancouver');
const end = moment(endDate).tz('America/Vancouver');
return current.isBetween(start, end, null, '[]');
```

**Risk**

- With DST eliminated, the `America/Vancouver` IANA entry would no longer switch between UTC-8 and UTC-7. Any `moment-timezone` version predating BC's DST removal would apply the old (incorrect) DST rules, potentially shifting the window by one hour.
- The result was also user-locale-dependent: the banner could appear at different wall-clock times depending on where the user's browser reported its timezone.

**Remediation**

Replaced with a pure UTC epoch comparison using native `Date` APIs. `Date.now()` and `new Date(isoString).getTime()` both operate on UTC epoch milliseconds and are completely immune to timezone rules or DST transitions. The `moment-timezone` import was removed from the source file and the package was fully uninstalled from `package.json` and `package-lock.json`.

```typescript
// AFTER — DST-agnostic, locale-independent
const now = Date.now();
return now >= new Date(startDate).getTime() && now <= new Date(endDate).getTime();
```

**Operational requirement**

Outage window env vars must be set as **UTC ISO 8601 strings**. The banner fires at the same instant for all users regardless of their browser locale.

```
CONFIGURATION_OUTAGEINFORMATION_STARTDATE=2025-09-25T04:00:00Z
CONFIGURATION_OUTAGEINFORMATION_ENDDATE=2025-09-25T12:00:00Z
CONFIGURATION_OUTAGEINFORMATION_MESSAGE=Scheduled maintenance in progress.
```

---

## Finding 2 — No Action Required

### Frontend Date-Only Fields (Birthdates, Court Dates, Travel Periods)

|              |                                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Files**    | `vsu-app/ClientApp/src/app/shared/form-base.ts`, `date-field/date-field.component.ts`, `shared/components/authorization/authorization.helper.ts`, `shared/components/applicant-information/applicant-information.component.ts` |
| **Severity** | None                                                                                                                                                                                                                           |
| **Status**   | ✅ Safe — no change required                                                                                                                                                                                                   |

**Assessment**

These usages all deal with **calendar dates** (year/month/day), not points in time:

- `today = new Date()` — used as a form default for a signature date or as a boundary in birthdate validation. Local date is the correct semantic; a BC resident filling in "today's date" should see their local calendar date.
- `new Date().getFullYear()` — used to populate a year dropdown. Year boundaries are unaffected by a 1-hour DST shift.
- `new Date(year, month, day)` in `date-field.component.ts` — constructs a local midnight date for min/max comparisons. Since both sides of the comparison are constructed the same way (local midnight), the comparison is internally consistent and DST cannot cause a day boundary error.
- `oldestHuman = new Date(year - 120, month, day)` — used for "120-year-old" birthdate validation floor. The year arithmetic is immune to DST.

None of these usages cross a DST boundary in a way that would produce an incorrect calendar date.

---

## Finding 3 — No Action Required

### Frontend Data Converters — `.toISOString()` Calls

|              |                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Files**    | `converters/notification-application.web.to.crm.ts`, `converters/travel-fund-application.web.to.crm.ts`, `converters/reimbursement.web.to.crm.ts` |
| **Severity** | None                                                                                                                                              |
| **Status**   | ✅ Safe — no change required                                                                                                                      |

**Assessment**

All date values sent from the frontend to the API use `.toISOString()`, which always produces a UTC ISO 8601 string (e.g., `1990-01-15T00:00:00.000Z`) regardless of the browser's local timezone. The API receives these strings and Newtonsoft.Json deserializes them with `DateTimeZoneHandling.Utc`, producing `DateTime` values with `Kind = DateTimeKind.Utc`. These are passed directly to the Dataverse SDK, which stores them as UTC in Dataverse.

---

## Finding 4 — No Action Required

### Frontend Event Sorting — `new Date(str).getTime()`

|              |                                                                           |
| ------------ | ------------------------------------------------------------------------- |
| **File**     | `vsu-cornet/ClientApp/src/app/client-details/client-details.component.ts` |
| **Severity** | None                                                                      |
| **Status**   | ✅ Safe — no change required                                              |

**Assessment**

Activity dates from Dataverse are ISO 8601 UTC strings. `new Date(isoString).getTime()` returns UTC epoch milliseconds, making the sort order timezone-agnostic. The sort comparator is correct regardless of DST or the user's locale.

---

## Finding 5 — No Action Required

### Backend API — DateTime Serialization Pipeline

|              |                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------- |
| **Files**    | `vsu-app/Program.cs`, `vsu-app/Models/**/*.cs`, `vsu-app/Models/Mapping/DynamicsDtoMapping.cs` |
| **Severity** | None                                                                                           |
| **Status**   | ✅ Safe — no change required                                                                   |

**Assessment**

The API's Newtonsoft.Json serializer is globally configured in `Program.cs`:

```csharp
opts.SerializerSettings.DateFormatHandling    = Newtonsoft.Json.DateFormatHandling.IsoDateFormat;
opts.SerializerSettings.DateTimeZoneHandling  = Newtonsoft.Json.DateTimeZoneHandling.Utc;
```

This means:

- All `DateTime` values in API responses are serialized as UTC ISO 8601.
- All incoming JSON `DateTime` strings are deserialized as `DateTime` with `Kind = DateTimeKind.Utc`.
- `DateTime?` DTO properties (`BirthDate`, `CourtDate`, `TravelPeriodFrom/To`, `SignatureDate`, `ChildcareStartDate/EndDate`) all carry `Kind = Utc` through to the Dataverse SDK, which stores them correctly as UTC.

`DateTime.Now` does not appear anywhere in the API source. The only `DateTime` usage is `DateTime.UtcNow` in the Serilog logging enricher (`Program.cs` line 407), which is correct.

---

## Finding 6 — No Action Required

### Infrastructure — CI Cron and OpenShift

|              |                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Files**    | `.github/workflows/ci-vsu.yml`, `vsu-app/openshift/templates/vsu/vsu-deploy.json`, `openshift/Dockerfile.ubi8.net8_customized` |
| **Severity** | None                                                                                                                           |
| **Status**   | ✅ Safe — no change required                                                                                                   |

**Assessment**

- GitHub Actions cron: `cron: "0 3 1,15 * *"` — GitHub Actions cron always runs in UTC. No DST impact.
- OpenShift `DeploymentConfig`: no `TZ` environment variable is set; the container inherits the host default (UTC for RHEL/UBI containers). Since the API uses `DateTime.UtcNow` exclusively, this has no impact even if the container timezone were changed.
- No cron-triggered OpenShift Jobs (CronJob resources) were found in the scanned templates.

---

## Finding 7 — No Action Required

### Dataverse Auto-Generated Entities

|              |                                                    |
| ------------ | -------------------------------------------------- |
| **Files**    | `Database/Entities/*.cs`, `Database/Messages/*.cs` |
| **Severity** | None                                               |
| **Status**   | ✅ Safe — no change required                       |

**Assessment**

Dataverse early-bound entity classes are auto-generated and include `UtcConversionTimeZoneCode` and `TimeZoneRuleVersionNumber` fields. These are managed internally by Dataverse and the Dataverse SDK; the application code does not manipulate them. All `DateTime` fields in the entity classes are stored and retrieved as UTC.

---

## Summary Table

| #   | Location                                  | Finding                                             | DST Risk | Action                               |
| --- | ----------------------------------------- | --------------------------------------------------- | -------- | ------------------------------------ |
| 1   | `configuration.store.ts`                  | `moment().tz('America/Vancouver')` in outage banner | **High** | ✅ Fixed — pure UTC epoch comparison |
| 2   | `form-base.ts`, `date-field.component.ts` | `new Date()` for calendar-date validation bounds    | None     | No change                            |
| 3   | Converter files                           | `.toISOString()` for API submission                 | None     | No change                            |
| 4   | `client-details.component.ts`             | `.getTime()` for activity sort                      | None     | No change                            |
| 5   | `Program.cs`, DTO models, mapping         | `DateTimeZoneHandling.Utc` enforced globally        | None     | No change                            |
| 6   | CI cron, OpenShift templates              | UTC-based cron; no local-time dependencies          | None     | No change                            |
| 7   | Dataverse entities                        | SDK-managed UTC fields                              | None     | No change                            |

---

## Residual Risks

| Risk                                                               | Likelihood | Impact                                                 | Mitigation                                                                                        |
| ------------------------------------------------------------------ | ---------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Ops team sets outage env vars in local Pacific time instead of UTC | Medium     | Outage banner appears at wrong time                    | Enforce UTC ISO 8601 format in deployment runbooks and env var comments                           |
| `cornet-info.component.ts` birth year from UTC string              | Very low   | Birth year off by 1 for Jan 1 births near UTC midnight | Pre-existing UTC offset issue unrelated to DST; acceptable given birth-year is a search hint only |

---

## Changed Files

| File                                                     | Change                                                                                                                                                    |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vsu-app/ClientApp/src/app/store/configuration.store.ts` | Removed `moment-timezone` import and `America/Vancouver` tz conversions; replaced with UTC epoch comparison using `Date.now()` and `new Date().getTime()` |
| `vsu-app/ClientApp/package.json`                         | Removed `moment-timezone` from `dependencies`; `package-lock.json` updated via `npm uninstall`                                                            |
