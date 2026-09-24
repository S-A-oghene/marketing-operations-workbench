import { sha256 } from "@mow/core";
import type { AiGenerationRequest,AiProviderResponse } from "@mow/core";
import type { ProviderOperationalState } from "@mow/shared";
export interface ProviderAdapter { id:string; capabilities:string[]; getState():ProviderOperationalState; generate(request:AiGenerationRequest):Promise<AiProviderResponse>; }
const now=()=>new Date().toISOString();
function safeStatus(r:Response):AiProviderResponse["status"]{if(r.status===429)return "RATE_LIMITED";if([401,403].includes(r.status))return "AUTH_ERROR";if([404,410].includes(r.status))return "UNAVAILABLE";if(r.status>=500)return "PROVIDER_ERROR";return "INVALID_OUTPUT";}
export function renderPrompt(request:AiGenerationRequest):string{
  return [`Task type: ${request.taskType}`,`Objective: ${request.objective}`,`Audience: ${request.audience??"UNKNOWN"}`,`Platform: ${request.platform??"UNKNOWN"}`,`Brand: ${request.brandContext??"UNKNOWN"}`,`Constraints: ${request.constraints.join("; ")}`,`Data class: ${request.dataClass}`,`Return valid ${request.outputSchema?"JSON matching the supplied schema":"text"}.`,`Inputs: ${JSON.stringify(request.inputs)}`].join("\n");
}
export class OpenRouterAdapter implements ProviderAdapter {
  id="openrouter"; capabilities=["generate_text","structured_output","classify","score"];
  constructor(private readonly key?:string,private readonly model="openai/gpt-oss-20b:free",private readonly capabilityVerified=false){}
  getState():ProviderOperationalState{return !this.key?"NOT_CONFIGURED":this.capabilityVerified?"READY":"CONNECTED";}
  async generate(request:AiGenerationRequest):Promise<AiProviderResponse>{
    const inputHash=await sha256(JSON.stringify(request)); if(!this.key)return {requestId:request.requestId,providerId:this.id,status:"UNAVAILABLE",inputHash,limitations:["OPENROUTER_API_KEY not configured"],receivedAt:now()};
    const started=Date.now(); const response=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${this.key}`,"Content-Type":"application/json"},body:JSON.stringify({model:this.model,messages:[{role:"user",content:renderPrompt(request)}],...(request.outputSchema?{response_format:{type:"json_object"}}:{})})});
    if(!response.ok)return {requestId:request.requestId,providerId:this.id,modelId:this.model,status:safeStatus(response),inputHash,latencyMs:Date.now()-started,receivedAt:now()};
    const data=await response.json() as any; const raw=data?.choices?.[0]?.message?.content;
    if(typeof raw!=="string")return {requestId:request.requestId,providerId:this.id,modelId:this.model,status:"INVALID_OUTPUT",inputHash,latencyMs:Date.now()-started,receivedAt:now()};
    let output:unknown=raw;
    if(request.outputSchema){try{output=JSON.parse(raw);}catch{return {requestId:request.requestId,providerId:this.id,modelId:this.model,status:"INVALID_OUTPUT",rawOutputRef:request.requestId,inputHash,latencyMs:Date.now()-started,receivedAt:now()};}}
    const outputHash=await sha256(typeof output==="string"?output:JSON.stringify(output));
    return {requestId:request.requestId,providerId:this.id,modelId:this.model,status:"SUCCESS",output,inputHash,outputHash,usage:{inputTokens:data?.usage?.prompt_tokens,outputTokens:data?.usage?.completion_tokens,totalTokens:data?.usage?.total_tokens},latencyMs:Date.now()-started,receivedAt:now(),limitations:["Free model availability is dynamic; model ID is configurable."]};
  }
}
export class GeminiAdapter implements ProviderAdapter {
  id="gemini"; capabilities=["generate_text","structured_output","classify","score"];
  constructor(private readonly key?:string,private readonly model="gemini-2.5-flash-lite",private readonly capabilityVerified=false){}
  getState():ProviderOperationalState{return !this.key?"NOT_CONFIGURED":this.capabilityVerified?"READY":"CONNECTED";}
  async generate(request:AiGenerationRequest):Promise<AiProviderResponse>{
    const inputHash=await sha256(JSON.stringify(request)); if(!this.key)return {requestId:request.requestId,providerId:this.id,status:"UNAVAILABLE",inputHash,limitations:["GEMINI_API_KEY not configured"],receivedAt:now()};
    const started=Date.now(); const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${encodeURIComponent(this.key)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:renderPrompt(request)}]}],generationConfig:request.outputSchema?{responseMimeType:"application/json"}:undefined})});
    if(!response.ok)return {requestId:request.requestId,providerId:this.id,modelId:this.model,status:safeStatus(response),inputHash,latencyMs:Date.now()-started,receivedAt:now()};
    const data=await response.json() as any; const raw=data?.candidates?.[0]?.content?.parts?.map((p:any)=>p.text).join("");
    if(typeof raw!=="string")return {requestId:request.requestId,providerId:this.id,modelId:this.model,status:"INVALID_OUTPUT",inputHash,latencyMs:Date.now()-started,receivedAt:now()};
    let output:unknown=raw;
    if(request.outputSchema){try{output=JSON.parse(raw);}catch{return {requestId:request.requestId,providerId:this.id,modelId:this.model,status:"INVALID_OUTPUT",rawOutputRef:request.requestId,inputHash,latencyMs:Date.now()-started,receivedAt:now()};}}
    const outputHash=await sha256(typeof output==="string"?output:JSON.stringify(output));
    return {requestId:request.requestId,providerId:this.id,modelId:this.model,status:"SUCCESS",output,inputHash,outputHash,usage:{inputTokens:data?.usageMetadata?.promptTokenCount,outputTokens:data?.usageMetadata?.candidatesTokenCount,totalTokens:data?.usageMetadata?.totalTokenCount},latencyMs:Date.now()-started,receivedAt:now(),limitations:["Provider free-tier policy and model limits are time-sensitive."]};
  }
}
export class HuggingFaceAdapter implements ProviderAdapter {
  id="huggingface"; capabilities=["generate_text","classify","score"];
  constructor(private readonly spaceUrl?:string,private readonly capabilityVerified=false){}
  getState():ProviderOperationalState{return !this.spaceUrl?"NOT_CONFIGURED":this.capabilityVerified?"READY":"CONNECTED";}
  async generate(request:AiGenerationRequest):Promise<AiProviderResponse>{
    const inputHash=await sha256(JSON.stringify(request)); if(!this.spaceUrl)return {requestId:request.requestId,providerId:this.id,status:"UNAVAILABLE",inputHash,receivedAt:now(),limitations:["HF_SPACE_URL not configured"]};
    const r=await fetch(this.spaceUrl,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({prompt:renderPrompt(request)})});
    if(!r.ok)return {requestId:request.requestId,providerId:this.id,status:safeStatus(r),inputHash,receivedAt:now()};
    const output=await r.json(); const outputHash=await sha256(JSON.stringify(output)); return {requestId:request.requestId,providerId:this.id,status:"SUCCESS",output,inputHash,outputHash,receivedAt:now()};
  }
}
export class NoAiProvider implements ProviderAdapter {
  id="deterministic"; capabilities=["generate_text","structured_output","classify","score"];
  getState():ProviderOperationalState{return "READY";}
  async generate(request:AiGenerationRequest):Promise<AiProviderResponse>{
    const inputHash=await sha256(JSON.stringify(request));
    const output={hook:"Open with the audience problem, tension, or question that makes the intended reader stop and understand why the topic matters.",value:["State the first practical point the audience can act on.","State the second practical point, backed by supplied evidence where available.","State the third practical point and connect it to the broader objective."],proof:"Use only verified source material or explicitly state that evidence is unavailable. Never invent a result, metric, client claim, or performance outcome.",CTA:"State the single next action the audience should take."};
    return {requestId:request.requestId,providerId:this.id,status:"SUCCESS",output,inputHash,outputHash:await sha256(JSON.stringify(output)),receivedAt:now(),limitations:["Deterministic template mode; no AI inference."]};
  }
}
