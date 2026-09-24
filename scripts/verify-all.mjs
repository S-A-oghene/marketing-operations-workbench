import {execFileSync} from "node:child_process";
const checks=[
  ["security","node",["scripts/security-check.mjs"],[]],
  ["traceability","node",["scripts/generate-traceability.mjs"],[]],
  ["core","node",["scripts/core-smoke.mjs"],["--experimental-strip-types"]],
  ["portable","node",["scripts/portable-smoke.mjs"],[]]
];
for(const [name,cmd,args,extraArgs] of checks){console.log(`=== ${name.toUpperCase()} ===`);execFileSync(cmd,[...extraArgs,...args],{stdio:"inherit"});}
console.log("Deterministic verification helpers complete. Dependency-backed Next/Vitest/Playwright/Cloudflare verification requires npm install and, for live checks, credentials/resources.");
