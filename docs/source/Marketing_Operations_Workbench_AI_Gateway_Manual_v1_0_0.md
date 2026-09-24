# MARKETING OPERATIONS WORKBENCH
## AI ORCHESTRATION GATEWAY — MASTER BUILD & OPERATIONS MANUAL v1.0.0

**Document type:** Product / Architecture / Engineering / Security / Operations / Beginner Execution Manual  
**Version:** 1.0.0  
**Prepared:** 23 September 2026  
**Primary objective:** Build a zero-budget, browser-first, cloud-to-cloud marketing operations workstation that remains useful with zero AI providers and can optionally use multiple free remote AI engines, Hugging Face resources, a structured Kev decision/evaluation layer, an optional local CPU model, and human-controlled browser AI.

---

# 0. DOCUMENT CONTROL

## 0.1 Purpose

This manual is the authoritative version 1.0.0 build, security, operating, testing, deployment and recovery specification for the **Marketing Operations Workbench (MOW)** and **AI Orchestration Gateway (AOG)**.

It is written for an operator who:

- wants a single browser-based place to run daily marketing work;
- has a strict zero-budget requirement;
- has modest Windows hardware;
- cannot depend on a dedicated AI GPU;
- wants to use several free AI sources instead of one provider;
- wants a manual/browser AI fallback;
- wants an open-source-first design;
- wants to preserve work when external providers fail;
- wants evidence and provenance instead of unverifiable AI claims.

## 0.2 What this manual covers

The manual covers:

1. product purpose;
2. user interface;
3. system architecture;
4. cloud architecture;
5. database design;
6. object storage;
7. background jobs;
8. work recipes;
9. AI Gateway;
10. provider adapters;
11. OpenRouter;
12. Gemini;
13. Hugging Face;
14. Kev;
15. optional local inference;
16. manual browser AI;
17. Chrome/Edge side panel;
18. platform connectors;
19. Instagram/Meta;
20. TikTok;
21. Pinterest;
22. X;
23. Pinterest + SEO;
24. blog production;
25. influencer research and CRM;
26. outreach;
27. campaign management;
28. Meta Ads planning;
29. analytics;
30. asset management;
31. reporting;
32. proof-of-work;
33. application tracking;
34. security;
35. privacy;
36. idempotency;
37. retries;
38. observability;
39. quota management;
40. testing;
41. adversarial testing;
42. deployment;
43. daily operations;
44. incident response;
45. backup/recovery;
46. provider migration;
47. release management.

## 0.3 Non-goals

This v1.0.0 does not promise:

- unlimited free AI;
- unrestricted API access to every social platform;
- unrestricted consumer-account publishing;
- unrestricted automation of consumer AI websites;
- automatic advertising spend without cost;
- automatic employment or hiring decisions;
- fabricated social proof;
- fabricated marketing performance;
- fully autonomous publication of every content item;
- permanent availability of any particular third-party model;
- permanent availability of any particular free tier.

## 0.4 Source discipline

The architecture in this manual is based on the supplied design material. Current external provider/API statements are treated as time-sensitive and are separately recorded in Appendix F.

When a provider changes its API, access tier, pricing or terms, this manual's core architecture does not change. Only the affected connector, provider registry entry, runbook and possibly compliance policy are updated.

---

# 1. CORE CONSTITUTION

## 1.1 System-of-record rule

The Workbench is the system of record for marketing work.

External platforms are execution and observation edges.

AI models are replaceable accelerators.

## 1.2 AI independence invariant

> **No core marketing workflow may become unavailable because a model, provider, browser service, quota, API, browser integration or hosted inference endpoint becomes unavailable.**

## 1.3 Manual bridge invariant

> **Manual AI interaction is a supported execution mode, not a failure mode.**

## 1.4 Human authority invariant

> **AI may generate, classify, compare and suggest. A human remains the final authority for publication, outreach and other consequential actions unless a separately approved automation policy explicitly allows otherwise.**

## 1.5 Evidence invariant

> **Measured facts, generated content, human decisions and AI suggestions must remain distinguishable.**

## 1.6 No fabrication invariant

The system must never invent:

- follower counts;
- reach;
- impressions;
- CTR;
- CPC;
- CPA;
- ROAS;
- leads;
- conversions;
- influencer contacts;
- customer results;
- employment history;
- client relationships;
- campaign spend;
- campaign outcomes.

If a field is unknown, store `UNKNOWN` or `NOT_AVAILABLE`.

---

# 2. PRODUCT NORTH STAR

## 2.1 Product statement

The Marketing Operations Workbench provides one operating console for:

**IDEA → RESEARCH → BRIEF → CONTENT → QA → APPROVAL → EXECUTION → MEASURE → LEARN → NEXT ACTION**

## 2.2 AI-assisted lifecycle

**USER REQUEST → WORK RECIPE → AI GATEWAY → GENERATION → NORMALIZATION → DETERMINISTIC QA → OPTIONAL KEV EVALUATION → HUMAN REVIEW → EXECUTION → EVIDENCE → REPORT**

## 2.3 Zero-AI lifecycle

**USER REQUEST → WORK RECIPE → TEMPLATE / RULE ENGINE → HUMAN EDIT → EXECUTION → EVIDENCE → REPORT**

---

# 3. TARGET USER EXPERIENCE

## 3.1 One browser window

The normal user experience is:

```text
MARKETING OPERATIONS WORKBENCH
│
├── Command Center
├── Today
├── Tasks
├── Content Studio
├── Content Calendar
├── Social Publisher
├── Pinterest & SEO
├── Blog Studio
├── Influencer CRM
├── Outreach
├── Campaigns
├── Meta Ads Lab
├── Analytics
├── Asset Library
├── Research
├── Reports
├── Proof of Work
├── Applications
├── AI Gateway
├── SOPs & Playbooks
├── Integrations
└── Settings
```

## 3.2 Command Center

The home page should show:

- tasks due today;
- overdue items;
- drafts waiting for QA;
- content awaiting approval;
- scheduled content;
- outreach follow-ups;
- influencer pipeline changes;
- SEO opportunities;
- AI provider health;
- quota warnings;
- failed jobs;
- upcoming interviews/applications;
- weekly performance snapshot.

## 3.3 Today view

The Today view is the default daily operating page.

It should answer:

1. What must be done today?
2. What is blocked?
3. What needs my approval?
4. What has failed?
5. What is scheduled?
6. What should happen next?

---

# 4. REFERENCE HARDWARE

The reference laptop described for this design is:

- Dell Latitude 3500;
- Intel i5-8265U;
- 4 cores / 8 threads;
- 16 GB RAM;
- approximately 4 GB free RAM in the observed state;
- integrated graphics.

This machine is suitable for:

- browser use;
- Workbench UI;
- browser extension;
- lightweight JavaScript;
- document editing;
- deterministic processing;
- local search/indexing;
- very small CPU-only models.

It is **not** the machine around which serious local LLM inference should be designed.

The architecture therefore prefers:

**browser interface + cloud inference when available + deterministic local/browser logic always.**

---

# 5. HIGH-LEVEL ARCHITECTURE

```text
                           USER
                            │
                            ▼
                  BROWSER WORKBENCH
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
        WORKBENCH APPLICATION     BROWSER COMPANION
                │                       │
                └───────────┬───────────┘
                            │
                            ▼
                      WORK RECIPES
                            │
                            ▼
                AI ORCHESTRATION GATEWAY
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
 FREE REMOTE AI       HUGGING FACE       MANUAL AI BRIDGE
       │                    │                    │
       │                    │                    ├─ ChatGPT Web
       │                    │                    ├─ Gemini Web
       │                    │                    ├─ Claude Web
       │                    │                    └─ other web AI
       │                    │
       └──────────────┬─────┘
                      ▼
                EVALUATION LAYER
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
      DETERMINISTIC QA       KEV
             │                 │
             └────────┬────────┘
                      ▼
                HUMAN REVIEW
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
        API EXECUTION     MANUAL HANDOFF
             │                 │
             └────────┬────────┘
                      ▼
                   EVIDENCE
                      │
                      ▼
                  ANALYTICS
```

---

# 6. CLOUD-TO-CLOUD BASELINE

## 6.1 Recommended baseline

```text
GitHub
  ↓
Cloudflare Pages / Workers
  ↓
Cloudflare D1
  ↓
Cloudflare R2
  ↓
Cloudflare Queues / Workers Workflows
  ↓
External APIs and Browser Handoff
```

