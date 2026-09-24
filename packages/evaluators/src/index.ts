import type { QaSummary } from "@mow/core";
import { runDeterministicQa } from "@mow/core";
export interface KevDecision { status:"AVAILABLE"|"UNAVAILABLE"; decision?:string; rationale?:string; modelId?:string; }
export interface KevEvaluator { evaluate(input:unknown):Promise<KevDecision>; }
export class UnavailableKevEvaluator implements KevEvaluator { async evaluate():Promise<KevDecision>{return {status:"UNAVAILABLE"};} }
export class HttpKevEvaluator implements KevEvaluator {
  constructor(private readonly endpoint:string){}
  async evaluate(input:unknown):Promise<KevDecision>{
    const r=await fetch(this.endpoint,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(input)});
    if(!r.ok) return {status:"UNAVAILABLE"};
    const d=await r.json() as Record<string,unknown>;
    return {status:"AVAILABLE",decision:typeof d.decision==="string"?d.decision:undefined,rationale:typeof d.rationale==="string"?d.rationale:undefined,modelId:typeof d.modelId==="string"?d.modelId:undefined};
  }
}
export function evaluateDeterministically(input:Parameters<typeof runDeterministicQa>[0]):QaSummary{return runDeterministicQa(input);}
