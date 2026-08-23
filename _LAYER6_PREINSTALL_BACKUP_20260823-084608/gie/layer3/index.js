import { randomUUID } from "node:crypto";
import { requireAuthorizedContext, assertPlainData } from "../security/validation.js";
import { createAuditEvent } from "../provenance/audit.js";
import * as WorldGraph from "./worldGraph.js";
import * as Diagnostics from "./diagnostics.js";
import * as AuditChain from "./auditChain.js";
export { WorldGraph, Diagnostics, AuditChain };
export function analyzeDependencies({context,nodes,edges,observedNodeIds=[]}){requireAuthorizedContext(context);assertPlainData({nodes,edges,observedNodeIds});const analysisId=randomUUID();const graph=WorldGraph.createWorldGraph({nodes,edges});const cycles=WorldGraph.detectCycles(graph);const rootCauseCandidates=Diagnostics.rankRootCauseCandidates(graph,observedNodeIds);const result={analysisId,cycles,rootCauseCandidates,graphSummary:{nodes:graph.nodes.length,edges:graph.edges.length}};const audit=createAuditEvent({analysisId,operation:"DEPENDENCY_ANALYSIS",module:"layer3",inputs:{nodes,edges,observedNodeIds},result});return Object.freeze({...result,audit});}
