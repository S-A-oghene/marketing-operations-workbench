# Known Limitations

1. Authentication is demo-safe in this repository artifact and must be connected to an approved production identity boundary before external release.
2. Social connectors are safe boundary implementations with manual handoff; no provider access is fabricated.
3. Full signed R2 upload UI is not exposed in this artifact; storage bindings and metadata model are in place.
4. Deterministic template generation is the default fallback.
5. Provider model IDs are configurable.
6. npm lockfile generation could not be completed due registry access failure in the build environment.
7. Live provider capability probes remain operator-configured through explicit READY flags; an API key alone does not make a provider READY.
8. Live social publishing is not claimed without provider accounts, scopes, approvals and publication evidence.
