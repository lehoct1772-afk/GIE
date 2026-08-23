export function complex(real = 0, imaginary = 0) {
  return { real, imaginary };
}

export function complexAdd(a, b) {
  return {
    real: a.real + b.real,
    imaginary: a.imaginary + b.imaginary
  };
}

export function complexMultiply(a, b) {
  return {
    real:
      a.real * b.real -
      a.imaginary * b.imaginary,

    imaginary:
      a.real * b.imaginary +
      a.imaginary * b.real
  };
}

export function complexMagnitudeSquared(value) {
  return (
    value.real * value.real +
    value.imaginary * value.imaginary
  );
}

export function normalizeState(state) {
  const magnitude = Math.sqrt(
    state.reduce(
      (sum, amplitude) =>
        sum + complexMagnitudeSquared(amplitude),
      0
    )
  );

  if (magnitude === 0) {
    throw new Error("Quantum state cannot have zero magnitude.");
  }

  return state.map(amplitude => ({
    real: amplitude.real / magnitude,
    imaginary: amplitude.imaginary / magnitude
  }));
}

export function measurementProbabilities(state) {
  const normalized = normalizeState(state);

  return normalized.map(
    complexMagnitudeSquared
  );
}

export function tensorProduct(a, b) {
  const output = [];

  for (const left of a) {
    for (const right of b) {
      output.push(complexMultiply(left, right));
    }
  }

  return output;
}
