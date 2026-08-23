import {
  Geometry,
  Sequences,
  Graph,
  Information,
  Quantum,
  describeEngine,
  verifyAgreement
} from "./index.js";

const tests = [];

function test(name, fn) {
  try {
    fn();
    tests.push({ name, passed: true });
  } catch (error) {
    tests.push({
      name,
      passed: false,
      error: error.message
    });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

test("circle radius/diameter", () => {
  assert(
    Geometry.radiusFromDiameter(72) === 36,
    "72 diameter should produce radius 36."
  );
});

test("fibonacci", () => {
  const sequence = Sequences.fibonacci(8);

  assert(
    JSON.stringify(sequence) ===
      JSON.stringify([0,1,1,2,3,5,8,13]),
    "Fibonacci sequence failed."
  );
});

test("graph components", () => {
  const graph = Graph.createGraph(
    [{ id: "A" }, { id: "B" }, { id: "C" }],
    [{ from: "A", to: "B" }]
  );

  assert(
    Graph.connectedComponents(graph).length === 2,
    "Graph component calculation failed."
  );
});

test("entropy", () => {
  const value = Information.entropy([0.5, 0.5]);

  assert(
    Math.abs(value - 1) < 1e-10,
    "Entropy calculation failed."
  );
});

test("quantum normalization", () => {
  const probabilities =
    Quantum.measurementProbabilities([
      Quantum.complex(1, 0),
      Quantum.complex(1, 0)
    ]);

  assert(
    Math.abs(probabilities[0] - 0.5) < 1e-10 &&
    Math.abs(probabilities[1] - 0.5) < 1e-10,
    "Quantum normalization failed."
  );
});

test("cross-method verification", () => {
  const result = verifyAgreement({
    values: [
      Geometry.circleCircumference(10),
      20 * Math.PI
    ]
  });

  assert(result.verified, "Verification failed.");
});

console.log("");
console.log("GIE ENGINE SELF TEST");
console.log("====================");

for (const result of tests) {
  console.log(
    result.passed
      ? `PASS  ${result.name}`
      : `FAIL  ${result.name}: ${result.error}`
  );
}

const failed = tests.filter(test => !test.passed);

console.log("");
console.log(JSON.stringify(describeEngine(), null, 2));

if (failed.length) {
  process.exit(1);
}

console.log("");
console.log("ALL GIE ENGINE TESTS PASSED");
