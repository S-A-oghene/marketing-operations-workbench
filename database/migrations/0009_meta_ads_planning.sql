-- Meta Ads planning fields required by the MOW manual's Campaign object.
-- Applied additively after the core/campaign schema.
ALTER TABLE campaigns ADD COLUMN account_ref TEXT;
ALTER TABLE campaigns ADD COLUMN creative_refs_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE campaigns ADD COLUMN copy_refs_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE campaigns ADD COLUMN placement TEXT;
ALTER TABLE campaigns ADD COLUMN currency TEXT;
ALTER TABLE campaigns ADD COLUMN tracking_plan TEXT;
