# Cloud Functions Post-Decomposition Verification Guide

This document explains how to verify that all Cloud Functions still work correctly after decomposition/refactoring.

## Scope

This project uses:
- Functions source: `functions/`
- Entry point: `functions/index.js`
- Runtime: Node.js 20
- Emulator ports from `firebase.json`:
  - Functions: `5001`
  - Firestore: `8080`

The entry point currently exports 39 handlers. Verification should cover:
- Export wiring
- Emulator runtime behavior
- Auth-protected and public routes
- Firestore side effects
- Production smoke checks

---

## 1. Fast Sanity Checks

Run these first before emulator/deploy testing.

### 1.1 Check exports load correctly

From `functions/`:

```powershell
node -e "const f=require('./index.js'); console.log(Object.keys(f).sort())"
```

Expected:
- No syntax/runtime load error
- All expected functions appear in the list

Expected exported handlers:

- sendEnquiry
- getEnquiries
- setAdminRole
- createAdminUser
- updateUserRole
- listAdminUsers
- deleteAdminUser
- createVenture
- updateVenture
- deleteVenture
- getVentures
- trackVentureView
- trackVentureClick
- getSiteSettings
- updateSiteSettings
- getSuccessStories
- createSuccessStory
- updateSuccessStory
- deleteSuccessStory
- submitReview
- getReviews
- approveReview
- updateReview
- deleteReview
- createBlogPost
- getBlogPosts
- getBlogPost
- updateBlogPost
- submitBlogPostForApproval
- approveBlogPost
- rejectBlogPost
- deleteBlogPost
- createJob
- getJobs
- updateJob
- deleteJob
- submitApplication
- getApplications
- updateApplicationStatus

### 1.2 Check editor/compile errors

At minimum, ensure there are no problems in:
- `functions/index.js`
- `functions/lib/*.js`
- `functions/modules/*.js`

---

## 2. Start Emulators and Run Smoke Tests

From repo root:

```powershell
npx -y firebase-tools@latest emulators:start --only functions,firestore
```

Base local endpoint format:

```text
http://127.0.0.1:5001/xsavlab/us-central1/<functionName>
```

### 2.1 Public GET smoke tests

```powershell
Invoke-RestMethod "http://127.0.0.1:5001/xsavlab/us-central1/getSiteSettings" -Method Get
Invoke-RestMethod "http://127.0.0.1:5001/xsavlab/us-central1/getSuccessStories" -Method Get
Invoke-RestMethod "http://127.0.0.1:5001/xsavlab/us-central1/getReviews" -Method Get
Invoke-RestMethod "http://127.0.0.1:5001/xsavlab/us-central1/getBlogPosts" -Method Get
Invoke-RestMethod "http://127.0.0.1:5001/xsavlab/us-central1/getJobs" -Method Get
Invoke-RestMethod "http://127.0.0.1:5001/xsavlab/us-central1/getVentures" -Method Get
```

Expected:
- HTTP 200
- Valid JSON response
- No emulator crash logs

### 2.2 Public POST smoke test: sendEnquiry

```powershell
$body = @{
  name = "Smoke Test"
  email = "test@example.com"
  company = "XSAV"
  service = "consulting"
  message = "Local emulator smoke test"
} | ConvertTo-Json

Invoke-RestMethod "http://127.0.0.1:5001/xsavlab/us-central1/sendEnquiry" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

Expected:
- HTTP 200
- `success: true`
- `enquiryId` present
- `emailsSent` may be `false` locally if secrets are not configured (acceptable for smoke test)

### 2.3 Public POST smoke test: submitApplication

Requires a real open job ID.

```powershell
$body = @{
  jobId = "REPLACE_WITH_REAL_JOB_ID"
  applicantName = "Candidate Test"
  applicantEmail = "candidate@example.com"
  applicantPhone = "1234567890"
  coverLetter = "Test cover letter"
  resumeUrl = "https://example.com/resume.pdf"
} | ConvertTo-Json

Invoke-RestMethod "http://127.0.0.1:5001/xsavlab/us-central1/submitApplication" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

Expected:
- HTTP 201
- `applicationId` returned
- Job `applicantCount` increments

---

## 3. Domain-by-Domain Functional Matrix

