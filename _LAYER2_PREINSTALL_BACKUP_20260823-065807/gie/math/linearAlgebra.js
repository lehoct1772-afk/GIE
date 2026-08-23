export function dot(a, b) {
  requireSameLength(a, b);
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

export function magnitude(vector) {
  return Math.sqrt(dot(vector, vector));
}

export function normalize(vector) {
  const mag = magnitude(vector);

  if (mag === 0) {
    throw new Error("Cannot normalize a zero vector.");
  }

  return vector.map(value => value / mag);
}

export function matrixVectorMultiply(matrix, vector) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    throw new Error("Matrix is required.");
  }

  return matrix.map(row => {
    if (row.length !== vector.length) {
      throw new Error("Matrix/vector dimensions do not match.");
    }

    return dot(row, vector);
  });
}

export function transpose(matrix) {
  if (!matrix.length) return [];

  return matrix[0].map((_, column) =>
    matrix.map(row => row[column])
  );
}

function requireSameLength(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    throw new Error("Vectors must have matching dimensions.");
  }
}
