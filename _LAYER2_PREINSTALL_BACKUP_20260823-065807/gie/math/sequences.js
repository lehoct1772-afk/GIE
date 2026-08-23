export const PHI = (1 + Math.sqrt(5)) / 2;

export function fibonacci(count) {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error("count must be a non-negative integer.");
  }

  if (count === 0) return [];
  if (count === 1) return [0];

  const values = [0, 1];

  while (values.length < count) {
    values.push(
      values[values.length - 1] +
      values[values.length - 2]
    );
  }

  return values;
}

export function ratioSequence(values) {
  if (!Array.isArray(values)) {
    throw new Error("values must be an array.");
  }

  const ratios = [];

  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] !== 0) {
      ratios.push(values[i] / values[i - 1]);
    }
  }

  return ratios;
}

export function goldenRatioDeviation(value) {
  return Math.abs(value - PHI);
}
