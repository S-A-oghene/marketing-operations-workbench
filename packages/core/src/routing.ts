import type { DataClass,ProviderOperationalState } from "@mow/shared";
export interface ProviderCandidate { providerId:string; state:ProviderOperationalState; capabilities:string[]; priority:number; availableQuota?:number; }
export function chooseEligibleProvider(candidates:ProviderCandidate[],requiredCapability:string,dataClass:DataClass,allowExternalInference:boolean):ProviderCandidate|undefined{
  if(!allowExternalInference || dataClass==="RESTRICTED" || dataClass==="PERSONAL") return undefined;
  return [...candidates].filter(p=>["READY","DEGRADED"].includes(p.state)).filter(p=>p.capabilities.includes(requiredCapability)).filter(p=>p.availableQuota===undefined||p.availableQuota>0).sort((a,b)=>a.priority-b.priority)[0];
}
