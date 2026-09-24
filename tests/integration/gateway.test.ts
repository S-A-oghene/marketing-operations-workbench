import { describe,expect,it } from "vitest";
import { AiGateway,NoAiProvider,OpenRouterAdapter } from "@mow/ai-gateway";
describe("gateway provider shock",()=>{it("falls back to deterministic provider without credentials",async()=>{
  const gateway=new AiGateway([new OpenRouterAdapter(undefined),new NoAiProvider()]);
  const result=await gateway.execute({requestId:"demo",recipeId:"tiktok_idea_generate",taskType:"CREATIVE_GENERATION",objective:"Engagement",audience:"SMB employers",platform:"TikTok",constraints:["no fabricated metrics"],inputs:[],dataClass:"LOW_SENSITIVITY",preferredMode:"AUTO",maxCandidates:5,allowExternalInference:true,requireHumanApproval:true});
  expect(result.response.providerId).toBe("deterministic"); expect(result.response.status).toBe("SUCCESS");
});});
