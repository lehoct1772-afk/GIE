export function normalizeProbabilities(values) {
  const total = values.reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    throw new Error("Probability weights must have positive total mass.");
  }

  return values.map(value => value / total);
}

export function entropy(probabilities) {
  const normalized = normalizeProbabilities(probabilities);

  return -normalized.reduce((sum, probability) => {
    if (probability === 0) return sum;
    return sum + probability * Math.log2(probability);
  }, 0);
}

export function expectedValue(values, probabilities) {
  if (values.length !== probabilities.length) {
    throw new Error("Values and probabilities must have equal length.");
  }

  const p = normalizeProbabilities(probabilities);

  return values.reduce(
    (sum, value, i) => sum + value * p[i],
    0
  );
}
