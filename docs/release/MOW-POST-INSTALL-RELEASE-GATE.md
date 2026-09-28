# MOW Post-Install Release Gate

This is the required release sequence after installing an MOW remediation package.

## Step 1 — Installation

Close any running MOW development server.

Use the existing repository:

```text
C:\Users\HSEF 2026\Documents\MOW\marketing-operations-workbench
```

Extract the package into the repository root:

```powershell
Expand-Archive -Path "$env:USERPROFILE\Downloads\mow-ux-state-of-art-end-to-end-final-policy-aligned.zip" -DestinationPath "$PWD" -Force
```

Confirm the installer:

```powershell
Test-Path ".\INSTALL-MOW-UX-END-TO-END.ps1"
```

Expected:

```text
True
```

Run:

```powershell
powershell -ExecutionPolicy Bypass -File ".\INSTALL-MOW-UX-END-TO-END.ps1"
```

Confirm a backup exists:

```text
.mow-ux-end-to-end-backup-YYYYMMDD-HHmmss
```

Do not delete the backup until verification is complete.

## Step 2 — Exact 11-command gate

Run unchanged:

```powershell
npm install --no-audit --no-fund
npm run typecheck
npm run lint
npm run unit
npm run integration
npm run security
npm run build
npx playwright install chromium
npm run e2e
npm run verify
npm run verify:ui
```

The individual exit codes are authoritative.

## Step 3 — Manual browser acceptance

After all 11 commands pass, verify:

```text
Navigation
→ desktop
→ medium
→ mobile
→ Ctrl/Cmd+B

Command Search
→ Ctrl/Cmd+K
→ search
→ select
→ navigate

Records
→ create
→ edit
→ duplicate
→ persist

Filters / Display / Views
→ open
→ change actual surface

Meta Ads
→ planning
→ QA/readiness
→ persistence

Analytics
→ measurement store
→ source/evidence
→ UNKNOWN handling
→ measured facts vs interpretation

Outreach
→ review
→ human confirmation
→ evidence

Applications
→ ready
→ human confirmation
→ evidence

Integrations
→ connection/capability state

AI Gateway
→ provider state
→ generation
→ provenance
→ deterministic QA

Manual AI
→ prepare
→ paste
→ validate
→ review

Publication
→ approval
→ confirmation
→ evidence
→ duplicate protection

No-AI
→ core Workbench remains usable
```

## Step 4 — Evidence

Record:

```text
commit
backup
package
11 command results
manual browser acceptance
known limitations
open incidents
evidence links
date
owner
```

## Release rule

Do not declare release readiness if any dependency-backed command remains unverified or failed.
Do not use a broken aggregate audit summary to override individual command failures.
