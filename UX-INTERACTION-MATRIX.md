# MOW v1.0.0 — UX Interaction Matrix

This matrix is the release-level interaction contract for the browser Workbench. A visible control must either navigate to a real surface, persist a real state change, open a real contextual workflow, or expose an explicit blocked/fallback state.

## Global shell

| Surface | Interaction | Expected result |
|---|---|---|
| Navigation | Hamburger | Collapse/expand navigation at desktop and medium widths; open/close off-canvas navigation on mobile |
| Navigation | Ctrl/Cmd+B | Same navigation state transition |
| Command search | Ctrl/Cmd+K / search button | Opens search dialog; selecting a result navigates to the actual module |
| Quick create | Create / Ctrl/Cmd+N | Opens real builder choices; choice navigates to builder and opens create mode |
| Workspace switcher | Click | Opens workspace menu; settings link navigates to settings |

## Core work

| Module | Create/edit | Views | State actions |
|---|---|---|---|
| Tasks / Today | Persist task | List / Board / Calendar | Start, done, cancel, reopen, wait, review |
| Content Studio / Blog | Persist content | List / Board | Brief, draft, QA, approve, schedule, confirm publication, changes |
| Content Calendar | Persist linked calendar entry | Calendar / List | Manual handoff, confirmed publication |
| Campaigns | Persist campaign | List / Board | Activate, pause, complete, archive |
| Meta Ads Lab | Persist planning campaign fields | List / Board + planning cockpit | Lifecycle state changes; QA-before-launch framing |
| Research | Persist source-backed research | List / Board | Edit / duplicate |
| Pinterest & SEO | Persist keyword + opportunities | List / Board | Edit / duplicate |
| Influencer CRM | Persist creator | List / Board | Research, qualify, contact, archive |
| Outreach | Persist linked outreach | List / Board | Review, ready to send, manual send confirmation |
| Applications | Persist opportunity | List / Board | Ready to submit, interview, confirmed submission |
| Assets | Persist metadata | List / Board | Edit / duplicate |
| Analytics | Persist metric snapshot | List / Board + measurement cockpit | Source-backed measurement only |
| Reports | Persist report | List / Board | Generate deterministic report |

## AI / evaluation

| Surface | Interaction | Expected result |
|---|---|---|
| AI Gateway | Generate / prepare | Uses provider registry, respects data class, records provenance |
| AI Gateway | Deterministic QA | Returns explicit QA state; does not auto-publish |
| AI Gateway | Kev | Optional evaluator; failure does not destroy work |
| AI Gateway | Human decision | Records APPROVED_BY_HUMAN or CHANGES_REQUIRED as an audit action |
| Manual AI | Prepare | Creates a user-controlled prompt package |
| Manual AI | Parse JSON | Validates structured response; malformed response remains invalid |
| Manual AI | Send to review | Enabled only after local parsing + QA |

## Connector / evidence integrity

| State/action | Expected result |
|---|---|
| Provider capability verify | Capability + evidence reference persisted before READY |
| Platform connection probe | Observed state + capability/evidence context persisted |
| OAuth expired | AUTH_REQUIRED; no false publication |
| TikTok audit-required | APPROVAL_REQUIRED / MANUAL_ONLY until actual audit evidence |
| Pinterest trial-only | TRIAL/limited state; no false production readiness |
| X authorization missing | AUTH_REQUIRED / MANUAL_ONLY |
| Publication | PUBLISHED only after platform confirmation or verified manual confirmation |
| Duplicate publication | DUPLICATE; no second publication side effect |

## Release invariants

- Every consequential state-changing request uses idempotency keys.
- Every workspace query is scoped server-side.
- Unknown measurements remain UNKNOWN or NOT_AVAILABLE.
- Provider failure preserves the underlying work item.
- No-AI mode keeps core Workbench workflows usable.
- Secrets never move into browser storage, URLs, prompts, logs, screenshots or client bundles.
