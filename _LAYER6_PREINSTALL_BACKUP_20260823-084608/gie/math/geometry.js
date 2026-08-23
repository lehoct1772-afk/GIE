const EPSILON = 1e-10;

export function distance2D(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
}

export function circleArea(radius) {
  requireNonNegative(radius, "radius");
  return Math.PI * radius * radius;
}

export function circleCircumference(radius) {
  requireNonNegative(radius, "radius");
  return 2 * Math.PI * radius;
}

export function diameterFromRadius(radius) {
  requireNonNegative(radius, "radius");
  return radius * 2;
}

export function radiusFromDiameter(diameter) {
  requireNonNegative(diameter, "diameter");
  return diameter / 2;
}

export function angleBetweenVectors(a, b) {
  const dot = a.x * b.x + a.y * b.y;
  const ma = Math.hypot(a.x, a.y);
  const mb = Math.hypot(b.x, b.y);

  if (ma < EPSILON || mb < EPSILON) {
    throw new Error("Cannot calculate angle from a zero-length vector.");
  }

  const cosine = clamp(dot / (ma * mb), -1, 1);
  return Math.acos(cosine);
}

export function rotatePoint(point, angleRadians, origin = { x: 0, y: 0 }) {
  const x = point.x - origin.x;
  const y = point.y - origin.y;

  const cos = Math.cos(angleRadians);
  const sin = Math.sin(angleRadians);

  return {
    x: origin.x + x * cos - y * sin,
    y: origin.y + x * sin + y * cos
  };
}

export function scalePoint(point, factor, origin = { x: 0, y: 0 }) {
  return {
    x: origin.x + (point.x - origin.x) * factor,
    y: origin.y + (point.y - origin.y) * factor
  };
}

export function centroid(points) {
  if (!Array.isArray(points) || points.length === 0) {
    throw new Error("centroid requires at least one point.");
  }

  return points.reduce(
    (acc, point) => ({
      x: acc.x + point.x / points.length,
      y: acc.y + point.y / points.length
    }),
    { x: 0, y: 0 }
  );
}

function requireNonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a finite non-negative number.`);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
