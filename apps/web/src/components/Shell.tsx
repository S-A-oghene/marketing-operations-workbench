"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { NAV_GROUPS } from "../lib/navigation";
import { getProviderStatus } from "../lib/api";
import { Icon } from "./Icon";
import type { ReactNode } from "react";

export function Shell({ children }: { children?: ReactNode }) {
  const pathname = usePathname();
  const [navExpanded, setNavExpanded] = useState(true);
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState({label:"NO AI SAFE MODE", tone:"warn"});
  const searchRef = useRef<HTMLInputElement>(null);
  const current = useMemo(() => NAV_GROUPS.flatMap(g => g.items).find(item => item.slug && (pathname === `/${item.slug}` || pathname.startsWith(`/${item.slug}/`))) ?? NAV_GROUPS[0].items[0], [pathname]);
  const allItems = NAV_GROUPS.flatMap(g => g.items);
  const matches = allItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 10);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setPalette(true); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") { event.preventDefault(); setNavExpanded(v => !v); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") { event.preventDefault(); setCreateOpen(true); }
      if (event.key === "Escape") { setPalette(false); setCreateOpen(false); setWorkspaceOpen(false); }
    };
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => { if (!palette) return; const frame=requestAnimationFrame(() => searchRef.current?.focus()); return () => cancelAnimationFrame(frame); }, [palette]);
  useEffect(() => {
    let mounted = true;
    void getProviderStatus().then((data) => {
      if (!mounted) return;
      const providers = data.providers || [];
      const live = providers.filter((p:any) => ["openrouter","gemini","huggingface"].includes(String(p.provider_id||"")));
      const ready = live.filter((p:any) => p.state === "READY" || p.capability_verified === true).length;
      const connected = live.filter((p:any) => ["CONNECTED","READY","DEGRADED","RATE_LIMITED","QUOTA_LIMITED"].includes(String(p.state||""))).length;
      if (ready > 0) setAiStatus({label:"AI READY", tone:"good"});
      else if (connected > 0) setAiStatus({label:"AI CONNECTED", tone:"info"});
      else setAiStatus({label:"NO AI SAFE MODE", tone:"warn"});
    }).catch(() => { if (mounted) setAiStatus({label:"AI OPTIONAL", tone:"info"}); });
    return () => { mounted = false; };
  }, []);


  return <div className={`app ${navExpanded ? "" : "nav-collapsed"}`}>
    <aside className={`sidebar ${navExpanded ? "" : "nav-collapsed"}`}>
      <div className="brand-row"><div className="brand-mark">M</div><div className="brand-meta"><div className="brand-name">Marketing Ops Workbench</div><div className="brand-sub">AI Orchestration Gateway</div></div></div>
      <button className={`workspace-switch ${workspaceOpen ? "open" : ""}`} onClick={() => setWorkspaceOpen(v => !v)} aria-expanded={workspaceOpen}><div className="workspace-left"><div className="workspace-avatar">DW</div><div><div className="workspace-title">Demo Workspace</div><div className="workspace-caption">Personal operating space</div></div></div><span className="workspace-caret"><Icon name="chevron" size={15}/></span></button>
      {workspaceOpen && <div className="workspace-menu"><div className="workspace-menu-item"><span className="workspace-avatar small">DW</span><span><strong>Demo Workspace</strong><small>Current workspace</small></span><span className="badge status-good">ACTIVE</span></div><Link href="/settings#create" className="workspace-menu-item" onClick={() => setWorkspaceOpen(false)}><span className="workspace-avatar small">+</span><span><strong>Workspace settings</strong><small>Policy and brand configuration</small></span><Icon name="arrow" size={13}/></Link></div>}
      <div className="nav-scroll">
        {NAV_GROUPS.map(group => <div className="nav-group" key={group.label}><div className="nav-group-label">{group.label}</div><nav className="nav" aria-label={`${group.label} navigation`}>{group.items.map(item => { const href = item.slug ? `/${item.slug}` : "/"; const active = item.slug ? pathname === href || pathname.startsWith(`${href}/`) : pathname === "/"; return <Link key={item.label} href={href} className={active ? "active" : ""} title={!navExpanded ? item.label : undefined}><span className="nav-icon"><Icon name={item.icon as any} size={16}/></span><span className="nav-label">{item.label}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}</Link>; })}</nav></div>)}
      </div>
      <div className="sidebar-footer"><div className="health-row"><span>System status</span><span className="health-status"><span className="health-dot"/>Operational</span></div><div className="health-row"><span>Release</span><span>v1.0.0</span></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="topbar-left"><button className="btn icon-btn nav-toggle" aria-label={navExpanded ? "Collapse navigation" : "Expand navigation"} aria-expanded={navExpanded} title={navExpanded ? "Collapse navigation (Ctrl/Cmd+B)" : "Expand navigation (Ctrl/Cmd+B)"} onClick={() => setNavExpanded(v => !v)}><Icon name={navExpanded ? "x" : "menu"} size={18}/></button><div className="crumbs"><span>Workspace</span><span>›</span><span className="crumb-current">{current.label}</span></div></div><div className="topbar-right"><button className="global-search" onClick={() => setPalette(true)} aria-label="Open command search"><Icon name="search" size={15}/><span>Search or jump…</span><span className="keycap">⌘K</span></button><button className="create-global" onClick={() => setCreateOpen(true)} aria-label="Create"><Icon name="plus" size={15}/> Create <span className="keycap">⌘N</span></button><span className={`status-chip ${aiStatus.tone}`}><span className="dot"/>{aiStatus.label}</span><button className="user-chip" onClick={() => setWorkspaceOpen(v => !v)}><div className="user-avatar">HS</div><div><div className="user-name">Operator</div><div className="user-role">Workspace owner</div></div><Icon name="chevron" size={14}/></button></div></header>
      <div className="content">{children}</div>
    </main>
    {(palette || createOpen) && <div className="modal-backdrop palette-backdrop" role="presentation" onMouseDown={(e:any) => { if (e.currentTarget === e.target) { setPalette(false); setCreateOpen(false); } }}>
      {palette && <section className="command-dialog" role="dialog" aria-modal="true" aria-label="Command search"><div className="command-input"><Icon name="search" size={17}/><input ref={searchRef} value={query} onChange={(e:any) => setQuery(e.target.value)} placeholder="Jump to a workspace area…"/><span className="keycap">ESC</span></div><div className="command-list">{(matches.length ? matches : allItems.slice(0, 8)).map(item => <Link key={item.label} href={item.slug ? `/${item.slug}` : "/"} className="command-item" onClick={() => { setPalette(false); setQuery(""); }}><Icon name={item.icon as any} size={16}/><span>{item.label}</span><span className="muted" style={{ marginLeft: "auto" }}>{item.slug ? "Open" : "Home"}</span></Link>)}</div></section>}
      {createOpen && <section className="create-dialog" role="dialog" aria-modal="true" aria-label="Create"><header className="modal-head"><div><div className="eyebrow">Quick create</div><h2>Start a new record</h2><p>Choose the Workbench object you want to create.</p></div><button className="icon-btn" onClick={() => setCreateOpen(false)} aria-label="Close"><Icon name="x" size={18}/></button></header><div className="quick-create-grid">{[{label:"Campaign",slug:"campaigns",icon:"megaphone"},{label:"Content",slug:"content-studio",icon:"file"},{label:"Task",slug:"tasks",icon:"check"},{label:"Research",slug:"research",icon:"search"},{label:"Influencer",slug:"influencer-crm",icon:"users"},{label:"Application",slug:"applications",icon:"rocket"}].map(item => <Link key={item.label} href={`/${item.slug}#create`} onClick={() => setCreateOpen(false)} className="quick-create-item"><span className="shortcut-icon"><Icon name={item.icon as any} size={16}/></span><span><strong>{item.label}</strong><small>Open builder</small></span><Icon name="arrow" size={13}/></Link>)}</div></section>}
    </div>}
  </div>;
}
