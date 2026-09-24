"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { NavItem } from "../lib/navigation";
import { Icon, type IconName } from "./Icon";
import { AiGatewayPanel } from "./AiGatewayPanel";
import { ModuleInsights } from "./ModuleInsights";
import { createRecord, exportWorkspace, generateReport, listRecords, postAction, recordAction, updateRecord } from "../lib/api";

type Field = { name: string; label: string; type?: "text"|"textarea"|"select"|"date"; required?: boolean; options?: string[]; helper?: string; lookup?: string };
type Spec = {
  resource: string;
  title: string;
  description: string;
  icon: IconName;
  noun: string;
  fields: Field[];
  status?: string[];
  filterKey?: string;
  filterLabel?: string;
  filterValues?: string[];
  groupKey?: string;
  groupLabel?: string;
  viewModes?: ("List"|"Board"|"Calendar"|"Timeline")[];
  columns?: { key: string; label: string; hide?: boolean }[];
  actionLabels?: Record<string,string>;
  primaryAction?: string;
  related?: string[];
};

const specs: Record<string, Spec> = {
  today:{resource:"tasks",title:"Today",description:"A focused command surface for work that needs attention now.",icon:"today",noun:"task",fields:[{name:"title",label:"Task",required:true},{name:"description",label:"Description",type:"textarea"},{name:"priority",label:"Priority",type:"select",options:["LOW","NORMAL","HIGH","URGENT"]},{name:"dueAt",label:"Due",type:"date"}],status:["TODAY","IN_PROGRESS","WAITING","REVIEW","DONE"],viewModes:["List","Board","Calendar"],columns:[{key:"title",label:"Task"},{key:"priority",label:"Priority"},{key:"status",label:"Status"},{key:"due_at",label:"Due"}],primaryAction:"Create task"},
  tasks:{resource:"tasks",title:"Tasks",description:"Operational work, ownership, due dates and explicit next actions.",icon:"check",noun:"task",fields:[{name:"title",label:"Task",required:true},{name:"description",label:"Description",type:"textarea"},{name:"priority",label:"Priority",type:"select",options:["LOW","NORMAL","HIGH","URGENT"]},{name:"dueAt",label:"Due",type:"date"}],status:["BACKLOG","TODAY","IN_PROGRESS","WAITING","REVIEW","DONE","CANCELLED"],viewModes:["List","Board","Calendar"],columns:[{key:"title",label:"Task"},{key:"area",label:"Area"},{key:"priority",label:"Priority"},{key:"status",label:"Status"},{key:"due_at",label:"Due"}],primaryAction:"Create task"},
  "content-studio":{resource:"content",title:"Content Studio",description:"Build structured content records, move them through QA and approval, then schedule only when policy allows.",icon:"file",noun:"content item",fields:[{name:"title",label:"Title",required:true},{name:"campaignId",label:"Campaign",type:"select",lookup:"campaigns"},{name:"contentType",label:"Content type",type:"select",options:["SOCIAL_POST","BLOG_POST","EMAIL","AD_COPY","PIN"]},{name:"objective",label:"Objective",required:true},{name:"audience",label:"Audience",required:true},{name:"coreMessage",label:"Core message",required:true},{name:"platform",label:"Primary platform",type:"select",options:["LinkedIn","Instagram","Facebook","TikTok","Pinterest","X","Blog"]},{name:"cta",label:"CTA",required:true},{name:"draftBody",label:"Draft body",type:"textarea"}],status:["IDEA","BRIEFED","DRAFT","QA","CHANGES_REQUIRED","APPROVED","SCHEDULED","PUBLISHED","FAILED","ARCHIVED"],viewModes:["List","Board"],columns:[{key:"title",label:"Content"},{key:"content_type",label:"Type"},{key:"status",label:"Status"},{key:"approval_state",label:"Approval"},{key:"scheduled_at",label:"Scheduled"}],primaryAction:"New content"},
  "content-calendar":{resource:"content_calendar",title:"Content Calendar",description:"Schedule approved content with a clear execution state and asset/approval visibility.",icon:"calendar",noun:"calendar entry",fields:[{name:"date",label:"Date",type:"date",required:true},{name:"time",label:"Time",required:true},{name:"platform",label:"Platform",type:"select",options:["LinkedIn","Instagram","Facebook","TikTok","Pinterest","X","Blog"],required:true},{name:"contentId",label:"Content",type:"select",required:true,lookup:"content",helper:"Select an existing Workbench content record."},{name:"campaignId",label:"Campaign",type:"select",lookup:"campaigns"}],status:["PLANNED","READY","SCHEDULED","MANUAL_ONLY","PUBLISHED","FAILED"],viewModes:["Calendar","List"],columns:[{key:"date",label:"Date"},{key:"time",label:"Time"},{key:"platform",label:"Platform"},{key:"content_id",label:"Content"},{key:"status",label:"Status"},{key:"approval_status",label:"Approval"},{key:"execution_status",label:"Execution"}],primaryAction:"Schedule content",related:["content"]},
  "social-publisher":{resource:"content_calendar",title:"Social Publisher",description:"Prepare platform handoffs and only report publication when actual evidence exists.",icon:"send",noun:"publication task",fields:[{name:"contentId",label:"Content",type:"select",required:true,lookup:"content",helper:"Select an existing content record."},{name:"platform",label:"Platform",type:"select",options:["LinkedIn","Instagram","Facebook","TikTok","Pinterest","X"],required:true},{name:"date",label:"Date",type:"date",required:true},{name:"time",label:"Time",required:true}],status:["READY","SCHEDULED","MANUAL_ONLY","PUBLISHED","FAILED","UNKNOWN"],viewModes:["List","Board"],columns:[{key:"platform",label:"Platform"},{key:"content_id",label:"Content"},{key:"approval_status",label:"Approval"},{key:"execution_status",label:"Execution"},{key:"status",label:"Status"}],primaryAction:"Prepare handoff",related:["content"]},
  "pinterest-seo":{resource:"keywords",title:"Pinterest & SEO",description:"Capture keyword opportunities without inventing search volume or difficulty.",icon:"search",noun:"keyword",fields:[{name:"keyword",label:"Keyword",required:true},{name:"source",label:"Source",required:true},{name:"intent",label:"Intent",type:"select",options:["INFORMATIONAL","COMMERCIAL","NAVIGATIONAL","TRANSACTIONAL","UNKNOWN"]},{name:"topic",label:"Topic"},{name:"volumeIfAvailable",label:"Volume (only when evidenced)"},{name:"difficultyIfAvailable",label:"Difficulty (only when evidenced)"},{name:"priority",label:"Priority",type:"select",options:["LOW","NORMAL","HIGH"]},{name:"contentOpportunity",label:"Content opportunity",type:"textarea"},{name:"pinterestOpportunity",label:"Pinterest opportunity",type:"textarea"},{name:"blogOpportunity",label:"Blog opportunity",type:"textarea"}],status:["IDEA","RESEARCHED","PRIORITIZED","USED","UNKNOWN"],viewModes:["List","Board"],columns:[{key:"keyword",label:"Keyword"},{key:"intent",label:"Intent"},{key:"volume_if_available",label:"Volume"},{key:"difficulty_if_available",label:"Difficulty"},{key:"priority",label:"Priority"},{key:"status",label:"Status"}],primaryAction:"Add keyword"},
  "blog-studio":{resource:"content",title:"Blog Studio",description:"Research-backed long-form production with explicit fact, source and approval boundaries.",icon:"book",noun:"blog draft",fields:[{name:"title",label:"Working title",required:true},{name:"campaignId",label:"Campaign",type:"select",lookup:"campaigns"},{name:"contentType",label:"Content type",type:"select",options:["BLOG_POST"]},{name:"objective",label:"Objective",required:true},{name:"audience",label:"Audience",required:true},{name:"coreMessage",label:"Core message",required:true},{name:"cta",label:"CTA",required:true},{name:"draftBody",label:"Draft body",type:"textarea"}],status:["IDEA","BRIEFED","DRAFT","QA","CHANGES_REQUIRED","APPROVED","SCHEDULED","PUBLISHED"],viewModes:["List","Board"],columns:[{key:"title",label:"Article"},{key:"status",label:"Status"},{key:"approval_state",label:"Approval"},{key:"created_at",label:"Created"}],primaryAction:"New blog draft"},
  "influencer-crm":{resource:"influencers",title:"Influencer CRM",description:"Research, qualification, next actions and source provenance for creator relationships.",icon:"users",noun:"influencer",fields:[{name:"name",label:"Creator name",required:true},{name:"platform",label:"Platform",type:"select",options:["Instagram","TikTok","YouTube","LinkedIn","X","Pinterest"],required:true},{name:"profileUrl",label:"Profile URL",required:true},{name:"niche",label:"Niche"},{name:"source",label:"Source",required:true},{name:"fitNotes",label:"Fit notes",type:"textarea"}],status:["DISCOVERED","RESEARCHING","QUALIFIED","CONTACTED","ACTIVE","ARCHIVED"],viewModes:["List","Board"],columns:[{key:"name",label:"Creator"},{key:"platform",label:"Platform"},{key:"niche",label:"Niche"},{key:"status",label:"Status"},{key:"next_action",label:"Next action"}],primaryAction:"Add influencer"},
  outreach:{resource:"outreach_messages",title:"Outreach",description:"Draft, review and prepare human-controlled outreach without claiming a message was sent unless confirmed.",icon:"mail",noun:"outreach message",fields:[{name:"influencerId",label:"Influencer",type:"select",required:true,lookup:"influencers"},{name:"campaignId",label:"Campaign",type:"select",lookup:"campaigns"},{name:"messageBody",label:"Message",type:"textarea",required:true}],status:["DRAFT","REVIEW","READY_TO_SEND","MANUAL_ONLY","SENT","FAILED","UNKNOWN"],viewModes:["List","Board"],columns:[{key:"message_body",label:"Message"},{key:"status",label:"Status"},{key:"sent_at",label:"Sent"},{key:"created_at",label:"Created"}],primaryAction:"Draft outreach",related:["influencers"]},
  campaigns:{resource:"campaigns",title:"Campaigns",description:"Campaign planning, objectives, audiences, messages, approvals and lifecycle status.",icon:"megaphone",noun:"campaign",fields:[{name:"name",label:"Campaign name",required:true},{name:"objective",label:"Objective",required:true},{name:"audience",label:"Audience",required:true},{name:"message",label:"Core message",required:true},{name:"channelsJson",label:"Channels JSON",type:"textarea",helper:"Use platform/channel names already supported by the Workbench."},{name:"startDate",label:"Start date",type:"date"},{name:"endDate",label:"End date",type:"date"},{name:"plannedBudget",label:"Planned budget"}],status:["PLANNED","ACTIVE","PAUSED","COMPLETED","ARCHIVED"],viewModes:["List","Board"],columns:[{key:"name",label:"Campaign"},{key:"objective",label:"Objective"},{key:"status",label:"Status"},{key:"approval_state",label:"Approval"},{key:"planned_budget",label:"Planned"},{key:"actual_spend_status",label:"Actual spend"}],primaryAction:"Create campaign"},
  "meta-ads":{resource:"campaigns",title:"Meta Ads Lab",description:"Build auditable campaign structures, audience hypotheses, creative and copy matrices, placement, budget and tracking plans before any paid execution.",icon:"flask",noun:"ad plan",fields:[{name:"name",label:"Campaign / experiment name",required:true},{name:"objective",label:"Objective",required:true},{name:"accountRef",label:"Ad account reference",helper:"Store a safe account reference, never an access token."},{name:"audience",label:"Audience hypothesis",required:true},{name:"creativeRefsJson",label:"Creative references JSON",type:"textarea",helper:"Use Workbench asset IDs or source references; do not invent asset evidence."},{name:"copyRefsJson",label:"Copy references JSON",type:"textarea",helper:"Use Workbench content IDs or source references."},{name:"message",label:"Creative/message hypothesis",required:true},{name:"placement",label:"Placement"},{name:"plannedBudget",label:"Planned budget"},{name:"currency",label:"Currency",type:"select",options:["USD","EUR","GBP","UNKNOWN"]},{name:"startDate",label:"Start date",type:"date"},{name:"endDate",label:"End date",type:"date"},{name:"trackingPlan",label:"Tracking plan",type:"textarea",required:true}],status:["PLANNED","ACTIVE","PAUSED","COMPLETED","UNKNOWN"],viewModes:["List","Board"],columns:[{key:"name",label:"Plan"},{key:"objective",label:"Objective"},{key:"audience",label:"Audience"},{key:"placement",label:"Placement"},{key:"status",label:"Status"},{key:"planned_budget",label:"Planned"},{key:"actual_spend_status",label:"Actual spend"},{key:"tracking_plan",label:"Tracking"}],primaryAction:"Create ad plan"},
  analytics:{resource:"metric_snapshots",title:"Analytics",description:"Record measured facts with source, period and retrieval context. Unknown stays unknown.",icon:"chart",noun:"metric snapshot",fields:[{name:"platform",label:"Platform",type:"select",options:["LinkedIn","Instagram","Facebook","TikTok","Pinterest","X","Website","UNKNOWN"],required:true},{name:"campaignId",label:"Campaign",type:"select",lookup:"campaigns"},{name:"contentId",label:"Content",type:"select",lookup:"content"},{name:"metricName",label:"Metric",required:true},{name:"valueJson",label:"Value JSON",required:true,helper:"Use UNKNOWN when no trustworthy measurement exists."},{name:"periodStart",label:"Period start",type:"date",required:true},{name:"periodEnd",label:"Period end",type:"date",required:true},{name:"provider",label:"Source/provider",required:true},{name:"sourceRef",label:"Source reference"}],status:["MEASURED","UNKNOWN","RECONCILIATION_REQUIRED"],filterKey:"platform",filterLabel:"Platform",filterValues:["LinkedIn","Instagram","Facebook","TikTok","Pinterest","X","Website","UNKNOWN"],groupKey:"platform",groupLabel:"Platform",viewModes:["List","Board"],columns:[{key:"platform",label:"Platform"},{key:"metric_name",label:"Metric"},{key:"value_json",label:"Value"},{key:"period_start",label:"Period"},{key:"provider",label:"Provider"},{key:"source_ref",label:"Source"}],primaryAction:"Record metric"},
  assets:{resource:"assets",title:"Asset Library",description:"Manage asset metadata, provenance, checksums, approvals and storage references.",icon:"image",noun:"asset",fields:[{name:"filename",label:"Filename",required:true},{name:"mimeType",label:"MIME type",required:true},{name:"assetType",label:"Asset type",type:"select",options:["IMAGE","VIDEO","DOCUMENT","AUDIO","OTHER"],required:true},{name:"version",label:"Version",required:true},{name:"source",label:"Source",required:true},{name:"license",label:"License"},{name:"checksum",label:"Checksum",required:true},{name:"storageRef",label:"Storage reference",required:true}],status:["PENDING","APPROVED","REJECTED","PENDING_UPLOAD"],filterKey:"approval_status",filterLabel:"Approval",filterValues:["PENDING","APPROVED","REJECTED","PENDING_UPLOAD"],groupKey:"approval_status",groupLabel:"Approval",viewModes:["List","Board"],columns:[{key:"filename",label:"Asset"},{key:"mime_type",label:"Type"},{key:"version",label:"Version"},{key:"approval_status",label:"Approval"},{key:"storage_ref",label:"Storage"}],primaryAction:"Register asset metadata"},
  research:{resource:"research",title:"Research",description:"Capture source-backed observations, implications and opportunities with explicit confidence.",icon:"search",noun:"research item",fields:[{name:"topic",label:"Topic",required:true},{name:"sourceUrl",label:"Source URL",required:true},{name:"sourceTitle",label:"Source title",required:true},{name:"sourceType",label:"Source type",type:"select",options:["USER_CAPTURED","OFFICIAL","PRIMARY","SECONDARY","UNKNOWN"]},{name:"summary",label:"Summary",type:"textarea",required:true},{name:"observations",label:"Observations",type:"textarea"},{name:"implications",label:"Implications",type:"textarea"},{name:"contentOpportunities",label:"Content opportunities",type:"textarea"},{name:"campaignOpportunities",label:"Campaign opportunities",type:"textarea"},{name:"confidence",label:"Confidence",type:"select",options:["HIGH","MEDIUM","LOW","UNKNOWN"]}],status:["CAPTURED","REVIEWED","ARCHIVED"],viewModes:["List","Board"],columns:[{key:"topic",label:"Topic"},{key:"source_title",label:"Source"},{key:"confidence",label:"Confidence"},{key:"captured_at",label:"Captured"}],primaryAction:"Capture research"},
  reports:{resource:"reports",title:"Reports",description:"Separate measured facts from interpretation and suggestions; generated reports remain inspectable records.",icon:"report",noun:"report",fields:[{name:"periodStart",label:"Period start",type:"date",required:true},{name:"periodEnd",label:"Period end",type:"date",required:true},{name:"measuredFactsJson",label:"Measured facts JSON",type:"textarea",required:true},{name:"interpretationJson",label:"Interpretation JSON",type:"textarea",required:true},{name:"nextPrioritiesJson",label:"Next priorities JSON",type:"textarea"},{name:"openRisksJson",label:"Open risks JSON",type:"textarea"}],filterKey:"generated_by",filterLabel:"Generated by",filterValues:["DETERMINISTIC","HUMAN","AI"],groupKey:"generated_by",groupLabel:"Generation",viewModes:["List","Board"],columns:[{key:"period_start",label:"Period"},{key:"generated_by",label:"Generated by"},{key:"created_at",label:"Created"}],primaryAction:"Create report"},
  "proof-of-work":{resource:"portfolio_items",title:"Proof of Work",description:"Build evidence-backed work artifacts without turning self-directed work into fictional client history.",icon:"briefcase",noun:"proof item",fields:[{name:"title",label:"Title",required:true},{name:"originLabel",label:"Origin label",type:"select",options:["SELF-DIRECTED SPEC","DEMO","CLIENT-VERIFIED"]},{name:"metricStatus",label:"Metric status",type:"select",options:["UNKNOWN","NOT_AVAILABLE","MEASURED"]},{name:"description",label:"Description",type:"textarea",required:true}],filterKey:"origin_label",filterLabel:"Origin",filterValues:["SELF-DIRECTED SPEC","DEMO","CLIENT-VERIFIED"],groupKey:"origin_label",groupLabel:"Origin",viewModes:["List","Board"],columns:[{key:"title",label:"Artifact"},{key:"origin_label",label:"Origin"},{key:"metric_status",label:"Metrics"},{key:"created_at",label:"Created"}],primaryAction:"Add proof item"},
  applications:{resource:"applications",title:"Applications",description:"Track opportunities, evidence and follow-ups without claiming submission before actual confirmation.",icon:"rocket",noun:"application",fields:[{name:"company",label:"Company",required:true},{name:"role",label:"Role",required:true},{name:"jobUrl",label:"Job URL",required:true},{name:"source",label:"Source",required:true},{name:"status",label:"Status",type:"select",options:["DRAFT","READY_TO_SUBMIT","SUBMITTED","INTERVIEW","REJECTED","UNKNOWN"],required:true},{name:"followUpAt",label:"Follow-up",type:"date"},{name:"notes",label:"Notes",type:"textarea"}],status:["DRAFT","READY_TO_SUBMIT","SUBMITTED","INTERVIEW","REJECTED","UNKNOWN"],viewModes:["List","Board"],columns:[{key:"company",label:"Company"},{key:"role",label:"Role"},{key:"status",label:"Status"},{key:"follow_up_at",label:"Follow-up"},{key:"created_at",label:"Created"}],primaryAction:"Add application"},
  "ai-gateway":{resource:"ai_providers",title:"AI Gateway",description:"Provider capability, operational state, quota and provenance are first-class. No provider is a dependency.",icon:"spark",noun:"provider",fields:[{name:"providerId",label:"Provider ID",required:true},{name:"state",label:"Operational state",type:"select",options:["NOT_CONFIGURED","CONNECTED","DEGRADED","RATE_LIMITED","QUOTA_LIMITED","AUTH_REQUIRED","APPROVAL_REQUIRED","UNAVAILABLE","MANUAL_ONLY","DISABLED"],required:true,helper:"READY is granted only after a capability record with evidence exists."},{name:"capabilitiesJson",label:"Capabilities JSON",type:"textarea"},{name:"quotaState",label:"Quota state",type:"select",options:["UNKNOWN","AVAILABLE","NEAR_LIMIT","LIMITED"]},{name:"limitationsJson",label:"Limitations JSON",type:"textarea"}],status:["NOT_CONFIGURED","CONNECTED","READY","DEGRADED","RATE_LIMITED","QUOTA_LIMITED","AUTH_REQUIRED","APPROVAL_REQUIRED","UNAVAILABLE","MANUAL_ONLY","DISABLED"],filterKey:"state",filterLabel:"State",filterValues:["NOT_CONFIGURED","CONNECTED","READY","DEGRADED","RATE_LIMITED","QUOTA_LIMITED","AUTH_REQUIRED","APPROVAL_REQUIRED","UNAVAILABLE","MANUAL_ONLY","DISABLED"],groupKey:"state",groupLabel:"State",viewModes:["List","Board"],columns:[{key:"provider_id",label:"Provider"},{key:"state",label:"State"},{key:"quota_state",label:"Quota"},{key:"last_checked_at",label:"Last checked"}],primaryAction:"Add provider record"},
  integrations:{resource:"platform_connections",title:"Integrations",description:"Observe platform and provider connection state, capabilities, scopes and limitations without pretending unsupported access exists.",icon:"plug",noun:"connection",fields:[{name:"platform",label:"Platform/provider",required:true},{name:"platformAccountId",label:"Platform account",type:"select",lookup:"platform_accounts",helper:"Link the connection to a Workbench platform account when available."},{name:"state",label:"State",type:"select",options:["DISCONNECTED","CONNECTED","AUTH_REQUIRED","APPROVAL_REQUIRED","TRIAL","READY","MANUAL_ONLY","UNAVAILABLE"],required:true},{name:"capabilitiesJson",label:"Capabilities JSON",type:"textarea"},{name:"scopesJson",label:"Scopes JSON",type:"textarea"},{name:"limitationsJson",label:"Limitations JSON",type:"textarea"}],status:["DISCONNECTED","CONNECTED","AUTH_REQUIRED","APPROVAL_REQUIRED","TRIAL","READY","MANUAL_ONLY","UNAVAILABLE"],filterKey:"state",filterLabel:"State",filterValues:["DISCONNECTED","CONNECTED","AUTH_REQUIRED","APPROVAL_REQUIRED","TRIAL","READY","MANUAL_ONLY","UNAVAILABLE"],groupKey:"state",groupLabel:"State",viewModes:["List","Board"],columns:[{key:"platform",label:"Platform"},{key:"state",label:"State"},{key:"capabilities_json",label:"Capabilities"},{key:"scopes_json",label:"Scopes"},{key:"last_probe_at",label:"Last probe"}],primaryAction:"Add connection"},
  sops:{resource:"sops",title:"SOPs & Playbooks",description:"Operational procedures, incident handling and repeatable work instructions.",icon:"book",noun:"SOP",fields:[{name:"name",label:"Name",required:true},{name:"cadence",label:"Cadence",type:"select",options:["DAILY","WEEKLY","MONTHLY","INCIDENT","RELEASE","AD_HOC"]},{name:"stepsJson",label:"Steps JSON",type:"textarea",required:true}],filterKey:"cadence",filterLabel:"Cadence",filterValues:["DAILY","WEEKLY","MONTHLY","INCIDENT","RELEASE","AD_HOC"],groupKey:"cadence",groupLabel:"Cadence",viewModes:["List","Board"],columns:[{key:"name",label:"SOP"},{key:"cadence",label:"Cadence"},{key:"created_at",label:"Created"}],primaryAction:"Create SOP"},
  settings:{resource:"brand_profiles",title:"Settings",description:"Workspace-level brand, data policy and approval context. Secrets never belong here.",icon:"settings",noun:"brand profile",fields:[{name:"brandName",label:"Brand name",required:true},{name:"audience",label:"Audience",required:true},{name:"voice",label:"Voice",required:true},{name:"tone",label:"Tone",required:true},{name:"doRulesJson",label:"Do rules JSON",type:"textarea"},{name:"dontRulesJson",label:"Don't rules JSON",type:"textarea"},{name:"ctaRulesJson",label:"CTA rules JSON",type:"textarea"},{name:"claimRulesJson",label:"Claim rules JSON",type:"textarea"}],status:["ACTIVE","DRAFT"],viewModes:["List"],columns:[{key:"brand_name",label:"Brand"},{key:"audience",label:"Audience"},{key:"voice",label:"Voice"},{key:"updated_at",label:"Updated"}],primaryAction:"Save brand profile"}
};

