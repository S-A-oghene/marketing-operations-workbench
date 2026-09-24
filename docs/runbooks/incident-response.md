# Incident Response

## AI outage
Mark provider `UNAVAILABLE`, preserve the job, route to the next eligible lane, then Manual AI or No-AI templates.

## Database failure
Stop unsafe writes, inspect status, restore from a tested backup, verify counts/integrity, resume.

## R2 failure
Preserve metadata, stop unsafe writes, validate checksums, retry safely, reconcile missing objects.

## Publish failure
Record provider/platform, request ID, post ID if available, provider response, and publication state. Use `UNKNOWN` when uncertain. Never duplicate automatically.
