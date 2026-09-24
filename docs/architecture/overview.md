# Architecture Overview

The Workbench is the system of record. Social platforms are execution/observation edges. Providers are adapters behind the AI Gateway.

Runtime:

`GitHub → Cloudflare Pages (Next static UI) + Cloudflare Workers (API/runtime) → D1/R2/Queues → provider/platform adapters`

AI:

`Request → Recipe → Data Policy → Capability/Quota → Provider → Normalization → Deterministic QA → Optional Kev → Human Review → Execution/Handoff → Evidence`

Core has no provider SDK or Cloudflare runtime dependency.
