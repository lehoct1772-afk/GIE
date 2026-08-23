import { sha256 } from "../provenance/audit.js";
export function appendChainEvent(chain=[],event){const previousHash=chain.length?chain[chain.length-1].chainHash:null;const payload={sequence:chain.length,previousHash,event};return Object.freeze({...payload,chainHash:sha256(payload)});}
export function verifyAuditChain(chain=[]){let previousHash=null;for(let i=0;i<chain.length;i++){const item=chain[i];if(item.sequence!==i||item.previousHash!==previousHash)return false;const {chainHash,...payload}=item;if(sha256(payload)!==chainHash)return false;previousHash=chainHash;}return true;}
