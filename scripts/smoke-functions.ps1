param(
  [ValidateSet('local', 'prod')]
  [string]$Target = 'local',
  [string]$BaseUrl = '',
  [string]$AdminToken = '',
  [string]$Slug = '',
  [string]$JobId = '',
  [switch]$RunMutations
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($AdminToken) -and -not [string]::IsNullOrWhiteSpace($env:ADMIN_TOKEN)) {
  $AdminToken = $env:ADMIN_TOKEN
}

if (-not [string]::IsNullOrWhiteSpace($AdminToken)) {
  $AdminToken = $AdminToken.Trim()
  if (($AdminToken.StartsWith('"') -and $AdminToken.EndsWith('"')) -or ($AdminToken.StartsWith("'") -and $AdminToken.EndsWith("'"))) {
    $AdminToken = $AdminToken.Substring(1, $AdminToken.Length - 2).Trim()
  }
}

function Test-IsPlaceholder {
  param([string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return $true
  }

  $trimmed = $Value.Trim()
  return $trimmed -match '^(PASTE_|REPLACE_)'
}

function Test-HasUsableToken {
  param([string]$Value)

  if (Test-IsPlaceholder -Value $Value) {
    return $false
  }

  $trimmed = $Value.Trim()
  if ($trimmed.Length -lt 40) {
    return $false
  }

  # JWTs are dot-separated with 3 parts.
  return ($trimmed.Split('.').Count -eq 3)
}

if ([string]::IsNullOrWhiteSpace($BaseUrl)) {
  if ($Target -eq 'local') {
    $BaseUrl = 'http://127.0.0.1:5001/xsavlab/us-central1'
  } else {
    $BaseUrl = 'https://us-central1-xsavlab.cloudfunctions.net'
  }
}

$BaseUrl = $BaseUrl.TrimEnd('/')
$HasAdminToken = Test-HasUsableToken -Value $AdminToken
$AdminHeaders = @{}
if ($HasAdminToken) {
  $AdminHeaders['Authorization'] = "Bearer $AdminToken"
}

$results = New-Object System.Collections.Generic.List[object]

function Invoke-SmokeTest {
  param(
    [string]$Name,
    [string]$Method,
    [string]$Path,
    [object]$Body = $null,
    [hashtable]$Headers = $null,
    [int[]]$ExpectedStatus = @(200),
    [switch]$Skip,
    [string]$SkipReason = ''
  )

  if ($Skip) {
    $results.Add([PSCustomObject]@{
      Name = $Name
      Status = 'SKIP'
      HttpCode = ''
      Detail = $SkipReason
    })
    Write-Host ("SKIP  {0} ({1})" -f $Name, $SkipReason) -ForegroundColor Yellow
    return
  }

  $uri = "$BaseUrl/$Path"
  $httpCode = -1
  $responseBody = ''
  $ok = $false

  try {
    $invokeArgs = @{
      Uri = $uri
      Method = $Method
      ErrorAction = 'Stop'
    }

    if ($Headers) {
      $invokeArgs['Headers'] = $Headers
    }

    if ($null -ne $Body) {
      $invokeArgs['ContentType'] = 'application/json'
      $invokeArgs['Body'] = ($Body | ConvertTo-Json -Depth 10)
    }

    if ($PSVersionTable.PSVersion.Major -le 5) {
      $invokeArgs['UseBasicParsing'] = $true
    }

    $response = Invoke-WebRequest @invokeArgs
    $httpCode = [int]$response.StatusCode
    $responseBody = [string]$response.Content
    $ok = $ExpectedStatus -contains $httpCode
  } catch {
    $ex = $_.Exception
    if ($_.ErrorDetails -and -not [string]::IsNullOrWhiteSpace($_.ErrorDetails.Message)) {
      $responseBody = $_.ErrorDetails.Message
    }

    if ($ex.Response) {
      $httpCode = [int]$ex.Response.StatusCode
      try {
        $stream = $ex.Response.GetResponseStream()
        if ($stream) {
          $reader = New-Object System.IO.StreamReader($stream)
          $streamBody = $reader.ReadToEnd()
          $reader.Close()
          if (-not [string]::IsNullOrWhiteSpace($streamBody)) {
            $responseBody = $streamBody
          }
        }
      } catch {
        if ([string]::IsNullOrWhiteSpace($responseBody)) {
          $responseBody = $ex.Message
        }
      }
      $ok = $ExpectedStatus -contains $httpCode
    } else {
      $httpCode = -1
      if ([string]::IsNullOrWhiteSpace($responseBody)) {
        $responseBody = $ex.Message
      }
      $ok = $false
    }
  }

  $detail = "HTTP $httpCode"
  if (-not $ok -and -not [string]::IsNullOrWhiteSpace($responseBody)) {
    $trimmed = $responseBody
    if ($trimmed.Length -gt 220) {
      $trimmed = $trimmed.Substring(0, 220) + '...'
    }
    $detail = "$detail | $trimmed"
  }

  if ($ok) {
    $results.Add([PSCustomObject]@{
      Name = $Name
      Status = 'PASS'
      HttpCode = $httpCode
      Detail = ''
    })
    Write-Host ("PASS  {0} (HTTP {1})" -f $Name, $httpCode) -ForegroundColor Green
  } else {
    $results.Add([PSCustomObject]@{
      Name = $Name
      Status = 'FAIL'
      HttpCode = $httpCode
      Detail = $detail
    })
    Write-Host ("FAIL  {0} ({1})" -f $Name, $detail) -ForegroundColor Red
  }
}

Write-Host "Running Cloud Functions smoke tests against $BaseUrl" -ForegroundColor Cyan
if ($HasAdminToken) {
  Write-Host "Admin token detected: yes" -ForegroundColor Cyan
} else {
  Write-Host "Admin token detected: no (admin checks will be skipped)" -ForegroundColor Yellow
}

# Public reads
Invoke-SmokeTest -Name 'getSiteSettings' -Method 'GET' -Path 'getSiteSettings' -ExpectedStatus @(200)
Invoke-SmokeTest -Name 'getSuccessStories' -Method 'GET' -Path 'getSuccessStories' -ExpectedStatus @(200)
Invoke-SmokeTest -Name 'getReviews' -Method 'GET' -Path 'getReviews' -ExpectedStatus @(200)
Invoke-SmokeTest -Name 'getBlogPosts' -Method 'GET' -Path 'getBlogPosts' -ExpectedStatus @(200)
Invoke-SmokeTest -Name 'getJobs' -Method 'GET' -Path 'getJobs' -ExpectedStatus @(200)
Invoke-SmokeTest -Name 'getVentures' -Method 'GET' -Path 'getVentures' -ExpectedStatus @(200)

# Public writes / conditional reads
Invoke-SmokeTest -Name 'sendEnquiry' -Method 'POST' -Path 'sendEnquiry' -Body @{
  name = 'Smoke Test'
  email = 'test@example.com'
  company = 'XSAV'
  service = 'consulting'
  message = 'Smoke test message'
} -ExpectedStatus @(200)

Invoke-SmokeTest -Name 'getBlogPost (by slug)' -Method 'GET' -Path ("getBlogPost?slug={0}" -f $Slug) -ExpectedStatus @(200) -Skip:(Test-IsPlaceholder -Value $Slug) -SkipReason 'Provide a real -Slug value'

Invoke-SmokeTest -Name 'submitApplication' -Method 'POST' -Path 'submitApplication' -Body @{
  jobId = $JobId
  applicantName = 'Candidate Test'
  applicantEmail = 'candidate@example.com'
  applicantPhone = '1234567890'
  coverLetter = 'Smoke test application'
  resumeUrl = 'https://example.com/resume.pdf'
} -ExpectedStatus @(201) -Skip:(Test-IsPlaceholder -Value $JobId) -SkipReason 'Provide a real -JobId of an open job'

# Negative auth check
Invoke-SmokeTest -Name 'getEnquiries without token (negative)' -Method 'GET' -Path 'getEnquiries' -ExpectedStatus @(401)

# Admin read checks
Invoke-SmokeTest -Name 'getEnquiries (admin)' -Method 'GET' -Path 'getEnquiries' -Headers $AdminHeaders -ExpectedStatus @(200) -Skip:(-not $HasAdminToken) -SkipReason 'Provide -AdminToken'
Invoke-SmokeTest -Name 'listAdminUsers (admin)' -Method 'GET' -Path 'listAdminUsers' -Headers $AdminHeaders -ExpectedStatus @(200) -Skip:(-not $HasAdminToken) -SkipReason 'Provide -AdminToken'
Invoke-SmokeTest -Name 'getApplications (admin)' -Method 'GET' -Path 'getApplications' -Headers $AdminHeaders -ExpectedStatus @(200) -Skip:(-not $HasAdminToken) -SkipReason 'Provide -AdminToken'

if ($RunMutations) {
  Invoke-SmokeTest -Name 'updateSiteSettings (admin mutation)' -Method 'PUT' -Path 'updateSiteSettings' -Headers $AdminHeaders -Body @{
    smokeCheck = @{
      timestamp = [DateTime]::UtcNow.ToString('o')
      source = 'scripts/smoke-functions.ps1'
    }
  } -ExpectedStatus @(200) -Skip:(-not $HasAdminToken) -SkipReason 'Provide -AdminToken'
}

$passCount = [int](@($results | Where-Object { $_.Status -eq 'PASS' }).Count)
$failCount = [int](@($results | Where-Object { $_.Status -eq 'FAIL' }).Count)
$skipCount = [int](@($results | Where-Object { $_.Status -eq 'SKIP' }).Count)
$totalCount = [int]$results.Count

Write-Host ''
Write-Host 'Smoke Test Summary' -ForegroundColor Cyan
Write-Host ("Total: {0} | PASS: {1} | FAIL: {2} | SKIP: {3}" -f $totalCount, $passCount, $failCount, $skipCount)

if ($failCount -gt 0) {
  Write-Host ''
  Write-Host 'Failed checks:' -ForegroundColor Red
  $results | Where-Object { $_.Status -eq 'FAIL' } | ForEach-Object {
    Write-Host ("- {0}: {1}" -f $_.Name, $_.Detail) -ForegroundColor Red
  }
  exit 1
}

exit 0
