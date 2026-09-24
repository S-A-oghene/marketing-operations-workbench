# Cloudflare beginner runbook

Create: Worker `marketing-operations-workbench`; D1 `mow-db`; R2 `mow-assets`; Queue `mow-jobs`.

Set server-side secrets:

`wrangler secret put OPENROUTER_API_KEY`

`wrangler secret put GEMINI_API_KEY`

`wrangler secret put AUTH_SECRET`

Apply migrations in order. Do staging first, then production.

Never paste secrets into GitHub.
