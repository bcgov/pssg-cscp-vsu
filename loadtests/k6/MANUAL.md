# K6 Load Testing — VSU Portal

Modeled after the k6 suite in `pssg-cscp-restitution/loadtests/k6/` (see
that repo's `MANUAL.md` for the original design rationale). This is the
second of four planned load-test suites (Restitution done, VSU here, VSD
and CPU still to come).

Location: `pssg-cscp-vsu/loadtests/k6/`

## 1. Overview

### What we're testing

The VSU app (`vsu-app`) is a public-facing ASP.NET Core API + Angular SPA
that lets victims/applicants submit Victim Travel Fund (VTF) applications,
VTF reimbursement invoices, and general notification applications, which
are written straight to Dataverse. The app currently has a global
`AllowAnonymousFilter()` in `Program.cs` (comment: "authentication not
implemented yet"), so — like Restitution — no login/token step is needed
in the scripts. This may change in future; if VSU adds real authentication,
these scripts will need a login step added (see Restitution's `MANUAL.md`
"Rollout to the other 3 portals" for what that would involve).

Two kinds of journeys are covered:

| Journey                       | Script                            | Side effects                                       | Safe environments         |
| ----------------------------- | --------------------------------- | -------------------------------------------------- | ------------------------- |
| Health/config/lookup browsing | `scenarios/lookups-read.js`       | None (read-only)                                   | local, dev, test, prod\*  |
| Full application submission   | `scenarios/application-submit.js` | **Creates a real application record in Dataverse** | local, dev, test **only** |

\* Running against prod still requires sign-off — see [Safety rules](#4-safety-rules).

There's also `scenarios/smoke.js`, a trivial 1-VU/3-iteration check of
`/hc`, `/api/configuration`, and `/api/lookup/countries` — run this first
whenever you're unsure the environment/script combination is wired up
correctly.

**Not covered:** `ReimbursementController`'s `/api/reimbursement` and
`/api/reimbursement/check_case` endpoints. Both require a `CaseId`
referencing an application that already exists in Dataverse, which this
synthetic-data-only suite deliberately can't fabricate (it never reads
back an ID from a real case). If you need to load test those, seed a real
case first (e.g. via `application-submit.js`, then look up the resulting
case in Dataverse) and pass its id in explicitly.

### Endpoints covered

```
GET  /hc
GET  /api/configuration
GET  /api/lookup/contact-email
GET  /api/lookup/countries
GET  /api/lookup/provinces
GET  /api/lookup/cities
GET  /api/lookup/cities/search
GET  /api/lookup/country/{id}/cities
GET  /api/lookup/country/{id}/province/{id}/cities
GET  /api/lookup/courts
GET  /api/lookup/offences
GET  /api/lookup/rates
POST /api/application/notification
POST /api/application/vtf
POST /api/application/vtf-reimbursement
```

Note the controller is `LookupController` (singular class name), so the
route is `/api/lookup/...` — not `/api/lookups/...` like Restitution.

### Folder layout

```
loadtests/k6/
  config/environments.js   # base URLs per environment (local/dev/test/prod)
  lib/profiles.js          # load profiles: smoke/load/stress/spike/soak
  lib/thresholds.js        # shared pass/fail thresholds (read vs write)
  lib/data.js              # tagged, synthetic payload builders
  scenarios/
    smoke.js               # trivial sanity check
    lookups-read.js        # read-only browsing journey
    application-submit.js  # write journey (creates Dataverse records)
  run.sh / run.ps1         # wrapper: runs k6 + saves a JSON summary
  report.ps1               # reviews a results/*.summary.json without k6 installed
  results/                 # gitignored - local run output lands here
```

## 2. Prerequisites

### Install k6

- **Windows (winget):** `winget install k6 --source winget`
- **Windows (choco):** `choco install k6`
- **macOS:** `brew install k6`
- **Linux:** see <https://k6.io/docs/get-started/installation/>
- **No install — run via container (Podman, preferred here):** see
  [Running via Podman (no local install)](#running-via-podman-no-local-install)
  below. `docker run ...` works the same way if you have Docker instead.

Verify with `k6 version`.

### Running via Podman (no local install)

If k6 isn't (and won't be) installed locally, `run.sh`/`run.ps1` can drive
the official `grafana/k6` image through Podman instead — nothing beyond
Podman itself is required, and results still land in `results/` on the
host via a bind mount.

```bash
# bash/macOS/Linux
./run.sh smoke --container -e ENV=dev

# PowerShell — note the `--%` stop-parsing token before -e flags, otherwise
# PowerShell tries to match `-e` against its own -ErrorAction/-ErrorVariable
# common parameters and fails with "parameter name 'e' is ambiguous"
.\run.ps1 smoke -Container --% -e ENV=dev
```

**Caveat for `ENV=local`:** `dev`/`test`/`prod` are real hostnames and work
from inside the container without any extra setup. `local`
(`http://localhost:5000`) does not — the container's `localhost` is the
container itself, not your machine, since `dotnet run` is on the host.
Point the script at the host instead with the `BASE_URL` override:

```bash
./run.sh smoke --container -e ENV=local -e BASE_URL=http://host.containers.internal:5000
```

`host.containers.internal` is Podman's (and Docker's) DNS name for the host
from inside a container; it works the same on Windows, macOS, and Linux.

### Reviewing a results file without k6 installed

`results/*.summary.json` is plain JSON, so no k6 install is needed to read
it — but the raw structure is deeply nested and easy to misread (see the
threshold gotcha below). Use `report.ps1` to get a readable summary using
only PowerShell (already on your machine, no jq/node/k6 required):

```powershell
# most recent run in results/
.\report.ps1

# a specific file
.\report.ps1 results\application-submit-20260924-093821.summary.json
```

This prints threshold pass/fail, error rate, latency percentiles, and a
per-check breakdown (pass/fail per assertion name, e.g. `submit vtf is
200`) pulled from `root_group.checks` — which has more detail than the
top-level `metrics` block alone.

**Gotcha:** in the raw JSON, each metric's `thresholds` object uses `true`
to mean the threshold was **breached** (failed) and `false` to mean it
held (passed) — the opposite of what the key name suggests. `report.ps1`
already accounts for this; if you ever read the JSON by hand, don't trust
a `true` value as "passing".

### Know your target environment

| Env   | Base URL                                     | Notes                                        |
| ----- | -------------------------------------------- | -------------------------------------------- |
| local | `http://localhost:5000`                      | `dotnet run` from `vsu-app/`, no `BASE_PATH` |
| dev   | `https://dev.justice.gov.bc.ca/vsuwebforms`  |                                              |
| test  | `https://test.justice.gov.bc.ca/vsuwebforms` |                                              |
| prod  | `https://justice.gov.bc.ca/vsuwebforms`      | read-only journey only, sign-off required    |

## 3. How to run tests

All scripts read `ENV` (default `local`) and `PROFILE` (default `smoke`)
from `-e` flags. The examples below use the `run.sh`/`run.ps1` wrappers
with `--container`/`-Container` so k6 never needs to be installed on your
machine. If you do have k6 installed locally, drop `--container`/
`-Container` and call `k6 run` directly instead — every example below
works either way.

### Quick sanity check

```bash
# bash/macOS/Linux
./run.sh smoke --container -e ENV=local

# PowerShell
.\run.ps1 smoke -Container --% -e ENV=local
```

### Read-only lookup/browsing journey

```bash
# bash/macOS/Linux
./run.sh lookups-read --container -e ENV=dev -e PROFILE=load

# PowerShell
.\run.ps1 lookups-read -Container --% -e ENV=dev -e PROFILE=load
```

### Write journey (creates real Dataverse records — dev/test only)

```bash
# bash/macOS/Linux
./run.sh application-submit --container -e ENV=dev -e PROFILE=smoke -e CASE_TYPE=vtf

# PowerShell
.\run.ps1 application-submit -Container --% -e ENV=dev -e PROFILE=smoke -e CASE_TYPE=vtf
```

`CASE_TYPE` is one of `notification` (default), `vtf`, `vtf-reimbursement`,
or `all` (rotates evenly through all three per iteration so a single run
covers every case type — each gets its own check/tag, e.g. `submit vtf is
200`, so pass/fail is reported per case type). Note: the console summary's
`http_req_duration` is still an aggregate across whichever types ran; for
an exact per-type latency split, inspect the tag breakdown in the exported
`results/*.summary.json`.

Start any new target/environment/profile combination with `PROFILE=smoke`
first. Only move to `load`/`stress`/`spike`/`soak` once smoke is clean.

Both wrappers write `results/<scenario>-<timestamp>.summary.json` on the
host automatically (via the bind mount in container mode) — check these
into your own scratch space or attach to a ticket, they're gitignored.

### Profiles

| Profile  | Purpose                                  | Shape                       |
| -------- | ---------------------------------------- | --------------------------- |
| `smoke`  | Sanity check                             | 1 VU, 5 iterations          |
| `load`   | Expected day-to-day traffic              | ramps to 10 VUs over 5 min  |
| `stress` | Find the breaking point                  | ramps to 80 VUs over 17 min |
| `spike`  | Sudden burst (e.g. reminder email blast) | 5→100→5 VUs over ~3.5 min   |
| `soak`   | Long-run leak/degradation check          | 15 VUs for ~34 min          |

## 4. Safety rules

1. **Never run `application-submit.js` against `prod`.** The script
   actively refuses via `assertWritesAllowed()` in
   `config/environments.js` — do not remove or bypass that check without
   team sign-off.
2. **Get sign-off before running anything against `dev`/`test`/`prod`.**
   These are shared environments other teams and testers rely on; a
   `stress`/`spike`/`soak` run can degrade Dataverse/ADFS response times for
   everyone. Post in the team channel with target env, profile, and time
   window before you start.
3. **All synthetic data is tagged.** Every write-journey payload embeds
   `K6-LOADTEST` plus a per-run marker (`RUN_MARKER`, defaults to a
   timestamp) in name/address/signature fields — see `lib/data.js`. Search
   Dataverse for `K6-LOADTEST` to find and remove everything a run created.
   Pass `-e RUN_MARKER=my-ticket-123` to make cleanup easier to track back
   to a specific test run.
4. **Never point scripts at real applicant data or reuse production PII.**
   All payload builders generate synthetic values only — do not "seed" them
   with copied production records.
5. **Respect downstream systems.** Dataverse/Dynamics and the on-prem ADFS
   proxy are shared infrastructure. If in doubt, run `stress`/`spike`/`soak`
   profiles only against `local` or `dev`, never `test` (other teams use
   `test` for UAT) without explicit coordination.

## 5. Interpreting results

k6 prints a summary at the end of every run. Key metrics:

- `http_req_failed` — the error rate. Threshold: `<1%`. Any run that fails
  this threshold means the API returned unexpected status codes (4xx/5xx)
  under load — check API logs (Splunk/Serilog) for exceptions around that
  time window.
- `http_req_duration` — response time. Read-endpoint threshold:
  `p(95)<800ms, p(99)<1500ms`. Write-endpoint threshold: `p(95)<2000ms,
p(99)<4000ms` (Dataverse writes are inherently slower).
- `checks` — should be 100% (or very close). A dropping check pass-rate
  under a `stress`/`spike` profile shows you where the system starts to
  degrade.

A threshold failure fails the k6 process (non-zero exit code) — useful for
wiring into CI later (see [CI integration](#7-cicd-integration-optional)).

If you need a visual dashboard instead of console output, stream results to
Grafana Cloud k6 or an InfluxDB+Grafana stack via `k6 run --out ...` — not
set up yet for this repo; ask in the team channel if you need it.

## 6. Support & maintenance

### Known gotchas

- **VSU's dev/test edge resets k6's default connections (WAF/bot
  detection).** Every scenario sets `options.userAgent` to a browser-like
  string (`Mozilla/5.0 ...`) to avoid `connection reset by peer` errors —
  this was verified during initial setup: k6's default User-Agent
  (`k6/x.y (https://k6.io/)`) got TCP resets on every single request
  against `dev.justice.gov.bc.ca/vsuwebforms`, while the same requests
  succeeded instantly once a browser UA was set. If you add a new scenario
  file, copy the `userAgent` option from an existing one — don't skip it.
- **Dataverse option-set fields are integers, not booleans.** Fields like
  `Decision1ImpactToOutcome`, `ApplicantType`, `ApplicationType` map
  directly to Dataverse option-set values (e.g. `VSd_YesNo.No=100000000`,
  not `0`/`false`). `lib/data.js` documents the exact values used and
  where they come from (`Database/OptionSets/*.cs`). See Restitution's
  `MANUAL.md` "When the API changes" for the story of how a similar bug
  (`0`/`1` instead of the real option-set ints) was caught there via
  `ArgumentOutOfRangeException` server-side — VSU's mapping code doesn't
  throw the same way (it casts directly, `(VSd_YesNo)value`), so an
  invalid value here may fail silently or produce a bad Dataverse record
  instead of a clean 500 — be extra careful when adding new option-set
  fields to the payload builders.

### When the API changes

- **New/changed endpoint:** add it to `scenarios/lookups-read.js` (reads)
  or create a new payload builder in `lib/data.js` + wire it into
  `scenarios/application-submit.js` (writes).
- **DTO field renamed/added/required:** update the matching builder in
  `lib/data.js`. The DTOs live in `vsu-app/Models/` — cross-check
  `ApplicationDto.cs`, `NotificationApplicationDto.cs`, `VtfApplicationDto.cs`,
  `VtfReimbursementApplicationDto.cs`, `ParticipantDto.cs`, `CourtInfoDto.cs`,
  `OffenceDto.cs`, `TravelInfoDto.cs`, `DocumentDto.cs` before editing. For
  option-set fields, cross-check `Database/OptionSets/*.cs` for the real
  underlying integer values.
- Run `scenarios/smoke.js` after any script change — it's the fastest way
  to confirm the contract still matches before a longer run.

### Keeping payloads in sync

`SAMPLE_COUNTRY_ID` / `SAMPLE_PROVINCE_ID` in `lookups-read.js` are
placeholder GUIDs. For a fully representative test, capture real lookup
ids from a browser network trace (DevTools → Network, filter `/lookup/`)
against the target environment and pass them via
`-e SAMPLE_COUNTRY_ID=... -e SAMPLE_PROVINCE_ID=...`.

### Tuning profiles

The numbers in `lib/profiles.js` are conservative starting points, not
measured capacity numbers. After your first `load`/`stress` runs against
`dev`, update the profile stages to reflect:

- Actual expected concurrent users (check Splunk/App Insights for real
  traffic patterns if available).
- The point where `stress` results showed error-rate or latency
  degradation — record that ceiling in this manual (add a "Known limits"
  section once you have data).

### Cleaning up test data

After an `application-submit.js` run against dev/test, search Dataverse
(Advanced Find or the Dataverse Web API) for records containing
`K6-LOADTEST` and delete them. Track the `RUN_MARKER` you used so you can
scope cleanup to a specific run.

### Adding a new profile or scenario

- New load shape: add an entry to `lib/profiles.js`.
- New environment: add an entry to `config/environments.js` (add it to
  `writeEnabledEnvironments` too if writes should be permitted there).
- New user journey: create a new file under `scenarios/`, import
  `getEnvironment`/`getProfile`/thresholds the same way the existing
  scenarios do, keep it self-contained and documented at the top of the
  file like the others — and don't forget the `userAgent` option (see
  "Known gotchas" above).

## 7. CI/CD integration (optional, not yet wired up)

Not currently part of the GitHub Actions pipeline in `.github/workflows/`.
If/when you want automated runs:

- Add a manually-triggered (`workflow_dispatch`) job that runs
  `scenarios/smoke.js` and `scenarios/lookups-read.js` (`PROFILE=load`)
  against `dev` after a deploy — never auto-trigger writes or
  stress/spike/soak profiles.
- Use the official `grafana/k6-action` GitHub Action, or run k6 via
  Podman/Docker as shown in [Prerequisites](#2-prerequisites).
- Fail the job on non-zero k6 exit code (thresholds breached).
