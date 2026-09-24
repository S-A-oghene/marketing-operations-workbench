"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getDashboard, getProviderStatus } from "../lib/api";
import { Icon, type IconName } from "./Icon";

type Kpi={label:string;value:string|number;meta:string;icon:IconName;tone:string;href:string};

export function Dashboard(){
  const [data,setData]=useState<any|null>(null);
  const [providers,setProviders]=useState<any[]>([]);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const load=useCallback(async()=>{setBusy(true);setError("");try{const [d,p]=await Promise.all([getDashboard(),getProviderStatus()]);setData(d);setProviders(p.providers||[]);}catch(e){setError(e instanceof Error?e.message:"Unable to load dashboard");}finally{setBusy(false);}},[]);
  useEffect(()=>{void load();},[load]);
  const kpis:Kpi[]=useMemo(()=>[
    {label:"Due today",value:data?.tasksToday??"—",meta:"Tasks requiring attention",icon:"today",tone:"accent",href:"/today"},
    {label:"Needs approval / QA",value:data?.contentAttention??"—",meta:"Content in review flow",icon:"check",tone:"warn",href:"/content-studio"},
    {label:"Failed / blocked",value:data?.failedJobs??"—",meta:"Investigate before retry",icon:"warning",tone:"bad",href:"/tasks"},
    {label:"AI providers ready",value:providers.filter(p=>p.state==="READY").length,meta:"Capability-verified only",icon:"spark",tone:"good",href:"/ai-gateway"},
  ],[data,providers]);
  return <div className="page-shell">
    <section className="hero hero-modern"><div className="hero-glow"/><div className="hero-grid"><div><div className="eyebrow hero-eyebrow"><span className="live-dot"/>Command Center · Live workspace</div><h1>Command Center</h1><div className="hero-subtitle">Make the next right move.</div><p>One operating surface for planning, creating, approving, executing and measuring work. External AI and platforms are optional edges; your Workbench remains the source of truth.</p><div className="hero-actions"><Link className="btn primary" href="/today"><Icon name="today" size={15}/> Open Today</Link><Link className="btn ghost-dark" href="/content-studio"><Icon name="plus" size={15}/> Create content</Link><button className="btn ghost-dark" onClick={load} disabled={busy}><Icon name="refresh" size={14}/>{busy?"Refreshing":"Refresh data"}</button></div></div><div className="hero-side"><div className="hero-side-card"><div className="surface-kicker">Operating mode</div><strong>No-AI safe mode</strong><span>Core workflows remain available without providers.</span><div className="hero-mode-line"><span className="mode-dot"/><span>Human review enforced</span></div></div></div></div></section>

    {error&&<div className="notice notice-bad" role="alert"><Icon name="warning" size={14}/><span>{error}</span><button aria-label="Dismiss" onClick={()=>setError("")}><Icon name="x" size={13}/></button></div>}

    <section className="kpi-grid">{kpis.map(k=><Link href={k.href} className="kpi-card" key={k.label}><div className="kpi-icon"><Icon name={k.icon} size={17}/></div><div className="kpi-copy"><div className="kpi-label">{k.label}</div><div className="kpi-value">{k.value}</div><div className="kpi-meta">{k.meta}</div></div><Icon name="arrow" size={15} className="kpi-arrow"/></Link>)}</section>

    <section className="dashboard-grid dashboard-grid-main"><div className="card card-pad focus-card"><div className="section-title"><div><div className="surface-kicker">Priority queue</div><h2>What needs you now</h2><p>Live operational counts, not hard-coded demo stories.</p></div><Link className="text-link" href="/today">Open Today <Icon name="arrow" size={14}/></Link></div><div className="focus-list"><FocusRow icon="warning" title="Content awaiting QA or approval" value={String(data?.contentAttention??0)} href="/content-studio" tone="warn"/><FocusRow icon="today" title="Tasks due today" value={String(data?.tasksToday??0)} href="/today" tone="accent"/><FocusRow icon="warning" title="Failed or blocked jobs" value={String(data?.failedJobs??0)} href="/tasks" tone="bad"/><FocusRow icon="spark" title="Capability-verified AI providers" value={String(providers.filter(p=>p.state==="READY").length)} href="/ai-gateway" tone="good"/></div></div>
      <div className="card card-pad"><div className="section-title"><div><div className="surface-kicker">System health</div><h2>Operational posture</h2><p>Explicit states take precedence over optimistic assumptions.</p></div><span className="status-pill status-good">LIVE</span></div><div className="health-stack"><HealthRow label="Workspace" value={data?.workspaceId||"UNKNOWN"} state={data?.workspaceId?"CONNECTED":"UNKNOWN"}/><HealthRow label="AI" value={`${providers.filter(p=>p.state==="READY").length} ready`} state={providers.some(p=>p.state==="READY")?"READY":"OPTIONAL"}/><HealthRow label="Quota" value="Telemetry-dependent" state="UNKNOWN"/><HealthRow label="Approval" value="Human required" state="ENFORCED"/></div></div></section>

    <section className="dashboard-grid dashboard-grid-secondary"><div className="card card-pad"><div className="section-title"><div><div className="surface-kicker">Start anywhere</div><h2>Command shortcuts</h2></div></div><div className="shortcut-grid"><Shortcut href="/campaigns" icon="megaphone" title="Plan campaign" text="Create a real campaign record"/><Shortcut href="/research" icon="search" title="Capture research" text="Save source-backed evidence"/><Shortcut href="/influencer-crm" icon="users" title="Research creator" text="Add a sourced creator"/><Shortcut href="/applications" icon="rocket" title="Track application" text="Preserve submission evidence"/></div></div><div className="card card-pad"><div className="section-title"><div><div className="surface-kicker">Guardrails</div><h2>Always visible</h2></div></div><div className="guard-list"><Guard icon="shield" title="Secrets stay server-side"/><Guard icon="warning" title="Unsupported metrics stay UNKNOWN"/><Guard icon="check" title="Human approval gates consequential execution"/><Guard icon="external" title="External platform limitations remain explicit"/></div></div><div className="card card-pad"><div className="section-title"><div><div className="surface-kicker">Flow</div><h2>Operating lifecycle</h2></div></div><div className="lifecycle"><span className="active">Plan</span><i/> <span className="active">Create</span><i/> <span>QA</span><i/> <span>Approve</span><i/> <span>Execute</span><i/> <span>Measure</span></div><p className="muted tiny" style={{marginTop:14}}>AI accelerates the flow; the Workbench owns the record and evidence.</p></div></section>
  </div>
}

function FocusRow({icon,title,value,href,tone}:{icon:IconName;title:string;value:string;href:string;tone:string}){return <Link href={href} className="focus-row"><div className={`focus-icon ${tone}`}><Icon name={icon} size={15}/></div><div className="focus-main"><strong>{title}</strong><span>Open workspace surface</span></div><div className="focus-value">{value}</div><Icon name="arrow" size={14}/></Link>}
function HealthRow({label,value,state}:{label:string;value:string;state:string}){return <div className="health-row-rich"><div><strong>{label}</strong><span>{value}</span></div><span className={`status-pill ${state==="UNKNOWN"?"status-warn":"status-good"}`}>{state}</span></div>}
function Shortcut({href,icon,title,text}:{href:string;icon:IconName;title:string;text:string}){return <Link href={href} className="shortcut-card"><span className="shortcut-icon"><Icon name={icon} size={15}/></span><span><strong>{title}</strong><small>{text}</small></span><Icon name="arrow" size={13}/></Link>}
function Guard({icon,title}:{icon:IconName;title:string}){return <div className="guard-item"><Icon name={icon} size={15}/><span>{title}</span></div>}
