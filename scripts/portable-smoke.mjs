process.stdout.write("");
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const migrationDir=path.resolve("database/migrations");
const seed=fs.readFileSync("database/seeds/demo.sql","utf8");
const migrationSql=fs.readdirSync(migrationDir).filter(f=>f.endsWith(".sql")).sort().map(f=>fs.readFileSync(path.join(migrationDir,f),"utf8")).join("\n");
const db=new DatabaseSync(":memory:"); db.exec("PRAGMA foreign_keys=ON"); db.exec(migrationSql); db.exec(seed);
const tables=["workspaces","users","memberships","projects","campaigns","content_items","content_variants","content_calendar","platform_accounts","platform_connections","provider_capabilities","ai_providers","ai_requests","ai_responses","ai_evaluations","ai_rules","recipes","recipe_versions","research_items","keywords","influencers","influencer_contacts","outreach_messages","tasks","assets","metric_snapshots","reports","applications","portfolio_items","sops","audit_events","webhook_events","jobs","sessions","provider_quota_snapshots","brand_profiles","prompt_templates","publication_evidence"];
const data={};
function hasWorkspaceId(db,table){return db.prepare(`PRAGMA table_info(${table})`).all().some(c=>c.name==="workspace_id");}
for(const table of tables)data[table]=hasWorkspaceId(db,table)?db.prepare(`SELECT * FROM ${table} WHERE workspace_id=?`).all("demo-workspace"):db.prepare(`SELECT * FROM ${table}`).all();
const exportObj={exportVersion:"1.0.0",workspaceId:"demo-workspace",exportedAt:"2026-09-23T00:00:00.000Z",data,assetReferences:data.assets.map(a=>a.storage_ref).filter(Boolean)};
fs.mkdirSync("artifacts",{recursive:true}); fs.writeFileSync("artifacts/workspace-export.json",JSON.stringify(exportObj,null,2));
function csv(rows){if(!rows.length)return "";const cols=[...new Set(rows.flatMap(r=>Object.keys(r)))];const esc=v=>{const s=v==null?"":String(v);return /[",\n]/.test(s)?`"${s.replaceAll('"','""')}"`:s};return [cols.join(","),...rows.map(r=>cols.map(c=>esc(r[c])).join(","))].join("\n")+"\n";}
for(const table of tables)fs.writeFileSync(`artifacts/${table}.csv`,csv(data[table]));
const restored=new DatabaseSync(":memory:"); restored.exec("PRAGMA foreign_keys=ON"); restored.exec(migrationSql);
for(const table of tables){for(const row of data[table]){const cols=Object.keys(row);if(!cols.length)continue;const placeholders=cols.map(()=>"?").join(",");restored.prepare(`INSERT OR REPLACE INTO ${table} (${cols.join(",")}) VALUES (${placeholders})`).run(...cols.map(c=>row[c]));}}
const sourceCounts={}; const restoreCounts={};
for(const table of tables){sourceCounts[table]=data[table].length;restoreCounts[table]=hasWorkspaceId(restored,table)?restored.prepare(`SELECT COUNT(*) AS c FROM ${table} WHERE workspace_id=?`).get("demo-workspace").c:restored.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get().c;if(sourceCounts[table]!==restoreCounts[table])throw new Error(`RESTORE_COUNT_MISMATCH:${table}`);}
if(!exportObj.assetReferences.every(r=>typeof r==="string"))throw new Error("ASSET_REFERENCE_FAILURE");
console.log(`PORTABLE_EXPORT_RESTORE=PASS tables=${tables.length} assets=${exportObj.assetReferences.length}`);
