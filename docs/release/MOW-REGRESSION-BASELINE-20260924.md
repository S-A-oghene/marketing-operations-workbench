# MOW Regression Baseline — 24 September 2026

Source: `MOW-AUDIT-RESULTS-20260924-144532.txt`

## Recorded failures

### Lint

`npm run lint` failed with 18 errors and 8 warnings.

Principal current-source findings:

- `Dashboard.tsx`: synchronous state updates within an effect.
- `ModulePage.tsx`: synchronous state updates within effects.
- `ModulePage.tsx`: `Date.now()` purity violations.
- archived repair/payload trees were also lint targets.

### Playwright E2E

10 tests ran; 6 passed and 4 failed.

1. Mobile navigation — the sidebar brand-mark subtree intercepted pointer events for the collapse control.
2. Module builders — duplicate `Create campaign` buttons caused Playwright strict-mode resolution failure.
3. Campaign creation — the same duplicate create-action resolution failed.
4. Analytics filters — the expected `Filters` control could not be found/clicked.

## Patch response

The remediation package addresses the recorded defects without weakening the architecture or release tests:

- defer effect-driven state work to avoid React purity lint findings;
- prevent mobile drawer stacking from covering the navigation toggle;
- target the primary create action when the UI exposes the action in more than one legitimate location;
- standardize the toolbar action as `Filters`;
- exclude local backup/payload trees from release lint targets.

## Important verification rule

The deterministic verifiers passing does not prove lint/build/Playwright success. The full real-machine 11-command gate must be executed after installation.
