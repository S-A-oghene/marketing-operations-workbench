declare module "react" {
  export type ReactNode = any;
  export function useState<T>(initial:T): [T,(value:T|((prev:T)=>T))=>void];
  export function useCallback<T extends (...args:any[])=>any>(fn:T,deps:unknown[]):T;
  export function useRef<T>(initial:T|null): {current:T|null};
  export function useEffect(effect:()=>void|(()=>void),deps:unknown[]):void;
  export function useMemo<T>(factory:()=>T,deps:unknown[]): T;
  const React: any;
  export default React;
}
declare module "next/link" { const Link: any; export default Link; }
declare module "next/navigation" { export function usePathname(): string; export function notFound(): never; }
declare module "next" { export type Metadata = Record<string, unknown>; export type NextConfig = Record<string, unknown>; }
declare module "next/config" { const x:any; export default x; }
declare namespace JSX { interface IntrinsicElements { [elemName:string]: any; } }
declare const process: { env: Record<string,string|undefined> };
