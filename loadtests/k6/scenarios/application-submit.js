// Write journey: submits a VSU application end-to-end, the same way the
// Angular client does (load lookups, then POST the completed application).
//
// !! THIS SCENARIO CREATES REAL RECORDS IN DATAVERSE !!
// It refuses to run unless ENV is one of config/environments.js's
// `writeEnabledEnvironments` (local/dev/test) - never point it at prod.
//
//   k6 run -e ENV=dev -e PROFILE=smoke -e CASE_TYPE=notification scenarios/application-submit.js
//
// CASE_TYPE selects which endpoint/payload to exercise: notification
// (default), vtf, vtf-reimbursement, or `all` (rotates evenly through all
// three so a single run reports on every case type - each gets its own
// metric tag, e.g. `submit notification is 200`, so the summary breaks
// down cleanly per case type instead of averaging them together).
//
// Note: ReimbursementController's `/api/reimbursement` and
// `/api/reimbursement/check_case` endpoints are NOT covered here - they
// require a CaseId referencing an application that already exists in
// Dataverse, which this synthetic-data-only suite deliberately can't
// fabricate. If you need to load test those, seed a real case first and
// pass its id in explicitly.
import { check, sleep } from 'k6';
import exec from 'k6/execution';
import http from 'k6/http';
import { assertWritesAllowed, getEnvironment } from '../config/environments.js';
import { buildNotificationApplicationPayload, buildVtfApplicationPayload, buildVtfReimbursementApplicationPayload } from '../lib/data.js';
import { getProfile } from '../lib/profiles.js';
import { writeThresholds } from '../lib/thresholds.js';

const env = getEnvironment();
const profile = getProfile();
const caseType = __ENV.CASE_TYPE || 'notification';

assertWritesAllowed(env.name);

const CASE_TYPES = {
  notification: { path: 'notification', build: buildNotificationApplicationPayload },
  vtf: { path: 'vtf', build: buildVtfApplicationPayload },
  'vtf-reimbursement': { path: 'vtf-reimbursement', build: buildVtfReimbursementApplicationPayload },
};
const CASE_TYPE_NAMES = Object.keys(CASE_TYPES);

if (caseType !== 'all' && !CASE_TYPES[caseType]) {
  throw new Error(`Unknown CASE_TYPE "${caseType}". Valid options: ${CASE_TYPE_NAMES.join(', ')}, all`);
}

export const options = {
  scenarios: {
    [profile.name]: profile.config,
  },
  // The VSU dev/test edge resets connections from k6's default User-Agent
  // (WAF/bot-detection) - a browser-like UA avoids that. See MANUAL.md
  // "Known gotchas".
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
  thresholds: writeThresholds,
};

export default function () {
  // Step 1: load the lookups a real user's browser would fetch first.
  const countriesRes = http.get(`${env.apiUrl}/lookup/countries`, {
    tags: { name: 'GET /api/lookup/countries' },
  });
  check(countriesRes, { 'countries is 200': (r) => r.status === 200 });

  sleep(1);

  // Step 2: submit the completed application. In `all` mode, rotate evenly
  // through every case type using the global iteration count so results
  // stay balanced across VUs and profiles.
  const activeType = caseType === 'all' ? CASE_TYPE_NAMES[exec.scenario.iterationInTest % CASE_TYPE_NAMES.length] : caseType;
  const { path, build } = CASE_TYPES[activeType];
  const payload = build();

  const submitRes = http.post(`${env.apiUrl}/application/${path}`, JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: `POST /api/application/${path}` },
  });

  check(submitRes, {
    [`submit ${path} is 200`]: (r) => r.status === 200,
    [`submit ${path} is not a server error`]: (r) => r.status < 500,
  });

  sleep(1);
}
