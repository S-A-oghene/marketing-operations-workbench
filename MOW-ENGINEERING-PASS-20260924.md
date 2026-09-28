# MOW Engineering Pass — 24 September 2026

## Purpose

This pass addresses the lint and Playwright failures recorded by the real-machine audit `MOW-AUDIT-RESULTS-20260924-144532.txt` and packages the resulting implementation under the standard MOW patch/remediation/release procedure.

## Governing standard

This is a continuation of the existing MOW repository state. Validated tooling and navigation work are retained. The regression log remains the defect baseline. Fixes are made against the actual MOW domain/API/manual contracts rather than against isolated visual symptoms.

The complete patch procedure is documented in:

`docs/release/MOW-PATCH-AND-RELEASE-STANDARD.md`

The operator installation guide is:

`README-INSTALL-MOW-UX-END-TO-END.md`

## Changes made

1. `apps/web/src/components/Dashboard.tsx`
   - Deferred initial dashboard data loading to the next browser task.
   - Keeps the existing async behavior while avoiding the React purity/lint complaint about synchronous state updates from the effect.

2. `apps/web/src/components/ModulePage.tsx`
   - Deferred initial record loading from the effect.
   - Deferred lookup-state updates from the lookup effect.
   - Reused the existing top-level schedule helper so `Date.now()` is not called from component render/event-handler code in a way that triggers the React purity lint rule.
   - Standardized the toolbar action text to `Filters`; the contextual filter name is still shown inside the filter popover.

3. `apps/web/src/app/globals.css`
   - On screens at or below 820px, lowered the fixed mobile sidebar below the topbar stacking layer.
   - This keeps the navigation toggle physically clickable while the sidebar drawer is open.

4. `tests/e2e/workbench.spec.ts`
   - Scoped duplicate `Create campaign` action lookup to the first primary action.
   - The UI legitimately exposes the same create action in both the page header and empty state; the test now targets the primary action rather than failing strict-mode resolution.

5. `eslint.config.mjs`
   - Added explicit ignores for local MOW repair/payload directories that appeared in the previous Windows audit working tree.
   - This prevents archived repair material from becoming release-lint targets.

## Deterministic verification run in the engineering environment

- `npm run security` — PASS
- `npm run verify` — PASS
  - security scan PASS
  - traceability 142 rows
  - DIRECT_CORE_SMOKE=PASS
  - PORTABLE_EXPORT_RESTORE=PASS (38 tables, 1 asset)
- `npm run verify:ui` — PASS
  - UI_INTERACTION_VERIFY=PASS
  - 17 resources
  - 30 actions
  - button-handler/dead-placeholder/API-worker-route/manual-capability/module-insights/navigation-wiring/demo-fallback all PASS

These deterministic results do not replace the dependency-backed release gate.

## Required installation procedure

1. Close any running MOW development server.
2. Use the existing repository root:

   `C:\Users\HSEF 2026\Documents\MOW\marketing-operations-workbench`

3. Extract this remediation package into that repository root.
4. Confirm:

   `Test-Path ".\INSTALL-MOW-UX-END-TO-END.ps1"`

   Expected: `True`

5. Run:

   `powershell -ExecutionPolicy Bypass -File ".\INSTALL-MOW-UX-END-TO-END.ps1"`

6. Confirm the installer created a timestamped backup:

   `.mow-ux-end-to-end-backup-YYYYMMDD-HHmmss`

The installer includes source/destination safety checks to prevent self-overwrite errors such as `Cannot overwrite ... with itself`.

## Exact real-repository release gate

Run these 11 commands unchanged:

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

Use each command's actual exit code and per-command evidence. Do not rely on a broken aggregate PASS field.

## Manual browser acceptance

After the 11-command gate passes, manually exercise:

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
→ navigation

Create / Edit / Duplicate
→ builder
→ persistence
→ relationships

Filters / Display / Views
→ actual dataset and presentation changes

Meta Ads
→ planning
→ QA/readiness
→ persistence

Analytics
→ measurement records
→ evidence/source posture
→ UNKNOWN handling

Outreach / Applications
→ human confirmation
→ evidence

Integrations / AI Gateway
→ capability/state
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

## Full audit status at creation of this package

The original real-machine audit showed lint failure and four Playwright failures. The source fixes in this package address those recorded defects, but a new Windows-equivalent 11-command audit must be run after installation before release readiness is claimed.

## Scope discipline

No provider permissions, security boundaries, evidence/provenance rules, human-approval rules, publication semantics, or product architecture were weakened or bypassed.