Optional:

```text
Supabase Auth/Postgres
Vercel Preview
```

These optional components may be used where an existing workflow already depends on them.

## 6.2 Why Cloudflare-first

The Workbench is primarily an internal/user-facing browser application with asynchronous jobs, small database records, and object storage.

Cloudflare's current Free allocations are useful for a personal or early-stage workload, but they are quotas and may change. Current official figures are recorded in Appendix F.

---

# 7. TECHNOLOGY BASELINE

Recommended implementation:

```text
Frontend:             Next.js + TypeScript
Core:                 TypeScript
API/runtime:          Cloudflare Workers
Database:             Cloudflare D1
Object storage:       Cloudflare R2
Async jobs:           Cloudflare Queues
Scheduled work:       Workers Cron / Workflows
Source control:       GitHub
Browser companion:    Chrome/Edge Manifest V3
Unit tests:           Vitest
Browser tests:        Playwright
```

The exact framework versions must be recorded in the repository lockfile rather than floating silently.

---

# 8. REPOSITORY STRUCTURE

```text
marketing-operations-workbench/
├── .github/
│   └── workflows/
├── apps/
│   ├── web/
│   └── extension/
├── packages/
│   ├── core/
│   ├── recipes/
│   ├── ai-gateway/
│   ├── evaluators/
│   ├── connectors/
│   └── shared/
├── database/
│   ├── migrations/
│   └── seeds/
├── docs/
│   ├── architecture/
│   ├── runbooks/
│   ├── providers/
│   ├── security/
│   └── release/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── adversarial/
├── scripts/
├── README.md
└── package.json
```

Core rules must never be placed directly inside provider-specific packages.

---

# 9. CORE MODULE BOUNDARY

The Core module contains:

- domain objects;
- validation;
- deterministic rules;
- recipes;
- normalization;
- hashes;
- state transitions;
- approval rules;
- idempotency semantics;
- policy evaluation.

The Core module does not import:

- provider SDKs;
- browser-only APIs;
- platform-specific SDKs;
- secret-bearing configuration;
- database drivers;
- Cloudflare-specific runtime types.

This keeps the core portable.

---

# 10. APPLICATION LAYERS

Use:

```text
UI
 ↓
Route / Controller
 ↓
Application Service
 ↓
Core Domain
 ↓
Repository / Adapter
 ↓
External System
```

The UI does not contain business rules.

A button may request `approveContent()` but must not reimplement approval rules itself.

---

# 11. PRIMARY DATA MODEL

Recommended logical tables:

```text
workspaces
users
memberships
projects
campaigns
content_items
content_variants
content_calendar
platform_accounts
platform_connections
provider_capabilities
ai_providers
ai_requests
ai_responses
ai_evaluations
ai_rules
recipes
recipe_versions
research_items
keywords
influencers
influencer_contacts
outreach_messages
tasks
assets
metric_snapshots
reports
applications
portfolio_items
sops
audit_events
webhook_events
jobs
```

---

# 12. TENANCY / WORKSPACE ISOLATION

Every business object that belongs to a workspace must have:

```text
workspace_id
```

Every query must scope to the authenticated workspace.

Never rely only on a browser-side filter.

## 12.1 Required test

```text
Workspace A user → Workspace A records
Workspace B user → Workspace B records
Workspace A user ≠ Workspace B records
```

## 12.2 Cross-workspace test

The test suite must attempt to read a known object from another workspace and confirm the request is denied or returns no unauthorized object.

---

# 13. CONTENT DATA MODEL

Minimum content fields:

```text
id
workspace_id
campaign_id
title
content_type
objective
audience
core_message
platforms
draft_body
cta
source_refs
asset_refs
status
approval_state
scheduled_at
published_at
created_at
updated_at
```

---

# 14. CONTENT STATES

```text
IDEA
BRIEFED
DRAFT
QA
CHANGES_REQUIRED
APPROVED
SCHEDULED
PUBLISHED
FAILED
ARCHIVED
```

A content record cannot move from `DRAFT` to `PUBLISHED` without satisfying the configured approval policy.

---

# 15. CAMPAIGN MODEL

Campaign fields:

```text
id
workspace_id
name
objective
audience
message
start_date
end_date
channels
status
budget_if_applicable
approval_state
```

Campaign-level budget values must distinguish:

- planned budget;
- actual spend;
- unknown.

Never infer actual spend from planned spend.

---

# 16. CONTENT CALENDAR

Views:

- day;
- week;
- month;
- platform;
- campaign.

Each calendar record must show:

```text
date
time
platform
content_id
campaign_id
status
asset_status
approval_status
execution_status
```

---

# 17. DIGITAL ASSET LIBRARY

R2 stores binary objects; D1 stores metadata.

Minimum asset metadata:

```text
asset_id
workspace_id
campaign_id
filename
mime_type
asset_type
platforms
version
source
license
checksum
storage_ref
created_at
updated_at
approval_status
```

Recommended key layout:

```text
workspace_id/campaign_id/year/month/asset-id.ext
```

---

# 18. ASSET NAMING STANDARD

Recommended:

```text
YYYY-MM-DD_brand_campaign_concept_platform_assettype_vNN.ext
```

Example:

```text
2026-09-23_fullpond_remote-talent_hiring-mistakes_ig-reel_v01.mp4
```

The naming scheme is an organizational aid, not the database identity.

---

# 19. RESEARCH CENTER

Research records:

```text
research_id
workspace_id
topic
source_url
source_title
source_type
published_at
captured_at
summary
observations
implications
content_opportunities
campaign_opportunities
confidence
```

Source levels:

```text
AUTHORITATIVE
HIGH_CONFIDENCE
SECONDARY
OBSERVATION
HYPOTHESIS
UNKNOWN
```

An AI summary must not replace the source reference.

---

# 20. PINTEREST + SEO LAB

The Pinterest/SEO module is a first-class Workbench area.

## 20.1 Keyword object

```text
keyword
source
intent
topic
volume_if_available
difficulty_if_available
priority
content_opportunity
pinterest_opportunity
blog_opportunity
status
```

## 20.2 Keyword lifecycle

```text
SEED
 ↓
RESEARCHED
 ↓
CLUSTERED
 ↓
MAPPED
 ↓
CONTENT_ASSIGNED
 ↓
PUBLISHED
 ↓
MEASURED
```

## 20.3 Pinterest workflow

```text
TOPIC
 ↓
KEYWORD
 ↓
SEARCH INTENT
 ↓
BOARD
 ↓
PIN CONCEPT
 ↓
TITLE
 ↓
DESCRIPTION
 ↓
IMAGE
 ↓
DESTINATION
 ↓
QA
 ↓
PUBLISH
 ↓
MEASURE
```

---

# 21. BLOG STUDIO

Blog workflow:

```text
KEYWORD
 ↓
SEARCH INTENT
 ↓
OUTLINE
 ↓
DRAFT
 ↓
FACTUAL REVIEW
 ↓
SEO QA
 ↓
HUMAN EDIT
 ↓
PUBLISH
 ↓
MEASURE
```

Required QA:

```text
[ ] Intent identified
[ ] Title aligned to intent
[ ] Main keyword used naturally
[ ] Helpful headings
[ ] Internal links
[ ] External references when needed
[ ] Meta description
[ ] Alt text
[ ] CTA
[ ] No fabricated claims
[ ] Human review
```

---

# 22. INFLUENCER CRM

## 22.1 Creator record

```text
id
workspace_id
name
platform
profile_url
niche
audience
location_if_public
contact_method
fit_notes
source
status
last_contact
next_action
campaign_ids
```

## 22.2 Pipeline

```text
DISCOVERED
 ↓
RESEARCHING
 ↓
QUALIFIED
 ↓
CONTACTED
 ↓
REPLIED
 ↓
INTERESTED
 ↓
NEGOTIATING
 ↓
COLLABORATION
 ↓
COMPLETED
```

## 22.3 Privacy rule

Store only information needed for legitimate outreach and research.

Do not store private information simply because a webpage made it technically discoverable.

---

# 23. OUTREACH CENTER

Workflow:

```text
CREATOR
 ↓
FIT CHECK
 ↓
CAMPAIGN
 ↓
MESSAGE DRAFT
 ↓
PERSONALIZATION
 ↓
HUMAN REVIEW
 ↓
SEND / MANUAL HANDOFF
 ↓
FOLLOW-UP
 ↓
RESPONSE
```

