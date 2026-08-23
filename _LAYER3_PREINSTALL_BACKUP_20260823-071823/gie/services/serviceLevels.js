export const SERVICE_LEVELS = Object.freeze({
  diagnostic: {
    id: "GIE_DIAGNOSTIC",
    analysisDepth: 1,
    modules: [
      "geometry",
      "graph",
      "information"
    ],
    crossVerification: true
  },

  advanced: {
    id: "GIE_ADVANCED",
    analysisDepth: 2,
    modules: [
      "geometry",
      "linearAlgebra",
      "graph",
      "topology",
      "information",
      "optimization"
    ],
    crossVerification: true
  },

  strategic: {
    id: "GIE_STRATEGIC",
    analysisDepth: 3,
    modules: [
      "geometry",
      "linearAlgebra",
      "sequences",
      "graph",
      "topology",
      "harmonic",
      "information",
      "optimization",
      "dynamics"
    ],
    crossVerification: true
  },

  fullEngine: {
    id: "GIE_FULL_ENGINE",
    analysisDepth: 4,
    modules: [
      "geometry",
      "linearAlgebra",
      "sequences",
      "graph",
      "topology",
      "harmonic",
      "information",
      "optimization",
      "dynamics",
      "quantum"
    ],
    crossVerification: true
  }
});

export function getServiceLevel(name) {
  const level = SERVICE_LEVELS[name];

  if (!level) {
    throw new Error(`Unknown GIE service level: ${name}`);
  }

  return level;
}