function AiGatewayEmbed({area}:{area:string}){return <div style={{marginTop:10}}><AiGatewayPanel area={area}/></div>}

function titleFor(row:any, spec:Spec){
  return row.title || row.name || row.topic || row.keyword || row.company || row.filename || row.platform || row.provider_id || row.metric_name || row.template_id || `${spec.noun} ${String(row.id||"").slice(0,8)}`;
}
function statusClass(status:string){const s=(status||"UNKNOWN").toUpperCase();if(["READY","APPROVED","PUBLISHED","ACTIVE","DONE","ON TRACK","MEASURED","FINAL"].includes(s))return "status-good";if(["UNKNOWN","TRIAL","REVIEW","QA","WAITING","RECONCILIATION_REQUIRED","APPROVAL_REQUIRED","AUTH_REQUIRED","QUOTA_LIMITED"].includes(s))return "status-warn";if(["FAILED","REJECTED","CANCELLED","UNAVAILABLE"].includes(s))return "status-bad";return "status-info";}
function pretty(value:any){if(value===null||value===undefined||value==="")return "—";if(typeof value==="object")return JSON.stringify(value);const str=String(value);return str.length>90?`${str.slice(0,88)}…`:str;}
function displayKey(key:string){return key.replace(/_/g," ").replace(/\b\w/g,m=>m.toUpperCase());}