Prevent:

- duplicate outreach;
- wrong campaign association;
- wrong recipient;
- sending after opt-out;
- uncontrolled mass sending.

---

# 24. TASK MANAGEMENT

Task fields:

```text
task_id
workspace_id
title
description
area
priority
status
due_at
owner
linked_record
next_action
```

Status:

```text
BACKLOG
TODAY
IN_PROGRESS
WAITING
REVIEW
DONE
CANCELLED
```

---

# 25. AI ORCHESTRATION GATEWAY

## 25.1 Gateway responsibilities

The Gateway:

1. receives a structured task;
2. loads the recipe;
3. classifies data;
4. checks allowed providers;
5. checks provider status;
6. checks capability;
7. checks budget/quota;
8. routes generation;
9. normalizes the response;
10. records provenance;
11. runs deterministic QA;
12. optionally invokes Kev;
13. produces a review package;
14. preserves the work item regardless of provider outcome.

## 25.2 Gateway non-responsibilities

The Gateway does not:

- authorize payments;
- decide employment candidates;
- make legal conclusions;
- bypass platform permissions;
- expose secrets to models;
- secretly manipulate consumer AI websites.

---

# 26. AI REQUEST CONTRACT

```ts
interface AiGenerationRequest {
  requestId: string;
  recipeId: string;
  taskType: string;
  objective: string;
  audience?: string;
  platform?: string;
  brandContext?: string;
  constraints: string[];
  inputs: AiInput[];
  outputSchema?: JsonSchema;
  dataClass:
    | "PUBLIC"
    | "LOW_SENSITIVITY"
    | "CONFIDENTIAL"
    | "PERSONAL"
    | "RESTRICTED";
  preferredMode:
    | "AUTO"
    | "CREATIVE"
    | "FAST"
    | "REASONING"
    | "LONG_FORM"
    | "MANUAL";
  maxCandidates: number;
  allowExternalInference: boolean;
  requireHumanApproval: boolean;
}
```

---

# 27. AI RESPONSE CONTRACT

```ts
interface AiProviderResponse {
  requestId: string;
  providerId: string;
  modelId?: string;
  status:
    | "SUCCESS"
    | "RATE_LIMITED"
    | "QUOTA_LIMITED"
    | "AUTH_ERROR"
    | "PROVIDER_ERROR"
    | "INVALID_OUTPUT"
    | "UNAVAILABLE";
  output?: unknown;
  rawOutputRef?: string;
  inputHash: string;
  outputHash?: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  latencyMs?: number;
  limitations?: string[];
  receivedAt: string;
}
```

---

# 28. PROVIDER CAPABILITY CONTRACT

Every provider must expose capabilities rather than assumptions.

Examples:

```text
generate_text
structured_output
classify
score
image_input
audio_input
file_input
search_grounding
publish_social
read_metrics
```

The capability layer must be queried before attempting a task.

---

# 29. PROVIDER STATES

```text
NOT_CONFIGURED
DISCONNECTED
CONNECTING
CONNECTED
READY
DEGRADED
RATE_LIMITED
QUOTA_LIMITED
AUTH_REQUIRED
APPROVAL_REQUIRED
UNAVAILABLE
MANUAL_ONLY
DISABLED
```

These are operational states, not marketing labels.

---

# 30. AI DATA CLASSIFICATION

## 30.1 PUBLIC

Examples:

- public job descriptions;
- public company pages;
- public marketing content;
- public portfolio drafts.

## 30.2 LOW_SENSITIVITY

Examples:

- generic content ideas;
- generic SEO themes;
- generic campaign structures.

## 30.3 CONFIDENTIAL

Examples:

- internal campaign plans;
- unreleased strategy;
- private client metrics.

Remote inference requires explicit policy permission.

## 30.4 PERSONAL

Examples:

- private applicant information;
- private contact records.

Default:

```text
REMOTE AI = BLOCKED
```

unless an explicit reviewed policy says otherwise.

## 30.5 RESTRICTED

Examples:

- passwords;
- API keys;
- OAuth client secrets;
- private keys;
- authentication cookies.

Never send to AI.

---

# 31. AI ROUTING STRATEGY

## 31.1 Low complexity

One provider.

Examples:

- shortening;
- rewriting;
- variant creation.

## 31.2 Medium complexity

One or two providers.

Examples:

- campaign concepts;
- blog outline;
- influencer-fit analysis.

## 31.3 High-value work

Multi-generator + deterministic QA + optional Kev + human review.

Examples:

- flagship campaign concept;
- important application materials;
- major client-facing launch assets.

---

# 32. OPENROUTER ADAPTER

## 32.1 Current role

OpenRouter is a free remote generation option, not a dependency.

Current official pricing documentation reports a Free plan with 25+ free models, 4 free providers and 50 requests/day. The free-model collection changes over time.

## 32.2 Adapter behavior

The adapter must:

- use a server-side secret;
- select only currently eligible free models;
- record the actual model used;
- handle 429 responses;
- handle provider/model unavailability;
- expose quota state;
- never expose the key to the browser.

## 32.3 Internal safety budget

Use an internal budget lower than the external published limit, for example:

```text
45 requests/day
```

This is an application safety policy, not an OpenRouter guarantee.

---

# 33. GEMINI ADAPTER

## 33.1 Current role

Gemini is an optional free remote generation engine.

Current Google documentation states that eligible Gemini API Free-tier usage provides free input/output tokens with model/rate limitations. Google currently lists Gemini 2.5 Flash and Gemini 2.5 Flash-Lite with free-tier pricing.

## 33.2 Recommended tasks

- content generation;
- rewriting;
- blog drafting;
- structured-output generation;
- lightweight research synthesis.

## 33.3 Data-use caution

Google's current Free-tier documentation states that content may be used to improve products. Therefore confidential/personal/restricted data should not be sent without a separately approved data policy.

---

# 34. HUGGING FACE ADAPTER

Hugging Face serves two purposes:

1. model/tool discovery;
2. optional browser/model execution.

Current Hugging Face documentation says Static Spaces are free and documents CPU Basic hardware without hourly compute cost when available, while creation of compute-backed Gradio/Docker Spaces requires a paid plan.

The Workbench should treat any Space as replaceable.

States:

```text
SPACE_AVAILABLE
SPACE_UNAVAILABLE
SPACE_CHANGED
```

---

# 35. KEV DECISION ENGINE

## 35.1 Correct role

Kev is an evaluator/decision engine.

It is not the primary content writer.

The current Kev-0.8B model card explicitly describes a typed decision model and states:

**No text generation.**

## 35.2 Good task

```text
Which of these five concepts best satisfies the requested objective?
A
B
C
D
E
```

## 35.3 Good task

```text
Does this concept include a clear CTA?
YES
NO
```

## 35.4 Good task

```text
Rate audience fit.
1
2
3
4
5
```

## 35.5 Incorrect task

```text
Write five TikTok concepts.
```

Do not use Kev as the generator for prose.

## 35.6 Kev reliability rule

Kev's output is a model opinion.

Use:

```text
DETERMINISTIC RULES
+
KEV
+
HUMAN REVIEW
```

not:

```text
KEV SCORE → AUTOMATIC PUBLICATION
```

## 35.7 Domain caution

Kev's current model card reports meaningful out-of-domain degradation. Therefore the Workbench must locally test evaluator performance on the exact marketing decision tasks before treating it as a meaningful signal.

---

# 36. DETERMINISTIC QA ENGINE

The deterministic QA layer is mandatory even when an AI model is used.

Minimum rules:

```text
AUDIENCE_PRESENT
OBJECTIVE_PRESENT
PLATFORM_PRESENT
CTA_PRESENT
NO_UNVERIFIED_METRIC
NO_RESTRICTED_DATA
NO_DUPLICATE_POST
NO_EMPTY_ASSET
NO_BROKEN_URL
APPROVAL_REQUIRED
```

Outputs:

```text
PASS
WARN
FAIL
UNKNOWN
```

`FAIL` blocks the relevant transition.

---

# 37. BRAND COMPLIANCE ENGINE

Brand profile:

```text
brand_name
audience
voice
tone
do_rules
dont_rules
visual_rules
cta_rules
claim_rules
platform_rules
```

AI-generated content is checked against this profile.

