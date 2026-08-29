import assert from "node:assert/strict";
import { assertPlainData } from "./security/validation.js";
import { createWorldGraph, shortestPath, dependencyClosure, detectCycles, topologicalOrder } from "./layer3/worldGraph.js";
import { qualifyEvidence } from "./layer4/evidence.js";
import { verificationGate } from "./layer4/verificationGate.js";
import { appendChainEvent, verifyAuditChain } from "./layer3/auditChain.js";
import { createAuditEvent, verifyAuditEvent } from "./provenance/audit.js";
import { createAnalysisJob, executeAnalysisJob, verifyApplicationResult, createDualAudienceReport, createExportManifest } from "./layer6/application.js";

const pass=n=>console.log(`PASS  ${n}`);
const ctx={authorized:true,principal:"hardening-operator",tenantId:"tenant-a"};
const ev=(value,method,source=`source-${method}`)=>qualifyEvidence({source,value,method,independent:true,reproducible:true,integrity:true});
console.log("\nGIE 1.0.0 HARDENING / ADVERSARIAL SELF TEST\n============================================");

assert.throws(()=>assertPlainData(NaN),/non-finite/); assert.throws(()=>assertPlainData(Infinity),/non-finite/); pass("non-finite numeric input rejected");
let deep=0; for(let i=0;i<34;i++) deep={x:deep}; assert.throws(()=>assertPlainData(deep),/nesting depth/); pass("excessive nesting rejected");
assert.throws(()=>assertPlainData(()=>42),/unsupported data/); pass("executable/function input rejected");
const blocked=Object.create(null); blocked.constructor="x"; assert.throws(()=>assertPlainData(blocked),/blocked key/); pass("prototype-pollution key rejected");

assert.throws(()=>createWorldGraph({nodes:[{id:"a"},{id:"a"}]}),/Duplicate/); pass("duplicate graph node rejected");
assert.throws(()=>createWorldGraph({nodes:[{id:"a"}],edges:[{from:"a",to:"missing"}]}),/unknown node/); pass("dangling graph edge rejected");
assert.throws(()=>createWorldGraph({nodes:[{id:"a"},{id:"b"}],edges:[{from:"a",to:"b",weight:-1}]}),/invalid weight/); pass("negative dependency weight rejected");
const cyclic=createWorldGraph({nodes:[{id:"a"},{id:"b"}],edges:[{from:"a",to:"b"},{from:"b",to:"a"}]}); assert.ok(detectCycles(cyclic).length); assert.throws(()=>topologicalOrder(cyclic),/cycle/); pass("dependency cycle detected and blocked from topological ordering");

const N=1200; const nodes=Array.from({length:N},(_,i)=>({id:`n${i}`})); const edges=Array.from({length:N-1},(_,i)=>({from:`n${i}`,to:`n${i+1}`,weight:1})); const graph=createWorldGraph({nodes,edges}); const p=shortestPath(graph,"n0",`n${N-1}`); assert.equal(p.distance,N-1); assert.equal(p.path.length,N); assert.equal(dependencyClosure(graph,"n0").length,N-1); pass("1200-node dependency graph stress path/closure");

assert.equal(verificationGate({evidence:[ev(10,"a"),ev(10,"b")]}).verified,true); pass("independent agreeing evidence accepted");
assert.equal(verificationGate({evidence:[ev(10,"a"),ev(11,"b")]}).verified,false); pass("conflicting evidence rejected");
assert.equal(verificationGate({evidence:[ev(10,"a")] }).verified,false); pass("single-source evidence rejected");
assert.equal(verificationGate({evidence:[ev(10,"a","same"),ev(10,"b","same")]}).verified,false); pass("duplicate evidence source cannot satisfy independence");
const original=ev(10,"a"); const tampered={...original,value:999}; assert.equal(verificationGate({evidence:[tampered,ev(999,"b")]}).verified,false); pass("tampered evidence rejected");

let chain=[]; for(let i=0;i<100;i++) chain.push(appendChainEvent(chain,createAuditEvent({operation:`OP_${i}`,module:"hardening",inputs:{i},result:{ok:true}}))); assert.equal(verifyAuditChain(chain),true); assert.equal(verifyAuditEvent(chain[50].event),true); pass("100-event audit chain integrity");
const badChain=chain.map(x=>({...x})); badChain[50]={...badChain[50],previousHash:"tampered"}; assert.equal(verifyAuditChain(badChain),false); pass("audit-chain tampering detected");

assert.throws(()=>createAnalysisJob({context:{authorized:false,principal:"x",tenantId:"tenant-a"},tenantId:"tenant-a",objective:"x"}),/Authorized/); pass("unauthorized job creation blocked");
assert.throws(()=>createAnalysisJob({context:ctx,tenantId:"tenant-b",objective:"x"}),/isolation/); pass("cross-tenant job creation blocked");
const candidate={id:"fix",description:"verified fix",recommendation:"apply verified fix",confidence:.9,impact:.9,feasibility:.9,risk:.1,evidence:[ev(42,"m1"),ev(42,"m2")]};
const job=createAnalysisJob({context:ctx,tenantId:"tenant-a",objective:"restore",observations:[{metric:"latency",value:42}],candidates:[candidate]});
assert.throws(()=>executeAnalysisJob({context:{...ctx,tenantId:"tenant-b"},job}),/isolation/); pass("cross-tenant execution blocked");
const alteredJob={...job,objective:"tampered"}; assert.throws(()=>executeAnalysisJob({context:ctx,job:alteredJob}),/integrity/); pass("job tampering detected before execution");
const result=executeAnalysisJob({context:ctx,job}); assert.equal(result.status,"VERIFIED_COMPLETE"); assert.equal(verifyApplicationResult(result),true); pass("verified end-to-end customer execution survives hardening");
const alteredResult={...result,status:"CHANGED"}; assert.equal(verifyApplicationResult(alteredResult),false); pass("result tampering detected");
const report=createDualAudienceReport({context:ctx,result}); const manifest=createExportManifest({context:ctx,report}); assert.ok(report.reportHash); assert.ok(manifest.manifestHash); pass("report/export integrity survives hardening");
const noJob=createAnalysisJob({context:ctx,tenantId:"tenant-a",objective:"unknown",candidates:[]}); const noResult=executeAnalysisJob({context:ctx,job:noJob}); const noReport=createDualAudienceReport({context:ctx,result:noResult}); assert.equal(noReport.business.recommendation,null); pass("no-evidence path still exposes no recommendation");

for(let i=0;i<100;i++){const j=createAnalysisJob({context:ctx,tenantId:"tenant-a",objective:`repeat-${i}`,candidates:[]}); const r=executeAnalysisJob({context:ctx,job:j}); assert.equal(verifyApplicationResult(r),true);} pass("100 repeated isolated jobs retain integrity");

console.log("\nALL GIE 1.0.0 HARDENING TESTS PASSED");
