"use client";
import { useMemo } from "react";
import { Icon, type IconName } from "./Icon";

type InsightProps = { area: string; rows: any[]; onCreate: () => void; onSelect: (row:any) => void };

function safeNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toUpperCase()==="UNKNOWN" || trimmed.toUpperCase()==="NOT_AVAILABLE") return null;
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === "number" && Number.isFinite(parsed)) return parsed;
    if (parsed && typeof parsed.value === "number" && Number.isFinite(parsed.value)) return parsed.value;
  } catch {}
  const numeric = Number(trimmed.replace(/[%,$]/g,""));
  return Number.isFinite(numeric) ? numeric : null;
}
function formatMetric(value:number|null){
  if(value===null)return "UNKNOWN";
  return new Intl.NumberFormat(undefined,{maximumFractionDigits:1}).format(value);
}
function latestByMetric(rows:any[]){
  const map=new Map<string,any>();
  for(const row of rows){
    const key=`${row.platform||"UNKNOWN"}::${row.metric_name||"UNKNOWN"}`;
    const prior=map.get(key);
    if(!prior || String(row.retrieved_at||"")>String(prior.retrieved_at||"")) map.set(key,row);
  }
  return [...map.values()];
}
function statusTone(value:string){
  const v=value.toUpperCase();
  if(["READY","ACTIVE","MEASURED","APPROVED","ON TRACK"].includes(v))return "status-good";
  if(["UNKNOWN","PENDING","PLANNED","QA","REVIEW","TRIAL"].includes(v))return "status-warn";
  if(["FAILED","BLOCKED","UNAVAILABLE","REJECTED"].includes(v))return "status-bad";
  return "status-info";
}

function AnalyticsInsights({rows,onCreate,onSelect}:Omit<InsightProps,"area">){
  const latest=useMemo(()=>latestByMetric(rows),[rows]);
  const cards=useMemo(()=>{
    const wanted=["reach","impressions","engagement","clicks","saves","shares"];
    return wanted.map(metric=>{
      const matches=latest.filter(r=>String(r.metric_name||"").toLowerCase()===metric);
      const latestRow=matches.sort((a,b)=>String(b.retrieved_at||"").localeCompare(String(a.retrieved_at||"")))[0];
      return {metric,label:metric.replace(/\b\w/g,m=>m.toUpperCase()),value:safeNumber(latestRow?.value_json),source:latestRow?.source_ref||latestRow?.provider||"UNKNOWN",row:latestRow};
    });
  },[latest]);
  const platforms=useMemo(()=>{
    const map=new Map<string,number>();
    for(const r of latest){const v=safeNumber(r.value_json);const p=String(r.platform||"UNKNOWN");if(v!==null)map.set(p,(map.get(p)||0)+v);}
    return [...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);
  },[latest]);
  return <section className="insight-shell analytics-insights">
    <div className="insight-header"><div><div className="surface-kicker">Measurement cockpit</div><h2>Latest measured facts</h2><p>Values come only from recorded metric snapshots. Missing evidence remains UNKNOWN.</p></div><button className="btn accent" onClick={onCreate}><Icon name="plus" size={14}/> Record metric</button></div>
    <div className="metric-card-grid">{cards.map(card=><button className="metric-card" key={card.metric} onClick={()=>card.row&&onSelect(card.row)} disabled={!card.row}><span>{card.label}</span><strong>{formatMetric(card.value)}</strong><small>{card.source}</small></button>)}</div>
    <div className="insight-grid-two"><section className="insight-panel"><div className="panel-title"><div><span className="surface-kicker">Platform observations</span><h3>Recorded volume by platform</h3></div><span className="badge">OBSERVED ONLY</span></div>{platforms.length===0?<div className="empty-inline">No numeric platform measurements have been recorded yet.</div>:<div className="bar-list">{platforms.map(([platform,value])=><div className="bar-row" key={platform}><div><strong>{platform}</strong><span>{formatMetric(value)}</span></div><div className="bar-track"><i style={{width:`${Math.max(8,Math.round((value/platforms[0][1])*100))}%`}}/></div></div>)}</div>}</section>
      <section className="insight-panel"><div className="panel-title"><div><span className="surface-kicker">Reconciliation</span><h3>Evidence posture</h3></div><span className={`status-pill ${latest.length?"status-good":"status-warn"}`}>{latest.length?"SOURCE-BACKED":"NO DATA"}</span></div><div className="recon-list"><Recon label="Metric snapshots" value={String(rows.length)}/><Recon label="Distinct metric/platform pairs" value={String(latest.length)}/><Recon label="Source references present" value={String(latest.filter(r=>r.source_ref).length)}/><Recon label="UNKNOWN values" value={String(latest.filter(r=>safeNumber(r.value_json)===null).length)}/></div></section></div>
  </section>;
}
function Recon({label,value}:{label:string;value:string}){return <div className="recon-row"><span>{label}</span><strong>{value}</strong></div>}