function defaultScheduleInput(row:any){
  if(row?.scheduled_at){
    const d=new Date(row.scheduled_at);
    if(!Number.isNaN(d.getTime())) return d.toISOString().slice(0,16);
  }
  return new Date(Date.now()+30*60000).toISOString().slice(0,16);
}

type DrawerAction = {key:string;label:string;variant?:"accent"|"default";icon?:IconName};
function actionsForRow(spec:Spec,row:any):DrawerAction[]{
  const status=String(row?.status||row?.state||row?.execution_status||"UNKNOWN").toUpperCase();
  const actions:DrawerAction[]=[];
  if(spec.resource==="content"){
    if(status==="IDEA") actions.push({key:"BRIEF",label:"Brief content",icon:"file"});
    if(status==="BRIEFED") actions.push({key:"START_DRAFT",label:"Start draft",variant:"accent",icon:"edit"});
    if(status==="DRAFT") actions.push({key:"QA",label:"Send to QA",icon:"shield"});
    if(status==="QA") actions.push({key:"APPROVE",label:"Approve",variant:"accent",icon:"check"},{key:"CHANGES",label:"Request changes",icon:"edit"});
    if(status==="CHANGES_REQUIRED") actions.push({key:"RESUME_DRAFT",label:"Resume drafting",variant:"accent",icon:"edit"});
    if(status==="APPROVED") actions.push({key:"SCHEDULE",label:"Schedule",icon:"calendar"});
    if(["APPROVED","SCHEDULED"].includes(status)) actions.push({key:"CONFIRM",label:"Confirm publication",variant:"accent",icon:"check"});
  } else if(spec.resource==="content_calendar"){
    if(status!=="PUBLISHED") actions.push({key:"MANUAL_HANDOFF",label:"Manual handoff",icon:"external"});
    if(["READY","SCHEDULED","MANUAL_ONLY"].includes(status)) actions.push({key:"MARK_PUBLISHED",label:"Confirm published",variant:"accent",icon:"check"});
  } else if(spec.resource==="tasks"){
    if(["BACKLOG","TODAY","WAITING","REVIEW"].includes(status)) actions.push({key:"START",label:"Start"});
    if(!["DONE","CANCELLED"].includes(status)) actions.push({key:"WAIT",label:"Wait"},{key:"REVIEW",label:"Review"},{key:"CANCEL",label:"Cancel"});
    if(!["DONE","CANCELLED"].includes(status)) actions.push({key:"DONE",label:"Complete",variant:"accent"});
    if(status==="DONE") actions.push({key:"REOPEN",label:"Reopen",variant:"accent"});
  } else if(spec.resource==="campaigns"){
    if(["PLANNED","PAUSED"].includes(status)) actions.push({key:"ACTIVATE",label:"Activate",variant:"accent"});
    if(status==="ACTIVE") actions.push({key:"PAUSE",label:"Pause"});
    if(!["COMPLETED","ARCHIVED"].includes(status)) actions.push({key:"COMPLETE",label:"Complete"});
    if(status!=="ARCHIVED") actions.push({key:"ARCHIVE",label:"Archive"});
  } else if(spec.resource==="influencers"){
    if(status==="DISCOVERED") actions.push({key:"RESEARCH",label:"Research"});
    if(status==="RESEARCHING") actions.push({key:"QUALIFY",label:"Qualify",variant:"accent"});
    if(status==="QUALIFIED") actions.push({key:"CONTACT",label:"Move to contact",variant:"accent"});
    if(status!=="ARCHIVED") actions.push({key:"ARCHIVE",label:"Archive"});
  } else if(spec.resource==="applications"){
    if(["DRAFT","UNKNOWN"].includes(status)) actions.push({key:"READY_TO_SUBMIT",label:"Ready to submit"});
    if(status==="SUBMITTED") actions.push({key:"INTERVIEW",label:"Record interview",variant:"accent"});
    if(status==="READY_TO_SUBMIT") actions.push({key:"CONFIRM_SUBMISSION",label:"Confirm submission",variant:"accent"});
  } else if(spec.resource==="outreach_messages"){
    if(status==="DRAFT") actions.push({key:"REVIEW",label:"Review"});
    if(status==="REVIEW") actions.push({key:"READY_TO_SEND",label:"Ready to send",variant:"accent"});
    if(status==="READY_TO_SEND") actions.push({key:"MANUAL_SEND_CONFIRMED",label:"Confirm manual send",variant:"accent"});
  } else if(spec.resource==="platform_connections"){
    actions.push({key:"PROBE",label:"Record connection check",variant:"accent",icon:"refresh"});
  } else if(spec.resource==="ai_providers"){
    if(status!=="READY") actions.push({key:"VERIFY_CAPABILITY",label:"Verify capability",variant:"accent"});
  }
  return actions;
}