---

# 38. CLAIM SAFETY

Each claim may be classified:

```text
UNSUPPORTED
SOURCE_REQUIRED
SUPPORTED
VERIFIED
UNKNOWN
```

Example:

A model says:

```text
"This strategy increases conversions by 40%."
```

Without evidence, the deterministic engine returns:

```text
UNVERIFIED_METRIC
```

The content is blocked or rewritten.

---

# 39. MULTI-MODEL GENERATION

High-value workflow:

```text
Generator A
Generator B
Generator C
    ↓
Candidate pool
    ↓
Normalization
    ↓
Deterministic QA
    ↓
Kev evaluation
    ↓
Human selection
```

Do not call multiple models for every sentence.

---

# 40. PROMPT RECIPES

A recipe defines the repeatable workflow for a task.

Examples:

```text
SOCIAL_POST_CREATE
TIKTOK_IDEA_GENERATE
PINTEREST_PIN_CREATE
BLOG_OUTLINE
BLOG_DRAFT
SEO_CLUSTER
INFLUENCER_RESEARCH
OUTREACH_DRAFT
META_AD_CONCEPT
WEEKLY_REPORT
APPLICATION_TAILORING
INTERVIEW_PREP
```

Recipe structure:

```yaml
id: tiktok_idea_generate_v1
taskType: CREATIVE_GENERATION
requiredInputs:
  - audience
  - objective
  - platform
  - brand
outputs:
  - concept
  - hook
  - angle
  - CTA
qualityRules:
  - audience_match
  - platform_fit
  - no_unverified_claims
approval:
  required: true
```

---

# 41. RECIPE VERSIONING

Never silently mutate a recipe.

Use:

```text
recipe_id
version
status
created_at
updated_at
```

A material change creates a new recipe version.

---

# 42. MANUAL AI BRIDGE

## 42.1 Purpose

The Manual AI Bridge allows the user to use any browser-accessible AI without making that external site a system dependency.

## 42.2 Workflow

```text
WORKBENCH
 ↓
PROMPT PACKAGE
 ↓
COPY PROMPT
 ↓
OPEN EXTERNAL AI
 ↓
USER RUNS PROMPT
 ↓
COPY RESULT
 ↓
PASTE RESULT
 ↓
PARSER
 ↓
DETERMINISTIC QA
 ↓
OPTIONAL KEV
 ↓
HUMAN REVIEW
 ↓
SAVE
```

## 42.3 Manual states

```text
PROMPT_READY
COPIED
EXTERNAL_AI_OPEN
RESPONSE_EXPECTED
RESPONSE_PASTED
PARSING
PARSED
QA_PENDING
REVIEW_PENDING
APPROVED
REJECTED
```

---

# 43. NO COVERT CONSUMER-AI AUTOMATION

Do not build core functionality around silently automating consumer AI websites.

Reasons:

- DOM changes;
- authentication changes;
- anti-bot systems;
- rate limits;
- UI redesigns;
- provider policy changes.

Human-controlled browser handoff is the durable design.

---

# 44. BROWSER SIDE-PANEL COMPANION

Chrome's current Side Panel API allows a Manifest V3 extension to display persistent UI beside the current webpage.

## 44.1 Intended actions

- capture selected text;
- capture page title;
- capture URL;
- save research;
- save influencer record;
- save competitor note;
- open Workbench task;
- open AI prompt package.

## 44.2 Minimum permissions

Begin with the smallest required permission set.

Example:

```json
{
  "permissions": ["sidePanel"]
}
```

Additional permissions require feature justification and security review.

---

# 45. EXTENSION DATA CAPTURE RULE

The capture must be user initiated.

Correct:

```text
USER CLICK
 ↓
SELECTED TEXT
 ↓
SAVE TO WORKBENCH
```

Incorrect:

```text
PAGE OPENS
 ↓
EXTENSION SCRAPES EVERYTHING
 ↓
UPLOADS IT
```

---

# 46. SOCIAL PUBLISHER

Platform matrix:

```text
                    Instagram  Facebook  TikTok  Pinterest  X
Content A              READY      READY    READY    READY    READY
Content B              READY      READY    MANUAL   READY    READY
Content C              DRAFT      READY    READY    DRAFT    READY
```

Connector state and capability state are separate.

---

# 47. INSTAGRAM / META BOUNDARY

The Workbench should support planning and applicable API operations for supported Meta/Instagram accounts, subject to the current account types, permissions and app requirements.

Do not classify an account as API-ready merely because the user can post manually.

Capabilities:

```text
CREATE_CONTENT
PUBLISH
READ_METRICS
READ_COMMENTS
```

only become `READY` after the current provider capability probe succeeds.

---

# 48. META ADS LAB

The Meta Ads Lab is a planning/QA/reporting environment.

Workflow:

```text
CAMPAIGN
 ↓
OBJECTIVE
 ↓
AUDIENCE
 ↓
CREATIVE
 ↓
COPY
 ↓
PLACEMENT
 ↓
BUDGET
 ↓
TRACKING
 ↓
QA
 ↓
LAUNCH
 ↓
MEASURE
```

Campaign object:

```text
campaign_id
objective
account_ref
audience
creative_refs
copy_refs
budget
currency
start_at
end_at
tracking_plan
approval
status
```

---

# 49. TIKTOK CONNECTOR

Current TikTok Content Posting API documentation says direct posting requires a registered app, the Content Posting API product/configuration, required user authorization and approval for `video.publish`. TikTok also states that unaudited clients' content is restricted to private viewing.

Connector states should therefore include:

```text
API_CONNECTED
DIRECT_POST_CONFIGURED
PUBLISH_SCOPE_APPROVED
AUDITED
PUBLIC_PUBLISH_READY
```

Do not represent an unaudited integration as equivalent to a public-production publisher.

---

# 50. PINTEREST CONNECTOR

Pinterest currently documents Trial and Standard access tiers.

Trial access can be used to test API workflows, and created Pins/Boards in Trial are restricted in visibility compared with Standard production access.

Connector states:

```text
TRIAL
STANDARD
READ_READY
WRITE_READY
PRODUCTION_READY
```

Use Pinterest's available Sandbox for safe integration testing where appropriate.

---

# 51. X CONNECTOR

X's current developer documentation describes authenticated API operations as requiring an approved developer account/App and user authorization.

Connector states:

```text
DEVELOPER_ACCOUNT
APP_CREATED
OAUTH_CONFIGURED
USER_AUTHORIZED
PUBLISH_READY
```

---

# 52. PLATFORM HANDOFF RULE

When a platform API is unavailable:

```text
API_UNAVAILABLE
 ↓
MANUAL_HANDOFF
 ↓
USER EXECUTES NATIVELY
 ↓
USER CONFIRMS RESULT
 ↓
WORKBENCH RECORDS EVIDENCE
```

Never mark `PUBLISHED` before actual confirmation.

---

# 53. ANALYTICS MODEL

Metric snapshot:

```text
metric_id
workspace_id
platform
campaign_id
content_id
metric_name
value
period_start
period_end
provider
source_ref
retrieved_at
```

Metrics must be traceable to a source or marked `UNKNOWN`.

---

# 54. ANALYTICS DASHBOARD

Display:

- reach;
- impressions;
- engagement;
- engagement rate;
- clicks;
- saves;
- shares;
- comments;
- follower change;
- top content;
- underperforming content;
- SEO observations;
- influencer pipeline.

Platform-specific metric names remain provider-dependent.

---

# 55. WEEKLY REPORT ENGINE

Report structure:

```text
WEEKLY MARKETING REPORT

Executive summary
Published content
Top content
Underperforming content
Platform performance
Pinterest / SEO
Influencer pipeline
Campaign performance
Observed problems
Experiments
Next priorities
Open risks
```

The AI may write the narrative, but the numeric values must come from the measurement store.

---

# 56. EVIDENCE / PROVENANCE

Each generated output stores:

```text
request_id
provider_id
model_id
recipe_id
recipe_version
input_hash
output_hash
timestamp
usage_if_available
status
limitations
```

Each human action stores:

```text
actor
action
timestamp
resource
result
```

---

# 57. IDEMPOTENCY

Any retriable state-changing action must have an idempotency key.

Examples:

```text
publish_post
send_outreach
create_influencer
create_asset
save_metric
generate_report
```

Duplicate requests with the same idempotency key must not create duplicate side effects.

