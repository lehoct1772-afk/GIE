const EPSILON = 1e-9;

function finite(value, name) {
  if (!Number.isFinite(value)) throw new Error(`${name} must be finite.`);
  return value;
}

export function classifyCircleRelationship(a, b, tolerance = EPSILON) {
  for (const [name, circle] of [["a", a], ["b", b]]) {
    if (!circle || !Number.isFinite(circle.x) || !Number.isFinite(circle.y) || !Number.isFinite(circle.radius) || circle.radius < 0) {
      throw new Error(`${name} must contain finite x, y and non-negative radius.`);
    }
  }
  finite(tolerance, "tolerance");
  const centerDistance = Math.hypot(b.x - a.x, b.y - a.y);
  const sum = a.radius + b.radius;
  const difference = Math.abs(a.radius - b.radius);
  let relationship;
  if (centerDistance <= tolerance && difference <= tolerance) relationship = "COINCIDENT";
  else if (centerDistance > sum + tolerance) relationship = "DISJOINT";
  else if (Math.abs(centerDistance - sum) <= tolerance) relationship = "EXTERNALLY_TANGENT";
  else if (centerDistance + Math.min(a.radius, b.radius) < Math.max(a.radius, b.radius) - tolerance) relationship = "CONTAINED";
  else if (Math.abs(centerDistance - difference) <= tolerance) relationship = "INTERNALLY_TANGENT";
  else relationship = "INTERSECTING";
  return { relationship, centerDistance, radiusSum: sum, radiusDifference: difference };
}

export function proportionalRelationship(a, b) {
  finite(a, "a"); finite(b, "b");
  if (Math.abs(b) <= EPSILON) throw new Error("b must be non-zero.");
  const ratio = a / b;
  return { ratio, inverseRatio: Math.abs(a) <= EPSILON ? null : b / a };
}

export function areCollinear(a, b, c, tolerance = EPSILON) {
  const cross = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  return Math.abs(cross) <= tolerance;
}
