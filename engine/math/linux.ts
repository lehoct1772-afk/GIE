import type { SystemSnapshot, Identification, Diagnosis, NodeId, MathModule } from "../types";

export const linuxMath: MathModule = {
  name: "linux",

  rootForward(snapshot: SystemSnapshot, _id: Identification): Map<NodeId, Diagnosis> {
    const out = new Map<NodeId, Diagnosis>();
    for (const file of snapshot.files) {
      const nodeId = file.path;
      let severity: Diagnosis["severity"] = "nominal";
      let cause: Diagnosis["cause"] = "unknown";
      let issue = "no issue";
      let recommendation = "none";

      if (/^etc\/shadow$/.test(file.path)) {
        severity = "degraded";
        cause = "human";
        issue = "shadow file present and readable in snapshot";
        recommendation = "verify permissions are 640 root:shadow";
      } else if (file.path.endsWith(".service") && file.content && !/Restart=/.test(file.content)) {
        severity = "degraded";
        cause = "human";
        issue = "systemd unit missing Restart policy";
        recommendation = "add Restart=on-failure to unit";
      } else if (file.path.startsWith("var/log/") && file.size > 100_000_000) {
        severity = "critical";
        cause = "machine";
        issue = "log file exceeds 100MB — likely rotation failure";
        recommendation = "check logrotate config and rotate immediately";
      }

      out.set(nodeId, {
        nodeId,
        severity,
        cause,
        issue,
        recommendation,
        evidence: [{ kind: "file", path: file.path, reason: "linux file check" }],
      });
    }
    return out;
  },

  clientBackward(snapshot: SystemSnapshot, _id: Identification): Map<NodeId, Diagnosis> {
    return this.rootForward(snapshot, _id);
  },
};