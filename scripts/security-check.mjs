import fs from "node:fs"; import path from "node:path";
const root=process.cwd(); const ignored=new Set(["node_modules",".git",".next","out","dist","coverage","playwright-report","test-results"]);
const secret=/(sk-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{20,}|BEGIN (?:RSA|OPENSSH|EC) PRIVATE KEY|client_secret\s*[:=]\s*['"][^'"]+|password\s*[:=]\s*['"][^'"]+)/i; const findings=[];
function walk(dir){for(const name of fs.readdirSync(dir)){if(ignored.has(name))continue;const full=path.join(dir,name),st=fs.statSync(full);if(st.isDirectory())walk(full);else if(st.isFile()&&/\.(ts|tsx|js|json|md|yaml|yml|sql|env|example|mjs|html)$/.test(name)){const t=fs.readFileSync(full,"utf8");if(secret.test(t)&&!full.endsWith(".env.example"))findings.push(path.relative(root,full));}}}
walk(root); if(findings.length){console.error("Potential secrets found:",findings);process.exit(1)} console.log("Security scan passed.");
