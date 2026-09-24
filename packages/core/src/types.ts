import type { DataClass, ApprovalState, ProviderOperationalState } from "@mow/shared";
export type ContentStatus = "IDEA"|"BRIEFED"|"DRAFT"|"QA"|"CHANGES_REQUIRED"|"APPROVED"|"SCHEDULED"|"PUBLISHED"|"FAILED"|"ARCHIVED";
export interface ContentItem {
  id:string; workspaceId:string; campaignId?:string|null; title:string; contentType:string; objective:string; audience:string;
  coreMessage:string; platforms:string[]; draftBody:string; cta:string; sourceRefs:string[]; assetRefs:string[];
  status:ContentStatus; approvalState:ApprovalState; scheduledAt?:string|null; publishedAt?:string|null; createdAt:string; updatedAt:string;
}
export interface RecipeDefinition { id:string; version:string; taskType:string; requiredInputs:string[]; outputs:string[]; qualityRules:string[]; approval:{required:boolean}; }
export interface AiInput { name:string; value:unknown; dataClass:DataClass; sourceRef?:string; }
export interface JsonSchema { type?:string; properties?:Record<string,unknown>; required?:string[]; additionalProperties?:boolean; }
export interface AiGenerationRequest {
  requestId:string; recipeId:string; taskType:string; objective:string; audience?:string; platform?:string; brandContext?:string;
  constraints:string[]; inputs:AiInput[]; outputSchema?:JsonSchema; dataClass:DataClass;
  preferredMode:"AUTO"|"CREATIVE"|"FAST"|"REASONING"|"LONG_FORM"|"MANUAL"; maxCandidates:number; allowExternalInference:boolean; requireHumanApproval:boolean;
}
export interface AiProviderResponse {
  requestId:string; providerId:string; modelId?:string;
  status:"SUCCESS"|"RATE_LIMITED"|"QUOTA_LIMITED"|"AUTH_ERROR"|"PROVIDER_ERROR"|"INVALID_OUTPUT"|"UNAVAILABLE";
  output?:unknown; rawOutputRef?:string; inputHash:string; outputHash?:string;
  usage?:{inputTokens?:number;outputTokens?:number;totalTokens?:number}; latencyMs?:number; limitations?:string[]; receivedAt:string;
}
export interface ProviderHealth { providerId:string; state:ProviderOperationalState; capabilities:Set<string>; lastCheckedAt?:string; detail?:string; }
export interface QaResult { rule:string; result:"PASS"|"WARN"|"FAIL"|"UNKNOWN"; detail:string; }
export interface QaSummary { overall:"PASS"|"WARN"|"FAIL"|"UNKNOWN"; results:QaResult[]; }
export interface BrandProfile { brandName:string; audience:string; voice:string; tone:string; doRules:string[]; dontRules:string[]; visualRules:string[]; ctaRules:string[]; claimRules:string[]; platformRules:string[]; }
