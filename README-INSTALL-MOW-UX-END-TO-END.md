# MOW End-to-End UX Remediation — Installation Guide

This package is an installer-first remediation overlay for the existing Marketing Operations Workbench repository.

It is designed to be applied to the current repository state, not used to start a new repository.

## Before installation

Close any running MOW development server.

Use the existing repository root:

```text
C:\Users\HSEF 2026\Documents\MOW\marketing-operations-workbench
```

Keep the existing repository and its validated work intact.

## 1. Extract the package into the repository root

From the repository root, extract:

```powershell
Expand-Archive -Path "$env:USERPROFILE\Downloads\mow-ux-state-of-art-end-to-end-final-policy-aligned.zip" -DestinationPath "$PWD" -Force
```

## 2. Confirm the installer exists

```powershell
Test-Path ".\INSTALL-MOW-UX-END-TO-END.ps1"
```

Expected:

```text
True
```

Do not continue if the result is not `True`.

## 3. Run the installer

```powershell
powershell -ExecutionPolicy Bypass -File ".\INSTALL-MOW-UX-END-TO-END.ps1"
```

The installer creates a timestamped backup before changing the repository:

```text
.mow-ux-end-to-end-backup-YYYYMMDD-HHmmss
```

It also contains source/destination safety checks so the previous:

```text
Cannot overwrite ... with itself
```

failure cannot silently recur.

The backup is retained until the installed state has been verified.

## 4. Run the exact 11-command real-repository gate

Do not remove, reorder, replace, or weaken any command.

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

Use individual command exit codes as the authoritative result.

Do not use a broken aggregate `OVERALL_RESULT` field as proof of success.

## 5. Perform manual browser acceptance

After the commands pass, manually exercise the application.

At minimum verify:

```text
Navigation
→ desktop collapse/expand
→ medium-width collapse/expand
→ mobile open/close
→ Ctrl/Cmd+B

Command Search
→ Ctrl/Cmd+K
→ search
→ select result
→ correct navigation

Create
→ builder
→ save
→ persisted record

Edit
→ reload
→ change
→ save

Duplicate
→ new record
→ preserved relationships

Filters
→ filter surface opens
→ visible dataset changes

Display / Views
→ Display changes visible columns
→ List / Board / Calendar / Timeline changes the surface

Meta Ads
→ planning fields
→ QA/readiness
→ persistence

Analytics
→ measured facts
→ source/evidence posture

Outreach
→ review
→ human confirmation

Applications
→ ready to submit
→ human confirmation

Integrations
→ capability/state

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
→ confirmation
→ evidence
→ duplicate protection

No-AI
→ core Workbench remains usable
```

## 6. Release evidence

Record:

```text
repository commit
backup directory
installation package
npm install
 typecheck
lint
unit
integration
security
build
Playwright installation
E2E
verify
verify:ui
manual browser acceptance
known limitations
open incidents
evidence links
date
owner
```

A clean deterministic verifier is not a substitute for lint, build, E2E or manual browser acceptance.
