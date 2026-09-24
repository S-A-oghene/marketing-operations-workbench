import type { RecipeDefinition } from "@mow/core";
const defs:Array<[string,string,string[],string[]]>=[
["SOCIAL_POST_CREATE","CREATIVE_GENERATION",["audience","objective","platform","brand"],["hook","value","proof","CTA"]],
["TIKTOK_IDEA_GENERATE","CREATIVE_GENERATION",["audience","objective","platform","brand"],["concept","hook","angle","CTA"]],
["PINTEREST_PIN_CREATE","CREATIVE_GENERATION",["keyword","intent","board","brand"],["title","description","concept","destination"]],
["BLOG_OUTLINE","PLANNING",["keyword","intent","audience"],["outline","title","metaDescription"]],
["BLOG_DRAFT","LONG_FORM",["keyword","outline","sources"],["draft","metaDescription","altText","CTA"]],
["SEO_CLUSTER","ANALYSIS",["seedKeywords","intent"],["clusters","mapping"]],
["INFLUENCER_RESEARCH","RESEARCH",["niche","platform","campaign"],["creator","fitNotes","source"]],
["OUTREACH_DRAFT","COMMUNICATION",["creator","campaign","message"],["subject","body","CTA"]],
["META_AD_CONCEPT","CAMPAIGN_PLANNING",["objective","audience","creative"],["concept","copy","tracking"]],
["WEEKLY_REPORT","REPORTING",["measurementStore","period"],["narrative","nextPriorities","risks"]],
["APPLICATION_TAILORING","APPLICATION",["role","actualExperience"],["requirementsMatrix","transferableMap","portfolioProof"]],
["INTERVIEW_PREP","APPLICATION",["role","evidence"],["stories","questions","skillGaps"]]
];
export const recipes:RecipeDefinition[]=defs.map(([id,taskType,requiredInputs,outputs])=>({id:id.toLowerCase(),version:"1.0.0",taskType,requiredInputs,outputs,qualityRules:["audience_match","platform_fit","no_unverified_claims"],approval:{required:true}}));
export function getRecipe(id:string):RecipeDefinition|undefined{return recipes.find(r=>r.id===id);}
