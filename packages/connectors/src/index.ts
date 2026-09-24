import type { ProviderOperationalState } from "@mow/shared";
export type PlatformCapability="CREATE_CONTENT"|"PUBLISH"|"READ_METRICS"|"READ_COMMENTS";
export interface CapabilityProbe { capability:PlatformCapability; ready:boolean; state:ProviderOperationalState|"MANUAL"; evidenceRef?:string; limitations?:string[]; }
export interface PublicationRequest { workspaceId:string; contentId:string; idempotencyKey:string; }
export interface PublicationResult { status:"PUBLISHED"|"FAILED"|"UNKNOWN"|"MANUAL_HANDOFF"; platformPostId?:string; evidenceRef?:string; providerMessage?:string; }
export interface SocialConnector { id:"instagram"|"facebook"|"tiktok"|"pinterest"|"x"; getCapabilities():Promise<CapabilityProbe[]>; publish(request:PublicationRequest):Promise<PublicationResult>; manualHandoff(request:PublicationRequest):PublicationResult; }
abstract class BaseConnector implements SocialConnector {
  abstract id:SocialConnector["id"];
  async getCapabilities():Promise<CapabilityProbe[]>{
    return [
      {capability:"CREATE_CONTENT",ready:false,state:"MANUAL",limitations:["Credentials/capability probe not configured."]},
      {capability:"PUBLISH",ready:false,state:"MANUAL",limitations:["Manual handoff lane is available."]},
      {capability:"READ_METRICS",ready:false,state:"MANUAL"},
      {capability:"READ_COMMENTS",ready:false,state:"MANUAL"}
    ];
  }
  async publish():Promise<PublicationResult>{return {status:"UNKNOWN",providerMessage:"Connector is not configured; publication evidence is unavailable."};}
  manualHandoff(request:PublicationRequest):PublicationResult{return {status:"MANUAL_HANDOFF",providerMessage:`User must execute ${this.id} publication natively and confirm the result.`};}
}
export class InstagramConnector extends BaseConnector{id="instagram" as const;}
export class FacebookConnector extends BaseConnector{id="facebook" as const;}
export class TikTokConnector extends BaseConnector{id="tiktok" as const;}
export class PinterestConnector extends BaseConnector{id="pinterest" as const;}
export class XConnector extends BaseConnector{id="x" as const;}
export const connectorStates={tiktok:["API_CONNECTED","DIRECT_POST_CONFIGURED","PUBLISH_SCOPE_APPROVED","AUDITED","PUBLIC_PUBLISH_READY"] as const,pinterest:["TRIAL","STANDARD","READ_READY","WRITE_READY","PRODUCTION_READY"] as const,x:["DEVELOPER_ACCOUNT","APP_CREATED","OAUTH_CONFIGURED","USER_AUTHORIZED","PUBLISH_READY"] as const};
