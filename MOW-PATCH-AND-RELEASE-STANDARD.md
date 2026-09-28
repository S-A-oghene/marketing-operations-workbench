# MOW Patch, Remediation, Installation, and Release Verification Standard

**Applies to:** Marketing Operations Workbench (MOW) + AI Orchestration Gateway (AOG)
**Baseline:** Master Build & Operations Manual v1.0.0
**Effective:** 24 September 2026

## 1. Standard

Every MOW patch begins from the existing repository state.

```text
Existing validated work
→ Regression / defect baseline
→ Diagnosis against MOW domain/API/manual contracts
→ Small understandable implementation changes
→ Deterministic verification
→ Dependency-backed verification
→ Manual browser acceptance
→ Evidence
```

Do not restart the project from scratch merely because a regression exists.

Do not replace a genuine product fix with a weakened test.

The Workbench remains the system of record; AI remains replaceable; human authority remains final for consequential actions; evidence remains distinct from generated material; and No-AI operation remains supported.

## 2. Installation is part of the patch procedure

For installer-based remediation packages:

1. close the running MOW development server;
2. use the existing repository root;
3. extract the package into the repository root;
4. confirm `INSTALL-MOW-UX-END-TO-END.ps1` exists;
5. run the installer;
6. verify that a timestamped `.mow-ux-end-to-end-backup-YYYYMMDD-HHmmss` backup was created;
7. only then run the verification gate.

The installer must protect against source/destination self-overwrite.

## 3. Exact release gate

The following 11 commands are the standard real-repository gate and must remain unchanged unless the release specification itself is deliberately revised:

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

The individual command exit codes are authoritative.

A summary field cannot override a recorded failure.

## 4. Manual browser acceptance

After the command gate, perform actual browser acceptance across navigation, Command Search, create/edit/duplicate, filters, views, Meta Ads, Analytics, Outreach, Applications, Integrations, AI Gateway, Manual AI, publication confirmation/evidence, and No-AI operation.

Do not declare release readiness solely because the home page loads or deterministic scans pass.

## 5. Engineering quality

Patches should be:

- small;
- readable;
- reversible;
- beginner-friendly;
- domain-aware;
- testable;
- documented.

Fix underlying UI/domain contracts instead of adding brittle test-only workarounds.

## 6. Security and evidence

Do not weaken server-side authorization, workspace scoping, idempotency, capability verification, publication evidence, provenance, or secret handling.

Do not convert `UNKNOWN` into `0`, `false`, or success for convenience.

## 7. Release status vocabulary

Use separate states:

```text
PATCHED
DETERMINISTICALLY VERIFIED
DEPENDENCY-VERIFIED
MANUALLY VERIFIED
RELEASE READY
```

Do not collapse these into one unsupported success claim.