function DialogFocus({children,onClose,dialogClass,ariaLabel}:{children?:any;onClose:()=>void;dialogClass:string;ariaLabel:string}){
  const ref=useRef<HTMLElement|null>(null);
  useEffect(()=>{
    const dialog=ref.current;
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const first=dialog?.querySelector<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
    first?.focus();
    return()=>{previous?.focus();};
  },[]);
  function onDialogKeyDown(event:any){
    if(event.key==="Escape"){event.preventDefault();event.stopPropagation();onClose();return;}
    if(event.key!=="Tab")return;
    const dialog=ref.current;if(!dialog)return;
    const items=Array.from(dialog.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter((el)=>!el.hasAttribute("disabled"));
    if(!items.length)return;
    const active=document.activeElement as HTMLElement|null;
    const index=active?items.indexOf(active):-1;
    if(event.shiftKey&&index<=0){event.preventDefault();items[items.length-1].focus();}
    else if(!event.shiftKey&&(index===items.length-1||index===-1)){event.preventDefault();items[0].focus();}
  }
  return <section ref={ref as any} className={dialogClass} role="dialog" aria-modal="true" aria-label={ariaLabel} onKeyDown={onDialogKeyDown}>{children}</section>;
}
function Modal({title,children,onClose,wide=false}:{title:string;children?:import("react").ReactNode;onClose:()=>void;wide?:boolean}){
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e:any)=>{if(e.currentTarget===e.target)onClose()}}><DialogFocus onClose={onClose} dialogClass={`modal ${wide?"modal-wide":""}`} ariaLabel={title}><header className="modal-head"><div><div className="eyebrow">Workbench action</div><h2>{title}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" size={18}/></button></header>{children}</DialogFocus></div>;
}
function resourceHref(resource:string){const map:Record<string,string>={campaigns:"campaigns",content:"content-studio",content_calendar:"content-calendar",research:"research",keywords:"pinterest-seo",influencers:"influencer-crm",outreach_messages:"outreach",metric_snapshots:"analytics",applications:"applications",assets:"assets",platform_connections:"integrations",ai_providers:"ai-gateway",portfolio_items:"proof-of-work",tasks:"tasks",reports:"reports"};return map[resource];}
function relatedLinks(row:any,spec:Spec){const links:[string,string,string][]=[];const add=(label:string,id:any,resource:string)=>{const href=resourceHref(resource);if(id&&href)links.push([label,String(id),href]);};add("Campaign",row.campaign_id,"campaigns");add("Content",row.content_id,"content");add("Influencer",row.influencer_id,"influencers");return links;}
function Drawer({row,spec,onClose,onAction}:{row:any;spec:Spec;onClose:()=>void;onAction:(action:string)=>void}){
  const links=relatedLinks(row,spec);
  const actions=actionsForRow(spec,row);
  return <div className="drawer-backdrop" onMouseDown={(e:any)=>{if(e.currentTarget===e.target)onClose()}}><DialogFocus onClose={onClose} dialogClass="drawer" ariaLabel={`${titleFor(row,spec)} details`}><header className="drawer-head"><div><div className="eyebrow">Record detail</div><h2>{titleFor(row,spec)}</h2><div className="drawer-sub">{row.id}</div></div><button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" size={18}/></button></header><div className="drawer-body">{links.length>0&&<section className="related-strip"><div className="surface-kicker">Linked records</div><div className="related-links">{links.map(([label,id,href])=><Link key={`${label}-${id}`} href={`/${href}?record=${encodeURIComponent(id)}`} className="related-link" onClick={onClose}><span>{label}</span><strong>{id.slice(0,8)}</strong><Icon name="arrow" size={12}/></Link>)}</div></section>}<div className="detail-grid">{Object.entries(row).filter(([k])=>k!=="workspace_id").map(([k,v])=><div className="detail-item" key={k}><div className="detail-label">{displayKey(k)}</div><div className={`detail-value ${k.endsWith("_json")?"mono":""}`}>{pretty(v)}</div></div>)}</div></div><footer className="drawer-foot"><button className="btn" onClick={()=>onAction("EDIT")}><Icon name="edit" size={14}/> Edit</button><button className="btn" onClick={()=>onAction("DUPLICATE")}><Icon name="copy" size={14}/> Duplicate</button>{actions.map(action=><button key={action.key} className={`btn ${action.variant==="accent"?"accent":""}`} onClick={()=>onAction(action.key)}>{action.icon&&<Icon name={action.icon} size={14}/>} {action.label}</button>)}</footer></DialogFocus></div>;
}

