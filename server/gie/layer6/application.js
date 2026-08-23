import { randomUUID } from "node:crypto";
import { assertPlainData, requireAuthorizedContext } from "../security/validation.js";
import { createAuditEvent, sha256 } from "../provenance/audit.js";
import { solveProblem, verifySolutionIntegrity } from "../layer5/problemSolver.js";

function requireTenantContext(context, tenantId) {
  requireAuthorizedContext(context);
  if (!tenantId || typeof tenantId !== "string" || !tenantId.trim()) throw new Error("tenantId is required.");
  if (context.tenantId !== tenantId) throw new Error("Customer isolation boundary violation.");
  return true;
}

export function createAnalysisJob({context,tenantId,objective,constraints=[],observations=[],candidates=[]}) {
  requireTenantContext(context,tenantId);
  assertPlainData({objective,constraints,observations,candidates});
  if (!objective || typeof objective !== "string") throw new Error("Analysis objective is required.");
  const createdAt=new Date().toISOString();
  const job={jobId:randomUUID(),tenantId,createdAt,status:"CREATED",objective,constraints,observations,candidates,inputHash:sha256({tenantId,objective,constraints,observations,candidates})};
  return Object.freeze(job);
}

export function executeAnalysisJob({context,job}) {
  requireTenantContext(context,job?.tenantId);
  assertPlainData(job);
  const expected=sha256({tenantId:job.tenantId,objective:job.objective,constraints:job.constraints,observations:job.observations,candidates:job.candidates});
  if(expected!==job.inputHash) throw new Error("Analysis job integrity check failed.");
  const solution=solveProblem({context,objective:job.objective,constraints:job.constraints,observations:job.observations,candidates:job.candidates});
  const completedAt=new Date().toISOString();
  const status=solution.status==="VERIFIED_SOLUTION_AVAILABLE"?"VERIFIED_COMPLETE":"COMPLETE_NO_VERIFIED_SOLUTION";
  const audit=createAuditEvent({analysisId:solution.analysisId,operation:"EXECUTE_APPLICATION_JOB",module:"layer6",inputs:{jobId:job.jobId,tenantId:job.tenantId,inputHash:job.inputHash},result:{status,solutionHash:solution.integrityHash},status});
  const result={jobId:job.jobId,tenantId:job.tenantId,createdAt:job.createdAt,completedAt,status,solution};
  return Object.freeze({...result,audit,integrityHash:sha256({result,auditHash:audit.eventHash})});
}

export function verifyApplicationResult(result){
  if(!result?.integrityHash||!result?.audit||!verifySolutionIntegrity(result.solution))return false;
  const {integrityHash,audit,...rest}=result;
  return sha256({result:rest,auditHash:audit.eventHash})===integrityHash;
}

export function createDualAudienceReport({context,result}) {
  requireTenantContext(context,result?.tenantId);
  if(!verifyApplicationResult(result))throw new Error("Application result failed integrity verification.");
  const s=result.solution;
  const selected=s.selected;
  const business=selected?{
    status:"VERIFIED_RECOMMENDATION_AVAILABLE",
    summary:`Verified solution ${selected.id} ranked first for the stated objective.`,
    priority:selected.rank??1,
    expectedImpact:selected.impact??null,
    recommendation:selected.recommendation??selected.description??selected.id
  }:{status:"NO_VERIFIED_RECOMMENDATION",summary:"Available evidence did not satisfy GIE verification requirements.",priority:null,expectedImpact:null,recommendation:null};
  const technical={status:s.status,analysisId:s.analysisId,problemId:s.problemId,selectedId:selected?.id??null,score:selected?.score??null,verification:selected?.verification??null,rankedCandidates:s.ranked.map(c=>({id:c.id,rank:c.rank,score:c.score,status:c.status})),solutionIntegrityHash:s.integrityHash,applicationIntegrityHash:result.integrityHash};
  const generatedAt=new Date().toISOString();
  const report={reportId:randomUUID(),tenantId:result.tenantId,jobId:result.jobId,generatedAt,business,technical};
  return Object.freeze({...report,reportHash:sha256(report)});
}

export function createExportManifest({context,report}){
  requireTenantContext(context,report?.tenantId);
  const {reportHash,...body}=report??{};
  if(!reportHash||sha256(body)!==reportHash)throw new Error("Report integrity check failed.");
  const manifest={exportId:randomUUID(),tenantId:report.tenantId,jobId:report.jobId,reportId:report.reportId,exportedAt:new Date().toISOString(),format:"GIE_VERIFIED_REPORT_V1",reportHash};
  return Object.freeze({...manifest,manifestHash:sha256(manifest)});
}