---

# 58. RETRIES

Default:

```text
attempt 1 → immediate
attempt 2 → short backoff
attempt 3 → longer backoff
then → FAILED / MANUAL_HANDOFF
```

Do not retry permanent errors.

Permanent examples:

- invalid credentials;
- missing permission;
- invalid request;
- provider rejects operation by policy.

---

# 59. ASYNC JOB MODEL

Job:

```text
job_id
workspace_id
type
payload_ref
status
attempts
last_error
created_at
updated_at
```

Status:

```text
QUEUED
RUNNING
SUCCEEDED
FAILED
DEAD_LETTER
CANCELLED
```

Dead-letter items remain visible to the user/operator.

---

# 60. QUOTA MANAGEMENT

Track:

```text
provider
period
requests
input_tokens
output_tokens
estimated_cost
quota_state
```

The UI should warn before the budget is exhausted.

Example:

```text
OpenRouter
Internal daily safety budget: 45
Used: 38
Remaining: 7
State: NEAR_LIMIT
```

---

# 61. CACHING

Cache key:

```text
SHA256(
  recipe_version +
  provider +
  model +
  normalized_input +
  output_schema +
  relevant_constraints
)
```

Cache only where provider terms and data policy allow reuse.

Invalidate on:

- recipe version change;
- brand-rule change;
- platform-rule change;
- changed source material.

---

# 62. PROMPT VERSIONING

Store:

```text
prompt_template_id
prompt_template_version
variables_hash
rendered_prompt_hash
```

Never silently overwrite a historical prompt version.

---

# 63. HUMAN APPROVAL

Default transition:

```text
DRAFT
 ↓
QA
 ↓
HUMAN REVIEW
 ↓
APPROVED
 ↓
EXECUTION
```

For higher-risk work, configurable two-person approval may be added later.

---

# 64. PROOF-OF-WORK CENTER

Artifact origin labels:

```text
REAL_CLIENT_WORK
EMPLOYMENT_WORK
PERSONAL_PROJECT
SELF_DIRECTED_SPEC
TRAINING_PROJECT
DEMO
```

Every portfolio item must state whether its metrics are:

- real;
- illustrative;
- unavailable;
- not measured.

---

# 65. APPLICATION TRACKER

Application fields:

```text
company
role
job_url
source
date_found
date_applied
resume_version
cover_letter_version
portfolio_version
status
recruiter
follow_up_at
interview_at
notes
outcome
```

This supports separate FullPond applications while sharing the same evidence library.

---

# 66. FULLPOND WORKFLOW RECIPES

For Marketing & Social Media Specialist:

```text
ROLE_ANALYSIS
 ↓
REQUIREMENTS_MATRIX
 ↓
TRANSFERABLE_EXPERIENCE_MAP
 ↓
CONTENT_PORTFOLIO
 ↓
INTERVIEW_STORY
 ↓
APPLICATION_SUBMISSION
```

For Pinterest / SEO / TikTok Shop:

```text
PINTEREST_AUDIT
KEYWORD_MAP
BOARD_STRATEGY
PIN_CALENDAR
BLOG_TOPICS
INFLUENCER_PIPELINE
OUTREACH
TIKTOK_SHOP_CONCEPT
```

For Meta Ads:

```text
CAMPAIGN_STRUCTURE
AUDIENCE_HYPOTHESIS
CREATIVE_MATRIX
COPY_MATRIX
TRACKING_PLAN
QA
MEASUREMENT
```

All work remains clearly labeled as actual, transferable or self-directed.

---

# 67. ROLE-POSITIONING INTEGRITY

The Workbench can help translate experience into transferable skills.

It must not invent:

- an employer;
- a client;
- paid campaign results;
- direct Meta experience;
- platform permissions;
- certifications;
- professional history.

A correct application evidence chain is:

```text
ACTUAL EXPERIENCE
 ↓
TRANSFERABLE CAPABILITY
 ↓
SELF-DIRECTED PROOF
 ↓
HONEST SKILL GAP
```

---

# 68. AI MANUAL MODES

Visible options:

```text
AUTO — available free AI
CREATIVE — creative generation
FAST — low latency
REASONING — structured reasoning
LONG_FORM — long content
BROWSER AI — manual web AI
LOCAL ONLY — no remote inference
NO AI — deterministic workflow
```

---

# 69. AI AVAILABILITY LADDER

The ladder is a fallback model, not a single-provider dependency:

```text
LEVEL 0  Deterministic Workbench
LEVEL 1  Free remote AI
LEVEL 2  Second free remote AI
LEVEL 3  Hugging Face specialist tool
LEVEL 4  Optional local CPU model
LEVEL 5  Manual browser AI
```

The router may choose another branch based on availability.

---

# 70. AI GATEWAY EXAMPLE

User asks:

```text
Create five TikTok ideas for a remote recruiting company.
```

Workbench builds:

```text
Recipe:
tiktok_idea_generate_v1

Audience:
SMB employers

Objective:
Engagement

Platform:
TikTok

Constraints:
- clear hook
- no fabricated statistics
- relevant CTA
- brand fit
```

Generation:

```text
Gemini → 5
OpenRouter → 5
```

Then:

```text
10 candidates
 ↓
QA
 ↓
Kev evaluation
 ↓
Human review
 ↓
5 finalists
```

---

# 71. AI COMPARISON VIEW

The comparison view should show:

```text
Candidate
Provider
Model
Audience fit
Platform fit
CTA
Brand fit
Risk flags
Rule status
Kev evaluation
Human decision
```

Do not turn this into a fake objective universal score.

---

# 72. NO-AI MODE

The Workbench must provide deterministic templates such as:

```text
HOOK:
[Audience pain or question]

VALUE:
[Three useful points]

PROOF:
[Verified evidence]

CTA:
[Desired next action]
```

No-AI mode should allow:

- content drafting;
- calendar scheduling;
- research;
- influencer CRM;
- outreach preparation;
- assets;
- applications;
- reports.

---

# 73. PROVIDER-SHOCK SCENARIOS

## 73.1 OpenRouter unavailable

Expected:

```text
OpenRouter = UNAVAILABLE
Gemini = next eligible provider
```

## 73.2 Gemini quota exhausted

Expected:

```text
Gemini = QUOTA_LIMITED
OpenRouter = next eligible provider
```

## 73.3 All remote AI unavailable

Expected:

```text
Manual AI Bridge
```

## 73.4 Manual AI unavailable

Expected:

```text
Deterministic templates
```

The task remains preserved.

---

# 74. FAILURE USER EXPERIENCE

Every error should tell the operator:

1. what happened;
2. whether the work was preserved;
3. whether anything was published;
4. whether retry is safe;
5. what to do next.

Example:

```text
Gemini is temporarily unavailable.

JOB-00042 was preserved.

No post was published.

Next:
[Try OpenRouter]
[Use Browser AI]
[Use Template]
[Retry]
```

---

# 75. UNKNOWN STATE

Use `UNKNOWN` when the evidence is insufficient.

Examples:

```text
PUBLISH_STATUS = UNKNOWN
METRIC = UNKNOWN
PROVIDER_HEALTH = UNKNOWN
SEO_VOLUME = UNKNOWN
INFLUENCER_EMAIL = UNKNOWN
```

Never turn `UNKNOWN` into zero or false by convenience.

---

# 76. REPORTING FACT VS INTERPRETATION

Reports should contain separate headings:

```text
MEASURED FACTS
```

and:

```text
INTERPRETATION / SUGGESTIONS
```

This prevents AI narrative from being confused with actual measurement.

---

# 77. SECURITY — SECRETS

Never place secrets in:

- GitHub source;
- browser localStorage;
- URLs;
- public logs;
- prompts;
- screenshots;
- client bundles.

Secrets belong in server-side encrypted environment bindings.

---

# 78. SECURITY — TOKEN STORAGE

Provider tokens must be:

- encrypted/protected at rest;
- scoped to the minimum required permissions;
- accompanied by expiry and scope metadata;
- revocable;
- omitted from logs.

---

# 79. SECURITY — CLIENT/SERVER BOUNDARY

Browser receives:

- public configuration;
- safe identifiers;
- non-secret status.

Server keeps:

- provider keys;
- OAuth client secrets;
- privileged database credentials;
- webhook secrets;
- signing keys.

---

# 80. SECURITY — EXTENSION

The browser extension must not:

