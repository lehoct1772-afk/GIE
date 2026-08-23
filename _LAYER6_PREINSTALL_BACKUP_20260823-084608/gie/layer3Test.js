import assert from "node:assert/strict";
import { WorldGraph, Diagnostics, AuditChain, analyzeDependencies } from "./layer3/index.js";
import { verifyAuditEvent } from "./provenance/audit.js";
const tests=[];function test(name,fn){tests.push([name,fn]);}
const nodes=[{id:"db"},{id:"api"},{id:"web"},{id:"billing"}];const edges=[{from:"db",to:"api"},{from:"api",to:"web"},{from:"api",to:"billing"}];
test("world graph integrity",()=>{const g=WorldGraph.createWorldGraph({nodes,edges});assert.equal(g.nodes.length,4);assert.equal(g.edges.length,3);});
test("dependency path",()=>{const g=WorldGraph.createWorldGraph({nodes,edges});assert.deepEqual(WorldGraph.shortestPath(g,"db","billing").path,["db","api","billing"]);});
test("impact analysis",()=>{const g=WorldGraph.createWorldGraph({nodes,edges});assert.deepEqual(new Set(Diagnostics.impactAnalysis(g,"api").downstream),new Set(["web","billing"]));});
test("cycle detection",()=>{const g=WorldGraph.createWorldGraph({nodes:[{id:"a"},{id:"b"}],edges:[{from:"a",to:"b"},{from:"b",to:"a"}]});assert.equal(WorldGraph.detectCycles(g).length>0,true);});
test("topological order",()=>{const g=WorldGraph.createWorldGraph({nodes,edges});const order=WorldGraph.topologicalOrder(g);assert.ok(order.indexOf("db")<order.indexOf("api"));});
test("root-cause ranking",()=>{const g=WorldGraph.createWorldGraph({nodes,edges});const r=Diagnostics.rankRootCauseCandidates(g,["web","billing"]);assert.equal(r[0].nodeId,"api");assert.equal(r[0].coverage,2);});
test("baseline deviation",()=>{const d=Diagnostics.compareObservedToBaseline({baseline:{latency:100},observed:{latency:160},tolerance:10});assert.equal(d[0].delta,60);});
test("tamper-evident audit chain",()=>{const e={eventHash:"abc",timestamp:"2026-01-01T00:00:00.000Z"};const a=AuditChain.appendChainEvent([],e);const b=AuditChain.appendChainEvent([a],{...e,eventHash:"def"});assert.equal(AuditChain.verifyAuditChain([a,b]),true);assert.equal(AuditChain.verifyAuditChain([a,{...b,previousHash:"bad"}]),false);});
test("authorized timestamped analysis",()=>{const r=analyzeDependencies({context:{authorized:true,principal:"test"},nodes,edges,observedNodeIds:["web","billing"]});assert.equal(r.rootCauseCandidates[0].nodeId,"api");assert.equal(verifyAuditEvent(r.audit),true);assert.match(r.audit.timestamp,/Z$/);});
console.log("\nGIE LAYER 3 SELF TEST\n=====================");let failed=0;for(const [name,fn] of tests){try{fn();console.log(`PASS  ${name}`);}catch(e){failed++;console.error(`FAIL  ${name}: ${e.message}`);}}if(failed){console.error(`\n${failed} LAYER 3 TEST(S) FAILED`);process.exit(1);}console.log("\nALL GIE LAYER 3 TESTS PASSED");
