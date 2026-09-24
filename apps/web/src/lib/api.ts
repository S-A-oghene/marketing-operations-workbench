export type ApiErrorShape = {
  code?: string;
  message?: string;
  retrySafe?: boolean;
  workPreserved?: boolean;
  publicationOccurred?: string;
  nextActions?: string[];
};

const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
const DEMO_MODE = !base || process.env.NEXT_PUBLIC_DEMO_AUTH === "true";
const DEMO_STORAGE = "mow-demo-v2";

type DemoState = { workspaceId:string; userId:string; records:Record<string, any[]>; audit:any[]; requestResults:Record<string,any> };

export class MowApiError extends Error {
  code: string;
  status: number;
  details: ApiErrorShape;
  constructor(message: string, status: number, details: ApiErrorShape = {}) {
    super(message);
    this.name = "MowApiError";
    this.code = details.code || `HTTP_${status}`;
    this.status = status;
    this.details = details;
  }
}

function now(){ return new Date().toISOString(); }
function id(prefix:string){ return `${prefix}-${crypto.randomUUID().slice(0,8)}`; }
function clone<T>(value:T):T{ return JSON.parse(JSON.stringify(value)); }
function storageAvailable(){ return typeof window !== "undefined" && typeof sessionStorage !== "undefined"; }