- capture cookies;
- copy authentication headers;
- upload page contents silently;
- scan passwords;
- collect unrelated browsing data;
- inject tracking code into unrelated sites.

---

# 81. PRIVACY POLICY INSIDE THE APP

Every remote AI request should be evaluated by:

```text
Can this data leave the browser?
```

If no:

```text
LOCAL ONLY
or
MANUAL REVIEW
```

If yes:

```text
PROVIDER POLICY CHECK
```

---

# 82. AUDIT LOG

Actions:

```text
AI_REQUEST_CREATED
AI_REQUEST_COMPLETED
AI_PROVIDER_FAILED
CONTENT_APPROVED
CONTENT_REJECTED
POST_SCHEDULED
POST_PUBLISHED
OUTREACH_SENT
ASSET_UPLOADED
APPLICATION_SUBMITTED
```

Audit records should contain safe metadata only.

---

# 83. OBSERVABILITY

Track:

- provider success rate;
- latency;
- 429 count;
- failure count;
- manual fallback rate;
- QA failure rate;
- publishing success;
- publishing failure;
- jobs in queue;
- dead-letter count.

---

# 84. BACKUP AND PORTABILITY

The Workbench should support exports for:

```text
campaigns
content
calendar
research
keywords
influencers
outreach
asset metadata
metrics
reports
applications
recipes
audit events
```

Export formats:

- JSON for full fidelity;
- CSV for tabular records.

---

# 85. DATABASE MIGRATION POLICY

Do not create every future feature in one migration.

Use additive migrations:

```text
0001_core
0002_content
0003_ai_gateway
0004_influencers
0005_analytics
...
```

Every migration must be:

- reviewed;
- tested;
- idempotent where appropriate;
- accompanied by rollback/recovery instructions.

---

# 86. CLOUD SETUP — BEGINNER PATH

## 86.1 Accounts

Required:

1. GitHub;
2. Cloudflare.

Optional:

3. Google AI Studio/Gemini;
4. OpenRouter;
5. Hugging Face;
6. platform developer accounts;
7. Supabase;
8. Vercel.

## 86.2 Account security

Enable MFA wherever available.

Never share:

- passwords;
- MFA codes;
- recovery codes;
- API secrets.

---

# 87. CREATE THE GITHUB REPOSITORY

1. Open GitHub.
2. Select **New repository**.
3. Name it:

```text
marketing-operations-workbench
```

4. Make it private.
5. Initialize with README.
6. Create.

Default branch:

```text
main
```

---

# 88. CREATE CLOUDFLARE RESOURCES

Create:

```text
Worker application:
marketing-operations-workbench

D1 database:
mow-db

R2 bucket:
mow-assets

Queue:
mow-jobs
```

Record IDs and bindings in the deployment configuration.

Do not paste secrets into GitHub source.

---

# 89. CLOUDFLARE WORKER CONFIGURATION

Conceptual bindings:

```text
DB → mow-db
ASSETS → mow-assets
JOBS → mow-jobs
```

Secrets:

```text
OPENROUTER_API_KEY
GEMINI_API_KEY
```

must be added as server-side secrets.

The application must boot even when both are absent.

---

# 90. D1 INITIAL MIGRATION

First create:

```text
workspaces
users
memberships
projects
campaigns
content_items
tasks
recipes
recipe_versions
ai_providers
ai_requests
ai_responses
audit_events
```

Then run the migration in staging.

Only after staging passes should it move to production.

---

# 91. FIRST DEPLOYMENT

Sequence:

```text
create repo
 ↓
create app
 ↓
create database
 ↓
create storage
 ↓
create queue
 ↓
connect bindings
 ↓
run migration
 ↓
deploy
 ↓
open browser
 ↓
verify health
```

---

# 92. CI PIPELINE

Every commit should run:

```text
install
 ↓
typecheck
 ↓
lint
 ↓
unit
 ↓
integration
 ↓
security checks
 ↓
build
 ↓
E2E
```

Release branches cannot bypass CI.

---

# 93. TESTING PYRAMID

## 93.1 Unit

Test:

- rules;
- recipes;
- parsers;
- provider selection;
- quota counters;
- hashes;
- state transitions.

## 93.2 Integration

Test:

- database;
- storage;
- queue;
- provider adapters;
- OAuth token persistence.

## 93.3 E2E

Test:

- login;
- dashboard;
- content;
- calendar;
- AI generation;
- manual bridge;
- QA;
- approval;
- assets;
- reporting;
- applications.

---

# 94. ADVERSARIAL TEST CATALOGUE

Minimum scenarios:

```text
provider unavailable
provider 429
provider invalid JSON
provider partial response
provider fabricated metric
missing CTA
missing audience
missing asset
duplicate post
expired OAuth token
invalid OAuth scope
cross-workspace access
restricted data sent remotely
secret inside prompt
malformed manual-AI response
Kev unavailable
all AI unavailable
D1 unavailable
R2 unavailable
queue failure
worker timeout
quota exhausted
```

Expected behavior should preserve work and surface an actionable state.

---

# 95. NO-AI DRILL

Procedure:

1. disable OpenRouter;
2. disable Gemini;
3. disable Hugging Face;
4. disable Kev;
5. disable local inference;
6. do not use external browser AI.

Verify:

```text
content works
calendar works
research works
influencer CRM works
assets work
applications work
reports work
tasks work
templates produce usable skeletons
```

---

# 96. PROVIDER SHOCK DRILL

Execute each separately:

```text
OpenRouter unavailable
Gemini unavailable
OpenRouter quota exhausted
Gemini quota exhausted
OAuth expired
TikTok audit-required
Pinterest trial-only
X authorization missing
```

The Workbench should degrade explicitly.

---

# 97. SECURITY RELEASE GATE

Before v1.0.0:

```text
[ ] no secret in Git
[ ] no secret in client bundle
[ ] no secret in logs
[ ] workspace isolation passes
[ ] audit log passes
[ ] idempotency passes
[ ] restricted data policy passes
[ ] manual bridge policy passes
[ ] no covert browser automation
[ ] connector capabilities verified
```

---

# 98. PERFORMANCE GOALS

The Workbench should prioritize:

- fast page load;
- incremental loading;
- background processing for AI jobs;
- no blocking UI on model calls;
- cached lists;
- paginated records;
- lazy asset loading.

The laptop's memory constraints make avoiding large client bundles especially important.

---

# 99. ACCESSIBILITY

The Workbench should support:

- keyboard navigation;
- visible focus states;
- semantic headings;
- accessible form labels;
- table headers;
- clear error text;
- sufficient contrast;
- non-color-only status indicators.

---

# 100. LOGGING

Log:

```text
request ID
provider
model
status
latency
safe error code
```

Do not log:

- tokens;
- passwords;
- secrets;
- full private documents;
- private API responses where retention is prohibited.

---

# 101. RATE LIMIT HANDLING

On 429:

1. classify provider as `RATE_LIMITED`;
2. read retry information when supplied;
3. delay according to policy;
4. do not spin-retry;
5. route to another provider if eligible.

---

# 102. AUTH FAILURE HANDLING

On invalid provider credentials:

```text
AUTH_REQUIRED
```

The UI should take the operator to the connector setup screen.

Never display the secret value.

---

# 103. MALFORMED OUTPUT HANDLING

If the model is asked for JSON but returns prose:

```text
INVALID_OUTPUT
```

Then:

1. preserve response;
2. attempt one repair if policy permits;
3. revalidate;
4. if still invalid, route to human/manual mode.

---

# 104. DUPLICATE PREVENTION

Before publishing:

```text
same content?
same platform?
same campaign?
same intended time?
```

If a duplicate is detected:

```text
DUPLICATE
```

and the user must decide what to do.

---

# 105. PLATFORM PUBLICATION EVIDENCE

A post is:

```text
PUBLISHED
```

only when the platform confirms publication or the user has completed a verified manual confirmation step.

A sent API request alone is insufficient.

---

# 106. ANALYTICS RECONCILIATION

For every scheduled item:

```text
EXPECTED: one published item
```

Later:

```text
OBSERVED: one published item
```

If no evidence is available:

```text
UNKNOWN
```

Do not silently infer success.

---

# 107. APPLICATION SUBMISSION EVIDENCE

A job application should be marked:

```text
SUBMITTED
```

only when the user has actual confirmation from the application system.

Otherwise:

