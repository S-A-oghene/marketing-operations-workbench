# MOW UX / Interaction Remediation — Complete Action Layer — 2026-09-24

## Scope

This release replaces the remaining prototype interaction layer with a connected, record-driven Workbench experience. The intent is not cosmetic button wiring; every important control now maps to a real persisted operation, validated state transition, navigation workflow, or explicit non-availability state.

### Frontend
- Replaced hard-coded demo rows with live workspace records and explicit empty/error states.
- Added create and edit builders for primary module resources.
- Added detail drawers with contextual actions.
- Added List / Board / Calendar / Timeline surfaces where appropriate.
- Added module Refresh, Export, Display and context-correct Filters controls.
- Added module-specific filter/group fields for `status`, `state`, `approval_status`, `platform`, `origin_label`, `generated_by` and `cadence` rather than assuming every resource has a `status` column.
- Added relationship-aware selectors for linked Content, Campaign and Influencer records.
- Added explicit scheduling confirmation with date/time input.
- Added explicit confirmation gates for publication, submission and manual-send actions.
- Added persisted human AI decision recording through the Gateway.
- Added actual provider-health state and live OpenRouter quota posture to the AI Gateway surface.
- Bound remote provider eligibility to the Workbench provider registry: a credential plus a deployment flag is not enough for `READY`; an evidenced capability record is required.
- Added an auditable provider-capability verification workflow that creates `provider_capabilities` evidence before a provider can become `READY`.
- Connected Manual AI Bridge preparation/open/review events to the workspace audit trail.
- Expanded workspace export coverage to include operational linkage/evidence records needed to reconstruct the Workbench state.
- Added global quick-create routing into the real module builder.
- Made Workspace Settings a real navigation destination.
- Preserved the working hamburger navigation control across desktop, medium and mobile layouts.
- Removed remaining decorative alert()-style interactions from the upgraded surfaces.

### Worker/API
- Workspace-scoped CRUD endpoints for primary record surfaces.
- Per-resource update allowlists.
- Idempotency protection on mutations.
- Audit events for record mutations and human AI decisions.
- Contextual resource actions for tasks, campaigns, influencers, applications, outreach, content calendar, AI providers and platform connections.
- Deterministic report generation from measured workspace counts.
- Provider state refresh based on actual server-side configuration rather than optimistic assumptions.
- Corrected report handling so the `reports` table is not updated with a nonexistent `updated_at` column.
- Preserved content lifecycle evidence gates and no-false-success publication semantics.
- Validated linked Content/Campaign selectors at persistence time rather than trusting browser-provided opaque IDs.

### Manual alignment
The remediation preserves the supplied manual's core contract: MOW remains the system of record; AI remains optional and replaceable; human review remains authoritative for consequential actions; provider/platform limitations are explicit; measured facts remain separate from interpretation; unknown values remain explicit; secrets remain server-side; workspace isolation remains server-enforced; idempotency and auditability remain active; and failed providers must not destroy work.

### Validation
- All modified TypeScript/TSX files pass syntax/transpile validation in the artifact environment.
- SQLite smoke validation passes for linked content/campaign persistence, publication-evidence duplicate detection, report updates, and provider-capability evidence.
- Added E2E coverage for navigation, command search, module create workflows, filter/display controls, No-AI generation and Manual AI parsing.
- The artifact-generation environment did not complete a fresh dependency installation for the whole repository, so the existing repaired repository remains the authoritative place for the full dependency-backed validation suite.
