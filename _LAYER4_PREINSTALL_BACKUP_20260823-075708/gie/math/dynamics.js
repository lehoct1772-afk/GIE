export function iterateMap({
  initialState,
  transition,
  steps = 100
}) {
  let state = initialState;
  const trajectory = [state];

  for (let i = 0; i < steps; i++) {
    state = transition(state, i);
    trajectory.push(state);
  }

  return trajectory;
}

export function logisticMap({
  x0,
  r,
  steps = 100
}) {
  return iterateMap({
    initialState: x0,
    steps,
    transition: x => r * x * (1 - x)
  });
}