function MetaAdsInsights({rows,onCreate,onSelect}:Omit<InsightProps,"area">){
  const active=rows.filter(r=>String(r.status||"").toUpperCase()==="ACTIVE").length;
  const planned=rows.filter(r=>String(r.status||"").toUpperCase()==="PLANNED").length;
  const budgeted=rows.reduce((sum,r)=>sum+(Number(r.planned_budget)||0),0);
  const currencies=[...new Set(rows.map(r=>String(r.currency||"").trim().toUpperCase()).filter(Boolean))];
  const budgetLabel=currencies.length===1&&budgeted>0?new Intl.NumberFormat(undefined,{style:"currency",currency:currencies[0],maximumFractionDigits:0}).format(budgeted):currencies.length>1?"MIXED":"UNKNOWN";
  const complete=(r:any)=>[r.account_ref,r.objective,r.audience,r.message,r.creative_refs_json,r.copy_refs_json,r.placement,r.planned_budget,r.currency,r.tracking_plan].filter(v=>v!==null&&v!==undefined&&String(v).trim()!==""&&String(v)!=="[]").length;
  const plans=rows.map(r=>({...r,completeness:complete(r)})).sort((a,b)=>b.completeness-a.completeness).slice(0,4);
  return <section className="insight-shell meta-insights">
    <div className="insight-header"><div><div className="surface-kicker">Meta Ads planning cockpit</div><h2>From campaign idea to launch-ready plan</h2><p>Planning only: campaign structure, audience hypothesis, creative/copy matrices, budget and tracking remain inspectable before any paid execution.</p></div><button className="btn accent" onClick={onCreate}><Icon name="plus" size={14}/> Create ad plan</button></div>
    <div className="meta-kpi-grid"><MetaKpi label="Planned" value={String(planned)} icon="flask"/><MetaKpi label="Active" value={String(active)} icon="check"/><MetaKpi label="Planned budget" value={budgetLabel} icon="chart"/><MetaKpi label="Tracked plans" value={String(rows.filter(r=>String(r.tracking_plan||"").trim()).length)} icon="shield"/></div>
    <div className="insight-panel"><div className="panel-title"><div><span className="surface-kicker">Readiness matrix</span><h3>Plan completeness</h3></div><span className="badge">QA BEFORE LAUNCH</span></div><div className="readiness-list">{plans.length===0?<div className="empty-inline">No ad plans recorded yet. Build the first plan to activate the planning workflow.</div>:plans.map(r=><button className="readiness-row" key={r.id} onClick={()=>onSelect(r)}><div className="readiness-main"><strong>{r.name}</strong><span>{r.objective||"Objective not recorded"}</span></div><div className="readiness-meter"><div><i style={{width:`${Math.round((r.completeness/10)*100)}%`}}/></div><span>{r.completeness}/10</span></div><span className={`status-pill ${statusTone(String(r.status||"PLANNED"))}`}>{r.status||"PLANNED"}</span><Icon name="arrow" size={13}/></button>)}</div><div className="meta-stage-flow"><Stage icon="megaphone" label="Campaign" active/><Stage icon="users" label="Audience" active/><Stage icon="image" label="Creative" active/><Stage icon="file" label="Copy" active/><Stage icon="chart" label="Budget" active/><Stage icon="shield" label="Tracking" active/><Stage icon="check" label="QA"/><Stage icon="rocket" label="Launch"/><Stage icon="chart" label="Measure"/></div></div>
  </section>;
}
function MetaKpi({label,value,icon}:{label:string;value:string;icon:IconName}){return <div className="meta-kpi"><span className="kpi-icon"><Icon name={icon} size={16}/></span><div><small>{label}</small><strong>{value}</strong></div></div>}
function Stage({icon,label,active}:{icon:IconName;label:string;active?:boolean}){return <div className={`meta-stage ${active?"active":""}`}><Icon name={icon} size={13}/><span>{label}</span></div>}

export function ModuleInsights({area,rows,onCreate,onSelect}:InsightProps){
  if(area==="analytics") return <AnalyticsInsights rows={rows} onCreate={onCreate} onSelect={onSelect}/>;
  if(area==="meta-ads") return <MetaAdsInsights rows={rows} onCreate={onCreate} onSelect={onSelect}/>;
  return null;
}