export function ModulePage({area}:{area:NavItem}){
  const spec=specs[area.slug] || specs.tasks;
  const [rows,setRows]=useState<any[]>([]);
  const [view,setView]=useState<"List"|"Board"|"Calendar"|"Timeline">((spec.viewModes?.[0]||"List") as "List"|"Board"|"Calendar"|"Timeline");
  const [query,setQuery]=useState("");
  const [statusFilter,setStatusFilter]=useState("ALL");
  const [openNew,setOpenNew]=useState(false);
  const [selected,setSelected]=useState<any|null>(null);
  const [editing,setEditing]=useState<any|null>(null);
  const [filterOpen,setFilterOpen]=useState(false);
  const [displayOpen,setDisplayOpen]=useState(false);
  const [notice,setNotice]=useState("");
  const [busy,setBusy]=useState(false);
  const [visibleCols,setVisibleCols]=useState<string[]>(spec.columns?.filter(c=>!c.hide).map(c=>c.key)||[]);
  const [form,setForm]=useState<Record<string,string>>({});
  const [lookupOptions,setLookupOptions]=useState<Record<string,any[]>>({});
  const [pendingAction,setPendingAction]=useState<{row:any;action:string}|null>(null);
  const [scheduleAt,setScheduleAt]=useState(""); const [verificationCapability,setVerificationCapability]=useState("generate_text"); const [verificationRef,setVerificationRef]=useState(""); const [probeState,setProbeState]=useState("AUTH_REQUIRED"); const [probeEvidenceRef,setProbeEvidenceRef]=useState(""); const [probeCapabilities,setProbeCapabilities]=useState("");

  const reload=useCallback(async()=>{
    setBusy(true);
    try{const r=await listRecords(spec.resource);setRows(r.data||[]);setNotice("");}
    catch(e){setNotice(e instanceof Error?e.message:"Unable to load records");}
    finally{setBusy(false);}
  },[spec.resource]);
  useEffect(()=>{void reload();},[reload]);
  useEffect(()=>{let cancelled=false;const lookups=Array.from(new Set(spec.fields.map(f=>f.lookup).filter(Boolean) as string[]));if(!lookups.length)return;Promise.all(lookups.map(async resource=>{try{const result=await listRecords(resource);return [resource,result.data||[]] as const;}catch{return [resource,[]] as const;}})).then(entries=>{if(!cancelled)setLookupOptions(Object.fromEntries(entries));});return()=>{cancelled=true;};},[spec.fields]);
  useEffect(()=>{
    const recordId=new URLSearchParams(window.location.search).get("record");
    if(!recordId)return;
    void listRecords(spec.resource).then(result=>{const match=(result.data||[]).find((row:any)=>String(row.id)===recordId);if(match) setSelected(match);}).catch(()=>{});
  },[spec.resource]);
  function setViewPersisted(next:any){setView(next);try{localStorage.setItem(`mow:view:${area.slug}`,next);}catch{}}

  const filterKey=spec.filterKey||"status";
  const filterValues=spec.filterValues?.length?spec.filterValues:Array.from(new Set(rows.map(r=>String(r[filterKey]??"")).filter(Boolean))).sort();
  const filtered=useMemo(()=>rows.filter(r=>{
    const matchesFilter=statusFilter==="ALL" || String(r[filterKey]??"").toUpperCase()===statusFilter;
    if(!matchesFilter)return false;
    if(!query.trim())return true;
    const q=query.toLowerCase();return Object.values(r).some(v=>String(v??"").toLowerCase().includes(q));
  }),[rows,statusFilter,query,filterKey]);

  const grouped=useMemo(()=>{
    const key=spec.groupKey||filterKey;
    const map:Record<string,any[]>={};for(const r of filtered){const s=String(r[key]||"UNKNOWN");(map[s] ||= []).push(r);}return map;
  },[filtered,spec.groupKey,filterKey]);

  function startCreate(){setForm({});setEditing(null);setOpenNew(true);setNotice("");}
  useEffect(()=>{if(typeof window!=="undefined"&&window.location.hash==="#create"){queueMicrotask(()=>{startCreate();window.history.replaceState({},"",window.location.pathname+window.location.search);});}},[area.slug]);
  function startEdit(row:any){const f:Record<string,string>={};for(const field of spec.fields){const db=toDbKey(field.name);const value=row[db] ?? row[field.name] ?? "";f[field.name]=Array.isArray(value)?JSON.stringify(value):String(value??"");}setForm(f);setEditing(row);setOpenNew(true);setSelected(null);}
  function toDbKey(k:string){const map:Record<string,string>={contentType:"content_type",coreMessage:"core_message",draftBody:"draft_body",campaignId:"campaign_id",contentId:"content_id",sourceUrl:"source_url",sourceTitle:"source_title",sourceType:"source_type",profileUrl:"profile_url",fitNotes:"fit_notes",plannedBudget:"planned_budget",channelsJson:"channels_json",contentOpportunity:"content_opportunity",pinterestOpportunity:"pinterest_opportunity",blogOpportunity:"blog_opportunity",startDate:"start_date",endDate:"end_date",platforms:"platforms_json",dueAt:"due_at",influencerId:"influencer_id",messageBody:"message_body",metricName:"metric_name",valueJson:"value_json",periodStart:"period_start",periodEnd:"period_end",sourceRef:"source_ref",mimeType:"mime_type",assetType:"asset_type",storageRef:"storage_ref",originLabel:"origin_label",metricStatus:"metric_status",jobUrl:"job_url",followUpAt:"follow_up_at",brandName:"brand_name",doRulesJson:"do_rules_json",dontRulesJson:"dont_rules_json",ctaRulesJson:"cta_rules_json",claimRulesJson:"claim_rules_json",platformAccountId:"platform_account_id",providerId:"provider_id",capabilitiesJson:"capabilities_json",quotaState:"quota_state",limitationsJson:"limitations_json",scopesJson:"scopes_json",stepsJson:"steps_json",measuredFactsJson:"measured_facts_json",interpretationJson:"interpretation_json",nextPrioritiesJson:"next_priorities_json",openRisksJson:"open_risks_json"};return map[k]||k;}

  async function submitForm(){setBusy(true);setNotice("");try{const body:any={};for(const field of spec.fields){const raw=form[field.name]||"";if(field.required&&!raw.trim()){setNotice(`${field.label} is required.`);setBusy(false);return;}body[field.name]=raw;}if(spec.resource==="tasks")body.area=area.slug;if(spec.resource==="campaigns"&&!body.channelsJson)body.channelsJson="[]";if(spec.resource==="content_calendar"){body.status="PLANNED";body.assetStatus="UNKNOWN";body.approvalStatus="PENDING";body.executionStatus="READY";}if(spec.resource==="outreach_messages")body.status="DRAFT";if(spec.resource==="assets")body.approvalStatus="PENDING";if(spec.resource==="metric_snapshots")body.valueJson=form.valueJson||"UNKNOWN";if(editing){const result=await updateRecord(spec.resource,editing.id,body);setRows(rs=>rs.map(r=>r.id===editing.id?{...r,...(result.record||result)}:r));setNotice("Saved. The record remains in the Workbench.");}else{const result=await createRecord(spec.resource,body);setRows(rs=>[(result.record||result),...rs]);setNotice("Created. The record is now linked to this workspace.");}setOpenNew(false);setForm({});}catch(e){setNotice(e instanceof Error?e.message:"Save failed");}finally{setBusy(false);}}

  async function executeAction(row:any,actionName:string,extra:any={}):Promise<void>{
    setBusy(true);setNotice("");
    try{
      let result:any;
      if(spec.resource==="content"){
        if(actionName==="BRIEF") result=await postAction(`/api/content/${row.id}/transition`,{target:"BRIEFED"});
        else if(actionName==="START_DRAFT") result=await postAction(`/api/content/${row.id}/transition`,{target:"DRAFT"});
        else if(actionName==="QA") result=await postAction(`/api/content/${row.id}/transition`,{target:"QA"});
        else if(actionName==="APPROVE") result=await postAction(`/api/content/${row.id}/approve`);
        else if(actionName==="SCHEDULE") result=await postAction(`/api/content/${row.id}/schedule`,{scheduledAt:extra.scheduledAt});
        else if(actionName==="CONFIRM") result=await postAction(`/api/content/${row.id}/manual-confirm`,{evidence:"MANUAL_CONFIRMED",evidenceRef:extra.evidenceRef||"Manual confirmation recorded in Workbench"});
        else if(actionName==="CHANGES") result=await postAction(`/api/content/${row.id}/transition`,{target:"CHANGES_REQUIRED"});
        else if(actionName==="RESUME_DRAFT") result=await postAction(`/api/content/${row.id}/transition`,{target:"DRAFT"});
        else throw new Error("CONTENT_ACTION_NOT_ALLOWED");
      } else if(spec.resource==="ai_providers"&&actionName==="VERIFY_CAPABILITY") {
        result=await recordAction(spec.resource,row.id,actionName,{capability:extra.capability,evidenceRef:extra.evidenceRef});
      } else if(spec.resource==="platform_connections"&&actionName==="PROBE") {
        result=await recordAction(spec.resource,row.id,actionName,{probeResult:extra.probeResult,evidenceRef:extra.evidenceRef,capabilitiesJson:extra.capabilitiesJson});
      } else {
        const payload=["CONFIRM_SUBMISSION","MANUAL_SEND_CONFIRMED","MARK_PUBLISHED"].includes(actionName)
          ? {evidence:"USER_CONFIRMED",scheduledAt:extra.scheduledAt,evidenceRef:extra.evidenceRef}
          : {};
        result=await recordAction(spec.resource,row.id,actionName,payload);
      }
      const patch=result?.record||result||{};
      setRows(rs=>rs.map(r=>r.id===row.id?{...r,...patch}:r));
      setSelected((current:any)=>current?.id===row.id?{...current,...patch}:current);
      setNotice(result?.message||`Action ${actionName} completed.`);
    }catch(e){setNotice(e instanceof Error?e.message:`Action ${actionName} failed`);}finally{setBusy(false);}
  }

  function requestAction(row:any,actionName:string){
    if(actionName==="EDIT"){startEdit(row);return;}
    if(actionName==="DUPLICATE"){
      const next:Record<string,string>={};
      for(const f of spec.fields){const db=toDbKey(f.name);if(row[db]!==undefined)next[f.name]=String(row[db]??"");}
      setForm(next);setEditing(null);setSelected(null);setOpenNew(true);return;
    }
    if(actionName==="SCHEDULE"){
      setScheduleAt(defaultScheduleInput(row));
      setPendingAction({row,action:actionName});return;
    }
    if(actionName==="VERIFY_CAPABILITY"){
      setVerificationCapability("generate_text");
      setVerificationRef("");
      setPendingAction({row,action:actionName});return;
    }
    if(["CONFIRM","MARK_PUBLISHED","CONFIRM_SUBMISSION","MANUAL_SEND_CONFIRMED"].includes(actionName)){
      setPendingAction({row,action:actionName});return;
    }
    void executeAction(row,actionName);
  }

  async function confirmPending(){
    if(!pendingAction)return;
    const {row,action:actionName}=pendingAction;
    setPendingAction(null);
    if(actionName==="SCHEDULE"){
      if(!scheduleAt){setNotice("Choose a schedule time before confirming.");return;}
      await executeAction(row,actionName,{scheduledAt:new Date(scheduleAt).toISOString()});
      return;
    }
    if(actionName==="VERIFY_CAPABILITY"){
      if(!verificationCapability.trim()||!verificationRef.trim()){setNotice("Capability and evidence reference are required.");return;}
      await executeAction(row,actionName,{capability:verificationCapability,evidenceRef:verificationRef});
      return;
    }
    await executeAction(row,actionName,{evidenceRef:"Human operator confirmation recorded in Workbench"});
  }

  async function doExport(format:"json"|"csv"="json"){setBusy(true);try{const data=await exportWorkspace();const stamp=new Date().toISOString().slice(0,10);if(format==="json"){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`mow-workspace-export-${stamp}.json`;a.click();URL.revokeObjectURL(url);setNotice("Workspace JSON export downloaded.");}else{const lines:string[]=["resource,record_id,field,value"];for(const [resource,records] of Object.entries(data.data||{})){for(const record of records as any[]){for(const [field,value] of Object.entries(record)){const text=typeof value==="object"&&value!==null?JSON.stringify(value):String(value??"");const escaped=text.replace(/"/g,'""');lines.push(`"${resource}","${String((record as any).id||"").replace(/"/g,'""')}","${field.replace(/"/g,'""')}","${escaped}"`);}}}const blob=new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`mow-workspace-export-${stamp}.csv`;a.click();URL.revokeObjectURL(url);setNotice("Workspace CSV export downloaded.");}}catch(e){setNotice(e instanceof Error?e.message:"Export failed");}finally{setBusy(false);}}

  return <div className="page-shell">
    <section className="page-header page-header-rich"><div className="page-title-wrap"><div className="eyebrow">Workspace / {area.label}</div><div className="title-line"><div className="title-icon"><Icon name={spec.icon} size={20}/></div><div><h1>{spec.title}</h1><p>{spec.description}</p></div></div></div><div className="header-actions"><div className="export-actions"><button className="btn" onClick={()=>void doExport("json")} disabled={busy}><Icon name="download" size={14}/> JSON</button><button className="btn" onClick={()=>void doExport("csv")} disabled={busy}>CSV</button></div>{area.slug==="reports"&&<button className="btn" onClick={async()=>{setBusy(true);try{const r=await generateReport();setRows(rs=>[r.record||r,...rs]);setNotice("Report generated from current measured workspace records.");}catch(e){setNotice(e instanceof Error?e.message:"Report generation failed");}finally{setBusy(false);}}} disabled={busy}><Icon name="spark" size={14}/> Generate from data</button>}<button className="btn accent" onClick={startCreate}><Icon name="plus" size={15}/> {spec.primaryAction || `Create ${spec.noun}`}</button></div></section>

    <ModuleInsights area={area.slug} rows={filtered} onCreate={startCreate} onSelect={setSelected}/>

    <section className="context-bar"><div className="context-left"><span className="live-dot"/> <strong>Workspace record</strong><span className="muted">{rows.length} loaded · {filtered.length} shown</span>{busy&&<span className="loading-inline">Working…</span>}</div><div className="context-right"><span className="badge status-good">AI OPTIONAL</span><span className="badge">HUMAN REVIEW</span><span className="badge">EVIDENCE FIRST</span></div></section>

    <section className="toolbar card-slim"><div className="toolbar-main"><div className="segmented">{(spec.viewModes||["List"]).map(v=><button key={v} className={view===v?"active":""} onClick={()=>setViewPersisted(v)}>{v}</button>)}</div>{spec.filterKey&&<button className={`btn ${filterOpen?"active-outline":""}`} onClick={()=>setFilterOpen(v=>!v)}><Icon name="filter" size={14}/> {spec.filterLabel||"Filters"}{statusFilter!=="ALL"&&<span className="count-pill">1</span>}</button>}<button className={`btn ${displayOpen?"active-outline":""}`} onClick={()=>setDisplayOpen(v=>!v)}><Icon name="sliders" size={14}/> Display</button><button className="btn" onClick={reload} disabled={busy}><Icon name="refresh" size={14}/> Refresh</button></div><div className="toolbar-search"><Icon name="search" size={15}/><input value={query} onChange={(e:any)=>setQuery(e.target.value)} placeholder={`Search ${spec.title.toLowerCase()}…`}/>{query&&<button className="search-clear" onClick={()=>setQuery("")} aria-label="Clear search"><Icon name="x" size={13}/></button>}</div></section>

    {filterOpen&&<section className="toolbar-popover card"><div><div className="popover-title">Filter records</div><p className="muted tiny">Filter by {spec.filterLabel||"operational state"}. Nothing is inferred.</p></div><div className="filter-options"><button className={statusFilter==="ALL"?"chip active":"chip"} onClick={()=>setStatusFilter("ALL")}>All</button>{(filterValues||[]).map(s=><button key={s} className={statusFilter===s.toUpperCase()?"chip active":"chip"} onClick={()=>setStatusFilter(s.toUpperCase())}>{s}</button>)}</div></section>}
    {displayOpen&&<section className="toolbar-popover card"><div className="popover-title">Display columns</div><div className="filter-options">{(spec.columns||[]).map(c=><label className="check-chip" key={c.key}><input type="checkbox" checked={visibleCols.includes(c.key)} onChange={(e:any)=>setVisibleCols(v=>e.target.checked?[...v,c.key]:v.filter(k=>k!==c.key))}/>{c.label}</label>)}</div></section>}

    {notice&&<div className={`notice ${/failed|error|unable|required|blocked/i.test(notice)?"notice-bad":"notice-good"}`} role="status"><Icon name={/failed|error|unable|required|blocked/i.test(notice)?"warning":"check"} size={14}/><span>{notice}</span><button onClick={()=>setNotice("")} aria-label="Dismiss"><Icon name="x" size={13}/></button></div>}

    {view==="List"&&<section className="card work-surface"><div className="surface-head"><div><span className="surface-kicker">Live records</span><h2>{spec.title} queue</h2></div><span className="muted tiny">Select a row to inspect, edit or advance the record.</span></div><div className="table-wrap"><table className="table dense-table"><thead><tr>{(spec.columns||[{key:"title",label:"Record"},{key:"status",label:"Status"}]).filter(c=>visibleCols.includes(c.key)).map(c=><th key={c.key}>{c.label}</th>)}<th className="action-col">Actions</th></tr></thead><tbody>{filtered.map(row=><tr key={row.id} onClick={()=>setSelected(row)} className="clickable-row">{(spec.columns||[]).filter(c=>visibleCols.includes(c.key)).map(c=><td key={c.key}>{c.key==="status"||c.key==="approval_state"||c.key==="execution_status"||c.key==="actual_spend_status"||c.key==="metric_status"||c.key==="state"||c.key==="quota_state"||c.key===spec.filterKey?<span className={`status-pill ${statusClass(String(row[c.key]||"UNKNOWN"))}`}>{String(row[c.key]||"UNKNOWN")}</span>:<span className={c.key.endsWith("_json")||c.key==="id"?"mono":""}>{pretty(row[c.key])}</span>}</td>)}<td className="action-col"><div className="row-actions" onClick={(e:any)=>e.stopPropagation()}><button className="icon-btn" onClick={()=>setSelected(row)} aria-label={`Open ${titleFor(row,spec)}`}><Icon name="arrow" size={14}/></button><button className="icon-btn" onClick={()=>startEdit(row)} aria-label="Edit"><Icon name="edit" size={14}/></button><button className="icon-btn" onClick={()=>setSelected(row)} aria-label={`More actions for ${titleFor(row,spec)}`}><Icon name="more-h" size={16}/></button></div></td></tr>)}</tbody></table>{filtered.length===0&&<div className="empty-state"><div className="empty-icon"><Icon name={query?"search":spec.icon} size={19}/></div><h3>{query?"No matching records":"No records yet"}</h3><p>{query?"Try another search or clear the filter.":`Create a ${spec.noun} to start building the real workspace record.`}</p>{!query&&<button className="btn accent" onClick={startCreate}><Icon name="plus" size={14}/> {spec.primaryAction || `Create ${spec.noun}`}</button>}</div>}</div></section>}

    {view==="Board"&&<section className="board-grid">{Object.entries(grouped).length===0?<div className="card empty-state"><div className="empty-icon"><Icon name={spec.icon} size={19}/></div><h3>No records in this board</h3><p>Create a record or adjust filters to populate the workflow.</p><button className="btn accent" onClick={startCreate}><Icon name="plus" size={14}/> {spec.primaryAction || "Create"}</button></div>:Object.entries(grouped).map(([group,items])=><div className="board-column" key={group}><header className="board-column-head"><div><div className="eyebrow">{spec.groupLabel||"Group"}</div><h3>{group}</h3></div><span className="count-pill">{items.length}</span></header>{items.map((r:any)=><article className="board-card" key={r.id} onClick={()=>setSelected(r)}><div className="board-card-top"><span className={`status-pill ${statusClass(group)}`}>{group}</span><button className="icon-btn" onClick={(e:any)=>{e.stopPropagation();startEdit(r)}} aria-label="Edit"><Icon name="edit" size={13}/></button></div><h4>{titleFor(r,spec)}</h4><p>{pretty(r.objective||r.description||r.message||r.next_action||r.metric_name)}</p><div className="board-meta"><span>{String(r.id).slice(0,8)}</span><span>{pretty(r.updated_at||r.created_at)}</span></div></article>)}</div>)}</section>}

    {view==="Calendar"&&<section className="card calendar-surface"><div className="calendar-head"><div><div className="surface-kicker">Scheduling surface</div><h2>Calendar</h2></div><div className="calendar-legend"><span><i className="legend-dot"/>Scheduled</span><span><i className="legend-dot warn"/>Needs review</span><span><i className="legend-dot bad"/>Blocked</span></div></div><div className="calendar-grid"><div className="weekday-row">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><div key={d}>{d}</div>)}</div><div className="month-grid">{(()=>{const now=new Date();const first=new Date(now.getFullYear(),now.getMonth(),1);const start=(first.getDay()+6)%7;const days=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();return Array.from({length:42},(_,i)=>{const offset=i-start+1;const inMonth=offset>=1&&offset<=days;const day=offset;const dayRows=inMonth?filtered.filter(r=>{const raw=r.date||r.scheduled_at||r.due_at||r.period_start||"";return raw&&(()=>{const d=new Date(raw);return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()&&d.getDate()===day;})()}):[];return <div className={`calendar-cell ${inMonth?"":"muted-month"}`} key={i}><div className="calendar-date">{inMonth?day:""}</div>{dayRows.slice(0,3).map((r:any)=><button key={r.id} className={`calendar-event ${statusClass(r.status||r.execution_status||r[spec.filterKey||""])}`} onClick={()=>setSelected(r)}>{titleFor(r,spec)}</button>)}</div>;})})()}</div></div></section>}

    {view==="Timeline"&&<section className="card timeline-surface"><div className="surface-head"><div><span className="surface-kicker">Chronology</span><h2>Timeline</h2></div></div>{filtered.length===0?<div className="empty-state"><h3>No timeline records</h3></div>:<div className="timeline-list">{filtered.map((r:any,i:number)=><div className="timeline-row" key={r.id}><div className="timeline-dot"/><div className="timeline-line"/><div className="timeline-content"><div className="timeline-top"><strong>{titleFor(r,spec)}</strong><span className={`status-pill ${statusClass(r.status||"UNKNOWN")}`}>{r.status||"UNKNOWN"}</span></div><div className="muted tiny">{pretty(r.created_at||r.date||r.period_start)} · {pretty(r.next_action||r.description||r.objective)}</div></div></div>)}</div>}</section>}

    {area.slug==="ai-gateway"&&<AiGatewayEmbed area={area.slug}/>}
    {openNew&&<Modal title={editing?`Edit ${spec.noun}`:`${spec.primaryAction || `Create ${spec.noun}`}`} onClose={()=>setOpenNew(false)} wide><div className="form-layout">{spec.fields.map(f=><label className={`field ${f.type==="textarea"?"field-full":""}`} key={f.name}><span>{f.label}{f.required&&<em>*</em>}</span>{f.type==="textarea"?<textarea value={form[f.name]||""} onChange={(e:any)=>setForm(v=>({...v,[f.name]:e.target.value}))} placeholder={f.helper||""} rows={5}/>:f.type==="select"?<select value={form[f.name]||""} onChange={(e:any)=>setForm(v=>({...v,[f.name]:e.target.value}))}><option value="">Select…</option>{f.lookup?(lookupOptions[f.lookup]||[]).map((o:any)=><option key={o.id} value={o.id}>{titleFor(o,{noun:f.lookup} as Spec)} · {String(o.id).slice(0,8)}</option>):(f.options||[]).map(o=><option key={o} value={o}>{o}</option>)}</select>:<input type={f.type||"text"} value={form[f.name]||""} onChange={(e:any)=>setForm(v=>({...v,[f.name]:e.target.value}))} placeholder={f.helper||""}/>} {f.helper&&<small>{f.helper}</small>}</label>)}</div><div className="modal-foot"><button className="btn" onClick={()=>setOpenNew(false)}>Cancel</button><button className="btn accent" onClick={submitForm} disabled={busy}>{busy?"Saving…":"Save record"}</button></div></Modal>}

    {pendingAction&&<Modal title={pendingAction.action==="SCHEDULE"?`Schedule ${spec.noun}`:pendingAction.action==="VERIFY_CAPABILITY"?"Verify provider capability":pendingAction.action==="PROBE"?"Record connector probe":"Confirm consequential action"} onClose={()=>setPendingAction(null)}><div className="confirm-copy"><div className="eyebrow">Human authority gate</div><h3>{pendingAction.action==="SCHEDULE"?`Choose when ${titleFor(pendingAction.row,spec)} should be scheduled.`:pendingAction.action==="VERIFY_CAPABILITY"?`Record a capability verification for ${titleFor(pendingAction.row,spec)}.`:pendingAction.action==="PROBE"?`Record the observed platform connection state for ${titleFor(pendingAction.row,spec)}.`:`Confirm “${pendingAction.action.replace(/_/g," ").toLowerCase()}” for ${titleFor(pendingAction.row,spec)}.`}</h3><p className="muted">{pendingAction.action==="VERIFY_CAPABILITY"?"READY is only allowed when the Workbench has explicit capability evidence. Enter the capability tested and the evidence reference (for example a test report, ticket, or controlled verification record).":pendingAction.action==="PROBE"?"Record only what the connector probe actually observed. READY must not be claimed without capability evidence.":"The Workbench will record this decision as an explicit operator action. It will not infer publication, submission or sending."}</p>{pendingAction.action==="SCHEDULE"&&<label className="field"><span>Scheduled time</span><input type="datetime-local" value={scheduleAt} onChange={(e:any)=>setScheduleAt(e.target.value)} required/></label>}{pendingAction.action==="VERIFY_CAPABILITY"&&<div className="form-layout"><label className="field"><span>Capability</span><input value={verificationCapability} onChange={(e:any)=>setVerificationCapability(e.target.value)} placeholder="generate_text" required/></label><label className="field"><span>Evidence reference</span><input value={verificationRef} onChange={(e:any)=>setVerificationRef(e.target.value)} placeholder="Release test / ticket / verification record" required/></label></div>}{pendingAction.action==="PROBE"&&<div className="form-layout"><label className="field"><span>Observed connector state</span><select value={probeState} onChange={(e:any)=>setProbeState(e.target.value)}><option value="AUTH_REQUIRED">AUTH_REQUIRED</option><option value="APPROVAL_REQUIRED">APPROVAL_REQUIRED</option><option value="TRIAL">TRIAL</option><option value="MANUAL_ONLY">MANUAL_ONLY</option><option value="API_CONNECTED">API_CONNECTED</option><option value="DIRECT_POST_CONFIGURED">DIRECT_POST_CONFIGURED</option><option value="PUBLISH_SCOPE_APPROVED">PUBLISH_SCOPE_APPROVED</option><option value="AUDITED">AUDITED</option><option value="PUBLIC_PUBLISH_READY">PUBLIC_PUBLISH_READY</option><option value="UNAVAILABLE">UNAVAILABLE</option></select></label><label className="field"><span>Evidence reference</span><input value={probeEvidenceRef} onChange={(e:any)=>setProbeEvidenceRef(e.target.value)} placeholder="Probe result / ticket / platform evidence"/></label><label className="field field-full"><span>Capabilities JSON</span><textarea value={probeCapabilities} onChange={(e:any)=>setProbeCapabilities(e.target.value)} placeholder='["CREATE_CONTENT","READ_METRICS"]' rows={3}/></label></div>}<div className="modal-foot"><button className="btn" onClick={()=>setPendingAction(null)}>Cancel</button><button className="btn accent" onClick={confirmPending} disabled={(pendingAction.action==="SCHEDULE"&&!scheduleAt)||(pendingAction.action==="VERIFY_CAPABILITY"&&(!verificationCapability.trim()||!verificationRef.trim()))}>{pendingAction.action==="SCHEDULE"?"Schedule":pendingAction.action==="VERIFY_CAPABILITY"?"Record verification":pendingAction.action==="PROBE"?"Save probe":"Confirm action"}</button></div></div></Modal>}
    {selected&&<Drawer row={selected} spec={spec} onClose={()=>setSelected(null)} onAction={a=>requestAction(selected,a)}/>} 
  </div>;
}