```text
DRAFT
READY_TO_SUBMIT
UNKNOWN
```

---

# 108. FULLPOND PROOF-OF-WORK MODEL

A tailored portfolio should demonstrate:

```text
Content strategy
Multi-platform adaptation
Pinterest/SEO thinking
Influencer research
Outreach structure
Asset organization
Campaign planning
Performance measurement
Professional English
Remote working discipline
```

If the artifact is self-directed, label it:

```text
SELF-DIRECTED SPEC
```

---

# 109. SELF-DIRECTED SPEC SAFETY

A spec campaign may contain:

- sample posts;
- sample Pins;
- mock campaign structure;
- mock Meta campaign plan;
- mock influencer outreach.

It must not contain fabricated claims such as:

```text
"Grew followers by 300%."
```

unless actual evidence exists.

---

# 110. FIRST-DAY BUILD

The first usable build should contain only:

```text
Dashboard
Content
Calendar
Tasks
Research
Influencer CRM
AI Gateway
Manual AI Bridge
```

This proves the core architecture before platform integrations.

---

# 111. SECOND BUILD

Add:

```text
OpenRouter
Gemini
provider registry
quota tracking
provenance
structured responses
```

---

# 112. THIRD BUILD

Add:

```text
Hugging Face
Kev
deterministic evaluator
multi-model comparison
```

---

# 113. FOURTH BUILD

Add:

```text
browser side panel
page capture
selected-text capture
research save
influencer save
manual AI launch
```

---

# 114. FIFTH BUILD

Add platform adapters:

```text
Pinterest
Instagram/Meta
TikTok
X
```

Only when credentials, scopes and platform approval are actually available.

---

# 115. SIXTH BUILD

Add:

```text
analytics
reports
proof-of-work
application tracker
```

---

# 116. RELEASE PROCESS

Every release follows:

```text
PLAN
 ↓
IMPLEMENT
 ↓
UNIT TEST
 ↓
INTEGRATION TEST
 ↓
E2E
 ↓
SECURITY
 ↓
NO-AI DRILL
 ↓
PROVIDER-SHOCK DRILL
 ↓
PREVIEW DEPLOY
 ↓
BROWSER VERIFY
 ↓
RECORD EVIDENCE
 ↓
TAG RELEASE
 ↓
FREEZE
```

---

# 117. VERSIONING

Use semantic versioning:

```text
MAJOR.MINOR.PATCH
```

Examples:

```text
1.0.0
1.0.1
1.1.0
2.0.0
```

Breaking core contract changes require a major version.

---

# 118. DOCUMENT CHANGE CONTROL

Every architecture change records:

```text
version
date
reason
old behavior
new behavior
migration impact
security impact
rollback plan
```

---

# 119. INCIDENT RESPONSE — AI OUTAGE

1. confirm provider status;
2. mark provider unavailable;
3. preserve job;
4. route to another provider;
5. use manual bridge if necessary;
6. record incident;
7. retest later.

Do not destroy the original work item.

---

# 120. INCIDENT RESPONSE — DATABASE FAILURE

1. mark service degraded;
2. stop writes that could corrupt state;
3. preserve in-flight work where possible;
4. inspect Cloudflare/database status;
5. restore using the documented recovery plan;
6. verify integrity;
7. resume jobs.

Do not blindly recreate the database.

---

# 121. INCIDENT RESPONSE — ASSET STORAGE FAILURE

1. mark asset service degraded;
2. preserve metadata;
3. stop new writes if integrity is uncertain;
4. verify R2 status;
5. retry safe uploads;
6. check checksums;
7. reconcile missing objects.

---

# 122. INCIDENT RESPONSE — PUBLISH FAILURE

Record:

```text
platform
post ID if available
request ID
status
provider response
whether publication occurred
```

If publication state is uncertain:

```text
UNKNOWN
```

Do not duplicate-publish automatically.

---

# 123. PROVIDER MIGRATION

If Gemini is replaced by another provider:

```text
AI GATEWAY
   ↓
new adapter
```

Core data remains unchanged.

The provider record changes in provenance only.

---

# 124. PLATFORM MIGRATION

If a platform changes API policy:

```text
PLATFORM = MANUAL_ONLY
```

Continue work using manual publication while preserving:

- content;
- calendar;
- analytics history;
- campaign records;
- proof-of-work.

---

# 125. EXPORT TEST

At least once per release cycle:

1. export a workspace;
2. verify JSON loads;
3. verify CSV rows are complete;
4. verify assets are referenced correctly;
5. confirm a second environment could rebuild from the export.

---

# 126. RESTORE TEST

A restore test must prove:

```text
backup
 ↓
new environment
 ↓
restore
 ↓
records count
 ↓
asset references
 ↓
application loads
```

A backup that has never been restored is not fully validated.

---

# 127. OPERATING DAILY PROCEDURE

1. Open Workbench.
2. Review Today.
3. Review failed/blocked items.
4. Review AI provider health.
5. Work content.
6. Review calendar.
7. Research.
8. Work influencer pipeline.
9. Prepare outreach.
10. Review analytics.
11. Update applications.
12. Save proof-of-work.
13. Review next actions.

---

# 128. DAILY STARTUP CHECK

```text
[ ] Workbench loads
[ ] Database reachable
[ ] Asset storage reachable
[ ] Provider status visible
[ ] No unresolved critical failed jobs
[ ] Calendar reviewed
[ ] Follow-ups reviewed
```

---

# 129. WEEKLY CHECK

```text
[ ] Weekly report generated
[ ] Failed jobs reviewed
[ ] Provider quota reviewed
[ ] Influencer pipeline reviewed
[ ] Content calendar reviewed
[ ] SEO opportunities reviewed
[ ] Application follow-ups reviewed
[ ] Proof-of-work updated
[ ] No-AI mode still usable
```

---

# 130. MONTHLY CHECK

```text
[ ] Asset storage reviewed
[ ] API policies rechecked
[ ] Free-tier limits rechecked
[ ] Deprecated provider models reviewed
[ ] Backup/export checked
[ ] Restore path exercised
[ ] Provider fallback exercised
[ ] Security review completed
```

---

# 131. V1.0.0 ACCEPTANCE CRITERIA

## Core

```text
[ ] Workbench loads
[ ] Workspace isolation passes
[ ] Content works
[ ] Calendar works
[ ] Tasks work
[ ] Research works
[ ] Influencer CRM works
[ ] Assets work
[ ] Applications work
[ ] Reports work
```

## AI

```text
[ ] Gateway exists
[ ] At least one remote engine works
[ ] Manual bridge works
[ ] Provenance stored
[ ] AI failure does not break core
[ ] No-AI mode passes
```

## Evaluation

```text
[ ] Deterministic QA works
[ ] Human review works
[ ] Kev is optional
[ ] No fabricated metrics
```

## Security

```text
[ ] No secrets in Git
[ ] No secrets in client bundle
[ ] Workspace isolation
[ ] Audit
[ ] Idempotency
[ ] Data-class restriction
```

## Browser companion

```text
[ ] Side panel opens
[ ] Selected text capture works
[ ] Page capture works
[ ] Save to Workbench works
```

## Release

```text
[ ] CI green
[ ] E2E green
[ ] No-AI drill green
[ ] Provider shock drill green
[ ] Evidence recorded
```

---

# 132. WHAT v1.0.0 MEANS

Version 1.0.0 establishes a durable operating environment, not a collection of disconnected tools.

The system is:

- AI optional;
- provider neutral;
- cloud-first;
- browser-first;
- human governed;
- auditable;
- portable;
- free-tier aware;
- capable of graceful degradation.

---

# 133. FINAL REFERENCE ARCHITECTURE

```text
                         USER
                          │
                          ▼
                ┌───────────────────┐
                │ BROWSER WORKBENCH │
                └─────────┬─────────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
           CONTENT     RESEARCH   APPLICATIONS
           CALENDAR    SEO        PROOF OF WORK
           TASKS       INFLUENCER REPORTS
           ASSETS      OUTREACH   CAMPAIGNS
              │           │           │
              └───────────┼───────────┘
                          │
                     WORK RECIPES
                          │
                     AI GATEWAY
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
     Gemini           OpenRouter      Hugging Face
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                    Candidate Pool
                          │
                    Deterministic QA
                          │
                    ┌─────┴─────┐
                    │           │
                    ▼           ▼
                   Kev        Human
                    │         Review
                    └────┬─────┘
                         │
                   Execute / Handoff
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
   Pinterest          Meta/IG           TikTok/X
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                      Evidence
                         │
                      Analytics
                         │
                       Reports

Browser Companion:
page → selection → capture → Workbench

Cloud:
GitHub → Cloudflare Workers → D1 → R2 → Queues

Fallback:
No AI → deterministic templates → manual workflow
```

