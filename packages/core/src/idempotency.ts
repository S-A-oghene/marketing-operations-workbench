export interface IdempotencyRecord { key:string; action:string; workspaceId:string; resourceId?:string; resultJson:string; createdAt:string; }
export function isSameIdempotencyScope(a:Pick<IdempotencyRecord,"key"|"action"|"workspaceId">,b:Pick<IdempotencyRecord,"key"|"action"|"workspaceId">):boolean{
  return a.key===b.key && a.action===b.action && a.workspaceId===b.workspaceId;
}
