import type { SystemSnapshot, Diagnosis, NodeId, Severity, Cause } from "./types";

export type GraphNode = {
  id: NodeId;
  label: string;
  parentId: NodeId | null;
  depth: number;
  severity: Severity;
  cause: Cause;
  issue: string;
  recommendation: string;
};

export type GraphArc = {
  id: string;
  parentId: NodeId;
  childId: NodeId;
  health: Severity;
};

export type SystemGraph = {
  rootId: NodeId;
  nodes: Map<NodeId, GraphNode>;
  arcs: GraphArc[];
  children: Map<NodeId, NodeId[]>;
};

export function buildGraph(
  snapshot: SystemSnapshot,
  diagnoses: Map<NodeId, Diagnosis>
): SystemGraph {
  const nodes = new Map<NodeId, GraphNode>();
  const arcs: GraphArc[] = [];
  const children = new Map<NodeId, NodeId[]>();

  const rootId = "__root__";
  nodes.set(rootId, {
    id: rootId,
    label: snapshot.root,
    parentId: null,
    depth: 0,
    severity: "nominal",
    cause: "unknown",
    issue: "no issue",
    recommendation: "none",
  });

  const dirIds = new Map<string, NodeId>();
  dirIds.set("", rootId);

  const ensureDir = (path: string): NodeId => {
    if (dirIds.has(path)) return dirIds.get(path)!;

    const parts = path.split("/");
    const name = parts[parts.length - 1]!;
    const parentPath = parts.slice(0, -1).join("/");
    const parentId = ensureDir(parentPath);
    const id = `dir:${path}`;

    nodes.set(id, {
      id,
      label: name,
      parentId,
      depth: parts.length,
      severity: "nominal",
      cause: "unknown",
      issue: "no issue",
      recommendation: "none",
    });

    children.set(id, []);
    children.get(parentId)!.push(id);
    arcs.push({ id: `arc:${parentId}->${id}`, parentId, childId: id, health: "nominal" });

    dirIds.set(path, id);
    return id;
  };

  for (const file of snapshot.files) {
    const parts = file.path.split("/");
    const parentPath = parts.slice(0, -1).join("/");
    const parentId = ensureDir(parentPath);
    const id = `file:${file.path}`;

    const diag = diagnoses.get(file.path);
    nodes.set(id, {
      id,
      label: parts[parts.length - 1]!,
      parentId,
      depth: parts.length,
      severity: diag?.severity ?? "nominal",
      cause: diag?.cause ?? "unknown",
      issue: diag?.issue ?? "no issue",
      recommendation: diag?.recommendation ?? "none",
    });

    if (!children.has(parentId)) children.set(parentId, []);
    children.get(parentId)!.push(id);
    arcs.push({ id: `arc:${parentId}->${id}`, parentId, childId: id, health: diag?.severity ?? "nominal" });
  }

  rollup(nodes, children, rootId);

  return { rootId, nodes, arcs, children };
}

function rollup(
  nodes: Map<NodeId, GraphNode>,
  children: Map<NodeId, NodeId[]>,
  id: NodeId
): Severity {
  const kids = children.get(id) ?? [];
  let worst: Severity = nodes.get(id)?.severity ?? "nominal";

  for (const kid of kids) {
    const childSev = rollup(nodes, children, kid);
    if (rank(childSev) > rank(worst)) worst = childSev;
  }

  const node = nodes.get(id);
  if (node) node.severity = worst;
  return worst;
}

function rank(s: Severity): number {
  switch (s) {
    case "critical": return 3;
    case "degraded": return 2;
    case "unknown": return 1;
    case "nominal": return 0;
  }
}