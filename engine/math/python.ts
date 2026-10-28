import type { SystemSnapshot, Identification, Diagnosis, NodeId, MathModule } from "../types";

export const pythonMath: MathModule = {
  name: "python",

  rootForward(snapshot: SystemSnapshot, _id: Identification): Map<NodeId, Diagnosis> {
    const out = new Map<NodeId, Diagnosis>();
    for (const file of snapshot.files) {
      const nodeId = file.path;
      let severity: Diagnosis["severity"] = "nominal";
      let cause: Diagnosis["cause"] = "unknown";
      let issue = "no issue";
      let recommendation = "none";

      if (file.path === "requirements.txt" && file.content && /==\s*$/.test(file.content)) {
        severity = "degraded";
        cause = "human";
        issue = "unpinned dependency in requirements.txt";
        recommendation = "pin every dependency to an exact version";
      } else if (file.path.endsWith(".py") && file.content && /eval\(/.test(file.content)) {
        severity = "critical";
        cause = "human";
        issue = "use of eval() in Python source";
        recommendation = "replace eval with safe parsing";
      } else if (file.path.endsWith(".py") && file.content && /except:\s*pass/.test(file.content)) {
        severity = "degraded";
        cause = "human";
        issue = "bare except with pass — silent failure";
        recommendation = "log or re-raise the exception";
      } else if (file.path === "Pipfile" || file.path === "pyproject.toml") {
        if (file.content && /\bpython_requires\b.*<\s*3/.test(file.content)) {
          severity = "degraded";
          cause = "human";
          issue = "project requires an unsupported Python version";
          recommendation = "raise the minimum Python version";
        }
      }

      out.set(nodeId, {
        nodeId,
        severity,
        cause,
        issue,
        recommendation,
        evidence: [{ kind: "file", path: file.path, reason: "python source check" }],
      });
    }
    return out;
  },

  clientBackward(snapshot: SystemSnapshot, _id: Identification): Map<NodeId, Diagnosis> {
    return this.rootForward(snapshot, _id);
  },
};