export function createGraph(nodes = [], edges = []) {
  return {
    nodes: [...nodes],
    edges: [...edges]
  };
}

export function adjacencyMap(graph) {
  const map = new Map();

  for (const node of graph.nodes) {
    map.set(node.id, []);
  }

  for (const edge of graph.edges) {
    if (!map.has(edge.from)) map.set(edge.from, []);
    if (!map.has(edge.to)) map.set(edge.to, []);

    map.get(edge.from).push({
      node: edge.to,
      weight: edge.weight ?? 1
    });

    if (!edge.directed) {
      map.get(edge.to).push({
        node: edge.from,
        weight: edge.weight ?? 1
      });
    }
  }

  return map;
}

export function degreeCentrality(graph) {
  const adjacency = adjacencyMap(graph);
  const output = {};

  for (const [node, neighbors] of adjacency.entries()) {
    output[node] = neighbors.length;
  }

  return output;
}

export function connectedComponents(graph) {
  const adjacency = adjacencyMap(graph);
  const visited = new Set();
  const components = [];

  for (const node of adjacency.keys()) {
    if (visited.has(node)) continue;

    const component = [];
    const stack = [node];

    while (stack.length) {
      const current = stack.pop();

      if (visited.has(current)) continue;

      visited.add(current);
      component.push(current);

      for (const neighbor of adjacency.get(current) ?? []) {
        if (!visited.has(neighbor.node)) {
          stack.push(neighbor.node);
        }
      }
    }

    components.push(component);
  }

  return components;
}
