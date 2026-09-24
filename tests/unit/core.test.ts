import { describe,expect,it } from "vitest";
import { canPublish,canTransitionContent,runDeterministicQa,canSendToRemoteAi } from "@mow/core";
describe("content state machine",()=>{
  it("blocks direct draft to published",()=>{expect(canTransitionContent("DRAFT","PUBLISHED")).toBe(false);expect(canPublish({current:"DRAFT",target:"PUBLISHED",approvalState:"APPROVED",approvalRequired:true,evidence:"CONFIRMED",duplicate:false}).allowed).toBe(false);});
  it("requires approval and publication evidence",()=>{expect(canPublish({current:"SCHEDULED",target:"PUBLISHED",approvalState:"PENDING",approvalRequired:true,evidence:"CONFIRMED",duplicate:false}).allowed).toBe(false);expect(canPublish({current:"SCHEDULED",target:"PUBLISHED",approvalState:"APPROVED",approvalRequired:true,evidence:"UNKNOWN",duplicate:false}).allowed).toBe(false);});
});
describe("QA",()=>{it("fails unsupported metric",()=>{const q=runDeterministicQa({audience:"SMBs",objective:"Engagement",platform:"TikTok",cta:"Learn",body:"This increases conversions by 40%",sourceRefs:[]});expect(q.overall).toBe("FAIL");});});
describe("policy",()=>{it("blocks restricted data",()=>{expect(canSendToRemoteAi("RESTRICTED",true,{allowPublic:true,allowLowSensitivity:true,allowConfidential:true,allowPersonal:true}).allowed).toBe(false);});});
