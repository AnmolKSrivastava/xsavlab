# Cloud Functions Smoke Commands (PowerShell)

This file contains copy-paste commands to smoke test all exported Cloud Functions in local emulator and production.

If you prefer one-command execution, use:

`./scripts/smoke-functions.ps1`

Example:

```powershell
./scripts/smoke-functions.ps1 -Target local -AdminToken "PASTE_ADMIN_ID_TOKEN" -Slug "existing-post-slug" -JobId "OPEN_JOB_ID"
```

## 0. Quick Setup

Run from repo root.

```powershell
# Local emulator base
$Base = "http://127.0.0.1:5001/xsavlab/us-central1"

# Optional production base
$ProdBase = "https://us-central1-xsavlab.cloudfunctions.net"

# For admin endpoints, paste a Firebase ID token from an admin session
$AdminToken = "PASTE_ADMIN_ID_TOKEN_HERE"
$AdminHeaders = @{ Authorization = "Bearer $AdminToken" }
```

Tip to get token in browser console while logged in as admin:

```javascript
const token = await (await import('firebase/auth')).getAuth().currentUser.getIdToken(true);
console.log(token);
```

---

## 1. Public Endpoints (No Admin Token)

### 1.1 sendEnquiry (POST)

```powershell
$body = @{
  name = "Smoke Test"
  email = "test@example.com"
  company = "XSAV"
  service = "consulting"
  message = "Smoke test message"
} | ConvertTo-Json

Invoke-RestMethod "$Base/sendEnquiry" -Method Post -ContentType "application/json" -Body $body
```

### 1.2 getSiteSettings (GET)

```powershell
Invoke-RestMethod "$Base/getSiteSettings" -Method Get
```

### 1.3 getSuccessStories (GET)

```powershell
Invoke-RestMethod "$Base/getSuccessStories" -Method Get
```

### 1.4 getReviews (GET)

```powershell
Invoke-RestMethod "$Base/getReviews" -Method Get
```

### 1.5 getBlogPosts (GET)

```powershell
Invoke-RestMethod "$Base/getBlogPosts" -Method Get
```

### 1.6 getBlogPost (GET)

```powershell
$Slug = "REPLACE_WITH_EXISTING_SLUG"
Invoke-RestMethod "$Base/getBlogPost?slug=$Slug" -Method Get
```

### 1.7 getJobs (GET)

```powershell
Invoke-RestMethod "$Base/getJobs" -Method Get
```

### 1.8 getVentures (GET)

```powershell
Invoke-RestMethod "$Base/getVentures" -Method Get
```

### 1.9 submitApplication (POST)

Requires an open job id.

```powershell
$JobId = "REPLACE_WITH_OPEN_JOB_ID"
$body = @{
  jobId = $JobId
  applicantName = "Candidate Test"
  applicantEmail = "candidate@example.com"
  applicantPhone = "1234567890"
  coverLetter = "Smoke test application"
  resumeUrl = "https://example.com/resume.pdf"
} | ConvertTo-Json

Invoke-RestMethod "$Base/submitApplication" -Method Post -ContentType "application/json" -Body $body
```

---

## 2. Admin Endpoints (Require Admin Token)

## 2.1 Enquiries

### getEnquiries (GET)

```powershell
Invoke-RestMethod "$Base/getEnquiries" -Method Get -Headers $AdminHeaders
```

---

## 2.2 Admin User Management

### setAdminRole (POST)

```powershell
$body = @{ email = "new-admin@example.com" } | ConvertTo-Json
Invoke-RestMethod "$Base/setAdminRole" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### createAdminUser (POST)

```powershell
$body = @{
  email = "admin-smoke@example.com"
  password = "StrongPass123!"
  displayName = "Smoke Admin"
  role = "admin"
} | ConvertTo-Json

Invoke-RestMethod "$Base/createAdminUser" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### updateUserRole (POST)

