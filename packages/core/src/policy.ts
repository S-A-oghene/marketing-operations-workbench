import type { DataClass } from "@mow/shared";
export interface RemoteInferencePolicy { allowPublic:boolean; allowLowSensitivity:boolean; allowConfidential:boolean; allowPersonal:boolean; }
export function canSendToRemoteAi(dataClass:DataClass,requestAllowsExternal:boolean,policy:RemoteInferencePolicy):{allowed:boolean;reason:string}{
  if(!requestAllowsExternal) return {allowed:false,reason:"REQUEST_BLOCKS_EXTERNAL_INFERENCE"};
  if(dataClass==="RESTRICTED") return {allowed:false,reason:"RESTRICTED_DATA_BLOCKED"};
  if(dataClass==="PERSONAL" && !policy.allowPersonal) return {allowed:false,reason:"PERSONAL_DATA_REMOTE_AI_BLOCKED"};
  if(dataClass==="CONFIDENTIAL" && !policy.allowConfidential) return {allowed:false,reason:"CONFIDENTIAL_DATA_REMOTE_AI_BLOCKED"};
  if(dataClass==="LOW_SENSITIVITY" && !policy.allowLowSensitivity) return {allowed:false,reason:"LOW_SENSITIVITY_REMOTE_AI_BLOCKED"};
  if(dataClass==="PUBLIC" && !policy.allowPublic) return {allowed:false,reason:"PUBLIC_REMOTE_AI_BLOCKED"};
  return {allowed:true,reason:"PASS"};
}
export function containsRestrictedSecret(text:string):boolean{
  return /(sk-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{20,}|BEGIN (?:RSA|OPENSSH|EC) PRIVATE KEY|password\s*[:=]|client_secret\s*[:=])/i.test(text);
}
