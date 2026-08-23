import { verifyAgreement } from "../verification/verifier.js";
import { verifyEvidenceIntegrity } from "./evidence.js";
export function verificationGate({evidence, tolerance=1e-9, minimumIndependent=2}){
  if(!Array.isArray(evidence)||evidence.length<minimumIndependent) return {status:"INSUFFICIENT_EVIDENCE",verified:false,reason:"Not enough independent evidence."};
  const valid=evidence.filter(e=>e.qualified===true&&verifyEvidenceIntegrity(e));
  const sources=new Set(valid.map(e=>e.source));
  if(valid.length<minimumIndependent||sources.size<minimumIndependent) return {status:"INSUFFICIENT_EVIDENCE",verified:false,reason:"Independent qualified evidence requirement not met."};
  const numeric=valid.every(e=>typeof e.value==="number"&&Number.isFinite(e.value));
  if(!numeric) return {status:"REVIEW_REQUIRED",verified:false,reason:"Non-numeric evidence requires an explicit verifier."};
  const agreement=verifyAgreement({values:valid.map(e=>e.value),tolerance});
  return agreement.verified?{status:"VERIFIED",verified:true,agreement}:{status:"DISAGREEMENT",verified:false,agreement,reason:"Independent methods disagree."};
}
