# MOW State-of-the-Art End-to-End UX Remediation — Policy-Aligned Package

This package is an installer-first remediation overlay for the existing Marketing Operations Workbench repository.

It must be applied to the current repository state. It is not a replacement repository and does not authorize starting over.

## Required sequence

1. Close the running MOW development server.
2. Extract this ZIP into the existing repository root.
3. Confirm `INSTALL-MOW-UX-END-TO-END.ps1` exists.
4. Run the installer.
5. Confirm the timestamped `.mow-ux-end-to-end-backup-YYYYMMDD-HHmmss` backup exists.
6. Run the exact 11-command real-repository gate in `docs/release/MOW-POST-INSTALL-RELEASE-GATE.md`.
7. Perform `docs/release/MOW-BROWSER-ACCEPTANCE-CHECKLIST.md`.
8. Record release evidence and known limitations.

## Key files

`INSTALL-MOW-UX-END-TO-END.ps1` — safe installer with timestamped backup.

`README-INSTALL-MOW-UX-END-TO-END.md` — beginner installation guide.

`MOW-PATCH-AND-RELEASE-STANDARD.md` — governing patch/remediation/release standard.

`MOW-ENGINEERING-PASS-20260924.md` — implementation and verification record.

`MOW-ENGINEERING-PASS-20260924.patch` — code diff for the recorded lint/E2E remediation.

## Release integrity

The previous audit report contains a broken aggregate `OVERALL_RESULT` field. Individual command exit codes and per-command evidence are authoritative.

A deterministic verifier pass is not a substitute for lint, build, Playwright E2E, or manual browser acceptance.
