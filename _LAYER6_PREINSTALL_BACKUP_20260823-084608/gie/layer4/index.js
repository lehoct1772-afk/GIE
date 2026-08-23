import { randomUUID } from "node:crypto";
import { assertPlainData, requireAuthorizedContext } from "../security/validation.js";
import { createAuditEvent } from "../provenance/audit.js";
import { verificationGate } from "./verificationGate.js";
import { createReplayRecord } from "./replay.js";
export * as Evidence from "./evidence.js";
export * as Replay from "./replay.js";
export { verificationGate } from "./verificationGate.js";
export function verifyAnalysis({context,operation="VERIFY_ANALYSIS",inputs={},evidence=[],tolerance=1e-9}){
  requireAuthorizedContext(context);assertPlainData(inputs);assertPlainData(evidence);
  const analysisId=randomUUID();
  const gate=verificationGate({evidence,tolerance});
  const result={analysisId,operation,gate};
  const audit=createAuditEvent({analysisId,operation,module:"layer4",inputs,result,status:gate.verified?"VERIFIED":gate.status});
  const replay=createReplayRecord({analysisId,operation,inputs,result});
  return Object.freeze({...result,audit,replay});
}
