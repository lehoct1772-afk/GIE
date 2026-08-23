export function eulerCharacteristic({
  vertices = 0,
  edges = 0,
  faces = 0
}) {
  return vertices - edges + faces;
}

export function topologySummary({
  vertices = 0,
  edges = 0,
  faces = 0,
  connectedComponents = 1,
  holes = 0
}) {
  return {
    vertices,
    edges,
    faces,
    connectedComponents,
    holes,
    eulerCharacteristic:
      eulerCharacteristic({ vertices, edges, faces })
  };
}
