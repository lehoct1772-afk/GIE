import type { Diagnosis, Direction, NodeId } from "./types";

export type TraversalResult = {
  direction: Direction;
  answers: Map<NodeId, Diagnosis>;
};

export type ConvergenceResult = {
  converged: boolean;
  disagreements: Array<{
    nodeId: NodeId;
    forward: Diagnosis;
    backward: Diagnosis;
  }>;
  answer: Map<NodeId, Diagnosis>;
};

export function converge(
  forward: TraversalResult,
  backward: TraversalResult
): ConvergenceResult {
  const disagreements: ConvergenceResult["disagreements"] = [];
  const answer = new Map<NodeId, Diagnosis>();

  const allIds = new Set<NodeId>([
    ...forward.answers.keys(),
    ...backward.answers.keys(),
  ]);

  for (const nodeId of allIds) {
    const f = forward.answers.get(nodeId);
    const b = backward.answers.get(nodeId);

    if (!f || !b) {
      if (f) answer.set(nodeId, f);
      if (b) answer.set(nodeId, b);
      continue;
    }

    const same =
      f.severity === b.severity &&
      f.cause === b.cause &&
      f.issue === b.issue;

    if (same) {
      answer.set(nodeId, f);
    } else {
      disagreements.push({ nodeId, forward: f, backward: b });
      answer.set(nodeId, f);
    }
  }

  return {
    converged: disagreements.length === 0,
    disagreements,
    answer,
  };
}