---

# 134. FINAL OPERATING PRINCIPLES

1. **The Workbench is the system of record.**
2. **AI is replaceable.**
3. **Kev evaluates; it does not write the core content.**
4. **Deterministic QA constrains generated output.**
5. **Human review remains authoritative for publication.**
6. **Manual browser AI is a supported lane.**
7. **No-AI mode must continue to work.**
8. **External platform limitations are explicit connector states.**
9. **Measured facts are separated from interpretation.**
10. **No fabricated metrics or professional history.**
11. **Restricted data does not leave the approved security boundary.**
12. **Secrets stay server-side.**
13. **Provider changes happen behind adapters.**
14. **Database records remain portable.**
15. **Work is preserved when providers fail.**

---

# APPENDIX A — QUICKSTART

```text
1. Create GitHub repository.
2. Create Cloudflare account.
3. Create Worker.
4. Create D1 database.
5. Create R2 bucket.
6. Create Queue.
7. Deploy deterministic Workbench.
8. Verify browser UI.
9. Add one AI provider.
10. Verify AI Gateway.
11. Enable Manual AI Bridge.
12. Run No-AI drill.
13. Add Kev evaluator.
14. Add browser Side Panel.
15. Add first social connector.
16. Run E2E.
17. Run provider-shock tests.
18. Record evidence.
19. Tag v1.0.0.
20. Freeze release.
```

---

# APPENDIX B — STOP CONDITIONS

Stop and investigate if:

```text
[ ] a secret appears in the browser
[ ] a secret appears in Git
[ ] restricted data is sent to remote AI
[ ] workspace isolation fails
[ ] an API action is marked successful without evidence
[ ] a provider is represented as ready without capability verification
[ ] AI invents metrics that pass into a final report
[ ] quota overrun threatens cost
[ ] browser automation bypasses provider security controls
[ ] a migration is partially applied
[ ] backup/recovery cannot be demonstrated
```

---

# APPENDIX C — USER-FACING AI PANEL

The panel should show:

```text
TASK
RECIPE
DATA CLASS
PROVIDER MODE
ELIGIBLE PROVIDERS
QUOTA
QA RULES
GENERATE
```

After generation:

```text
CANDIDATES
PROVENANCE
QA
KEV
HUMAN REVIEW
```

---

# APPENDIX D — GOLDEN DEMO

A complete demonstration is:

```text
Create campaign
 ↓
Create content brief
 ↓
Generate candidates
 ↓
Show provider provenance
 ↓
Run QA
 ↓
Run Kev
 ↓
Human chooses
 ↓
Create platform variants
 ↓
Schedule
 ↓
Record evidence
 ↓
Generate report
```

The same workflow must remain usable with all AI providers disabled.

---

# APPENDIX E — RELEASE EVIDENCE TEMPLATE

```text
Marketing Operations Workbench v1.0.0

Git commit:
Deployment:
Database:
AI providers configured:
AI providers unavailable drill:
No-AI drill:
Kev evaluator:
Browser Side Panel:
Platform connectors:
Security checks:
E2E:
Open incidents:
Known limitations:
Evidence links:
Date:
Owner:
```

---

# APPENDIX F — CURRENT OFFICIAL PROVIDER / PLATFORM VERIFICATION REGISTER

**Verification date:** 23 September 2026

## OpenRouter

Current official pricing reports a Free plan with 25+ free models, 4 free providers, chat/API access, and a 50 requests/day rate limit. The free model collection is dynamic.

Source:
https://openrouter.ai/pricing
https://openrouter.ai/collections/free-models

## Google Gemini

Current official Gemini pricing documents a Free tier with free input/output tokens for eligible models and restricted access/rate limits. The current pricing page lists Gemini 2.5 Flash and Gemini 2.5 Flash-Lite among models with free-tier pricing. Current Google documentation also warns that Free-tier content may be used to improve products.

Sources:
https://ai.google.dev/gemini-api/docs/pricing
https://ai.google.dev/gemini-api/docs/rate-limits
https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-lite

## Hugging Face

Current official Spaces documentation says Static Spaces are free. CPU Basic is documented as 2 vCPU / 16 GB with no hourly cost when available; creation of compute-backed Gradio/Docker Spaces requires a paid plan. Hardware and community grants can change.

Sources:
https://huggingface.co/docs/hub/spaces-overview
https://huggingface.co/pricing

## Kev

Current official project documentation describes Kev-0.8B as a typed decision model and explicitly states no text generation. The model card reports development and out-of-domain metrics, so evaluator behavior must be measured on the Workbench's specific decision tasks.

Sources:
https://github.com/jaredpalmer/kev/blob/main/docs/model-cards/kev-0.8b.md
https://github.com/jaredpalmer/kev/blob/main/kev/model.py

## Chrome Side Panel

Chrome's current Side Panel API allows a Manifest V3 extension to provide UI alongside webpages and supports persistent side-panel experiences.

Source:
https://developer.chrome.com/docs/extensions/reference/api/sidePanel

## TikTok

TikTok's current Content Posting API documentation says direct posting requires a registered app, Content Posting API configuration, user authorization and appropriate scope approval. TikTok also states that unaudited clients' posted content is restricted to private viewing until audit.

Sources:
https://developers.tiktok.com/docs/en/content-posting-api-reference-direct-post
https://developers.tiktok.com/docs/en/content-posting-api-get-started
https://developers.tiktok.com/docs/en/content-sharing-guidelines

## Pinterest

Pinterest's current API documentation distinguishes Trial and Standard access. Trial supports testing and has visibility limitations on created Pins/Boards; Standard offers broader production functionality. Pinterest also documents a Sandbox for API testing.

Sources:
https://developers.pinterest.com/docs/key-concepts/access-tiers/
https://developers.pinterest.com/docs/developer-tools/sandbox/

## X

Current X developer documentation shows authenticated API operations depend on approved developer access/App setup and user authorization.

Source:
https://docs.x.com/

## Cloudflare Workers

Current Workers Free limits include 100,000 requests/day, 10 ms CPU per invocation, 128 MB memory, 64 environment variables per Worker, and 5 Cron Triggers per account.

Source:
https://developers.cloudflare.com/workers/platform/limits/

## Cloudflare D1

Current Workers Free D1 limits include 5 million rows read/day, 100,000 rows written/day and 5 GB total free storage.

Sources:
https://developers.cloudflare.com/d1/platform/pricing/
https://developers.cloudflare.com/d1/platform/limits/

## Cloudflare R2

Current Standard Free tier includes 10 GB-month storage, 1 million Class A operations/month, 10 million Class B operations/month, and free Internet egress.

Source:
https://developers.cloudflare.com/r2/pricing/

## Cloudflare Queues

Current Workers Free includes 10,000 Queue operations/day. The free tier has a 24-hour message retention period.

Sources:
https://developers.cloudflare.com/queues/platform/pricing/
https://developers.cloudflare.com/changelog/post/2026-02-04-queues-free-plan/

---

# APPENDIX G — CHANGELOG

## 1.0.0 — 23 September 2026

Initial master release.

Established:

- provider-neutral AI Gateway;
- deterministic-first architecture;
- OpenRouter adapter;
- Gemini adapter;
- Hugging Face adapter;
- Kev evaluation layer;
- optional local CPU model;
- browser/manual AI bridge;
- Chrome/Edge side-panel companion;
- content studio;
- content calendar;
- Pinterest/SEO lab;
- Blog Studio;
- Influencer CRM;
- Outreach Center;
- Campaigns;
- Meta Ads Lab;
- analytics;
- asset library;
- proof-of-work;
- applications;
- audit/idempotency;
- security/privacy;
- cloud-to-cloud baseline;
- free-tier/quota controls;
- testing/adversarial drills;
- backup/recovery;
- provider migration rules;
- daily/weekly/monthly operations.

---

# END OF MANUAL

**Marketing Operations Workbench — AI Orchestration Gateway Master Build & Operations Manual v1.0.0**
