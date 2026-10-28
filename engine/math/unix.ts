import type { SystemSnapshot, Identification, Diagnosis, NodeId, MathModule } from "../types";

export const unixMath: MathModule = {
  name: "unix",

  rootForward(snapshot: SystemSnapshot, _id: Identification): Map<NodeId, Diagnosis> {
    const out = new Map<NodeId, Diagnosis>();
    for (const file of snapshot.files) {
      const nodeId = file.path;
      const sev = file.content && /chmod\s+777/.test(file.content) ? "degraded" : "nominal";
      out.set(nodeId, {
        nodeId,
        severity: sev,
        cause: sev === "nominal" ? "unknown" : "human",
        issue: sev === "nominal" ? "no issue" : "world-writable permissions",
        recommendation: sev === "nominal" ? "none" : "restrict permissions",
        evidence: [{ kind: "file", path: file.path, reason: "unix permission check" }],
      });
    }
    return out;
  },

  clientBackward(snapshot: SystemSnapshot, _id: Identification): Map<NodeId, Diagnosis> {
    return this.rootForward(snapshot, _id);
  },
};