```powershell
$body = @{
  userId = "REPLACE_WITH_UID"
  role = "moderator"
} | ConvertTo-Json

Invoke-RestMethod "$Base/updateUserRole" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### listAdminUsers (GET)

```powershell
Invoke-RestMethod "$Base/listAdminUsers" -Method Get -Headers $AdminHeaders
```

### deleteAdminUser (DELETE)

```powershell
$body = @{ userId = "REPLACE_WITH_UID" } | ConvertTo-Json
Invoke-RestMethod "$Base/deleteAdminUser" -Method Delete -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

---

## 2.3 Ventures

### createVenture (POST)

```powershell
$body = @{
  name = "Smoke Venture"
  slug = "smoke-venture"
  status = "live"
  order = 1
} | ConvertTo-Json

Invoke-RestMethod "$Base/createVenture" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### updateVenture (POST)

```powershell
$body = @{
  ventureId = "REPLACE_WITH_VENTURE_ID"
  name = "Smoke Venture Updated"
  order = 2
} | ConvertTo-Json

Invoke-RestMethod "$Base/updateVenture" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### deleteVenture (DELETE)

```powershell
$body = @{ ventureId = "REPLACE_WITH_VENTURE_ID" } | ConvertTo-Json
Invoke-RestMethod "$Base/deleteVenture" -Method Delete -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### trackVentureView (POST)

```powershell
$body = @{ ventureId = "REPLACE_WITH_VENTURE_ID" } | ConvertTo-Json
Invoke-RestMethod "$Base/trackVentureView" -Method Post -ContentType "application/json" -Body $body
```

### trackVentureClick (POST)

```powershell
$body = @{ ventureId = "REPLACE_WITH_VENTURE_ID" } | ConvertTo-Json
Invoke-RestMethod "$Base/trackVentureClick" -Method Post -ContentType "application/json" -Body $body
```

---

## 2.4 Site Settings

### updateSiteSettings (PUT)

```powershell
$body = @{
  statistics = @{ clientsServed = 501 }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod "$Base/updateSiteSettings" -Method Put -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

---

## 2.5 Success Stories

### createSuccessStory (POST)

```powershell
$body = @{
  company = "Smoke Corp"
  industry = "Tech"
  challenge = "Challenge text"
  solution = "Solution text"
  status = "draft"
  order = 1
  featured = $false
} | ConvertTo-Json

Invoke-RestMethod "$Base/createSuccessStory" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### updateSuccessStory (PUT)

```powershell
$body = @{
  storyId = "REPLACE_WITH_STORY_ID"
  updates = @{ status = "live"; featured = $true }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod "$Base/updateSuccessStory" -Method Put -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### deleteSuccessStory (DELETE)

```powershell
$body = @{ storyId = "REPLACE_WITH_STORY_ID" } | ConvertTo-Json
Invoke-RestMethod "$Base/deleteSuccessStory" -Method Delete -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

---

## 2.6 Reviews

### submitReview (POST)

Requires authenticated user token. For admin smoke, AdminToken is enough.

```powershell
$body = @{
  clientName = "Smoke Client"
  clientRole = "CTO"
  clientCompany = "Smoke Co"
  content = "Great service"
  rating = 5
} | ConvertTo-Json

Invoke-RestMethod "$Base/submitReview" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### approveReview (POST)

```powershell
$body = @{ reviewId = "REPLACE_WITH_REVIEW_ID" } | ConvertTo-Json
Invoke-RestMethod "$Base/approveReview" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### updateReview (PUT)

```powershell
$body = @{
  reviewId = "REPLACE_WITH_REVIEW_ID"
  updates = @{ featured = $true; order = 1 }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod "$Base/updateReview" -Method Put -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### deleteReview (DELETE)

```powershell
$body = @{ reviewId = "REPLACE_WITH_REVIEW_ID" } | ConvertTo-Json
Invoke-RestMethod "$Base/deleteReview" -Method Delete -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

---

## 2.7 Blog

### createBlogPost (POST)

```powershell
$body = @{
  title = "Smoke Blog Post"
  excerpt = "Smoke excerpt"
  content = "Smoke content"
  category = "security"
  tags = @("smoke", "test")
  featured = $false
} | ConvertTo-Json -Depth 5

Invoke-RestMethod "$Base/createBlogPost" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### updateBlogPost (PUT)

```powershell
$body = @{
  postId = "REPLACE_WITH_POST_ID"
  title = "Smoke Blog Post Updated"
  content = "Updated content"
} | ConvertTo-Json

Invoke-RestMethod "$Base/updateBlogPost" -Method Put -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### submitBlogPostForApproval (POST)

```powershell
$body = @{ postId = "REPLACE_WITH_POST_ID" } | ConvertTo-Json
Invoke-RestMethod "$Base/submitBlogPostForApproval" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### approveBlogPost (POST)

```powershell
$body = @{ postId = "REPLACE_WITH_POST_ID" } | ConvertTo-Json
Invoke-RestMethod "$Base/approveBlogPost" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### rejectBlogPost (POST)

```powershell
$body = @{ postId = "REPLACE_WITH_POST_ID"; feedback = "Needs edits" } | ConvertTo-Json
Invoke-RestMethod "$Base/rejectBlogPost" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### deleteBlogPost (DELETE)

```powershell
$body = @{ postId = "REPLACE_WITH_POST_ID" } | ConvertTo-Json
Invoke-RestMethod "$Base/deleteBlogPost" -Method Delete -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

---

## 2.8 Jobs

### createJob (POST)

```powershell
$body = @{
  title = "Security Engineer"
  department = "Engineering"
  location = "Remote"
  jobType = "Full-time"
  description = "Smoke test job"
  requirements = @("Req 1")
  responsibilities = @("Resp 1")
  benefits = @("Benefit 1")
  featured = $true
} | ConvertTo-Json -Depth 5

Invoke-RestMethod "$Base/createJob" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### updateJob (PUT)

```powershell
$body = @{
  jobId = "REPLACE_WITH_JOB_ID"
  status = "open"
  title = "Security Engineer Updated"
} | ConvertTo-Json

Invoke-RestMethod "$Base/updateJob" -Method Put -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

### deleteJob (DELETE)

```powershell
$body = @{ jobId = "REPLACE_WITH_JOB_ID" } | ConvertTo-Json
Invoke-RestMethod "$Base/deleteJob" -Method Delete -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

---

## 2.9 Applications

### getApplications (GET)

```powershell
Invoke-RestMethod "$Base/getApplications" -Method Get -Headers $AdminHeaders
```

### updateApplicationStatus (POST)

```powershell
$body = @{
  applicationId = "REPLACE_WITH_APPLICATION_ID"
  status = "in-review"
  note = "Smoke test note"
} | ConvertTo-Json

Invoke-RestMethod "$Base/updateApplicationStatus" -Method Post -Headers $AdminHeaders -ContentType "application/json" -Body $body
```

---

## 3. Negative Tests (Auth/Method Guards)

### No token on admin endpoint should fail

```powershell
Invoke-RestMethod "$Base/getEnquiries" -Method Get
```

Expected: 401

### Wrong method should fail

```powershell
Invoke-RestMethod "$Base/getSiteSettings" -Method Post
```

Expected: 405

---

## 4. Production Quick Switch

To test production, replace `$Base` with:

```powershell
$Base = $ProdBase
```

Then rerun the same commands carefully with test data.

---

## 5. Optional Helper: Safe Wrapper

Use this helper to avoid hard-stop on first failed request:

```powershell
function Invoke-Smoke {
  param(
    [string]$Name,
    [scriptblock]$Call
  )

  try {
    $result = & $Call
    Write-Host "PASS: $Name" -ForegroundColor Green
    return $result
  } catch {
    Write-Host "FAIL: $Name" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
  }
}
```

Example:

```powershell
Invoke-Smoke -Name "getSiteSettings" -Call { Invoke-RestMethod "$Base/getSiteSettings" -Method Get }
```