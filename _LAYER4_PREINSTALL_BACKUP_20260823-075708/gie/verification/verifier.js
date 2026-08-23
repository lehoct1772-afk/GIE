export function approximatelyEqual(
  a,
  b,
  tolerance = 1e-9
) {
  return Math.abs(a - b) <= tolerance;
}

export function verifyAgreement({
  values,
  tolerance = 1e-9
}) {
  if (!Array.isArray(values) || values.length < 2) {
    throw new Error(
      "At least two independent values are required."
    );
  }

  const reference = values[0];

  const comparisons = values.slice(1).map(
    (value, index) => ({
      sourceIndex: index + 1,
      value,
      agrees:
        approximatelyEqual(
          reference,
          value,
          tolerance
        )
    })
  );

  return {
    reference,
    tolerance,
    verified:
      comparisons.every(item => item.agrees),
    comparisons
  };
}

export function createEvidenceTrace({
  operation,
  inputs,
  result,
  method,
  module
}) {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    operation,
    module,
    method,
    inputs,
    result
  };
}
