"use client";
import { useEffect, useMemo, useState } from "react";
import { getRecipe } from "@mow/recipes";
import { Icon } from "./Icon";
import { listRecords, mowJson, MowApiError, postAction } from "../lib/api";

type Candidate={requestId:string;providerId:string;modelId?:string;output:any;status:string;inputHash?:string;outputHash?:string;latencyMs?:number;limitations?:string[]};
const modes=[['AUTO','Gateway chooses eligible provider'],['CREATIVE','Idea generation'],['FAST','Low-latency'],['REASONING','Structured reasoning'],['LONG_FORM','Long-form drafting'],['BROWSER AI','Human browser handoff'],['LOCAL ONLY','No remote inference'],['NO AI','Deterministic templates']];

export function AiGatewayPanel({area}:{area:string}){
  const defaultRecipe=area==="blog-studio"?"blog_outline":area==="pinterest-seo"?"pinterest_pin_create":area==="applications"?"application_tailoring":"social_post_create";
  const recipe=getRecipe(defaultRecipe)||getRecipe("social_post_create");
  const [mode,setMode]=useState("NO AI");
  const [dataClass,setDataClass]=useState("PUBLIC");
  const [task,setTask]=useState(area.replaceAll("-"," "));
  const [status,setStatus]=useState("READY");
  const [candidates,setCandidates]=useState<Candidate[]>([]);
  const [qa,setQa]=useState<any>(null);
  const [kev,setKev]=useState<any>(null);
  const [decision,setDecision]=useState("PENDING");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [audience,setAudience]=useState("Target marketing audience");
  const [platform,setPlatform]=useState(area==="blog-studio"?"Blog":"Relevant platform");
  const [brandName,setBrandName]=useState("");
  const [providerHealth,setProviderHealth]=useState<any[]>([]);

  useEffect(()=>{let mounted=true;Promise.all([listRecords("brand_profiles"),mowJson<any>("/api/providers/status")]).then(([brands,health])=>{if(!mounted)return;const brand=brands.data?.[0];if(brand){setBrandName(brand.brand_name||"");setAudience(brand.audience||"Target marketing audience");}setProviderHealth(health.providers||[]);}).catch(()=>{});return()=>{mounted=false;}},[]);
  const eligible=useMemo(()=>mode==="NO AI"?["deterministic"]:mode==="BROWSER AI"?["manual-browser"]:[...providerHealth.filter(p=>p.state==="READY").map(p=>p.provider_id),"deterministic"],[mode,providerHealth]);
  const primaryOutput=candidates[0]?.output;

  async function generate(){
    setBusy(true);setError("");setStatus("RUNNING");setCandidates([]);setQa(null);setKev(null);setDecision("PENDING");
    const request={requestId:crypto.randomUUID(),recipeId:recipe?.id||defaultRecipe,taskType:recipe?.taskType||"CREATIVE_GENERATION",objective:"Create useful marketing work for the selected task",audience,platform,brandContext:brandName,constraints:["clear objective","human approval","no fabricated claims"],inputs:[{name:"task",value:task,dataClass}],dataClass,preferredMode:mode,maxCandidates:5,allowExternalInference:mode!=="NO AI"&&mode!=="BROWSER AI",requireHumanApproval:true};
    try{
      if(mode==="BROWSER AI"){
        const prepared=await postAction("/api/manual/prepare",request);
        setCandidates([{requestId:request.requestId,providerId:"manual-browser",output:prepared.prompt||request,status:"PROMPT_READY"}]);
        setStatus("REVIEW_PENDING");
      }else if(mode==="NO AI"){
        const output={hook:"Make remote hiring workflows easier to review with a practical five-step checklist.",value:["Define decision criteria before outreach.","Attach source evidence to every factual claim.","Review the workflow before publishing or submitting.","Keep platform variants linked to the same campaign record."],proof:"No measured performance evidence was supplied for this demo run; quantitative claims remain UNKNOWN.",CTA:"Review the remote hiring checklist."};
        setCandidates([{requestId:request.requestId,providerId:"deterministic",output,status:"SUCCESS"}]);
        setStatus("REVIEW_PENDING");
      }else{
        const data=await mowJson<any>("/api/ai/generate",{method:"POST",headers:{"idempotency-key":crypto.randomUUID()},body:JSON.stringify(request)});
        const response=data.response||{};
        setCandidates([{requestId:request.requestId,providerId:response.providerId||"UNKNOWN",modelId:response.modelId,output:response.output??null,status:response.status||"UNKNOWN",inputHash:response.inputHash,outputHash:response.outputHash,latencyMs:response.latencyMs,limitations:response.limitations||[]}]);
        setStatus(response.status==="SUCCESS"?"QA_PENDING":response.status||"UNKNOWN");
      }
    }catch(e){
      const message=e instanceof MowApiError?`${e.code}: ${e.message}`:e instanceof Error?e.message:"Generation failed";
      setError(message);setCandidates([]);setStatus("DEGRADED");
    }finally{setBusy(false);}
  }

  async function runQa(){
    if(!primaryOutput){setError("Generate or prepare a candidate before QA.");return;}
    setBusy(true);setError("");
    try{
      const result=await mowJson<any>("/api/ai/qa",{method:"POST",body:JSON.stringify({audience,objective:"Create useful marketing work for the selected task",platform,cta:primaryOutput?.CTA||primaryOutput?.cta||"",body:JSON.stringify(primaryOutput),sourceRefs:[],assetRefs:[],approvalRequired:true})});
      setQa(result);setStatus("REVIEW_PENDING");
    }catch(e){setError(e instanceof Error?e.message:"QA failed");}finally{setBusy(false);}
  }

  async function runKev(){
    if(!primaryOutput){setError("Generate a candidate before evaluation.");return;}
    setBusy(true);setError("");
    try{const result=await postAction("/api/ai/kev",{requestId:candidates[0]?.requestId||crypto.randomUUID(),candidate:primaryOutput,task:"Evaluate marketing fit against deterministic QA"});setKev(result);}catch(e){setKev({status:"UNAVAILABLE",message:e instanceof Error?e.message:"Kev unavailable"});}finally{setBusy(false);}
  }

  async function setHumanDecision(next:string){
    const requestId=candidates[0]?.requestId;
    if(!requestId){setError("Generate a candidate before recording a human decision.");return;}
    setBusy(true);setError("");
    try{await postAction("/api/ai/decision",{requestId,decision:next});setDecision(next);}catch(e){setError(e instanceof Error?e.message:"Unable to record human decision");}finally{setBusy(false);}
  }

  return <section className="card ai-workbench"><div className="card-pad"><div className="section-title"><div><div className="surface-kicker">AI Orchestration Gateway</div><h2>Generate without losing control</h2><p>Every run exposes task, recipe, data policy, provider state, QA and human review as one connected workflow.</p></div><span className={`status-pill ${status==="REVIEW_PENDING"?"status-warn":status==="DEGRADED"?"status-bad":"status-good"}`}>{status}</span></div><div className="ai-progress"><Step n="1" label="Request" active/><Step n="2" label="Provider" active={status!=="READY"}/><Step n="3" label="QA" active={Boolean(qa)}/><Step n="4" label="Human review" active={decision!=="PENDING"}/></div></div>
    <div className="ai-split"><div className="ai-config"><div className="form-layout form-layout-ai"><label className="field"><span>Task</span><input value={task} onChange={(e:any)=>setTask(e.target.value)}/></label><label className="field"><span>Audience</span><input value={audience} onChange={(e:any)=>setAudience(e.target.value)}/></label><label className="field"><span>Platform</span><input value={platform} onChange={(e:any)=>setPlatform(e.target.value)}/></label><label className="field"><span>Recipe</span><input readOnly value={recipe?.id||defaultRecipe}/></label><label className="field"><span>Data class</span><select value={dataClass} onChange={(e:any)=>setDataClass(e.target.value)}><option>PUBLIC</option><option>LOW_SENSITIVITY</option><option>CONFIDENTIAL</option><option>PERSONAL</option><option>RESTRICTED</option></select></label><div className="field"><span>Eligible providers</span><div className="pill-row">{eligible.map(p=><span className="badge" key={p}>{p}</span>)}</div></div></div><div className="field" style={{marginTop:16}}><span>Provider mode</span><div className="mode-grid">{modes.map(([name,caption])=><button className={`mode-btn ${mode===name?"active":""}`} type="button" key={name} onClick={()=>setMode(name)}><strong>{name}</strong><small>{caption}</small></button>)}</div></div><div className="ai-actions"><button className="btn accent" onClick={generate} disabled={busy}><Icon name="spark" size={14}/>{busy?"Running…":"Generate / prepare"}</button><span className="muted tiny">No-AI mode never calls a remote provider.</span></div>{error&&<div className="notice notice-bad"><Icon name="warning" size={13}/><span>{error}</span></div>}</div>
      <div className="ai-results"><div className="result-head"><div><div className="surface-kicker">Run output</div><h3>Candidates & provenance</h3></div>{candidates[0]&&<span className={`status-pill ${statusClass(candidates[0].status)}`}>{candidates[0].status}</span>}</div>{candidates.length===0?<div className="empty-state compact"><div className="empty-icon"><Icon name="spark" size={18}/></div><h3>No run yet</h3><p>Configure the request and run the workflow.</p></div>:<><div className="provenance-grid"><div><span>Provider</span><strong>{candidates[0].providerId}</strong></div><div><span>Model</span><strong>{candidates[0].modelId||"—"}</strong></div><div><span>Latency</span><strong>{candidates[0].latencyMs?`${candidates[0].latencyMs} ms`:"—"}</strong></div><div><span>Evidence</span><strong>{candidates[0].outputHash?candidates[0].outputHash.slice(0,10):"—"}</strong></div></div><pre className="output-code">{JSON.stringify(primaryOutput,null,2)}</pre><div className="run-controls"><button className="btn" onClick={runQa} disabled={busy}><Icon name="shield" size={14}/> Run deterministic QA</button><button className="btn" onClick={runKev} disabled={busy}><Icon name="flask" size={14}/> Evaluate with Kev</button><button className="btn" onClick={()=>setHumanDecision("CHANGES_REQUIRED")} disabled={busy}>Request changes</button><button className="btn accent" onClick={()=>setHumanDecision("APPROVED_BY_HUMAN")} disabled={busy||!qa}>Approve</button></div><div className="review-grid"><div className="review-block"><div className="surface-kicker">QA</div><pre>{qa?JSON.stringify(qa,null,2):"Not run"}</pre></div><div className="review-block"><div className="surface-kicker">Kev</div><pre>{kev?JSON.stringify(kev,null,2):"Optional — not run"}</pre></div></div><div className="review-footer"><span className={`status-pill ${decision==="APPROVED_BY_HUMAN"?"status-good":decision==="CHANGES_REQUIRED"?"status-bad":"status-warn"}`}>{decision}</span><span className="muted tiny">Human decision remains authoritative for consequential actions.</span></div></>}</div></div></section>;
}

function Step({n,label,active}:{n:string;label:string;active?:boolean}){return <div className={`ai-step ${active?"active":""}`}><span>{n}</span><strong>{label}</strong></div>}
function statusClass(status:string){const s=(status||"").toUpperCase();if(["SUCCESS","APPROVED","READY"].includes(s))return "status-good";if(["PROMPT_READY","REVIEW_PENDING","QA_PENDING"].includes(s))return "status-warn";if(["FAILED","DEGRADED","UNAVAILABLE"].includes(s))return "status-bad";return "status-info";}
