import * as geometry from "../math/geometry.js";
import * as linearAlgebra from "../math/linearAlgebra.js";
import * as sequences from "../math/sequences.js";
import * as graph from "../math/graph.js";
import * as topology from "../math/topology.js";
import * as harmonic from "../math/harmonic.js";
import * as information from "../math/information.js";
import * as optimization from "../math/optimization.js";
import * as dynamics from "../math/dynamics.js";
import * as quantum from "../math/quantum.js";

export const modules = Object.freeze({
  geometry,
  linearAlgebra,
  sequences,
  graph,
  topology,
  harmonic,
  information,
  optimization,
  dynamics,
  quantum
});

export function listModules() {
  return Object.keys(modules);
}

export function describeEngine() {
  return {
    engine: "GIE",
    architecture: "GEOMETRY_CENTERED",
    modules: listModules(),

    rules: {
      acceptedMathModificationByAI: false,
      geometryRemainsOrganizingLayer: true,
      verificationRequiredForDerivedResults: true
    }
  };
}
