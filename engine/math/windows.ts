import type { SystemSnapshot, Identification, Diagnosis, NodeId, MathModule } from "../types";

export const windowsMath: MathModule = {
  name: "windows",

  rootForward(snapshot: SystemSnapshot, _id: Identification): Map<NodeId, Diagnosis> {
    const out = new Map<NodeId, Diagnosis>();
    for (const file of snapshot.files) {
      const nodeId = file.path;
      let severity: Diagnosis["severity"] = "nominal";
      let cause: Diagnosis["cause"] = "unknown";
      let issue = "no issue";
      let recommendation = "none";

      if (/web\.config$/i.test(file.path) && file.content && /debug="true"/i.test(file.content)) {
        severity = "critical";
        cause = "human";
        issue = "debug mode enabled in web.config";
        recommendation = "set debug=\"false\" and restart IIS";
      } else if (/\.dll$/i.test(file.path) && file.size === 0) {
        severity = "critical";
        cause = "machine";
        issue = "zero-byte DLL — corrupt or missing binary";
        recommendation = "restore from known-good source";
      } else if (/\.bat$/i.test(file.path) && file.content && /net\s+user\s+.*\s+\/add/i.test(file.content)) {
        severity = "degraded";
        cause = "human";
        issue = "batch script creates user accounts";
        recommendation = "review privilege and disable if unused";
      }

      out.set(nodeId, {
        nodeId,
        severity,
        cause,
        issue,
        recommendation,
        evidence: [{ kind: "file", path: file.path, reason: "windows file check" }],
      });
    }
    return out;
  },

  clientBackward(snapshot: SystemSnapshot, _id: Identification): Map<NodeId, Diagnosis> {
    return this.rootForward(snapshot, _id);
  },
};