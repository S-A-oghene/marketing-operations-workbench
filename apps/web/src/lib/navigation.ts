export type NavItem={label:string;slug:string;icon:string;badge:string};
export type NavGroup={label:string;items:NavItem[]};

export const NAV_GROUPS:NavGroup[]=[
  {label:"Plan",items:[
    {label:"Command Center",slug:"",icon:"grid",badge:""},{label:"Today",slug:"today",icon:"today",badge:"5"},{label:"Tasks",slug:"tasks",icon:"check",badge:"2"},{label:"Content Calendar",slug:"content-calendar",icon:"calendar",badge:""}
  ]},
  {label:"Create",items:[
    {label:"Content Studio",slug:"content-studio",icon:"file",badge:""},{label:"Social Publisher",slug:"social-publisher",icon:"send",badge:""},{label:"Pinterest & SEO",slug:"pinterest-seo",icon:"search",badge:""},{label:"Blog Studio",slug:"blog-studio",icon:"book",badge:""}
  ]},
  {label:"Grow",items:[
    {label:"Influencer CRM",slug:"influencer-crm",icon:"users",badge:""},{label:"Outreach",slug:"outreach",icon:"mail",badge:""},{label:"Campaigns",slug:"campaigns",icon:"megaphone",badge:""},{label:"Meta Ads Lab",slug:"meta-ads",icon:"flask",badge:""},{label:"Analytics",slug:"analytics",icon:"chart",badge:""}
  ]},
  {label:"Intelligence",items:[
    {label:"Research",slug:"research",icon:"search",badge:""},{label:"Reports",slug:"reports",icon:"report",badge:""},{label:"Proof of Work",slug:"proof-of-work",icon:"briefcase",badge:""},{label:"Applications",slug:"applications",icon:"rocket",badge:""}
  ]},
  {label:"System",items:[
    {label:"AI Gateway",slug:"ai-gateway",icon:"spark",badge:""},{label:"Manual AI Bridge",slug:"manual-ai",icon:"panel",badge:""},{label:"SOPs & Playbooks",slug:"sops",icon:"book",badge:""},{label:"Integrations",slug:"integrations",icon:"plug",badge:""},{label:"Settings",slug:"settings",icon:"settings",badge:""}
  ]}
];

export const NAV_ITEMS:NavItem[]=NAV_GROUPS.flatMap(group=>group.items).filter(item=>item.slug!=="manual-ai");
