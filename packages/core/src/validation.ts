import type { AiGenerationRequest } from "./types";
import type { DataClass } from "@mow/shared";
const dataClasses=new Set<DataClass>(["PUBLIC","LOW_SENSITIVITY","CONFIDENTIAL","PERSONAL","RESTRICTED"]);
const modes=new Set(["AUTO","CREATIVE","FAST","REASONING","LONG_FORM","MANUAL"]);
export function validateAiGenerationRequest(input:unknown):AiGenerationRequest{
  if(!input||typeof input!=="object")throw new Error("AI_REQUEST_NOT_OBJECT");
  const v=input as Record<string,unknown>;
  for(const key of ["requestId","recipeId","taskType","objective"]){if(typeof v[key]!=="string"||!(v[key] as string).trim())throw new Error(`AI_REQUEST_${key.toUpperCase()}_REQUIRED`);}
  if(!Array.isArray(v.constraints)||v.constraints.some(x=>typeof x!=="string"))throw new Error("AI_REQUEST_CONSTRAINTS_INVALID");
  if(!Array.isArray(v.inputs))throw new Error("AI_REQUEST_INPUTS_INVALID");
  for(const item of v.inputs){if(!item||typeof item!=="object")throw new Error("AI_INPUT_INVALID");const i=item as Record<string,unknown>;if(typeof i.name!=="string"||!i.name.trim()||!dataClasses.has(i.dataClass as DataClass))throw new Error("AI_INPUT_CLASSIFICATION_INVALID");}
  if(!dataClasses.has(v.dataClass as DataClass))throw new Error("AI_REQUEST_DATA_CLASS_INVALID");
  if(!modes.has(v.preferredMode as string))throw new Error("AI_REQUEST_MODE_INVALID");
  if(typeof v.maxCandidates!=="number"||!Number.isInteger(v.maxCandidates)||v.maxCandidates<1||v.maxCandidates>50)throw new Error("AI_REQUEST_MAX_CANDIDATES_INVALID");
  if(typeof v.allowExternalInference!=="boolean"||typeof v.requireHumanApproval!=="boolean")throw new Error("AI_REQUEST_POLICY_FLAGS_INVALID");
  if(v.outputSchema!==undefined&&(!v.outputSchema||typeof v.outputSchema!=="object"))throw new Error("AI_REQUEST_OUTPUT_SCHEMA_INVALID");
  return input as AiGenerationRequest;
}
