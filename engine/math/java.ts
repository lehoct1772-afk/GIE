import type { SystemSnapshot, Identification, Diagnosis, NodeId, MathModule } from "../types";

export const javaMath: MathModule = {
  name: "java",

  rootForward(snapshot: SystemSnapshot, _id: Identification): Map<NodeId, Diagnosis> {
    const out = new Map<NodeId, Diagnosis>();
    for (const file of snapshot.files) {
      const nodeId = file.path;
      let severity: Diagnosis["severity"] = "nominal";
      let cause: Diagnosis["cause"] = "unknown";
      let issue = "no issue";
      let recommendation = "none";

      if (file.path === "pom.xml" && file.content && /SNAPSHOT/.test(file.content)) {
        severity = "degraded";
        cause = "human";
        issue = "SNAPSHOT dependency in pom.xml — not production-safe";
        recommendation = "pin to a released version";
      } else if (file.path.endsWith(".jar") && file.size === 0) {
        severity = "critical";
        cause = "machine";
        issue = "empty JAR — build or download failed";
        recommendation = "rebuild or re-fetch artifact";
      } else if (file.path.endsWith(".class") && file.content) {
        const major = file.content.charCodeAt(6);
        if (major > 61) {
          severity = "degraded";
          cause = "human";
          issue = "class compiled for newer JVM than target";
          recommendation = "recompile with target JVM version";
        }
      }

      out.set(nodeId, {
        nodeId,
        severity,
        cause,
        issue,
        recommendation,
        evidence: [{ kind: "file", path: file.path, reason: "java artifact check" }],
      });
    }
    return out;
  },

  clientBackward(snapshot: SystemSnapshot, _id: Identification): Map<NodeId, Diagnosis> {
    return this.rootForward(snapshot, _id);
  },
};