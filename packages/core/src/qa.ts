import type { QaResult,QaSummary } from "./types";
const metricClaim=/\b\d+(?:\.\d+)?\s*%|\b(?:CTR|CPC|CPA|ROAS|reach|impressions|followers|conversions)\b.*\b\d+(?:\.\d+)?/i;
const urlPattern=/^https?:\/\/[^\s]+$/i;
export function runDeterministicQa(i:{audience?:string;objective?:string;platform?:string;cta?:string;body?:string;assetRefs?:string[];sourceRefs?:string[];restrictedDataPresent?:boolean;duplicate?:boolean;url?:string;approvalRequired?:boolean;}):QaSummary{
  const results:QaResult[]=[
    {rule:"AUDIENCE_PRESENT",result:i.audience?.trim()?"PASS":"FAIL",detail:i.audience?.trim()?"Audience provided.":"Audience is required."},
    {rule:"OBJECTIVE_PRESENT",result:i.objective?.trim()?"PASS":"FAIL",detail:i.objective?.trim()?"Objective provided.":"Objective is required."},
    {rule:"PLATFORM_PRESENT",result:i.platform?.trim()?"PASS":"FAIL",detail:i.platform?.trim()?"Platform provided.":"Platform is required."},
    {rule:"CTA_PRESENT",result:i.cta?.trim()?"PASS":"FAIL",detail:i.cta?.trim()?"CTA provided.":"CTA is required."},
    {rule:"NO_UNVERIFIED_METRIC",result:i.body && metricClaim.test(i.body) && !i.sourceRefs?.length?"FAIL":"PASS",detail:i.body && metricClaim.test(i.body) && !i.sourceRefs?.length?"Potential unsupported metric claim.":"No unsupported metric detected."},
    {rule:"NO_RESTRICTED_DATA",result:i.restrictedDataPresent?"FAIL":"PASS",detail:i.restrictedDataPresent?"Restricted data detected.":"No restricted data detected."},
    {rule:"NO_DUPLICATE_POST",result:i.duplicate?"FAIL":"PASS",detail:i.duplicate?"Potential duplicate publication.":"No duplicate detected."},
    {rule:"NO_EMPTY_ASSET",result:i.assetRefs?(i.assetRefs.length?"PASS":"WARN"):"UNKNOWN",detail:i.assetRefs===undefined?"Asset evidence not supplied.":i.assetRefs.length?"Asset reference present.":"No asset reference."},
    {rule:"NO_BROKEN_URL",result:i.url===undefined?"UNKNOWN":urlPattern.test(i.url)?"PASS":"FAIL",detail:i.url===undefined?"URL not supplied.":urlPattern.test(i.url)?"URL shape looks valid.":"URL is malformed."},
    {rule:"APPROVAL_REQUIRED",result:i.approvalRequired===false?"PASS":"WARN",detail:i.approvalRequired===false?"Approval not required by policy.":"Human approval gate remains active."}
  ];
  const overall=results.some(r=>r.result==="FAIL")?"FAIL":results.some(r=>r.result==="UNKNOWN")?"UNKNOWN":results.some(r=>r.result==="WARN")?"WARN":"PASS";
  return {overall,results};
}
export function claimClass(text:string,hasSource:boolean):"UNSUPPORTED"|"SOURCE_REQUIRED"|"SUPPORTED"|"VERIFIED"|"UNKNOWN"{
  if(!text.trim()) return "UNKNOWN"; if(metricClaim.test(text)&&!hasSource) return "SOURCE_REQUIRED"; if(metricClaim.test(text)&&hasSource) return "SUPPORTED"; return "UNKNOWN";
}