Run one happy-path CRUD/lifecycle flow per domain.

### Enquiries
- `sendEnquiry`: create enquiry
- `getEnquiries`: admin can fetch list
- Admin status/read updates persist in Firestore

### Admin Users
- `listAdminUsers`
- `createAdminUser`
- `updateUserRole`
- `deleteAdminUser`
- `setAdminRole` (if still used)

### Ventures
- Create, update, list, track view/click, delete

### Site Settings
- Public read works
- Admin update works
- Changes visible on refresh

### Success Stories
- Create, update, public list filtering (`live`), delete

### Reviews
- Submit -> pending
- Approve
- Public approved list shows item
- Update and delete

### Blog
- Create draft
- Update draft
- Submit for approval
- Approve/reject
- Fetch list/single
- Delete

### Jobs
- Create, update, public list (`open`), delete/close

### Applications
- Submit application
- Admin list
- Admin status update + note append

---

## 4. Verify Firestore Side Effects

A response code alone is not enough. Validate DB writes/updates in Emulator UI or Firebase Console.

Check:
- Document exists in correct collection
- Field names/types are unchanged
- Metadata fields (timestamps, role info, status transitions) are written correctly
- Counters (`views`, `clicks`, `applicantCount`) increment as expected

---

## 5. Negative/Auth Tests (Very Important)

For protected endpoints, test unauthorized access.

Examples:
- `getEnquiries` without token -> `401`
- `createVenture` without token -> `401`
- `deleteSuccessStory` as non-superadmin -> `403`
- Wrong HTTP method on endpoint -> `405`

This validates shared auth and method guard helpers still work across modules.

---

## 6. Production Smoke Test After Deploy

Deploy:

```powershell
npx -y firebase-tools@latest deploy --only functions
```

Then run small production smoke checks:

1. Read-only endpoints first:
   - `getSiteSettings`
   - `getSuccessStories`
   - `getReviews`
   - `getBlogPosts`
   - `getJobs`
   - `getVentures`
2. One safe write path:
   - `sendEnquiry`
   - one create/edit/delete flow in admin with clearly labeled test data
3. Inspect logs:

```powershell
npx -y firebase-tools@latest functions:log
```

Watch for:
- `TypeError`, `ReferenceError`
- Missing import/module errors
- Permission/auth errors
- Firestore query/index/field errors

---

## 7. Definition of Done (Refactor Safety)

Consider decomposition validated when all are true:

1. `functions/index.js` loads with no error.
2. Emulators start with no module resolution errors.
3. Every exported endpoint has at least one successful happy-path test.
4. Protected routes return correct `401/403/405` for invalid calls.
5. Firestore side effects match expected schema/behavior.
6. Production smoke + logs are clean.

---

## 8. Quick High-Signal Minimal Checklist

If you are short on time, do this subset:

1. Export load check (`node -e` in `functions/`).
2. Start Functions + Firestore emulators.
3. Smoke test:
   - `sendEnquiry`
   - `getSiteSettings`
   - `getSuccessStories`
   - `getBlogPosts`
   - `getJobs`
   - `getVentures`
4. In admin UI, run one CRUD flow per tab.
5. Deploy.
6. Repeat the same subset in production and inspect logs.

This gives strong confidence with minimal effort.

---

## 9. Automated Smoke Runner

You can run a consolidated smoke pass using:

`scripts/smoke-functions.ps1`

### Local emulator example

```powershell
./scripts/smoke-functions.ps1 -Target local -AdminToken "PASTE_ADMIN_ID_TOKEN" -Slug "existing-post-slug" -JobId "OPEN_JOB_ID"
```

### Production example

```powershell
./scripts/smoke-functions.ps1 -Target prod -AdminToken "PASTE_ADMIN_ID_TOKEN" -Slug "existing-post-slug" -JobId "OPEN_JOB_ID"
```

### Optional mutation check

Adds one admin write check (`updateSiteSettings`) to validate write permissions.

```powershell
./scripts/smoke-functions.ps1 -Target local -AdminToken "PASTE_ADMIN_ID_TOKEN" -RunMutations
```

Behavior:
- Prints PASS / FAIL / SKIP per endpoint
- Returns exit code `1` if any test fails
- Returns exit code `0` when all executed checks pass
