import type { ContentStatus } from "./types";
const transitions:Record<ContentStatus,ContentStatus[]> = {
  IDEA:["BRIEFED","ARCHIVED"], BRIEFED:["DRAFT","ARCHIVED"], DRAFT:["QA","ARCHIVED"], QA:["CHANGES_REQUIRED","APPROVED","ARCHIVED"],
  CHANGES_REQUIRED:["DRAFT","QA","ARCHIVED"], APPROVED:["SCHEDULED","ARCHIVED"], SCHEDULED:["PUBLISHED","FAILED","ARCHIVED"],
  PUBLISHED:["ARCHIVED"], FAILED:["SCHEDULED","ARCHIVED"], ARCHIVED:[]
};
export function canTransitionContent(from:ContentStatus,to:ContentStatus):boolean{ return transitions[from].includes(to); }
export interface PublicationGateInput { current:ContentStatus; target:"PUBLISHED"; approvalState:"NOT_REQUIRED"|"PENDING"|"APPROVED"|"REJECTED"; approvalRequired:boolean; evidence:"CONFIRMED"|"MANUAL_CONFIRMED"|"UNKNOWN"; duplicate:boolean; }
export function canPublish(i:PublicationGateInput):{allowed:boolean;reason:string}{
  if(!canTransitionContent(i.current,"PUBLISHED")) return {allowed:false,reason:"INVALID_STATE_TRANSITION"};
  if(i.approvalRequired && i.approvalState!=="APPROVED") return {allowed:false,reason:"APPROVAL_REQUIRED"};
  if(i.duplicate) return {allowed:false,reason:"DUPLICATE"};
  if(i.evidence==="UNKNOWN") return {allowed:false,reason:"PUBLICATION_EVIDENCE_REQUIRED"};
  return {allowed:true,reason:"PASS"};
}
