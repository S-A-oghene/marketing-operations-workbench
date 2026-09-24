import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const web = path.join(root, 'apps', 'web');
const components = path.join(web, 'src', 'components');
const requiredFiles = [
  path.join(components, 'Shell.tsx'),
  path.join(components, 'ModulePage.tsx'),
  path.join(components, 'ModuleInsights.tsx'),
  path.join(components, 'AiGatewayPanel.tsx'),
  path.join(components, 'ManualBridge.tsx'),
  path.join(web, 'src', 'lib', 'api.ts'),
  path.join(web, 'worker', 'index.ts'),
  path.join(web, 'worker', 'cloudflare.d.ts'),
  path.join(web, 'src', 'lib', 'navigation.ts'),
  path.join(root, 'database', 'migrations', '0009_meta_ads_planning.sql'),
];

function fail(message) {
  console.error('UI_INTERACTION_VERIFY=FAIL');
  console.error(message);
  process.exit(1);
}

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) fail(`Missing required file: ${path.relative(root, file)}`);
}

const read = (file) => fs.readFileSync(file, 'utf8');
const modulePage = read(path.join(components, 'ModulePage.tsx'));
const shell = read(path.join(components, 'Shell.tsx'));
const insights = read(path.join(components, 'ModuleInsights.tsx'));
const api = read(path.join(web, 'src', 'lib', 'api.ts'));
const worker = read(path.join(web, 'worker', 'index.ts'));
const nav = read(path.join(web, 'src', 'lib', 'navigation.ts'));
const ai = read(path.join(components, 'AiGatewayPanel.tsx'));
const manual = read(path.join(components, 'ManualBridge.tsx'));
const migration = read(path.join(root, 'database', 'migrations', '0009_meta_ads_planning.sql'));

const resources = ['campaigns','content','tasks','research','influencers','applications','content_calendar','keywords','outreach_messages','assets','metric_snapshots','reports','portfolio_items','sops','ai_providers','platform_connections','brand_profiles'];
for (const resource of resources) {
  if (!modulePage.includes(`resource:"${resource}"`)) fail(`ModulePage spec missing resource: ${resource}`);
}

const expectedActions = [
  'BRIEF','START_DRAFT','QA','APPROVE','SCHEDULE','CONFIRM','CHANGES','RESUME_DRAFT','START','DONE','CANCEL','REOPEN','WAIT','REVIEW',
  'ACTIVATE','PAUSE','COMPLETE','ARCHIVE','RESEARCH','QUALIFY','CONTACT','READY_TO_SUBMIT','INTERVIEW',
  'CONFIRM_SUBMISSION','READY_TO_SEND','MANUAL_SEND_CONFIRMED','MANUAL_HANDOFF','MARK_PUBLISHED','PROBE','VERIFY_CAPABILITY'
];
for (const action of expectedActions) {
  if (!modulePage.includes(`"${action}"`)) fail(`UI action not represented: ${action}`);
}

const handlerlessButtons = [];
for (const file of [shell, modulePage, insights, ai, manual]) {
  for (const [index, line] of file.split(/\r?\n/).entries()) {
    if (line.includes('<button') && !line.includes('onClick') && !line.includes('type="submit"')) {
      handlerlessButtons.push(`${path.basename(file)}:${index + 1}`);
    }
  }
}
if (handlerlessButtons.length) fail(`Button without action handler/submit type: ${handlerlessButtons.join(', ')}`);

