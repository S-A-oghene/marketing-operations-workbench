import { canSendToRemoteAi, chooseEligibleProvider, validateAiGenerationRequest } from "@mow/core";
import type { AiGenerationRequest,ProviderCandidate } from "@mow/core";
import { getRecipe } from "@mow/recipes";
import type { ProviderAdapter } from "./providers";
export interface GatewayResult { request:AiGenerationRequest; response:Awaited<ReturnType<ProviderAdapter["generate"]>>; recipeVersion:string; providerChain:string[]; }
export interface RemotePolicy { allowPublic:boolean; allowLowSensitivity:boolean; allowConfidential:boolean; allowPersonal:boolean; }
const defaultRemotePolicy:RemotePolicy={allowPublic:true,allowLowSensitivity:true,allowConfidential:false,allowPersonal:false};
export class AiGateway {
  constructor(private readonly providers:ProviderAdapter[],private readonly remotePolicy:RemotePolicy=defaultRemotePolicy,private readonly quotaByProvider:Record<string,number|undefined>={}){}
  async execute(request:AiGenerationRequest):Promise<GatewayResult>{
    validateAiGenerationRequest(request);
    const recipe=getRecipe(request.recipeId); if(!recipe)throw new Error("RECIPE_NOT_FOUND");
    const policy=canSendToRemoteAi(request.dataClass,request.allowExternalInference,this.remotePolicy);
    const providerCandidates:ProviderCandidate[]=this.providers.map((p,i)=>({providerId:p.id,state:p.getState(),capabilities:p.capabilities,priority:i,availableQuota:this.quotaByProvider[p.id]}));
    const eligible=policy.allowed?chooseEligibleProvider(providerCandidates,"generate_text",request.dataClass,true):undefined;
    const chain=providerCandidates.map(p=>p.providerId);
    if(eligible){
      const ordered=[...providerCandidates].filter(p=>["READY","DEGRADED"].includes(p.state)&&p.capabilities.includes("generate_text")&&(p.availableQuota===undefined||p.availableQuota>0)).sort((a,b)=>a.priority-b.priority);
      for(const candidate of ordered){
        const adapter=this.providers.find(p=>p.id===candidate.providerId); if(!adapter)continue;
        const response=await adapter.generate(request);
        if(response.status==="SUCCESS")return {request,response,recipeVersion:recipe.version,providerChain:chain};
        if(response.status==="RATE_LIMITED"||response.status==="QUOTA_LIMITED"||response.status==="UNAVAILABLE"||response.status==="PROVIDER_ERROR"||response.status==="AUTH_ERROR"||response.status==="INVALID_OUTPUT") continue;
      }
    }
    const deterministic=this.providers.find(p=>p.id==="deterministic"); if(!deterministic)throw new Error("DETERMINISTIC_PROVIDER_MISSING");
    const response=await deterministic.generate({...request,preferredMode:"MANUAL",allowExternalInference:false});
    return {request,response,recipeVersion:recipe.version,providerChain:[...chain,"deterministic"]};
  }
}
