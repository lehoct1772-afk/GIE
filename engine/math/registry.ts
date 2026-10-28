import type { Identification, MathModule } from "../types";
import { unixMath } from "./unix";
import { linuxMath } from "./linux";
import { windowsMath } from "./windows";
import { javaMath } from "./java";
import { pythonMath } from "./python";

const BY_OS: Record<string, MathModule> = {
  unix: unixMath,
  linux: linuxMath,
  windows: windowsMath,
  macos: unixMath,
};

const BY_RUNTIME: Record<string, MathModule> = {
  java: javaMath,
  python: pythonMath,
};

export function selectMath(id: Identification): MathModule {
  if (id.runtime && BY_RUNTIME[id.runtime]) {
    return BY_RUNTIME[id.runtime]!;
  }
  if (BY_OS[id.os]) {
    return BY_OS[id.os]!;
  }
  return unixMath;
}