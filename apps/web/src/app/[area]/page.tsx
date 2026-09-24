import { notFound } from "next/navigation";
import { ModulePage } from "../../components/ModulePage";
import { NAV_ITEMS } from "../../lib/navigation";
export function generateStaticParams(){return NAV_ITEMS.filter((n)=>n.slug!=="").map((n)=>({area:n.slug}));}
export default async function AreaPage({params}:{params:Promise<{area:string}>}){const {area}=await params;const item=NAV_ITEMS.find((n)=>n.slug===area);if(!item){notFound(); return null;} return <ModulePage area={item}/>;}
