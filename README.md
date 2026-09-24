# Marketing Operations Workbench (MOW) + AI Orchestration Gateway (AOG) v1.0.0

This repository implements the supplied **Marketing Operations Workbench — AI Orchestration Gateway — Master Build & Operations Manual v1.0.0**.

## Binding specification

The exact source manual is preserved at:

`docs/source/Marketing_Operations_Workbench_AI_Gateway_Manual_v1_0_0.md`

The implementation preserves the manual's core constitution: the Workbench is the system of record, AI is replaceable, manual AI is a supported lane, deterministic QA is mandatory, human review remains authoritative for consequential actions, and unknown evidence remains `UNKNOWN`/`NOT_AVAILABLE`.

## Technology baseline

- Frontend: Next.js 16.3.6 + TypeScript
- React: 19.3.0
- Runtime: Cloudflare Workers
- Database: Cloudflare D1
- Object storage: Cloudflare R2
- Async jobs: Cloudflare Queues
- Tests: Vitest 5 + Playwright 1.63
- Browser companion: Chrome/Edge Manifest V3

The version pins were selected against public package releases available on 23 September 2026. The lockfile is not fabricated: the build environment could not reach the npm registry, so `npm ci` and real lockfile resolution could not be completed here. See `docs/release/verification-status.md`.

## Repository map

```text
marketing-operations-workbench/
├── .github/workflows/ci.yml
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
│   ├── release/
│   └── source/
├── tests/
└── scripts/
```

## First run

After dependencies are installed:

```text
npm install
npm run dev
```

Open `http://localhost:3000`.

The browser UI starts in `NO AI` mode and presents deterministic templates. Optional remote providers do not become mandatory dependencies.

## Cloud deployment

Create the resources named by the source manual:

```text
Worker: marketing-operations-workbench
D1: mow-db
R2: mow-assets
Queue: mow-jobs
```

Apply additive migrations in order and deploy the Worker. Build the Next.js app as a static browser frontend for Pages.

## Security

No API keys, OAuth secrets, cookies, passwords, tokens, private keys or MFA data belong in Git, browser local storage, URLs, prompts, screenshots, logs, or client bundles.

The extension capture is user initiated and captures only selection + title + URL.

Do not declare v1.0.0 complete until the evidence gates are actually satisfied.

## Local deterministic verification (available without npm dependencies)

```text
node --experimental-strip-types scripts/core-smoke.mjs
node scripts/portable-smoke.mjs
node scripts/security-check.mjs
node scripts/generate-traceability.mjs
node scripts/verify-all.mjs
```

The portable smoke creates a synthetic DEMO workspace export as JSON and CSV, restores that export into a second in-memory SQLite database, and verifies record counts plus asset references. This is a portability test, not evidence of a live Cloudflare restore.

## Production authentication boundary

Demo mode is explicitly controlled by `DEMO_AUTH=true` and uses the synthetic workspace only. A production deployment should set `DEMO_AUTH=false` and place the Worker behind Cloudflare Access. The Worker maps the authenticated Access email to a D1 membership and rejects unauthenticated or non-member requests. A client-supplied workspace header is therefore not trusted in production.

## Provider readiness

An API key does not make a provider `READY`. OpenRouter, Gemini and Hugging Face adapters expose `CONNECTED` until an explicit operator-controlled capability verification flag is set. This prevents a configured-but-unverified provider from being treated as production-ready.
