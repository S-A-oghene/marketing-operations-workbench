# MOW Manual Browser Acceptance Checklist

Use this checklist after the exact 11-command real-repository gate passes.

## Navigation

- [ ] Desktop collapse/expand works.
- [ ] Medium-width collapse/expand works.
- [ ] Mobile off-canvas open/close works.
- [ ] `Ctrl/Cmd+B` toggles navigation.
- [ ] Visible controls are keyboard accessible.

## Command Search

- [ ] `Ctrl/Cmd+K` opens Command Search.
- [ ] Search results are actionable.
- [ ] Selecting a result navigates correctly.
- [ ] Duplicate actions do not create ambiguous navigation behavior.

## Records and builders

- [ ] Create opens the real builder.
- [ ] Create persists a record.
- [ ] Edit loads existing values.
- [ ] Edit persists changes.
- [ ] Duplicate creates a new record.
- [ ] Related identifiers remain valid.

## Filters and views

- [ ] Filters opens.
- [ ] Applying a filter changes the visible dataset.
- [ ] Display controls change visible columns.
- [ ] List view works where supported.
- [ ] Board view works where supported.
- [ ] Calendar view works where supported.
- [ ] Timeline view works where supported.

## Meta Ads / Analytics

- [ ] Meta Ads planning fields are usable.
- [ ] QA/readiness state is explicit.
- [ ] Campaign persistence works.
- [ ] Analytics uses measurement records.
- [ ] Source/evidence posture is visible.
- [ ] Unknown metrics remain `UNKNOWN`.
- [ ] Measured facts are separated from interpretation.

## Consequential actions

- [ ] Publication requires human approval/confirmation.
- [ ] Publication evidence is recorded.
- [ ] Outreach requires human confirmation.
- [ ] Application submission requires human confirmation.
- [ ] Platform handoff preserves manual execution and confirmation.
- [ ] Duplicate publication is not silently performed.

## AI Gateway / Manual AI

- [ ] Provider state is visible.
- [ ] Capability state is distinguishable from credential state.
- [ ] Generation records provenance.
- [ ] Deterministic QA runs.
- [ ] Manual AI response parsing validates structure.
- [ ] Malformed responses remain invalid.
- [ ] Manual fallback remains available.

## No-AI operation

- [ ] Content workflow remains usable.
- [ ] Calendar remains usable.
- [ ] Research remains usable.
- [ ] Influencer CRM remains usable.
- [ ] Assets remain usable.
- [ ] Applications remain usable.
- [ ] Reports remain usable.
- [ ] Tasks remain usable.
- [ ] Deterministic templates remain usable.

## Release evidence

- [ ] Repository commit recorded.
- [ ] Backup directory recorded.
- [ ] All 11 command results recorded.
- [ ] Manual acceptance recorded.
- [ ] Known limitations recorded.
- [ ] Open incidents recorded.