const forbidden = [
  /\balert\s*\(/,
  /\bwindow\.confirm\s*\(/,
  /\bwindow\.prompt\s*\(/,
  /\[Audience pain or question\]/,
  /\[Useful point\]/,
  /\[Verified evidence\]/,
  /\[Desired next action\]/,
  /TODO\b/,
  /FIXME\b/,
];
for (const [name, text] of [['ModulePage', modulePage], ['Shell', shell], ['Insights', insights], ['AI', ai], ['ManualBridge', manual]]) {
  for (const pattern of forbidden) if (pattern.test(text)) fail(`Forbidden placeholder/dead interaction pattern in ${name}: ${pattern}`);
}

for (const symbol of ['listRecords','getRecord','createRecord','updateRecord','recordAction','postAction','getDashboard','getProviderStatus','generateReport','exportWorkspace']) {
  if (!api.includes(`export async function ${symbol}`)) fail(`API client operation missing: ${symbol}`);
}

for (const route of ['dashboard','ai/generate','ai/qa','manual/prepare','manual/event','providers/status','reports/generate','ai/decision']) {
  if (!worker.includes(`/api/${route}`)) fail(`Worker route missing: /api/${route}`);
}
if (!worker.includes('recordMatch=url.pathname.match')) fail('Worker record route missing.');
if (!worker.includes('function str(body:any,k:string,requiredOrAlias:boolean|string=true)')) fail('Worker alias-aware string reader missing.');
if (!worker.includes('env.DB.batch(')) fail('Worker publication path must use D1 batch transactions.');
if (!worker.includes('PLATFORM_CONNECTION_PROBED')) fail('Platform connection probe evidence is missing.');
if (!worker.includes('PLATFORM_CAPABILITY_EVIDENCE_REQUIRED')) fail('Platform capability evidence gate missing.');
if (!worker.includes('PROVIDER_CAPABILITY_EVIDENCE_REQUIRED')) fail('AI provider capability evidence gate missing.');
if (!worker.includes('CALENDAR_REQUIRES_APPROVED_CONTENT')) fail('Calendar approval gate missing.');
if (!worker.includes('CAMPAIGN_NOT_FOUND')) fail('Cross-workspace campaign lookup gate missing.');
if (!worker.includes('INFLUENCER_NOT_FOUND')) fail('Cross-workspace influencer lookup gate missing.');

if (!modulePage.includes('ModuleInsights')) fail('Module insights layer missing.');
for (const marker of ['AnalyticsInsights','MetaAdsInsights','Measurement cockpit','Meta Ads planning cockpit']) {
  if (!insights.includes(marker)) fail(`State-of-art insight surface missing: ${marker}`);
}
for (const field of ['accountRef','creativeRefsJson','copyRefsJson','placement','plannedBudget','currency','trackingPlan']) {
  if (!modulePage.includes(`name:"${field}"`)) fail(`Meta Ads field missing: ${field}`);
}
for (const field of ['channelsJson','contentOpportunity','pinterestOpportunity','blogOpportunity']) {
  if (!modulePage.includes(`name:"${field}"`)) fail(`Strategic field missing: ${field}`);
}
if (!migration.includes('ALTER TABLE campaigns ADD COLUMN tracking_plan TEXT')) fail('Meta Ads planning migration incomplete.');

if (fs.existsSync(path.join(components, 'RecordWorkbench.tsx')) || modulePage.includes('RecordWorkbench')) {
  fail('Legacy RecordWorkbench adapter must not remain in the final interaction tree.');
}
if (!shell.includes('aria-label={navExpanded ? "Collapse navigation" : "Expand navigation"}')) fail('Global navigation toggle aria wiring missing.');
if (!shell.includes('setNavExpanded(v => !v)')) fail('Global navigation toggle handler missing.');
if (!nav.includes('NAV_GROUPS')) fail('Grouped navigation registry missing.');
if (!api.includes('const DEMO_MODE = !base')) fail('Local/demo fallback missing.');
if (!ai.includes('providerHealth')) fail('AI provider health is not surfaced.');
if (!manual.includes('JSON.parse')) fail('Manual AI JSON validation missing.');

const packageJson = JSON.parse(read(path.join(root, 'package.json')));
if (packageJson.scripts?.['verify:ui'] !== 'node scripts/verify-ui-interactions.mjs') fail('verify:ui script missing from package.json.');

console.log('UI_INTERACTION_VERIFY=PASS');
console.log(`resources=${resources.length}`);
console.log(`actions=${expectedActions.length}`);
console.log('button-handler-scan=PASS');
console.log('dead-placeholder-scan=PASS');
console.log('api-worker-route-scan=PASS');
console.log('manual-capability-gates=PASS');
console.log('module-insights-scan=PASS');
console.log('navigation-wiring=PASS');
console.log('demo-fallback=PASS');