function seedState():DemoState{
  const t="2026-09-24T08:00:00.000Z";
  return {
    workspaceId:"demo-workspace",userId:"demo-user",audit:[],requestResults:{},records:{
      campaigns:[{id:"demo-campaign",workspace_id:"demo-workspace",name:"Remote Talent Education Q4",objective:"Engagement",audience:"SMB employers",message:"Educational content about transparent remote hiring workflows",channels_json:"[\"LinkedIn\",\"Instagram\",\"Pinterest\"]",status:"ACTIVE",planned_budget:0,actual_spend:null,actual_spend_status:"UNKNOWN",approval_state:"APPROVED",start_date:"2026-09-01",end_date:"2026-12-31",account_ref:"DEMO-AD-ACCOUNT",creative_refs_json:"[\"demo-asset\"]",copy_refs_json:"[\"demo-content\"]",placement:"Feeds",currency:"USD",tracking_plan:"Use source-backed UTMs and reconcile observed outcomes in metric_snapshots.",created_at:t,updated_at:t}],
      content:[{id:"demo-content",workspace_id:"demo-workspace",campaign_id:"demo-campaign",title:"Five remote hiring workflow mistakes",content_type:"SOCIAL_POST",objective:"Engagement",audience:"SMB employers",core_message:"A transparent checklist for reviewing a remote hiring workflow",platforms_json:'["LinkedIn","Instagram"]',draft_body:"Use a five-step checklist to make remote hiring workflows easier to audit and improve.",cta:"Review the workflow checklist",source_refs_json:"[]",asset_refs_json:"[]",status:"QA",approval_state:"PENDING",scheduled_at:null,published_at:null,created_at:t,updated_at:t}],
      tasks:[{id:"demo-task",workspace_id:"demo-workspace",title:"Review content for deterministic QA",description:"Validate CTA, audience, evidence and publication readiness.",area:"content-studio",status:"TODAY",priority:"HIGH",due_at:"2026-09-24T17:00:00.000Z",owner_user_id:"demo-user",linked_record_type:"content",linked_record_id:"demo-content",next_action:"Run deterministic QA",created_at:t,updated_at:t}],
      research:[{id:"demo-research",workspace_id:"demo-workspace",topic:"Remote hiring workflow design",source_url:"https://example.invalid/research",source_title:"Synthetic source used only to exercise the interface",source_type:"UNKNOWN",published_at:null,captured_at:t,summary:"Demo-only research record. Replace with verified source material.",observations:"No measured external evidence captured.",implications:"Use only as a synthetic workflow fixture; verify evidence before operational use.",content_opportunities:"Develop checklist content after source verification.",campaign_opportunities:"Test education-led content once evidence is captured.",confidence:"UNKNOWN"}],
      influencers:[{id:"demo-influencer",workspace_id:"demo-workspace",name:"Demo Creator",platform:"LinkedIn",profile_url:"https://example.invalid/creator",niche:"Remote work",audience:"SMB operators",location_if_public:null,contact_method:null,fit_notes:"Synthetic demo record; verify real creator data before outreach.",source:"DEMO",status:"QUALIFIED",last_contact:null,next_action:"Review fit and source",campaign_ids_json:'["demo-campaign"]',created_at:t,updated_at:t}],
      outreach_messages:[{id:"demo-outreach",workspace_id:"demo-workspace",influencer_id:"demo-influencer",campaign_id:"demo-campaign",idempotency_key:"demo-outreach-key",message_body:"Hello — I’m exploring evidence-led remote hiring content and would like to discuss a focused collaboration.",status:"READY_TO_SEND",reviewed_by:"demo-user",sent_at:null,created_at:t}],
      applications:[{id:"demo-application",workspace_id:"demo-workspace",company:"Demo Company",role:"Marketing Operations Specialist",job_url:"https://example.invalid/job",source:"DEMO",date_found:t,date_applied:null,resume_version:null,cover_letter_version:null,portfolio_version:null,status:"READY_TO_SUBMIT",recruiter:null,follow_up_at:null,interview_at:null,notes:"Synthetic demo record; verify the real opportunity before submission.",outcome:null,created_at:t,updated_at:t}],
      content_calendar:[{id:"demo-calendar",workspace_id:"demo-workspace",date:"2026-09-24",time:"10:00",platform:"LinkedIn",content_id:"demo-content",campaign_id:"demo-campaign",status:"SCHEDULED",asset_status:"UNKNOWN",approval_status:"PENDING",execution_status:"NOT_EXECUTED"}],
      keywords:[{id:"demo-keyword",workspace_id:"demo-workspace",keyword:"remote hiring workflow",source:"DEMO",intent:"INFORMATIONAL",topic:"Remote hiring",volume_if_available:null,difficulty_if_available:null,priority:"NORMAL",content_opportunity:"Create a source-backed checklist",pinterest_opportunity:"Develop a visual checklist",blog_opportunity:"Expand into a long-form guide",status:"IDEA"}],
      assets:[{id:"demo-asset",workspace_id:"demo-workspace",campaign_id:"demo-campaign",filename:"demo-remote-hiring-checklist.txt",mime_type:"text/plain",asset_type:"DEMO_TEXT",platforms_json:'["LinkedIn","Pinterest"]',version:"v01",source:"DEMO",license:"DEMO",checksum:"demo-checksum",storage_ref:"demo-workspace/demo-campaign/2026/09/demo-asset.txt",approval_status:"PENDING",created_at:t,updated_at:t}],
      metric_snapshots:[{id:"demo-metric",workspace_id:"demo-workspace",platform:"LinkedIn",campaign_id:"demo-campaign",content_id:"demo-content",metric_name:"engagement_rate",value_json:"UNKNOWN",period_start:"2026-09-18",period_end:"2026-09-24",provider:"DEMO",source_ref:null,retrieved_at:t}],
      reports:[],
      portfolio_items:[{id:"demo-portfolio",workspace_id:"demo-workspace",title:"MOW end-to-end operations demo",origin_label:"DEMO",metric_status:"UNKNOWN",description:"A synthetic demonstration of the Workbench workflow; not client history.",evidence_refs_json:"[]",created_at:t,updated_at:t}],
      sops:[{id:"demo-sop",workspace_id:"demo-workspace",name:"Daily Workbench startup",cadence:"DAILY",steps_json:'["Open Workbench","Review Today","Review failed or blocked items","Review provider health"]',created_at:t,updated_at:t}],
      ai_providers:[
        {id:"demo-deterministic",workspace_id:"demo-workspace",provider_id:"deterministic",state:"READY",capabilities_json:'["generate_text","structured_output","classify","score"]',quota_state:"AVAILABLE",last_checked_at:t,limitations_json:'["No remote AI inference"]'},
        {id:"demo-openrouter",workspace_id:"demo-workspace",provider_id:"openrouter",state:"NOT_CONFIGURED",capabilities_json:'["generate_text","structured_output","classify","score"]',quota_state:"UNKNOWN",last_checked_at:null,limitations_json:'["Optional server-side key"]'},
        {id:"demo-gemini",workspace_id:"demo-workspace",provider_id:"gemini",state:"NOT_CONFIGURED",capabilities_json:'["generate_text","structured_output","classify","score"]',quota_state:"UNKNOWN",last_checked_at:null,limitations_json:'["Optional server-side key"]'},
        {id:"demo-huggingface",workspace_id:"demo-workspace",provider_id:"huggingface",state:"NOT_CONFIGURED",capabilities_json:'["generate_text","classify","score"]',quota_state:"UNKNOWN",last_checked_at:null,limitations_json:'["Optional replaceable Space"]'},
        {id:"demo-kev",workspace_id:"demo-workspace",provider_id:"kev",state:"MANUAL_ONLY",capabilities_json:'["classify","score"]',quota_state:"UNKNOWN",last_checked_at:null,limitations_json:'["Optional evaluator; no prose generation"]'}
      ],
      provider_capabilities:[],
      platform_accounts:[
        {id:"demo-meta-account",workspace_id:"demo-workspace",platform:"Meta",account_name:"Demo Meta account",external_account_ref:null,state:"AUTH_REQUIRED",created_at:t,updated_at:t},
        {id:"demo-tiktok-account",workspace_id:"demo-workspace",platform:"TikTok",account_name:"Demo TikTok account",external_account_ref:null,state:"APPROVAL_REQUIRED",created_at:t,updated_at:t},
        {id:"demo-pinterest-account",workspace_id:"demo-workspace",platform:"Pinterest",account_name:"Demo Pinterest account",external_account_ref:null,state:"TRIAL",created_at:t,updated_at:t},
        {id:"demo-x-account",workspace_id:"demo-workspace",platform:"X",account_name:"Demo X account",external_account_ref:null,state:"AUTH_REQUIRED",created_at:t,updated_at:t}
      ],
      platform_connections:[
        {id:"demo-meta-connection",workspace_id:"demo-workspace",platform:"Meta",platform_account_id:"demo-meta-account",state:"AUTH_REQUIRED",capabilities_json:"[]",scopes_json:"[]",token_ref:null,token_expires_at:null,last_probe_at:null,limitations_json:'["User authorization required"]',created_at:t,updated_at:t},
        {id:"demo-tiktok-connection",workspace_id:"demo-workspace",platform:"TikTok",platform_account_id:"demo-tiktok-account",state:"APPROVAL_REQUIRED",capabilities_json:'["direct_post"]',scopes_json:"[]",token_ref:null,token_expires_at:null,last_probe_at:null,limitations_json:'["Audit/approval required before public posting"]',created_at:t,updated_at:t},
        {id:"demo-pinterest-connection",workspace_id:"demo-workspace",platform:"Pinterest",platform_account_id:"demo-pinterest-account",state:"TRIAL",capabilities_json:'["sandbox"]',scopes_json:"[]",token_ref:null,token_expires_at:null,last_probe_at:null,limitations_json:'["Trial-only visibility/production limitations"]',created_at:t,updated_at:t},
        {id:"demo-x-connection",workspace_id:"demo-workspace",platform:"X",platform_account_id:"demo-x-account",state:"AUTH_REQUIRED",capabilities_json:"[]",scopes_json:"[]",token_ref:null,token_expires_at:null,last_probe_at:null,limitations_json:'["User authorization required"]',created_at:t,updated_at:t}
      ],
      brand_profiles:[{id:"demo-brand",workspace_id:"demo-workspace",brand_name:"Demo Workspace",audience:"SMB employers",voice:"Clear, useful and evidence-led",tone:"Professional and practical",do_rules_json:'["Be specific"]',dont_rules_json:'["Do not invent results"]',visual_rules_json:'["Accessible typography"]',cta_rules_json:'["One clear next action"]',claim_rules_json:'["Source metrics before use"]',platform_rules_json:'["Adapt natively by platform"]',created_at:t,updated_at:t}],
      prompt_templates:[],
      publication_evidence:[],
      ai_requests:[],ai_responses:[],ai_evaluations:[],ai_rules:[],projects:[],jobs:[],sessions:[]
    }
  };
}

