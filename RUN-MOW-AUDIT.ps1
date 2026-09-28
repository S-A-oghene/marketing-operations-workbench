# MOW Release/Audit Test Runner
# Run this from the ROOT of the marketing-operations-workbench repository.
# It creates MOW-AUDIT-RESULTS-YYYYMMDD-HHmmss.txt in the repository root.

$ErrorActionPreference = 'Continue'
$repo = (Get-Location).Path
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$report = Join-Path $repo "MOW-AUDIT-RESULTS-$stamp.txt"
$logsDir = Join-Path $env:TEMP "MOW-AUDIT-$stamp"
New-Item -ItemType Directory -Force $logsDir | Out-Null

function Write-Report([string]$Text='') {
  $Text | Out-File -FilePath $report -Append -Encoding utf8
  Write-Host $Text
}

function Run-AuditCommand {
  param(
    [Parameter(Mandatory=$true)][string]$Label,
    [Parameter(Mandatory=$true)][string]$Executable,
    [Parameter(Mandatory=$true)][string[]]$Arguments
  )
  $safe = ($Label -replace '[^A-Za-z0-9_-]', '_')
  $cmdLog = Join-Path $logsDir "$safe.log"
  $start = Get-Date
  Write-Report ''
  Write-Report ('=' * 88)
  Write-Report "TEST: $Label"
  Write-Report "START: $($start.ToString('yyyy-MM-dd HH:mm:ss zzz'))"
  Write-Report "COMMAND: $Executable $($Arguments -join ' ')"
  Write-Report ('=' * 88)
  try {
    & $Executable @Arguments 2>&1 | Tee-Object -FilePath $cmdLog -Append | ForEach-Object {
      Write-Report $_.ToString()
    }
    $exitCode = if ($null -ne $LASTEXITCODE) { [int]$LASTEXITCODE } else { 0 }
  } catch {
    $exitCode = 1
    Write-Report "EXCEPTION: $($_.Exception.Message)"
  }
  $end = Get-Date
  $duration = $end - $start
  Write-Report ''
  Write-Report "END: $($end.ToString('yyyy-MM-dd HH:mm:ss zzz'))"
  Write-Report "EXIT_CODE: $exitCode"
  Write-Report ('DURATION_SECONDS: {0:N1}' -f $duration.TotalSeconds)
  $resultText = if ($exitCode -eq 0) { 'RESULT: PASS' } else { 'RESULT: FAIL' }
  Write-Report $resultText
  [pscustomobject]@{ Label=$Label; ExitCode=$exitCode; Result=(if ($exitCode -eq 0) {'PASS'} else {'FAIL'}); DurationS=[math]::Round($duration.TotalSeconds,1) }
}

Write-Report 'MARKETING OPERATIONS WORKBENCH — AUDIT TEST RESULTS'
Write-Report '====================================================='
Write-Report "Repository: $repo"
Write-Report "Audit started: $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss zzz'))"
Write-Report "PowerShell: $($PSVersionTable.PSVersion)"
Write-Report "OS: $([System.Environment]::OSVersion.VersionString)"
Write-Report ''
Write-Report 'ENVIRONMENT SNAPSHOT'
Write-Report '--------------------'
try { Write-Report ("Node: " + ((& node --version 2>&1 | Out-String).Trim())) } catch { Write-Report 'Node: UNAVAILABLE' }
try { Write-Report ("npm: " + ((& npm --version 2>&1 | Out-String).Trim())) } catch { Write-Report 'npm: UNAVAILABLE' }
try { Write-Report ("Git branch: " + ((& git branch --show-current 2>&1 | Out-String).Trim())) } catch { Write-Report 'Git branch: UNAVAILABLE' }
try { Write-Report ("Git HEAD: " + ((& git rev-parse HEAD 2>&1 | Out-String).Trim())) } catch { Write-Report 'Git HEAD: UNAVAILABLE' }
try {
  Write-Report 'Git status:'
  (& git status --short 2>&1) | ForEach-Object { Write-Report $_.ToString() }
} catch { Write-Report 'Git status: UNAVAILABLE' }

$results = New-Object System.Collections.Generic.List[object]
$results.Add((Run-AuditCommand '01 npm install' 'npm' @('install','--no-audit','--no-fund')))
$results.Add((Run-AuditCommand '02 npm run typecheck' 'npm' @('run','typecheck')))
$results.Add((Run-AuditCommand '03 npm run lint' 'npm' @('run','lint')))
$results.Add((Run-AuditCommand '04 npm run unit' 'npm' @('run','unit')))
$results.Add((Run-AuditCommand '05 npm run integration' 'npm' @('run','integration')))
$results.Add((Run-AuditCommand '06 npm run security' 'npm' @('run','security')))
$results.Add((Run-AuditCommand '07 npm run build' 'npm' @('run','build')))
$results.Add((Run-AuditCommand '08 npx playwright install chromium' 'npx' @('playwright','install','chromium')))
$results.Add((Run-AuditCommand '09 npm run e2e' 'npm' @('run','e2e')))
$results.Add((Run-AuditCommand '10 npm run verify' 'npm' @('run','verify')))
$results.Add((Run-AuditCommand '11 npm run verify:ui' 'npm' @('run','verify:ui')))

Write-Report ''
Write-Report ''
Write-Report ('=' * 88)
Write-Report 'FINAL AUDIT SUMMARY'
Write-Report ('=' * 88)
foreach ($r in $results) {
  Write-Report ("{0,-32} {1,-6} EXIT={2,-3} DURATION={3,8:N1}s" -f $r.Label,$r.Result,$r.ExitCode,$r.DurationS)
}
$passCount = @($results | Where-Object {$_.Result -eq 'PASS'}).Count
$failCount = @($results | Where-Object {$_.Result -eq 'FAIL'}).Count
Write-Report ''
Write-Report "PASS_COUNT: $passCount"
Write-Report "FAIL_COUNT: $failCount"
$overallText = if ($failCount -eq 0) { 'OVERALL_RESULT: PASS' } else { 'OVERALL_RESULT: FAIL' }
Write-Report $overallText
Write-Report "Audit completed: $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss zzz'))"
Write-Report "Full per-command logs: $logsDir"
Write-Report ''
Write-Report 'IMPORTANT AUDIT NOTE:'
Write-Report 'This report captures the actual commands executed on the operator machine.'
Write-Report 'A PASS means the command returned exit code 0 in this run; it does not replace'
Write-Report 'the manual security, release, recovery, and evidence review requirements.'

Write-Host ''
Write-Host 'AUDIT REPORT CREATED:'
Write-Host $report
Write-Host ''
Write-Host 'Upload that .txt file here for audit review.'
