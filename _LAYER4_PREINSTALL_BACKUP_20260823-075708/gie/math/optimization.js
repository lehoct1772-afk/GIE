export function gradientDescent({
  start,
  gradient,
  learningRate = 0.01,
  iterations = 100
}) {
  let point = [...start];
  const trace = [];

  for (let i = 0; i < iterations; i++) {
    const grad = gradient(point);

    point = point.map(
      (value, index) =>
        value - learningRate * grad[index]
    );

    trace.push({
      iteration: i + 1,
      point: [...point]
    });
  }

  return {
    solution: point,
    trace
  };
}
