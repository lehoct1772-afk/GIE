import { randomUUID } from "node:crypto";
import { assertPlainData, requireAuthorizedContext } from "../security/validation.js";
import { createAuditEvent, sha256 } from "../provenance/audit.js";
import { verificationGate } from "../layer4/verificationGate.js";

const finite = n => typeof n === "number" && Number.isFinite(n);

export function decomposeProblem({problemId=randomUUID(), objective, constraints=[], observations=[]}) {
  if (!objective || typeof objective !== "string") throw new Error("Problem objective is required.");
  assertPlainData({constraints, observations});
  const tasks = observations.map((o,i)=>({id:`${problemId}:obs:${i+1}`, type:"ANALYZE_OBSERVATION", observation:o}));
  tasks.push({id:`${problemId}:verify`, type:"VERIFY_CANDIDATES"});
  tasks.push({id:`${problemId}:rank`, type:"RANK_VERIFIED_SOLUTIONS"});
  return Object.freeze({problemId, objective, constraints, observations, tasks});
}

export function scoreCandidate(candidate) {
  if (!candidate?.id) throw new Error("Candidate id is required.");
  const confidence = finite(candidate.confidence) ? Math.max(0,Math.min(1,candidate.confidence)) : 0;
  const impact = finite(candidate.impact) ? Math.max(0,Math.min(1,candidate.impact)) : 0;
  const feasibility = finite(candidate.feasibility) ? Math.max(0,Math.min(1,candidate.feasibility)) : 0;
  const risk = finite(candidate.risk) ? Math.max(0,Math.min(1,candidate.risk)) : 1;
  return 0.35*confidence + 0.30*impact + 0.25*feasibility + 0.10*(1-risk);
}

export function evaluateCandidate(candidate,{tolerance=1e-9,minimumIndependent=2}={}) {
  assertPlainData(candidate);
  const gate=verificationGate({evidence:candidate.evidence??[],tolerance,minimumIndependent});
  const score=gate.verified?scoreCandidate(candidate):0;
  return Object.freeze({...candidate,verification:gate,score,status:gate.verified?"VERIFIED_CANDIDATE":"REJECTED_CANDIDATE"});
}

export function rankVerifiedCandidates(candidates) {
  if(!Array.isArray(candidates)) throw new Error("Candidates must be an array.");
  return candidates.filter(c=>c.verification?.verified===true).sort((a,b)=>b.score-a.score || String(a.id).localeCompare(String(b.id))).map((c,i)=>Object.freeze({...c,rank:i+1}));
}

export function solveProblem({context,objective,constraints=[],observations=[],candidates=[],tolerance=1e-9}) {
  requireAuthorizedContext(context);
  assertPlainData({objective,constraints,observations,candidates});
  const decomposition=decomposeProblem({objective,constraints,observations});
  const evaluated=candidates.map(c=>evaluateCandidate(c,{tolerance}));
  const ranked=rankVerifiedCandidates(evaluated);
  const status=ranked.length?"VERIFIED_SOLUTION_AVAILABLE":"NO_VERIFIED_SOLUTION";
  const selected=ranked[0]??null;
  const result={analysisId:randomUUID(),problemId:decomposition.problemId,status,decomposition,evaluated,ranked,selected};
  const audit=createAuditEvent({analysisId:result.analysisId,operation:"SOLVE_PROBLEM",module:"layer5",inputs:{objective,constraints,observations,candidates},result:{status,selectedId:selected?.id??null},status});
  const integrityHash=sha256({result,auditHash:audit.eventHash});
  return Object.freeze({...result,audit,integrityHash});
}

export function verifySolutionIntegrity(solution){
  if(!solution?.integrityHash||!solution?.audit)return false;
  const {audit,integrityHash,...result}=solution;
  return sha256({result,auditHash:audit.eventHash})===integrityHash;
}
