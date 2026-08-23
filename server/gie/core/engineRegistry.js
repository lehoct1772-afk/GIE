/*
 * GIE — GEOMETRIC INTELLIGENCE ENGINE
 * ENGINE REGISTRY
 *
 * Geometry is the organizing layer.
 * Mathematical modules extend GIE without replacing
 * or modifying accepted GIE mathematics.
 */

export const GIE_ENGINE = Object.freeze({
  name: "GIE",
  fullName: "Geometric Intelligence Engine",
  architecture: "GEOMETRY_CENTERED",
  version: "0.2.0",

  authority: {
    acceptedMathematicsImmutable: true,
    aiMayModifyAcceptedMathematics: false,
    ownerAuthorizationRequiredForMathChanges: true
  },

  principles: {
    geometryFirst: true,
    traceableReasoning: true,
    crossMethodVerification: true,
    deterministicMathPreferred: true,
    preserveSourceEvidence: true
  }
});

export default GIE_ENGINE;
