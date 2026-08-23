import { sha256 } from "../provenance/audit.js";
export function qualifyEvidence({source, value, method, independent=true, reproducible=true, integrity=true}) {
  if (!source || !method) throw new Error("Evidence source and method are required.");
  const qualified = independent === true && reproducible === true && integrity === true;
  const record = {source, method, independent:!!independent, reproducible:!!reproducible, integrity:!!integrity, value, qualified};
  return Object.freeze({...record, evidenceHash:sha256(record)});
}
export function verifyEvidenceIntegrity(evidence){
  if(!evidence?.evidenceHash)return false;
  const {evidenceHash,...record}=evidence;
  return sha256(record)===evidenceHash;
}
