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
import * as layer2 from "../layer2/index.js";
import * as layer3 from "../layer3/index.js";
import * as layer4 from "../layer4/index.js";
import * as layer5 from "../layer5/index.js";
import * as layer6 from "../layer6/index.js";

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
  quantum,
  layer2,
  layer3,
  layer4,
  layer5,
  layer6
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
      verificationRequiredForDerivedResults: true,
      timestampedProvenanceRequired: true,
      securityBoundaryRequired: true
    }
  };
}
