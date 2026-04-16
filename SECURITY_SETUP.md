# Security Setup Guide

Last Updated: April 16, 2026
Scope: Hosting, Cloud Functions, Firestore Rules, Storage Rules, and CI security checks for this repository.

## Current Security Posture

This project has layered protections across:
- Firebase Hosting response headers (CSP + hardening headers)
- Cloud Functions request controls (CORS, auth, RBAC, validation, sanitization)
- Firestore document-level access rules
- Storage object-level access rules
- Automated dependency vulnerability scanning in GitHub Actions

## Security Controls Implemented

| Control | Status | Source |
|---|---|---|
| Strict CORS allowlist + localhost pattern checks | Implemented | functions/lib/http.js |
| HTTP method allowlists per endpoint | Implemented | functions/lib/http.js, functions/modules/*.js |
| Firebase ID token verification | Implemented | functions/lib/auth.js |
| Role-based authorization (`admin`, `superadmin`, `moderator`) | Implemented | functions/lib/auth.js, firestore.rules |
| Input sanitization (`escapeHtml`) | Implemented | functions/lib/content.js |
| Request payload size limit (enquiries) | Implemented | functions/modules/enquiries.js |
| Rate limiting (enquiries: 3/hour, 10/day per IP) | Implemented | functions/modules/enquiries.js |
| Rate limiting (applications: 5/hour per IP) | Implemented | functions/modules/applications.js |
| Firestore least-privilege rules per collection | Implemented | firestore.rules |
| Storage path and MIME restrictions | Implemented | storage.rules |
| CSP + security headers on hosting | Implemented | firebase.json |
| Secrets for email credentials | Implemented | functions/modules/enquiries.js |
| Automated npm audit workflows | Implemented | .github/workflows/security-audit.yml, .github/workflows/firebase-deploy.yml |

## 1) Hosting Security (Firebase Hosting)

Configured in firebase.json.

### Headers applied
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: geolocation=(), microphone=(), camera=()
- Strict-Transport-Security: max-age=31536000; includeSubDomains

### Cache controls
- /static/**: long cache immutable assets
- /index.html: no-cache/no-store/must-revalidate

### CSP scope
The CSP allows only required origins for scripts/styles/fonts/images/network calls including Firebase, Google APIs, and Cloud Run domains.

## 2) Cloud Functions HTTP Security

Core HTTP security helpers are centralized in:
- functions/lib/http.js
- functions/lib/auth.js
- functions/lib/content.js

### CORS policy
- Explicit allowlist includes:
  - https://xsavlab.web.app
  - https://xsavlab.firebaseapp.com
  - https://xsavlab.com
  - https://www.xsavlab.com
  - http://localhost:3000
  - http://localhost:5000
- Dynamic localhost allowance via regex:
  - http://localhost:{port}
  - http://127.0.0.1:{port}
- Requests with no Origin are blocked.

### Auth and RBAC
- Bearer token extraction and Firebase verification are handled in functions/lib/auth.js.
- Admin enforcement supports role checks:
  - admin gate: `decodedToken.admin === true`
  - role gate: required role list for privileged actions

### Input sanitization and validation
- escapeHtml is used before persisting/displaying user-provided strings.
- Endpoint-specific validation includes required fields, length checks, enum checks, and URL/path format checks.

## 3) Function-Level Security Details

### Enquiries endpoints
File: functions/modules/enquiries.js

- Secrets used for email service credentials:
  - EMAIL_USER
  - EMAIL_PASSWORD
  - ADMIN_EMAIL
- Request body size limit: 10 KB
- Input validation: required fields + email format + length constraints
- Rate limit by IP:
  - 3 per hour
  - 10 per day
- Generic 500 responses to clients; detailed errors are logged server-side.

### Applications endpoints
File: functions/modules/applications.js

- Public submission supported through backend function, with optional bearer token attribution.
- Rate limit by IP:
  - 5 submissions per hour
  - stored in `rateLimits` collection (`app_{sanitizedIp}` docs)
- Validation includes:
  - required fields
  - bounded numeric ranges
  - approved enum values
  - strict URL/path regex for resume and cover-letter storage path handling
- Admin-only read/update endpoints enforced with requireAdmin.

### Admin user management
File: functions/modules/adminUsers.js

- Privileged operations guarded by role checks.
- Superadmin-only operations exist for:
  - creating users with admin roles
  - role changes
  - deleting admin users
- Protection against self-lockout and self-delete edge cases.

### Content modules (ventures, reviews, blog, success stories, jobs, site settings)
Files: functions/modules/*.js

- Method allowlists enforced per endpoint.
- Public read behavior is restricted to published/live/approved states where applicable.
- Admin/superadmin authorization is required for writes/moderation/deletes based on role.
- Sanitization is applied before writes for user-entered text fields.

## 4) Firestore Security Rules

Configured in firestore.rules.

### Role model in rules
- isAuthenticated()
- isAdmin() via token.admin
- isSuperAdmin() via token.role == 'superadmin'
- hasRole(minRole) for role hierarchy checks

### Collection-level protections
- enquiries:
  - read: admin only
  - create/delete: denied from clients (server writes only)
  - update: admin-limited to specific moderation fields
- admins:
  - read/write: admin only
- users:
  - read: admin+
  - update: superadmin OR owner-limited profile fields
  - create/delete: denied from clients
- ventures:
  - public read only for live
  - create/update: admin+
  - delete: superadmin
- siteSettings:
  - read: public
  - update: admin+
  - create/delete: denied from clients
- successStories:
  - public read only for live
  - create/update: admin+
  - delete: superadmin
- reviews:
  - public read only for approved
  - create: authenticated users
  - update: admin+
  - delete: superadmin
- blogPosts:
  - public read only for published
  - create: authenticated user draft with ownership checks
  - update: owner draft or admin
  - delete: admin
- jobs:
  - public read only for open
  - create/update/delete: admin
- applications:
  - read/update/delete: admin only
  - create: authenticated clients (direct rule), while backend function can also write via Admin SDK

### Default posture
- Deny-all fallback for unmatched collections.

## 5) Firestore Indexes

Configured in firestore.indexes.json.

Implemented indexes include:
- enquiries:
  - ipAddress ASC
  - createdAt ASC
- ventures:
  - status ASC + order ASC
  - category ASC + order ASC

Note:
- The enquiries rate-limit queries rely on this composite index.

## 6) Storage Security Rules

Configured in storage.rules.

### Protected paths
- resumes/{jobId}/{fileName}
  - create: public, MIME restricted (pdf/doc/docx), max 10 MB
  - read/delete: admin only
- coverLetters/{jobId}/{fileName}
  - create: public, PDF only, max 5 MB
  - read/delete: admin only
- blogImages/{fileName}
  - read: public
  - write: admin only, image/*, max 5 MB
- ventureImages/{folder}/{fileName}
  - read: public
  - write: admin only, image/*, max 5 MB

Default deny for all other paths.

## 7) CI Security Monitoring

### Workflow: security-audit.yml
- Scheduled weekly scan (Monday 09:00 UTC)
- Also runs on dependency-file changes and manual trigger
- Runs npm audit for frontend and functions
- Fails on critical/high production vulnerabilities
- Uploads audit artifacts

### Workflow: firebase-deploy.yml
- Runs security scan job before deployment job
- Performs npm audits for frontend and functions
- Deploy job depends on scan completion

## 8) Secrets and Sensitive Data Handling

- Email credentials are loaded from Firebase secrets in functions/modules/enquiries.js.
- Function behavior in emulator avoids required secret injection for local runs.
- Repository contains a public Firebase web config in frontend (normal for client SDK), but API key restrictions must be enforced in Google Cloud Console.

## 9) Verification Checklist

Run these checks when validating a security release:

1. Rules and index deployment
- firebase deploy --only firestore:rules
- firebase deploy --only firestore:indexes
- firebase deploy --only storage

2. Functions and hosting
- firebase deploy --only functions
- firebase deploy --only hosting

3. Dependency audits
- npm audit --omit=dev
- cd functions && npm audit

4. Manual behavior checks
- CORS rejects non-whitelisted origins
- Admin endpoints reject missing/invalid bearer token
- Role-restricted endpoints enforce superadmin/admin boundaries
- Enquiry and application rate limits trigger as expected
- Resume/cover-letter uploads enforce MIME and size limits

## 10) Operational Notes

- Functions runtime is currently Node.js 20 (configured in firebase.json and functions/package.json). Plan migration to Node.js 22 before platform deprecation timelines.
- Keep custom claims (`admin`, `role`) synchronized with Firestore user records when changing permissions.
- Re-run this checklist whenever adding new collections, storage paths, or admin endpoints.
