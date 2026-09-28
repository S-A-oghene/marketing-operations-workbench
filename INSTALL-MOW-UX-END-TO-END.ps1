$ErrorActionPreference = 'Stop'

# MOW End-to-End UX Remediation Installer
# Designed for Windows PowerShell 5.1+ and for extraction directly into the
# existing MOW repository root.

$installerRoot = [System.IO.Path]::GetFullPath((Split-Path -Parent $MyInvocation.MyCommand.Definition))
$repoRoot = $installerRoot
$payloadRoot = [System.IO.Path]::GetFullPath((Join-Path $repoRoot 'mow-ux-payload'))

function Normalize-Path([string]$Path) {
    return [System.IO.Path]::GetFullPath($Path).TrimEnd('\','/')
}

$repoNorm = Normalize-Path $repoRoot
$payloadNorm = Normalize-Path $payloadRoot

if ($repoNorm -eq $payloadNorm) {
    throw "SAFETY STOP: installer source and repository destination are the same path. Do not copy a directory onto itself."
}

if (-not $payloadNorm.StartsWith($repoNorm + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "SAFETY STOP: payload is outside the repository root."
}

if (-not (Test-Path -LiteralPath $payloadRoot -PathType Container)) {
    throw "INSTALLATION STOP: payload folder was not found: $payloadRoot"
}

$payloadFiles = @(Get-ChildItem -LiteralPath $payloadRoot -Recurse -File)
if ($payloadFiles.Count -eq 0) {
    throw "INSTALLATION STOP: payload folder is empty."
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupRoot = Join-Path $repoRoot ('.mow-ux-end-to-end-backup-' + $timestamp)
New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null

$backupManifest = New-Object System.Collections.Generic.List[string]
$installManifest = New-Object System.Collections.Generic.List[string]

Write-Host ''
Write-Host 'MOW END-TO-END UX REMEDIATION INSTALLER' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host "Repository : $repoRoot"
Write-Host "Payload    : $payloadRoot"
Write-Host "Backup     : $backupRoot"
Write-Host ''

foreach ($file in $payloadFiles) {
    $relative = $file.FullName.Substring($payloadRoot.Length).TrimStart('\','/')
    $destination = Join-Path $repoRoot $relative
    $destinationDir = Split-Path -Parent $destination

    # Never allow the payload to overwrite itself.
    if ((Normalize-Path $destination) -eq (Normalize-Path $file.FullName)) {
        throw "SAFETY STOP: source/destination resolved to the same file: $relative"
    }

    if (Test-Path -LiteralPath $destination -PathType Leaf) {
        $backupPath = Join-Path $backupRoot $relative
        $backupDir = Split-Path -Parent $backupPath
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        Copy-Item -LiteralPath $destination -Destination $backupPath -Force
        $backupManifest.Add($relative)
    }

    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
    Copy-Item -LiteralPath $file.FullName -Destination $destination -Force
    $installManifest.Add($relative)
}

Set-Content -LiteralPath (Join-Path $backupRoot 'BACKUP-MANIFEST.txt') -Value $backupManifest
Set-Content -LiteralPath (Join-Path $repoRoot 'MOW-INSTALL-MANIFEST.txt') -Value $installManifest

Write-Host 'Installation complete.' -ForegroundColor Green
Write-Host "Files installed : $($installManifest.Count)"
Write-Host "Files backed up : $($backupManifest.Count)"
Write-Host ''
Write-Host 'Next required step:' -ForegroundColor Yellow
Write-Host 'Run the complete 11-command real-repository release gate unchanged.'
Write-Host ''
Write-Host 'Do not delete the timestamped backup until the new state has been verified.'
