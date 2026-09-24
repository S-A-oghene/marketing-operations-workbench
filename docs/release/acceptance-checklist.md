# v1.0.0 Acceptance Checklist — Evidence Status

The checklist below records what is implemented in the repository versus what still requires live external-environment evidence. It deliberately does not convert unresolved items into success.

## Core
- [x] Repository / Workbench shell implemented
- [ ] Workspace isolation — runtime policy implemented; adversarial execution pending dependency-backed test run
- [x] Content schema + state machine + API transitions
- [x] Calendar schema / module
- [x] Tasks schema + create API
- [x] Research schema + create API
- [x] Influencer CRM schema + create API
- [ ] Assets — D1 metadata + R2 boundary present; live binary upload not verified
- [x] Applications schema + create API
- [ ] Reports — schema and UI present; numeric reporting requires live measurement data

## AI
- [x] AI Gateway boundary
- [ ] At least one remote engine actually works — credentials/provider access not available in this build environment
- [x] Manual AI Bridge
- [x] Provenance fields + audit writes
- [x] AI failure preserves work / deterministic fallback
- [x] No-AI deterministic generation path

## Evaluation
- [x] Deterministic QA rules
- [x] Human review state in UI and publication gates
- [x] Kev optional adapter boundary
- [x] Fabricated metric detection blocks unsupported numeric claims

## Security
- [x] Repository secret scan passes
- [ ] Client-bundle secret scan — real Next production bundle not built because npm registry installation could not complete
- [ ] Workspace isolation — live adversarial suite not executed
- [x] Audit schema + AI audit writes
- [ ] Idempotency — core table/primitive present; all state-changing endpoints not yet fully covered
- [x] Data-class remote-inference restriction

## Browser Companion
- [x] Manifest V3 side panel source
- [x] Explicit selected-text capture source
- [x] Page title / URL capture source
- [x] Save/handoff code path source
- [ ] Browser installation/runtime verification

## Release
- [ ] GitHub CI — workflow committed; hosted run not executed from this environment
- [ ] Next.js production build — dependencies unavailable locally
- [ ] E2E — Playwright dependencies/browser unavailable locally
- [x] Deterministic No-AI drill source + local smoke
- [x] Provider-shock fallback logic + test source
- [x] Portable JSON/CSV export + second in-memory SQLite restore smoke
- [x] Traceability matrix covering sections 0–134 and appendices A–G