let demoState:DemoState|undefined;
function getDemoState():DemoState{
  if(demoState)return demoState;
  if(storageAvailable()){
    try{const raw=sessionStorage.getItem(DEMO_STORAGE);if(raw){demoState=JSON.parse(raw);return demoState!;}}catch{}
  }
  demoState=seedState();persistDemo();return demoState!;
}
function persistDemo(){
  if(storageAvailable() && demoState) try{sessionStorage.setItem(DEMO_STORAGE,JSON.stringify(demoState));}catch{}
}
function tableFor(resource:string){ return resource==="content"?"content":resource; }
function addAudit(eventType:string,resourceType:string,resourceId:string,result:any){const s=getDemoState();s.audit.unshift({id:id("audit"),workspace_id:s.workspaceId,event_type:eventType,actor_id:s.userId,resource_type:resourceType,resource_id:resourceId,result_json:JSON.stringify(result),created_at:now()});persistDemo();}
function ensureArray(resource:string){const s=getDemoState();s.records[resource] ||= [];return s.records[resource];}
function updateRow(resource:string,row:any){const arr=ensureArray(resource);const idx=arr.findIndex(r=>r.id===row.id);if(idx>=0)arr[idx]={...arr[idx],...row};else arr.unshift(row);persistDemo();}

function demoResponse(body:any,status=200){return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json;charset=utf-8"}});}
function demoError(code:string,status=400,message=code):Response{return demoResponse({code,message,retrySafe:status<400,workPreserved:true,publicationOccurred:"UNKNOWN",nextActions:[status===401?"Authenticate through the approved connector":"Review the explicit state and retry only when safe"]},status);}

function readDemoPath(path:string){return path.replace(/^\/api\/?/,"");}
async function demoHandle(path:string,init:RequestInit):Promise<Response>{
  const s=getDemoState(); const url=new URL(path,"https://demo.local"); const parts=readDemoPath(url.pathname).split("/").filter(Boolean); const method=(init.method||"GET").toUpperCase();
  let body:any={}; if(init.body){try{body=JSON.parse(String(init.body));}catch{}}
  if(path.startsWith("/api/health"))return demoResponse({ok:true,version:"1.0.0",ai_optional:true,authMode:"DEMO"});
  if(path.startsWith("/api/dashboard")){
    const tasks=ensureArray("tasks").filter(r=>["TODAY","IN_PROGRESS","REVIEW"].includes(r.status)).length;
    const content=ensureArray("content").filter(r=>["DRAFT","QA"].includes(r.status)).length;
    const failed=ensureArray("jobs").filter(r=>["FAILED","DEAD_LETTER"].includes(r.status)).length;
    return demoResponse({workspaceId:s.workspaceId,tasksToday:tasks,contentAttention:content,failedJobs:failed});
  }
  if(path.startsWith("/api/providers/status")) return demoResponse({providers:clone(ensureArray("ai_providers")),connections:clone(ensureArray("platform_connections"))});
  if(path.startsWith("/api/export")) return demoResponse({exportVersion:"1.0.0",workspaceId:s.workspaceId,exportedAt:now(),data:clone(s.records),auditEvents:clone(s.audit),assetReferences:ensureArray("assets").map(a=>a.storage_ref).filter(Boolean)});
  if(path.startsWith("/api/reports/generate")&&method==="POST"){
    const idv=id("report");const records={campaigns:ensureArray("campaigns").length,content:ensureArray("content").length,tasks:ensureArray("tasks").length,metrics:ensureArray("metric_snapshots").length,outreach:ensureArray("outreach_messages").length,applications:ensureArray("applications").length,assets:ensureArray("assets").length};
    const unknown=ensureArray("metric_snapshots").filter(r=>r.value_json==="UNKNOWN").length;
    const rec={id:idv,workspace_id:s.workspaceId,period_start:"2026-09-18",period_end:"2026-09-24",measured_facts_json:JSON.stringify({counts:records,unknownMetricSnapshots:unknown}),interpretation_json:JSON.stringify({basis:"DETERMINISTIC_COUNTS_ONLY",statements:[unknown?"Some metric snapshots are explicitly UNKNOWN; do not treat them as zero.":"No UNKNOWN metric snapshots were recorded."]}),next_priorities_json:JSON.stringify(["Review QA and approval states","Review outreach next actions","Review application evidence"]),open_risks_json:JSON.stringify(unknown?["Unknown metric evidence remains unresolved."]:[]),generated_by:"DETERMINISTIC",created_at:now()};
    ensureArray("reports").unshift(rec);persistDemo();addAudit("REPORT_GENERATED","REPORT",idv,{generatedBy:"DETERMINISTIC"});return demoResponse({id:idv,record:clone(rec)});
  }
  if(path.startsWith("/api/ai/qa")&&method==="POST"){
    const parsed=body||{};const issues:string[]=[];const text=String(parsed.body||"");if(!parsed.audience)issues.push("MISSING_AUDIENCE");if(!parsed.cta)issues.push("MISSING_CTA");if(/\b\d+%|\$\d+|\b\d+\.\d+x\b/i.test(text)&&!(parsed.sourceRefs||[]).length)issues.push("UNSOURCED_QUANTITATIVE_CLAIM");return demoResponse({status:issues.length?"CHANGES_REQUIRED":"PASS",issues,checked:{audience:Boolean(parsed.audience),cta:Boolean(parsed.cta),sourceRefs:Array.isArray(parsed.sourceRefs)?parsed.sourceRefs.length:0,assetRefs:Array.isArray(parsed.assetRefs)?parsed.assetRefs.length:0},generatedBy:"DETERMINISTIC"});
  }
  if(path.startsWith("/api/ai/kev")&&method==="POST") return demoResponse({status:"UNAVAILABLE",message:"Kev is optional and unavailable in demo mode."});
  if(path.startsWith("/api/ai/decision")&&method==="POST"){addAudit("AI_HUMAN_DECISION","AI_REQUEST",body.requestId||"UNKNOWN",{decision:body.decision});return demoResponse({requestId:body.requestId,decision:body.decision,recorded:true});}
  if(path.startsWith("/api/ai/generate")&&method==="POST"){
    const output={hook:"Make remote hiring workflows easier to review with a simple five-step checklist.",value:["Define the decision criteria before outreach.","Keep source evidence attached to every claim.","Review the candidate workflow before publication."],proof:"No measured performance evidence supplied; quantitative claims remain UNKNOWN.",CTA:"Review the remote hiring checklist."};
    const reqId=body.requestId||id("request");ensureArray("ai_requests").unshift({id:reqId,workspace_id:s.workspaceId,recipe_id:body.recipeId||"social_post_create",task_type:body.taskType||"CREATIVE_GENERATION",data_class:body.dataClass||"PUBLIC",preferred_mode:body.preferredMode||"NO AI",input_hash:"demo-input",status:"SUCCESS",created_at:now()});ensureArray("ai_responses").unshift({id:id("response"),request_id:reqId,provider_id:"deterministic",model_id:null,status:"SUCCESS",output_json:JSON.stringify(output),raw_output_ref:null,input_hash:"demo-input",output_hash:"demo-output",latency_ms:0,limitations_json:JSON.stringify(["No remote provider is capability-verified in demo mode."]),received_at:now()});persistDemo();addAudit("AI_REQUEST_COMPLETED","AI_REQUEST",reqId,{provider:"deterministic",status:"SUCCESS"});return demoResponse({request:{requestId:reqId,recipeId:body.recipeId||"social_post_create",taskType:body.taskType||"CREATIVE_GENERATION",dataClass:body.dataClass||"PUBLIC",preferredMode:body.preferredMode||"NO AI"},response:{providerId:"deterministic",status:"SUCCESS",output,inputHash:"demo-input",outputHash:"demo-output",latencyMs:0,limitations:["No remote provider is capability-verified in demo mode."]}});
  }
  if(path.startsWith("/api/manual/prepare")&&method==="POST"){
    const requestId=body.requestId||id("manual");addAudit("MANUAL_AI_PREPARED","AI_REQUEST",requestId,{mode:"MANUAL_BROWSER",dataClass:body.dataClass||"LOW_SENSITIVITY"});return demoResponse({requestId,prompt:{task:body.taskType||"CREATIVE_GENERATION",recipeId:body.recipeId||"social_post_create",dataClass:body.dataClass||"LOW_SENSITIVITY",objective:"Create useful marketing work",audience:body.audience||"SMB employers",platform:body.platform||"Relevant platform",constraints:["No fabricated claims","Clear CTA","Evidence-aware"],responseFormat:"JSON"}});
  }
  if(path.startsWith("/api/manual/event")&&method==="POST"){addAudit(body.eventType||"MANUAL_EVENT","AI_REQUEST",body.requestId||"manual",{mode:"MANUAL_BROWSER"});return demoResponse({requestId:body.requestId||"manual",eventType:body.eventType,recorded:true});}
  if(parts[0]==="records"&&parts.length===2&&method==="GET") return demoResponse({data:clone(ensureArray(tableFor(parts[1])))});
  if(parts[0]==="records"&&parts.length===2&&method==="POST") return demoCreate(parts[1],body);
  if(parts[0]==="records"&&parts.length===3&&method==="GET"){const row=ensureArray(tableFor(parts[1])).find(r=>r.id===parts[2]);return row?demoResponse({data:clone(row)}):demoError("RECORD_NOT_FOUND",404);}
  if(parts[0]==="records"&&parts.length===3&&method==="PATCH"){const resource=tableFor(parts[1]);const arr=ensureArray(resource);const row=arr.find(r=>r.id===parts[2]);if(!row)return demoError("RECORD_NOT_FOUND",404);Object.assign(row,body,{updated_at:now()});persistDemo();addAudit("RECORD_UPDATED",resource,row.id,{fields:Object.keys(body)});return demoResponse({id:row.id,record:clone(row)});}
  if(parts[0]==="records"&&parts.length===4&&parts[3]==="actions"&&method==="POST") return demoAction(parts[1],parts[2],body.action||"",body);
  if(parts[0]==="content"&&parts.length===3&&method==="POST") return demoContentAction(parts[1],parts[2],body);
  return demoError("NOT_FOUND",404,"Route not found");
}

function field(body:any,...keys:string[]){for(const k of keys){if(body?.[k]!==undefined&&body[k]!==null&&String(body[k]).trim()!=="")return body[k];}return null;}
function demoCreate(resource:string,body:any):Response{
  const s=getDemoState();const idv=id(resource);const t=now();
  const common={id:idv,workspace_id:s.workspaceId,created_at:t,updated_at:t};let row:any={...common};
  if(resource==="campaigns") row={...row,name:field(body,"name")||"Untitled campaign",objective:field(body,"objective")||"UNKNOWN",audience:field(body,"audience")||"UNKNOWN",message:field(body,"message")||"UNKNOWN",channels_json:field(body,"channelsJson","channels_json")||"[]",status:"PLANNED",planned_budget:field(body,"plannedBudget","planned_budget")?Number(field(body,"plannedBudget","planned_budget")):null,actual_spend:null,actual_spend_status:"UNKNOWN",approval_state:"PENDING",start_date:field(body,"startDate","start_date"),end_date:field(body,"endDate","end_date"),account_ref:field(body,"accountRef","account_ref")||null,creative_refs_json:field(body,"creativeRefsJson","creative_refs_json")||"[]",copy_refs_json:field(body,"copyRefsJson","copy_refs_json")||"[]",placement:field(body,"placement")||null,currency:field(body,"currency")||null,tracking_plan:field(body,"trackingPlan","tracking_plan")||null};
  else if(resource==="content") row={...row,campaign_id:field(body,"campaignId","campaign_id"),title:field(body,"title")||"Untitled content",content_type:field(body,"contentType","content_type")||"SOCIAL_POST",objective:field(body,"objective")||"UNKNOWN",audience:field(body,"audience")||"UNKNOWN",core_message:field(body,"coreMessage","core_message")||"UNKNOWN",platforms_json:JSON.stringify([field(body,"platform")||"UNKNOWN"]),draft_body:field(body,"draftBody","draft_body")||"",cta:field(body,"cta")||"",source_refs_json:"[]",asset_refs_json:"[]",status:"IDEA",approval_state:"PENDING",scheduled_at:null,published_at:null};
  else if(resource==="tasks") row={...row,title:field(body,"title")||"Untitled task",description:field(body,"description")||null,area:field(body,"area")||"GENERAL",priority:field(body,"priority")||"NORMAL",status:"TODAY",due_at:field(body,"dueAt","due_at"),owner_user_id:s.userId,linked_record_type:null,linked_record_id:null,next_action:"Review task"};
  else if(resource==="research") row={...row,topic:field(body,"topic")||"UNKNOWN",source_url:field(body,"sourceUrl","source_url")||"UNKNOWN",source_title:field(body,"sourceTitle","source_title")||"UNKNOWN",source_type:field(body,"sourceType","source_type")||"UNKNOWN",published_at:null,captured_at:t,summary:field(body,"summary")||"",observations:field(body,"observations")||"",implications:field(body,"implications")||"",content_opportunities:field(body,"contentOpportunities","content_opportunities")||"",campaign_opportunities:field(body,"campaignOpportunities","campaign_opportunities")||"",confidence:field(body,"confidence")||"UNKNOWN"};
  else if(resource==="influencers") row={...row,name:field(body,"name")||"Unnamed creator",platform:field(body,"platform")||"UNKNOWN",profile_url:field(body,"profileUrl","profile_url")||"UNKNOWN",niche:field(body,"niche")||null,audience:null,location_if_public:null,contact_method:null,fit_notes:field(body,"fitNotes","fit_notes")||null,source:field(body,"source")||"UNKNOWN",status:"DISCOVERED",last_contact:null,next_action:"Research fit",campaign_ids_json:"[]"};
  else if(resource==="applications") row={...row,company:field(body,"company")||"Unknown company",role:field(body,"role")||"Unknown role",job_url:field(body,"jobUrl","job_url")||"UNKNOWN",source:field(body,"source")||"UNKNOWN",date_found:t,date_applied:null,resume_version:null,cover_letter_version:null,portfolio_version:null,status:field(body,"status")||"DRAFT",recruiter:null,follow_up_at:field(body,"followUpAt","follow_up_at"),interview_at:null,notes:field(body,"notes")||null,outcome:null};
  else if(resource==="content_calendar") row={...row,date:field(body,"date")||t.slice(0,10),time:field(body,"time")||"09:00",platform:field(body,"platform")||"UNKNOWN",content_id:field(body,"contentId","content_id")||null,campaign_id:field(body,"campaignId","campaign_id")||null,status:"PLANNED",asset_status:"UNKNOWN",approval_status:"PENDING",execution_status:"READY"};
  else if(resource==="keywords") row={...row,keyword:field(body,"keyword")||"UNKNOWN",source:field(body,"source")||"UNKNOWN",intent:field(body,"intent")||"UNKNOWN",topic:field(body,"topic")||null,volume_if_available:null,difficulty_if_available:null,priority:field(body,"priority")||"NORMAL",content_opportunity:"",pinterest_opportunity:"",blog_opportunity:"",status:"IDEA"};
  else if(resource==="outreach_messages") row={...row,influencer_id:field(body,"influencerId","influencer_id")||"UNKNOWN",campaign_id:field(body,"campaignId","campaign_id")||null,idempotency_key:id("idem"),message_body:field(body,"messageBody","message_body")||"",status:"DRAFT",reviewed_by:null,sent_at:null};
  else if(resource==="assets") row={...row,campaign_id:field(body,"campaignId","campaign_id")||null,filename:field(body,"filename")||"unnamed",mime_type:field(body,"mimeType","mime_type")||"application/octet-stream",asset_type:field(body,"assetType","asset_type")||"UNKNOWN",platforms_json:"[]",version:field(body,"version")||"v01",source:field(body,"source")||"UNKNOWN",license:field(body,"license")||null,checksum:field(body,"checksum")||"UNKNOWN",storage_ref:field(body,"storageRef","storage_ref")||"UNKNOWN",approval_status:"PENDING"};
  else if(resource==="metric_snapshots") row={...row,platform:field(body,"platform")||"UNKNOWN",campaign_id:field(body,"campaignId","campaign_id")||null,content_id:field(body,"contentId","content_id")||null,metric_name:field(body,"metricName","metric_name")||"UNKNOWN",value_json:field(body,"valueJson","value_json")||"UNKNOWN",period_start:field(body,"periodStart","period_start")||t.slice(0,10),period_end:field(body,"periodEnd","period_end")||t.slice(0,10),provider:field(body,"provider")||"MANUAL",source_ref:field(body,"sourceRef","source_ref")||null,retrieved_at:t};
  else if(resource==="portfolio_items") row={...row,title:field(body,"title")||"Untitled proof",origin_label:field(body,"originLabel","origin_label")||"SELF-DIRECTED SPEC",metric_status:field(body,"metricStatus","metric_status")||"UNKNOWN",description:field(body,"description")||"",evidence_refs_json:"[]"};
  else if(resource==="sops") row={...row,name:field(body,"name")||"Untitled SOP",cadence:field(body,"cadence")||"AD_HOC",steps_json:field(body,"stepsJson","steps_json")||"[]"};
  else if(resource==="ai_providers") row={...row,provider_id:field(body,"providerId","provider_id")||"UNKNOWN",state:field(body,"state")||"NOT_CONFIGURED",capabilities_json:field(body,"capabilitiesJson","capabilities_json")||"[]",quota_state:field(body,"quotaState","quota_state")||"UNKNOWN",last_checked_at:t,limitations_json:field(body,"limitationsJson","limitations_json")||"[]"};
  else if(resource==="provider_capabilities") row={...row,provider_id:field(body,"providerId","provider_id")||"UNKNOWN",capability:field(body,"capability")||"UNKNOWN",ready:field(body,"ready")?1:0,evidence_ref:field(body,"evidenceRef","evidence_ref")||null,checked_at:t};
  else if(resource==="platform_accounts") row={...row,platform:field(body,"platform")||"UNKNOWN",account_name:field(body,"accountName","account_name")||null,external_account_ref:field(body,"externalAccountRef","external_account_ref")||null,state:field(body,"state")||"DISCONNECTED"};
  else if(resource==="platform_connections") row={...row,platform:field(body,"platform")||"UNKNOWN",platform_account_id:field(body,"platformAccountId","platform_account_id")||null,state:field(body,"state")||"DISCONNECTED",capabilities_json:field(body,"capabilitiesJson","capabilities_json")||"[]",scopes_json:field(body,"scopesJson","scopes_json")||"[]",token_ref:null,token_expires_at:null,last_probe_at:null,limitations_json:field(body,"limitationsJson","limitations_json")||"[]"};
  else if(resource==="brand_profiles") row={...row,brand_name:field(body,"brandName","brand_name")||"Demo Workspace",audience:field(body,"audience")||"UNKNOWN",voice:field(body,"voice")||"Clear and useful",tone:field(body,"tone")||"Professional",do_rules_json:field(body,"doRulesJson","do_rules_json")||"[]",dont_rules_json:field(body,"dontRulesJson","dont_rules_json")||"[]",visual_rules_json:"[]",cta_rules_json:field(body,"ctaRulesJson","cta_rules_json")||"[]",claim_rules_json:field(body,"claimRulesJson","claim_rules_json")||"[]",platform_rules_json:"[]"};
  else if(resource==="prompt_templates") row={...row,template_id:field(body,"templateId","template_id")||id("template"),version:field(body,"version")||"1.0.0",template_text:field(body,"templateText","template_text")||"",variables_hash:"UNKNOWN",rendered_prompt_hash:null};
  else return demoError("RESOURCE_NOT_ALLOWED",400);
  ensureArray(resource).unshift(row);persistDemo();addAudit("RECORD_CREATED",resource,idv,{id:idv});return demoResponse({id:idv,workspaceId:s.workspaceId,record:clone(row)});
}

function demoContentAction(idv:string,action:string,body:any):Response{
  const arr=ensureArray("content");const row=arr.find(r=>r.id===idv);if(!row)return demoError("CONTENT_NOT_FOUND",404);const t=now();
  if(action==="transition"){
    const target=body.target;const allowed:any={IDEA:["BRIEFED","DRAFT"],BRIEFED:["DRAFT"],DRAFT:["QA"],QA:["CHANGES_REQUIRED"],CHANGES_REQUIRED:["DRAFT"],APPROVED:[],SCHEDULED:[],PUBLISHED:[],ARCHIVED:[]};if(!allowed[row.status]?.includes(target))return demoError("INVALID_STATE_TRANSITION",409,`INVALID_STATE_TRANSITION:${row.status}->${target}`);row.status=target;row.updated_at=t;persistDemo();addAudit("CONTENT_STATE_CHANGED","CONTENT",idv,{to:target});return demoResponse({id:idv,status:target,record:clone(row)});
  }
  if(action==="approve"){
    if(row.status!=="QA")return demoError("APPROVAL_REQUIRES_QA_STATE",409);row.status="APPROVED";row.approval_state="APPROVED";row.updated_at=t;persistDemo();addAudit("CONTENT_APPROVED","CONTENT",idv,{status:"APPROVED"});return demoResponse({id:idv,status:"APPROVED",record:clone(row)});
  }
  if(action==="schedule"){
    if(row.status!=="APPROVED")return demoError("SCHEDULE_REQUIRES_APPROVAL",409);row.status="SCHEDULED";row.scheduled_at=body.scheduledAt||t;row.updated_at=t;persistDemo();addAudit("POST_SCHEDULED","CONTENT",idv,{scheduledAt:row.scheduled_at});return demoResponse({id:idv,status:"SCHEDULED",scheduledAt:row.scheduled_at,record:clone(row)});
  }
  if(action==="manual-confirm"){
    if(!["APPROVED","SCHEDULED"].includes(row.status))return demoError("PUBLICATION_REQUIRES_APPROVAL_OR_SCHEDULE",409);if(ensureArray("publication_evidence").some(e=>e.content_id===idv&&e.platform===JSON.parse(row.platforms_json||"[]")[0]&&["PUBLISHED","CONFIRMED_MANUAL"].includes(e.status)))return demoError("DUPLICATE_PUBLICATION",409);const platform=body.platform||JSON.parse(row.platforms_json||"[]")[0]||"UNKNOWN";const ev={id:id("evidence"),workspace_id:getDemoState().workspaceId,content_id:idv,platform,provider:"MANUAL",status:"PUBLISHED",evidence_ref:body.evidenceRef||"MANUAL_CONFIRMED",provider_post_id:body.providerPostId||null,confirmed_by:getDemoState().userId,confirmed_at:t,request_id:null,created_at:t};ensureArray("publication_evidence").unshift(ev);row.status="PUBLISHED";row.published_at=t;row.updated_at=t;persistDemo();addAudit("POST_PUBLISHED","CONTENT",idv,{platform,evidenceId:ev.id});return demoResponse({id:idv,status:"PUBLISHED",evidence:"MANUAL_CONFIRMED",platform,evidenceId:ev.id,record:clone(row)});
  }
  return demoError("CONTENT_ACTION_NOT_ALLOWED",400);
}

function demoAction(resource:string,idv:string,action:string,body:any):Response{
  const arr=ensureArray(resource);const row=arr.find(r=>r.id===idv);if(!row)return demoError("RECORD_NOT_FOUND",404);const t=now();
  if(resource==="tasks"){
    const transitions:any={START:"IN_PROGRESS",DONE:"DONE",CANCEL:"CANCELLED",REOPEN:"TODAY",WAIT:"WAITING",REVIEW:"REVIEW"};if(!transitions[action])return demoError("TASK_ACTION_NOT_ALLOWED",400);if(action==="REOPEN"&&row.status!=="DONE")return demoError("TASK_REOPEN_REQUIRES_DONE",409);row.status=transitions[action];row.updated_at=t;
  } else if(resource==="campaigns"){
    const tr:any={ACTIVATE:"ACTIVE",PAUSE:"PAUSED",COMPLETE:"COMPLETED",ARCHIVE:"ARCHIVED"};if(!tr[action])return demoError("CAMPAIGN_ACTION_NOT_ALLOWED",400);if(action==="PAUSE"&&row.status!=="ACTIVE")return demoError("CAMPAIGN_PAUSE_REQUIRES_ACTIVE",409);row.status=tr[action];row.updated_at=t;
  } else if(resource==="influencers"){
    const tr:any={RESEARCH:"RESEARCHING",QUALIFY:"QUALIFIED",CONTACT:"CONTACTED",ARCHIVE:"ARCHIVED"};if(!tr[action])return demoError("INFLUENCER_ACTION_NOT_ALLOWED",400);row.status=tr[action];row.next_action=action==="ARCHIVE"?"No active next action":"Review fit and source";row.updated_at=t;
  } else if(resource==="applications"){
    if(action==="READY_TO_SUBMIT"){if(!["DRAFT","UNKNOWN"].includes(row.status))return demoError("APPLICATION_READY_STATE_NOT_ALLOWED",409);row.status="READY_TO_SUBMIT";}
    else if(action==="CONFIRM_SUBMISSION"){if(row.status!=="READY_TO_SUBMIT")return demoError("APPLICATION_SUBMISSION_REQUIRES_READY_STATE",409);if(body.evidence!=="USER_CONFIRMED")return demoError("SUBMISSION_CONFIRMATION_REQUIRED",400);row.status="SUBMITTED";row.date_applied=t;}
    else if(action==="INTERVIEW")row.status="INTERVIEW"; else return demoError("APPLICATION_ACTION_NOT_ALLOWED",400); row.updated_at=t;
  } else if(resource==="outreach_messages"){
    if(action==="REVIEW")row.status="REVIEW"; else if(action==="READY_TO_SEND")row.status="READY_TO_SEND"; else if(action==="MANUAL_SEND_CONFIRMED"){if(row.status!=="READY_TO_SEND")return demoError("OUTREACH_SEND_REQUIRES_READY_STATE",409);row.status="SENT";row.sent_at=t;} else return demoError("OUTREACH_ACTION_NOT_ALLOWED",400);row.reviewed_by=getDemoState().userId;
  } else if(resource==="content_calendar"){
    if(action==="MANUAL_HANDOFF"){row.execution_status="MANUAL_ONLY";row.status="MANUAL_ONLY";}
    else if(action==="MARK_PUBLISHED"){if(!body.evidence||body.evidence!=="USER_CONFIRMED")return demoError("PUBLICATION_CONFIRMATION_REQUIRED",400);if(ensureArray("publication_evidence").some(e=>e.content_id===row.content_id&&e.platform===row.platform&&["PUBLISHED","CONFIRMED_MANUAL"].includes(e.status)))return demoError("DUPLICATE_PUBLICATION",409);const ev={id:id("evidence"),workspace_id:getDemoState().workspaceId,content_id:row.content_id,platform:row.platform,provider:"MANUAL",status:"PUBLISHED",evidence_ref:body.evidenceRef||"USER_CONFIRMED",provider_post_id:body.providerPostId||null,confirmed_by:getDemoState().userId,confirmed_at:t,request_id:null,created_at:t};ensureArray("publication_evidence").unshift(ev);row.execution_status="PUBLISHED";row.status="PUBLISHED";}
    else return demoError("CALENDAR_ACTION_NOT_ALLOWED",400);
  } else if(resource==="platform_connections"){
    if(action!=="PROBE")return demoError("CONNECTION_ACTION_NOT_ALLOWED",400);
    if(!body.probeResult)return demoError("PROBE_RESULT_REQUIRED",400);
    if(body.probeResult==="READY"&&!body.evidenceRef)return demoError("PLATFORM_CAPABILITY_EVIDENCE_REQUIRED",409);
    try{JSON.parse(String(body.capabilitiesJson||row.capabilities_json||"[]"));}catch{return demoError("CAPABILITIES_JSON_INVALID",400);}
    row.state=body.probeResult;row.capabilities_json=body.capabilitiesJson||row.capabilities_json||"[]";row.last_probe_at=t;row.updated_at=t;
  } else if(resource==="ai_providers"){
    if(action!=="VERIFY_CAPABILITY"&&action!=="PROBE")return demoError("PROVIDER_ACTION_NOT_ALLOWED",400);
    if(action==="VERIFY_CAPABILITY"){if(!body.capability||!body.evidenceRef)return demoError("CAPABILITY_EVIDENCE_REQUIRED",400);const cap={id:id("cap"),workspace_id:getDemoState().workspaceId,provider_id:row.provider_id,capability:body.capability,ready:1,evidence_ref:body.evidenceRef,checked_at:t};ensureArray("provider_capabilities").unshift(cap);row.state="READY";row.last_checked_at=t;}
    else row.last_checked_at=t;
  } else return demoError("ACTION_NOT_ALLOWED",400);
  row.updated_at=t;persistDemo();addAudit("RECORD_ACTION",resource,idv,{action});return demoResponse({id:idv,record:clone(row),message:`${action} completed`});
}

function authHeaders(){
  const headers=new Headers();
  if(typeof window!=="undefined" && (process.env.NEXT_PUBLIC_DEMO_AUTH==="true" || DEMO_MODE)){
    headers.set("x-mow-workspace",sessionStorage.getItem("mow_workspace")||"demo-workspace");
    headers.set("x-mow-user",sessionStorage.getItem("mow_user")||"demo-user");
  }
  return headers;
}

export async function mowFetch(path:string,init:RequestInit={}):Promise<Response>{
  if(DEMO_MODE)return demoHandle(path,init);
  const headers=new Headers(authHeaders());new Headers(init.headers).forEach((value,key)=>headers.set(key,value));if(init.body&&!headers.has("content-type"))headers.set("content-type","application/json");return fetch(`${base}${path}`,{...init,headers});
}

export async function mowJson<T>(path:string,init:RequestInit={}):Promise<T>{
  const response=await mowFetch(path,init);const text=await response.text();let body:any={};try{body=text?JSON.parse(text):{};}catch{body={message:text||`HTTP_${response.status}`};}if(!response.ok)throw new MowApiError(body?.message||`HTTP_${response.status}`,response.status,body);return body as T;
}

export async function listRecords(resource:string,params:Record<string,string>={}){const query=new URLSearchParams(params).toString();return mowJson<{data:any[]}>(`/api/records/${resource}${query?`?${query}`:""}`);}
export async function getRecord(resource:string,idv:string){return mowJson<{data:any}>(`/api/records/${resource}/${encodeURIComponent(idv)}`);}
export async function createRecord(resource:string,data:unknown){return mowJson<any>(`/api/records/${resource}`,{method:"POST",headers:{"idempotency-key":crypto.randomUUID()},body:JSON.stringify(data)});}
export async function updateRecord(resource:string,idv:string,data:unknown){return mowJson<any>(`/api/records/${resource}/${encodeURIComponent(idv)}`,{method:"PATCH",headers:{"idempotency-key":crypto.randomUUID()},body:JSON.stringify(data)});}
export async function recordAction(resource:string,idv:string,action:string,data:unknown={}){return mowJson<any>(`/api/records/${resource}/${encodeURIComponent(idv)}/actions`,{method:"POST",headers:{"idempotency-key":crypto.randomUUID()},body:JSON.stringify({action,...((data as object)||{})})});}
export async function postAction(path:string,data:unknown={}){return mowJson<any>(path,{method:"POST",headers:{"idempotency-key":crypto.randomUUID()},body:JSON.stringify(data)});}
export async function getDashboard(){return mowJson<any>("/api/dashboard");}
export async function getProviderStatus(){return mowJson<{providers:any[];connections:any[]}>("/api/providers/status");}
export async function generateReport(){return mowJson<any>("/api/reports/generate",{method:"POST",headers:{"idempotency-key":crypto.randomUUID()},body:JSON.stringify({})});}
export async function exportWorkspace(){return mowJson<any>("/api/export");}
