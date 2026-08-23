import { sha256 } from "../provenance/audit.js";
export function createReplayRecord({analysisId, operation, inputs, result, verifierVersion="GIE-L4-1"}){
  if(!analysisId||!operation)throw new Error("analysisId and operation are required.");
  const record={analysisId,operation,inputHash:sha256(inputs),resultHash:sha256(result),verifierVersion};
  return Object.freeze({...record,replayHash:sha256(record)});
}
export function verifyReplayRecord(record,{inputs,result}){
  if(!record?.replayHash)return false;
  const {replayHash,...base}=record;
  return sha256(base)===replayHash&&record.inputHash===sha256(inputs)&&record.resultHash===sha256(result);
}
