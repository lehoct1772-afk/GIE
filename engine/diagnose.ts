import type {
  SystemSnapshot,
  Identification,
  Diagnosis,
  NodeId,
  Direction,
} from "./types";
import { identify } from "./identify";
import { converge, type TraversalResult } from "./converge";
import { selectMath } from "./math/registry";

export type DiagnoseResult = {
  identification: Identification;
  converged: boolean;
  disagreements: Array<{
    nodeId: NodeId;
    forward: Diagnosis;
    backward: Diagnosis;
  }>;
  answers: Map<NodeId, Diagnosis>;
};

export function diagnose(snapshot: SystemSnapshot): DiagnoseResult {
  const identification = identify(snapshot);
  const math = selectMath(identification);

  const forward: TraversalResult = {
    direction: "forward" as Direction,
    answers: math.rootForward(snapshot, identification),
  };

  const backward: TraversalResult = {
    direction: "backward" as Direction,
    answers: math.clientBackward(snapshot, identification),
  };

  const result = converge(forward, backward);

  return {
    identification,
    converged: result.converged,
    disagreements: result.disagreements,
    answers: result.answer,
  };
}