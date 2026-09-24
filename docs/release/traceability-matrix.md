# Manual Traceability Matrix

> Generated from the binding manual. Status distinguishes implemented code/documentation from items that require live provider, browser, Cloudflare, or second-environment evidence. Code existence alone does not mark completion.

| Manual Section | Requirement Summary | Implementation Location | Test / Verification | Status | Evidence |
|---|---|---|---|---|---|
| 0 | DOCUMENT CONTROL | README.md;CONSTITUTION.md;docs/source/Marketing_Operations_Workbench_AI_Gateway_Manual_v1_0_0.md | Manual included verbatim; governance copied. | IMPLEMENTED | |
| 1 | CORE CONSTITUTION | CONSTITUTION.md;packages/core/src/policy.ts;packages/core/src/state.ts | Unit coverage for policy/state; adversarial secret coverage. | IMPLEMENTED | |
| 2 | PRODUCT NORTH STAR | packages/core/src/templates.ts;packages/recipes/src/index.ts | Unit recipe/template assertions. | IMPLEMENTED | |
| 3 | TARGET USER EXPERIENCE | apps/web/src/components/Shell.tsx;Dashboard.tsx;ModulePage.tsx;apps/web/src/lib/navigation.ts | Browser E2E requires installed Playwright/browser; not yet executed. | PARTIAL | |
| 4 | REFERENCE HARDWARE | docs/architecture/overview.md;README.md | Design documented; hardware runtime not measured in CI. | IMPLEMENTED | |
| 5 | HIGH-LEVEL ARCHITECTURE | docs/architecture/overview.md;packages/*/src;apps/web/worker/index.ts | Typecheck package boundaries; architecture review. | PARTIAL | |
| 6 | CLOUD-TO-CLOUD BASELINE | apps/web/wrangler.jsonc;docs/runbooks/cloudflare.md | Configuration present; live Cloudflare deployment not verified. | PARTIAL | |
| 7 | TECHNOLOGY BASELINE | package.json;apps/web/package.json;playwright.config.ts;vitest.config.ts | Lockfile absent until dependency installation; manifest versions pinned in package manifests. | PARTIAL | |
| 8 | REPOSITORY STRUCTURE | repository root;apps;packages;database;docs;tests;scripts | Repository tree present. | IMPLEMENTED | |
| 9 | CORE MODULE BOUNDARY | packages/core/src | Core imports shared types only; no provider SDK/runtime imports. | IMPLEMENTED | |
| 10 | APPLICATION LAYERS | apps/web/src;apps/web/worker/index.ts;packages/core/src | Code review + package typecheck. | IMPLEMENTED | |
| 11 | PRIMARY DATA MODEL | database/migrations/0001_core.sql through 0008_platform_and_policy.sql | Migration inspection; D1 execution pending. | PARTIAL | |
| 12 | TENANCY / WORKSPACE ISOLATION | apps/web/worker/index.ts;database/migrations/0001_core.sql;tests/adversarial/security.test.ts | Cross-workspace runtime policy present; adversarial suite not executed here due missing dependencies. | PARTIAL | |
| 13 | CONTENT DATA MODEL | database/migrations/0002_content.sql;packages/core/src/types.ts | Schema inspection + typecheck. | IMPLEMENTED | |
| 14 | CONTENT STATES | packages/core/src/state.ts | Unit state-transition assertions. | IMPLEMENTED | |
| 15 | CAMPAIGN MODEL | database/migrations/0001_core.sql | Schema review; planned/actual/UNKNOWN fields explicit. | IMPLEMENTED | |
| 16 | CONTENT CALENDAR | database/migrations/0002_content.sql;apps/web/src/components/ModulePage.tsx | Schema/UI inspection. | IMPLEMENTED | |
| 17 | DIGITAL ASSET LIBRARY | database/migrations/0004_growth.sql;apps/web/wrangler.jsonc | R2 binding and metadata schema present; live R2 upload not verified. | PARTIAL | |
| 18 | ASSET NAMING STANDARD | docs/architecture/overview.md;README.md | Naming standard documented. | IMPLEMENTED | |
| 19 | RESEARCH CENTER | database/migrations/0003_ai_gateway.sql;apps/web/src/components/ModulePage.tsx | Research schema and UI module present. | IMPLEMENTED | |
| 20 | PINTEREST + SEO LAB | database/migrations/0003_ai_gateway.sql;apps/web/src/components/ModulePage.tsx;packages/recipes/src/index.ts | Keyword schema/workflow represented; external SEO provider not configured. | PARTIAL | |
| 21 | BLOG STUDIO | apps/web/src/components/ModulePage.tsx;packages/recipes/src/index.ts;packages/core/src/templates.ts | Blog recipe/template and module present. | IMPLEMENTED | |
| 22 | INFLUENCER CRM | database/migrations/0004_growth.sql;apps/web/src/components/ModulePage.tsx | CRM schema/UI present; privacy limits documented. | IMPLEMENTED | |
| 23 | OUTREACH CENTER | database/migrations/0004_growth.sql;apps/web/src/components/ModulePage.tsx | Outreach schema/UI and human-confirmed send workflow are present; live automated send remains explicitly MANUAL_ONLY until an approved platform connector is configured. | PARTIAL | |
| 24 | TASK MANAGEMENT | database/migrations/0001_core.sql;apps/web/src/components/ModulePage.tsx | Task schema/UI present. | IMPLEMENTED | |
| 25 | AI ORCHESTRATION GATEWAY | packages/ai-gateway/src/gateway.ts;apps/web/worker/index.ts | Gateway package typecheck; integration test source present. | PARTIAL | |
| 26 | AI REQUEST CONTRACT | packages/core/src/types.ts | Typecheck validates contract shape. | IMPLEMENTED | |
| 27 | AI RESPONSE CONTRACT | packages/core/src/types.ts;packages/ai-gateway/src/providers.ts | Provider contract typecheck. | IMPLEMENTED | |
| 28 | PROVIDER CAPABILITY CONTRACT | packages/core/src/routing.ts;packages/ai-gateway/src/providers.ts | Capability filtering/unit source. | IMPLEMENTED | |
| 29 | PROVIDER STATES | packages/shared/src/index.ts;packages/ai-gateway/src/providers.ts | Operational states modeled; live probes not verified. | PARTIAL | |
| 30 | AI DATA CLASSIFICATION | packages/core/src/policy.ts | Policy unit coverage/source review. | IMPLEMENTED | |
| 31 | AI ROUTING STRATEGY | packages/core/src/routing.ts;packages/ai-gateway/src/gateway.ts | Fallback logic and quota-aware candidate filtering. | IMPLEMENTED | |
| 32 | OPENROUTER ADAPTER | packages/ai-gateway/src/providers.ts | Server-side key boundary; live credential check pending. | PARTIAL | |
| 33 | GEMINI ADAPTER | packages/ai-gateway/src/providers.ts | Server-side key boundary; live credential check pending. | PARTIAL | |
| 34 | HUGGING FACE ADAPTER | packages/ai-gateway/src/providers.ts | Replaceable HTTP adapter; Space state is configuration-dependent. | PARTIAL | |
| 35 | KEV DECISION ENGINE | packages/evaluators/src/index.ts;apps/web/worker/index.ts | Optional evaluator boundary; actual Kev endpoint/model evaluation not configured. | PARTIAL | |
| 36 | DETERMINISTIC QA ENGINE | packages/core/src/qa.ts;packages/evaluators/src/index.ts | Deterministic QA rules encoded. | IMPLEMENTED | |
| 37 | BRAND COMPLIANCE ENGINE | packages/core/src/types.ts;apps/web/src/components/AiGatewayPanel.tsx | Brand profile contract represented; richer rule execution remains to be expanded. | PARTIAL | |
| 38 | CLAIM SAFETY | packages/core/src/qa.ts | Metric-claim detection and claim classifier present. | IMPLEMENTED | |
| 39 | MULTI-MODEL GENERATION | packages/ai-gateway/src/gateway.ts;apps/web/src/components/AiGatewayPanel.tsx | Candidate/provenance UI; current adapter invocation is single-success with fallback rather than full fan-out. | PARTIAL | |
| 40 | PROMPT RECIPES | packages/recipes/src/index.ts | 12 versioned recipes present. | IMPLEMENTED | |
| 41 | RECIPE VERSIONING | database/migrations/0003_ai_gateway.sql;packages/recipes/src/index.ts | Recipe versions stored and seeded. | IMPLEMENTED | |
| 42 | MANUAL AI BRIDGE | apps/web/src/components/ManualBridge.tsx;apps/web/src/app/manual-ai/page.tsx | Manual state machine/UI present; browser execution is intentionally user-controlled. | IMPLEMENTED | |
| 43 | NO COVERT CONSUMER-AI AUTOMATION | apps/extension;docs/security/threat-model.md;CONSTITUTION.md | Extension contains no consumer-AI DOM automation. | IMPLEMENTED | |
| 44 | BROWSER SIDE-PANEL COMPANION | apps/extension/manifest.json;apps/extension/sidepanel.html;apps/extension/sidepanel.js | Manifest and side panel present; browser install/runtime not executed here. | PARTIAL | |
| 45 | EXTENSION DATA CAPTURE RULE | apps/extension/sidepanel.js;apps/extension/justification.md | Explicit user capture and minimal permissions documented. | IMPLEMENTED | |
| 46 | SOCIAL PUBLISHER | packages/connectors/src/index.ts;apps/web/src/components/ModulePage.tsx | Connector abstraction and states present; live APIs pending. | PARTIAL | |
| 47 | INSTAGRAM / META BOUNDARY | packages/connectors/src/index.ts;docs/providers/platform-connectors.md | Meta/IG boundary represented; capability probing is configuration dependent. | PARTIAL | |
| 48 | META ADS LAB | apps/web/src/components/ModulePage.tsx;packages/recipes/src/index.ts | Planning module and recipe present; launch execution not wired to ads API. | PARTIAL | |
| 49 | TIKTOK CONNECTOR | packages/connectors/src/index.ts;docs/providers/platform-connectors.md | TikTok states present; approval/audit credentials not configured. | PARTIAL | |
| 50 | PINTEREST CONNECTOR | packages/connectors/src/index.ts;docs/providers/platform-connectors.md | Pinterest states present; sandbox not connected. | PARTIAL | |
| 51 | X CONNECTOR | packages/connectors/src/index.ts;docs/providers/platform-connectors.md | X states present; developer credentials not configured. | PARTIAL | |
| 52 | PLATFORM HANDOFF RULE | packages/connectors/src/index.ts;apps/web/src/components/ModulePage.tsx | Manual handoff represented; publication evidence still requires runtime confirmation. | PARTIAL | |
| 53 | ANALYTICS MODEL | database/migrations/0005_analytics_proof.sql | Metric snapshot schema is source-backed/UNKNOWN-capable. | IMPLEMENTED | |
| 54 | ANALYTICS DASHBOARD | apps/web/src/components/ModulePage.tsx;database/migrations/0005_analytics_proof.sql | Analytics area and schema present; live metrics ingestion pending. | PARTIAL | |
| 55 | WEEKLY REPORT ENGINE | database/migrations/0005_analytics_proof.sql;apps/web/src/components/ModulePage.tsx | Report fields separate measured facts/interpretation. | PARTIAL | |
| 56 | EVIDENCE / PROVENANCE | database/migrations/0003_ai_gateway.sql;0006_security_ops.sql;apps/web/worker/index.ts | AI provenance/audit writes implemented in Worker. | PARTIAL | |
| 57 | IDEMPOTENCY | packages/core/src/idempotency.ts;database/migrations/0006_security_ops.sql | Core idempotency semantics and storage table present; all state-changing endpoints not fully surfaced yet. | PARTIAL | |
| 58 | RETRIES | apps/web/worker/index.ts;docs/runbooks/incident-response.md | Queue retry/dead-letter handling implemented; provider retry headers are adapter-level only. | PARTIAL | |
| 59 | ASYNC JOB MODEL | database/migrations/0006_security_ops.sql;apps/web/wrangler.jsonc;apps/web/worker/index.ts | Job schema and queue handler present. | PARTIAL | |
| 60 | QUOTA MANAGEMENT | database/migrations/0006_security_ops.sql;apps/web/worker/index.ts | OpenRouter internal daily safety budget wired; other provider quotas remain provider-dependent. | PARTIAL | |
| 61 | CACHING | packages/core/src/hash.ts;packages/ai-gateway/src/providers.ts | SHA256 primitive exists; cache store/invalidation not fully wired. | PARTIAL | |
| 62 | PROMPT VERSIONING | database/migrations/0003_ai_gateway.sql;docs/architecture/overview.md | Recipe/prompt version model documented; prompt-template persistence is partial. | PARTIAL | |
| 63 | HUMAN APPROVAL | packages/core/src/state.ts;apps/web/src/components/AiGatewayPanel.tsx | Human approval gate represented; publication adapter enforcement remains runtime-dependent. | PARTIAL | |
| 64 | PROOF-OF-WORK CENTER | database/migrations/0005_analytics_proof.sql;apps/web/src/components/ModulePage.tsx | Origin/metric status schema/UI present. | IMPLEMENTED | |
| 65 | APPLICATION TRACKER | database/migrations/0005_analytics_proof.sql;apps/web/src/components/ModulePage.tsx | Application tracker schema/UI present; actual submission confirmation requires user evidence. | PARTIAL | |
| 66 | FULLPOND WORKFLOW RECIPES | packages/recipes/src/index.ts;apps/web/src/components/ModulePage.tsx | FullPond recipes represented in recipe registry/UI. | IMPLEMENTED | |
| 67 | ROLE-POSITIONING INTEGRITY | CONSTITUTION.md;database/migrations/0005_analytics_proof.sql | No-fabrication/transferable evidence rules documented. | IMPLEMENTED | |
| 68 | AI MANUAL MODES | apps/web/src/components/AiGatewayPanel.tsx | User-visible modes include all manual/no-AI options. | IMPLEMENTED | |
| 69 | AI AVAILABILITY LADDER | packages/core/src/routing.ts;packages/ai-gateway/src/gateway.ts | Fallback routing is deterministic-first and provider-neutral. | IMPLEMENTED | |
| 70 | AI GATEWAY EXAMPLE | packages/recipes/src/index.ts;apps/web/src/components/AiGatewayPanel.tsx | TikTok recipe and golden prompt fields represented; multi-generator fan-out is partial. | PARTIAL | |
| 71 | AI COMPARISON VIEW | apps/web/src/components/AiGatewayPanel.tsx | Candidate/provider/model/rule/decision signals shown; no universal score. | IMPLEMENTED | |
| 72 | NO-AI MODE | packages/core/src/templates.ts;apps/web/src/components/AiGatewayPanel.tsx | Deterministic generation remains usable without providers. | IMPLEMENTED | |
| 73 | PROVIDER-SHOCK SCENARIOS | tests/integration/gateway.test.ts;tests/adversarial/security.test.ts;docs/release/verification-status.md | Shock scenarios documented/test sources; live execution pending dependency install. | PARTIAL | |
| 74 | FAILURE USER EXPERIENCE | apps/web/src/components/AiGatewayPanel.tsx;apps/web/worker/index.ts | Actionable failure surface and work-preservation response modeled. | PARTIAL | |
| 75 | UNKNOWN STATE | packages/core/src/qa.ts;apps/web/src/components/Dashboard.tsx;docs/architecture/unknown-and-evidence.md | UNKNOWN used explicitly for unmeasured states. | IMPLEMENTED | |
| 76 | REPORTING FACT VS INTERPRETATION | database/migrations/0005_analytics_proof.sql;apps/web/src/components/ModulePage.tsx | Report schema separates fact/narrative fields. | IMPLEMENTED | |
| 77 | SECURITY — SECRETS | docs/security/data-classification.md;scripts/security-check.mjs | Secret scan and data policy documentation present. | PARTIAL | |
| 78 | SECURITY — TOKEN STORAGE | database/migrations/0006_security_ops.sql;docs/security/threat-model.md | Token/session tables and threat model present; production secret-at-rest runtime not fully exercised. | PARTIAL | |
| 79 | SECURITY — CLIENT/SERVER BOUNDARY | apps/web/worker/index.ts;apps/web/src;docs/security/data-classification.md | Production request context uses Cloudflare Access email; demo mode is explicitly gated by DEMO_AUTH. | PARTIAL | |
| 80 | SECURITY — EXTENSION | apps/extension/justification.md;apps/extension/sidepanel.js | No cookie/header/password collection implemented. | IMPLEMENTED | |
| 81 | PRIVACY POLICY INSIDE THE APP | packages/core/src/policy.ts;apps/web/worker/index.ts | Remote AI policy is enforced before dispatch. | IMPLEMENTED | |
| 82 | AUDIT LOG | database/migrations/0006_security_ops.sql;apps/web/worker/index.ts | AI completion/failure audit writes present; other audit actions require connector wiring. | PARTIAL | |
| 83 | OBSERVABILITY | apps/web/worker/index.ts;docs/release/verification-status.md | Health/quota/job fields exist; dashboards are partly demo-facing. | PARTIAL | |
| 84 | BACKUP AND PORTABILITY | apps/web/worker/index.ts;scripts/export-workspace.mjs;docs/runbooks/backup-restore.md | JSON workspace export exists; CSV/full restore run not executed. | PARTIAL | |
| 85 | DATABASE MIGRATION POLICY | database/migrations/0001_core.sql through 0008_platform_and_policy.sql;docs/runbooks/backup-restore.md | Additive migrations with recovery notes. | IMPLEMENTED | |
| 86 | CLOUD SETUP — BEGINNER PATH | docs/runbooks/cloudflare.md;README.md | Beginner setup documented; account creation remains user-side. | IMPLEMENTED | |
| 87 | CREATE THE GITHUB REPOSITORY | README.md;docs/runbooks/cloudflare.md | GitHub repository instructions documented; remote repository not created by this build environment. | PARTIAL | |
| 88 | CREATE CLOUDFLARE RESOURCES | apps/web/wrangler.jsonc;docs/runbooks/cloudflare.md | Resource names/bindings specified; actual resources not created here. | PARTIAL | |
| 89 | CLOUDFLARE WORKER CONFIGURATION | apps/web/wrangler.jsonc;apps/web/worker/index.ts | Bindings and server-side env names present. | PARTIAL | |
| 90 | D1 INITIAL MIGRATION | database/migrations/0001_core.sql;database/migrations/0002_content.sql;0003_ai_gateway.sql;0004_growth.sql;0005_analytics_proof.sql;0006_security_ops.sql;0007_indexes.sql | Migration files present; D1 staging migration not run in Cloudflare. | PARTIAL | |
| 91 | FIRST DEPLOYMENT | docs/runbooks/cloudflare.md;apps/web/wrangler.jsonc | Deployment sequence documented; live deployment/browser health check not performed. | PARTIAL | |
| 92 | CI PIPELINE | .github/workflows/ci.yml;package.json | CI definition present; GitHub-hosted run not verified. | PARTIAL | |
| 93 | TESTING PYRAMID | tests/unit;tests/integration;tests/e2e;tests/adversarial | Test pyramid sources present; runners unavailable until npm dependencies are installed. | PARTIAL | |
| 94 | ADVERSARIAL TEST CATALOGUE | tests/adversarial/security.test.ts;tests/integration/gateway.test.ts | Core adversarial scenarios represented; execution pending dependency install. | PARTIAL | |
| 95 | NO-AI DRILL | scripts/verify-all.mjs;docs/release/verification-status.md | No-AI drill documented; live second-environment drill not run. | PARTIAL | |
| 96 | PROVIDER SHOCK DRILL | tests/integration/gateway.test.ts;docs/release/verification-status.md | Provider shock cases represented; external credentials/providers not configured. | PARTIAL | |
| 97 | SECURITY RELEASE GATE | scripts/security-check.mjs;docs/release/verification-status.md | Secret scan passes locally; full release gate not yet fully executed. | PARTIAL | |
| 98 | PERFORMANCE GOALS | apps/web/src;docs/architecture/overview.md | Static shell avoids large client-side runtime; bundle measurement pending real Next build. | PARTIAL | |
| 99 | ACCESSIBILITY | apps/web/src/app/globals.css;apps/web/src/components | Semantic UI and focus styles present; automated axe/accessibility run not included. | PARTIAL | |
| 100 | LOGGING | apps/web/worker/index.ts;scripts/security-check.mjs | Safe event metadata and secret scanning present. | PARTIAL | |
| 101 | RATE LIMIT HANDLING | packages/ai-gateway/src/providers.ts;packages/ai-gateway/src/gateway.ts | 429 classified; fallback continues to next eligible provider. | IMPLEMENTED | |
| 102 | AUTH FAILURE HANDLING | apps/web/worker/index.ts | Production path returns AUTH_REQUIRED and Cloudflare Access guidance. | IMPLEMENTED | |
| 103 | MALFORMED OUTPUT HANDLING | packages/ai-gateway/src/providers.ts;packages/ai-gateway/src/gateway.ts | Invalid JSON status preserved and falls back; one explicit repair flow remains future enhancement. | PARTIAL | |
| 104 | DUPLICATE PREVENTION | packages/core/src/state.ts;tests/unit/core.test.ts | Duplicate publication gate encoded. | IMPLEMENTED | |
| 105 | PLATFORM PUBLICATION EVIDENCE | packages/core/src/state.ts;packages/connectors/src/index.ts | PUBLISHED transition requires evidence; live provider confirmation not exercised. | PARTIAL | |
| 106 | ANALYTICS RECONCILIATION | database/migrations/0005_analytics_proof.sql;apps/web/worker/index.ts | Metric/source fields exist; automated reconciliation job not fully wired. | PARTIAL | |
| 107 | APPLICATION SUBMISSION EVIDENCE | database/migrations/0005_analytics_proof.sql;apps/web/src/components/ModulePage.tsx | Application status model visible; actual external confirmation must be supplied by user. | PARTIAL | |
| 108 | FULLPOND PROOF-OF-WORK MODEL | database/migrations/0005_analytics_proof.sql;apps/web/src/components/ModulePage.tsx | Origin labels and measurement status are modeled. | IMPLEMENTED | |
| 109 | SELF-DIRECTED SPEC SAFETY | CONSTITUTION.md;docs/release/known-limitations.md | Self-directed spec safety documented. | IMPLEMENTED | |
| 110 | FIRST-DAY BUILD | apps/web/src;packages/core/src;apps/web/worker/index.ts | First-day modules and common shell implemented. | PARTIAL | |
| 111 | SECOND BUILD | packages/ai-gateway/src/providers.ts;database/migrations/0003_ai_gateway.sql | Remote provider adapters/quota/provenance implemented at boundary. | PARTIAL | |
| 112 | THIRD BUILD | packages/evaluators/src/index.ts;packages/core/src/qa.ts | HF boundary, Kev optional evaluator, deterministic QA present. | PARTIAL | |
| 113 | FOURTH BUILD | apps/extension | Side panel code present; browser installation/runtime proof pending. | PARTIAL | |
| 114 | FIFTH BUILD | packages/connectors/src/index.ts | Platform connector boundaries/states present; live credentials pending. | PARTIAL | |
| 115 | SIXTH BUILD | database/migrations/0005_analytics_proof.sql;apps/web/src/components/ModulePage.tsx | Analytics/report/proof/application schemas/UI present. | PARTIAL | |
| 116 | RELEASE PROCESS | docs/release/release-evidence-template.md;docs/release/acceptance-checklist.md | Release process documented. | IMPLEMENTED | |
| 117 | VERSIONING | package.json | SemVer 1.0.0 fixed in manifests. | IMPLEMENTED | |
| 118 | DOCUMENT CHANGE CONTROL | CONSTITUTION.md;docs/release/known-limitations.md | Change-control policy documented. | IMPLEMENTED | |
| 119 | INCIDENT RESPONSE — AI OUTAGE | docs/runbooks/incident-response.md;apps/web/worker/index.ts | AI outage playbook and preserve/fallback behavior present. | IMPLEMENTED | |
| 120 | INCIDENT RESPONSE — DATABASE FAILURE | docs/runbooks/backup-restore.md;docs/runbooks/incident-response.md | DB failure recovery is documented; actual restore exercise pending. | PARTIAL | |
| 121 | INCIDENT RESPONSE — ASSET STORAGE FAILURE | docs/runbooks/incident-response.md;apps/web/wrangler.jsonc | R2 incident path documented. | PARTIAL | |
| 122 | INCIDENT RESPONSE — PUBLISH FAILURE | docs/runbooks/incident-response.md;packages/core/src/state.ts | Publication uncertainty uses UNKNOWN; no auto duplicate publish. | PARTIAL | |
| 123 | PROVIDER MIGRATION | packages/ai-gateway/src/providers.ts;docs/providers/provider-registry.md | Provider replacement is adapter-contained. | IMPLEMENTED | |
| 124 | PLATFORM MIGRATION | packages/connectors/src/index.ts;docs/providers/platform-connectors.md | Platform MANUAL_ONLY state represented. | PARTIAL | |
| 125 | EXPORT TEST | apps/web/worker/index.ts;scripts/export-workspace.mjs | JSON export implemented; CSV/rebuild verification pending. | PARTIAL | |
| 126 | RESTORE TEST | docs/runbooks/backup-restore.md | Restore procedure documented; second-environment execution pending. | PENDING | |
| 127 | OPERATING DAILY PROCEDURE | docs/runbooks/daily-weekly-monthly.md | Daily procedure documented. | IMPLEMENTED | |
| 128 | DAILY STARTUP CHECK | docs/runbooks/daily-weekly-monthly.md | Startup checklist documented; live run pending. | IMPLEMENTED | |
| 129 | WEEKLY CHECK | docs/runbooks/daily-weekly-monthly.md | Weekly checklist documented. | IMPLEMENTED | |
| 130 | MONTHLY CHECK | docs/runbooks/daily-weekly-monthly.md | Monthly checklist documented. | IMPLEMENTED | |
| 131 | V1.0.0 ACCEPTANCE CRITERIA | docs/release/acceptance-checklist.md;docs/release/verification-status.md | Acceptance checklist present; unresolved entries remain explicit. | PARTIAL | |
| 132 | WHAT v1.0.0 MEANS | README.md;CONSTITUTION.md | v1.0.0 meaning captured. | IMPLEMENTED | |
| 133 | FINAL REFERENCE ARCHITECTURE | docs/architecture/overview.md;apps/web | Reference architecture documented/implemented at component boundary. | PARTIAL | |
| 134 | FINAL OPERATING PRINCIPLES | CONSTITUTION.md;docs/release/verification-status.md | Operating principles captured; verification status remains honest. | IMPLEMENTED | |
| A | APPENDIX A — QUICKSTART | README.md;docs/runbooks/cloudflare.md | Quickstart sequence documented. | IMPLEMENTED | |
| B | APPENDIX B — STOP CONDITIONS | docs/release/known-limitations.md;CONSTITUTION.md | Stop conditions preserved and surfaced. | IMPLEMENTED | |
| C | APPENDIX C — USER-FACING AI PANEL | apps/web/src/components/AiGatewayPanel.tsx | User-facing AI panel implemented. | IMPLEMENTED | |
| D | APPENDIX D — GOLDEN DEMO | docs/release/acceptance-checklist.md;apps/web/src/components/AiGatewayPanel.tsx | Golden demo path represented; full runtime proof pending. | PARTIAL | |
| E | APPENDIX E — RELEASE EVIDENCE TEMPLATE | docs/release/release-evidence-template.md | Evidence template implemented. | IMPLEMENTED | |
| F | APPENDIX F — CURRENT OFFICIAL PROVIDER / PLATFORM VERIFICATION REGISTER | docs/providers/provider-registry.md;docs/source/Marketing_Operations_Workbench_AI_Gateway_Manual_v1_0_0.md | Verification snapshot retained as source/manual data; re-verification is operator responsibility. | IMPLEMENTED | |
| G | APPENDIX G — CHANGELOG | docs/source/Marketing_Operations_Workbench_AI_Gateway_Manual_v1_0_0.md;docs/release/known-limitations.md | Changelog retained; implementation deltas documented. | IMPLEMENTED | |
