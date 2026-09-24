import type { BrandProfile } from "./types";
export interface BrandCheck { status:"PASS"|"WARN"|"FAIL"; violations:string[]; }
export function evaluateBrandCompliance(text:string,profile:BrandProfile):BrandCheck{
  const normalized=text.toLocaleLowerCase(); const violations:string[]=[];
  for(const rule of profile.dontRules)if(rule.trim()&&normalized.includes(rule.toLocaleLowerCase()))violations.push(`DONT_RULE:${rule}`);
  const ctaRequired=profile.ctaRules.some(r=>r.trim());
  if(ctaRequired&&!profile.ctaRules.some(r=>r.trim()&&normalized.includes(r.toLocaleLowerCase())))violations.push("CTA_RULE_NOT_OBSERVED");
  if(violations.some(v=>v.startsWith("DONT_RULE")))return {status:"FAIL",violations};
  return {status:violations.length?"WARN":"PASS",violations};
}
