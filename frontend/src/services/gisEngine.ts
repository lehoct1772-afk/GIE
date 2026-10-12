import * as THREE from 'three';

/**
 * Professional Scientific Globe Engine Services
 * Modeled after CesiumJS, NASA WorldWind, and ArcGIS WebGL architectures.
 *
 * Provides WGS84 Ellipsoid geodetic transformations, spatial indexing,
 * tile/layer provider abstractions, and multi-spectral rendering pipelines.
 *
 * This is the computational bridge between geographic datasets and the 3D globe:
 * - Coordinate processing and transformations (true WGS84 ellipsoid)
 * - Spatial calculations and GIS measurements (Haversine, spherical)
 * - Geographic relationships and layer analysis
 * - Data needed by GIE's visualization/diagnostic system
 */

// ============================================================
// Types
// ============================================================

export interface WGS84Coordinates {
  latitude: number;   // -90 to +90 degrees
  longitude: number;  // -180 to +180 degrees
  altitude?: number;  // meters above WGS84 ellipsoid
}

export interface SpatialBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface GeodesicDistance {
  distanceKm: number;
  distanceMiles: number;
  bearingDegrees: number;
  start: WGS84Coordinates;
  end: WGS84Coordinates;
}

export type GISImageryProviderType =
  | 'SATELLITE_NASA_BLUE_MARBLE'
  | 'VECTOR_NATURAL_EARTH'
  | 'DARK_ENGINEERING_GIS'
  | 'TOPOGRAPHIC_RELIEF'
  | 'BATHYMETRIC_DEPTH';

export interface GISLayerConfig {
  provider: GISImageryProviderType;
  opacity: number;
  visible: boolean;
  resolution: number; // e.g. 2048, 4096
}

// ============================================================
// WGS84 Reference Ellipsoid Constants
// ============================================================

export const WGS84_SEMI_MAJOR_AXIS = 6378137.0; // meters
export const WGS84_SEMI_MINOR_AXIS = 6356752.314245; // meters
export const WGS84_FLATTENING = 1.0 / 298.257223563;
export const WGS84_ECCENTRICITY_SQUARED = 0.00669437999014;
export const EARTH_MEAN_RADIUS_KM = 6371.0;
export const EARTH_CIRCUMFERENCE_KM = 40075.017;

// ============================================================
// TRUE WGS84 ELLIPSOID ECEF CONVERSIONS
// ============================================================

/**
 * Converts WGS84 Latitude, Longitude, and Altitude to ECEF (Earth-Centered, Earth-Fixed)
 * Cartesian coordinates using the WGS84 ellipsoid.
 *
 * This is the mathematically correct transformation for real-world coordinates.
 */
export function wgs84ToECEF(
  lat: number,
  lng: number,
  alt = 0
): { x: number; y: number; z: number } {
  const phi = lat * (Math.PI / 180);
  const lambda = lng * (Math.PI / 180);

  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const sinLambda = Math.sin(lambda);
  const cosLambda = Math.cos(lambda);

  const N = WGS84_SEMI_MAJOR_AXIS / Math.sqrt(1 - WGS84_ECCENTRICITY_SQUARED * sinPhi * sinPhi);

  const x = (N + alt) * cosPhi * cosLambda;
  const y = (N + alt) * cosPhi * sinLambda;
  const z = (N * (1 - WGS84_ECCENTRICITY_SQUARED) + alt) * sinPhi;

  return { x, y, z };
}

/**
 * Converts ECEF Cartesian coordinates back to WGS84 Latitude, Longitude, and Altitude
 * using the WGS84 ellipsoid (iterative algorithm with polar stability).
 */
export function ecefToWGS84(
  x: number,
  y: number,
  z: number
): WGS84Coordinates {
  const eps = 1e-12;
  const maxIter = 10;

  // Longitude
  const lambda = Math.atan2(y, x);
  const lng = lambda * (180 / Math.PI);

  // Latitude — iterative
  const p = Math.sqrt(x * x + y * y);

  // Handle exact polar case (at or extremely near ±90° latitude)
  if (p < eps) {
    // At the poles, longitude is arbitrary; set to 0
    const lat = z >= 0 ? 90 : -90;
    const alt = Math.abs(z) - WGS84_SEMI_MINOR_AXIS;
    return {
      latitude: lat,
      longitude: 0,
      altitude: alt,
    };
  }

  let phi = Math.atan2(z, p * (1 - WGS84_ECCENTRICITY_SQUARED));

  for (let i = 0; i < maxIter; i++) {
    const sinPhi = Math.sin(phi);
    const N = WGS84_SEMI_MAJOR_AXIS / Math.sqrt(1 - WGS84_ECCENTRICITY_SQUARED * sinPhi * sinPhi);
    const newPhi = Math.atan2(z + N * WGS84_ECCENTRICITY_SQUARED * sinPhi, p);
    if (Math.abs(newPhi - phi) < eps) {
      phi = newPhi;
      break;
    }
    phi = newPhi;
  }

  const lat = phi * (180 / Math.PI);

  // Calculate altitude using numerically stable two-form method
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const N = WGS84_SEMI_MAJOR_AXIS / Math.sqrt(1 - WGS84_ECCENTRICITY_SQUARED * sinPhi * sinPhi);

  let alt: number;

  // Use the numerically stable formulation based on the magnitude of cos(phi)
  // This avoids division by very small numbers near the poles
  const cosPhiAbs = Math.abs(cosPhi);
  const cosThreshold = 1e-6;

  if (cosPhiAbs > cosThreshold) {
    // Away from poles: use the standard p/cos(phi) formulation
    alt = p / cosPhi - N;
  } else {
    // Near poles: use the z/sin(phi) formulation which is more stable
    // h = z/sin(phi) - N * (1 - e²)
    const sinPhiAbs = Math.abs(sinPhi);
    if (sinPhiAbs > eps) {
      alt = z / sinPhi - N * (1 - WGS84_ECCENTRICITY_SQUARED);
    } else {
      // Extremely close to pole, fallback to the exact pole calculation
      alt = Math.abs(z) - WGS84_SEMI_MINOR_AXIS;
    }
  }

  return {
    latitude: lat,
    longitude: ((lng + 540) % 360) - 180,
    altitude: alt,
  };
}

// ============================================================
// DISPLAY GLOBE COORDINATE FUNCTIONS
// ============================================================

/**
 * Converts WGS84 Latitude, Longitude to 3D coordinates on a display globe of given radius.
 * This is the function used by the Three.js rendering system.
 *
 * Note: This is a spherical display conversion, not a true WGS84 ellipsoid ECEF conversion.
 * For real-world ECEF coordinates, use wgs84ToECEF() instead.
 */
export function geodeticToCartesian(
  lat: number,
  lng: number,
  alt = 0,
  globeRadius = 2.4
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  // Scaled radius considering height offset
  const r = globeRadius * (1.0 + alt / WGS84_SEMI_MAJOR_AXIS);

  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Converts 3D display-globe Cartesian coordinates back to WGS84 Latitude, Longitude, and Altitude.
 * This is the inverse of geodeticToCartesian() for the display globe.
 */
export function cartesianToGeodetic(
  position: THREE.Vector3,
  globeRadius = 2.4
): WGS84Coordinates {
  const r = position.length();
  const norm = position.clone().divideScalar(r);

  const phi = Math.acos(norm.y);
  const lat = 90 - phi * (180 / Math.PI);

  const theta = Math.atan2(norm.z, -norm.x);
  let lng = theta * (180 / Math.PI) - 180;
  if (lng < -180) lng += 360;
  if (lng > 180) lng -= 360;

  const altitude = (r - globeRadius) * (WGS84_SEMI_MAJOR_AXIS / globeRadius);

  return { latitude: lat, longitude: lng, altitude };
}

// ============================================================
// Spherical / Geographic Calculations
// ============================================================

/**
 * Calculates geodesic distance between two WGS84 lat/lng points using Haversine formula
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_MEAN_RADIUS_KM * c;
}

/**
 * Calculates initial bearing (forward azimuth) between two points
 */
export function initialBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const phi1 = lat1 * (Math.PI / 180);
  const phi2 = lat2 * (Math.PI / 180);
  const deltaLng = (lng2 - lng1) * (Math.PI / 180);

  const x = Math.sin(deltaLng) * Math.cos(phi2);
  const y =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLng);

  const bearing = Math.atan2(x, y) * (180 / Math.PI);
  return (bearing + 360) % 360;
}

/**
 * Returns complete geodesic distance information between two points
 */
export function calculateGeodesicDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): GeodesicDistance {
  const distanceKm = haversineDistance(lat1, lng1, lat2, lng2);
  return {
    distanceKm,
    distanceMiles: distanceKm * 0.621371,
    bearingDegrees: initialBearing(lat1, lng1, lat2, lng2),
    start: { latitude: lat1, longitude: lng1 },
    end: { latitude: lat2, longitude: lng2 },
  };
}

/**
 * Calculates destination point given start, bearing, and distance
 */
export function calculateDestination(
  lat: number,
  lng: number,
  bearingDegrees: number,
  distanceKm: number
): WGS84Coordinates {
  const phi1 = lat * (Math.PI / 180);
  const bearing = bearingDegrees * (Math.PI / 180);
  const angularDistance = distanceKm / EARTH_MEAN_RADIUS_KM;

  const phi2 = Math.asin(
    Math.sin(phi1) * Math.cos(angularDistance) +
      Math.cos(phi1) * Math.sin(angularDistance) * Math.cos(bearing)
  );

  const lambda1 = lng * (Math.PI / 180);
  const lambda2 =
    lambda1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(phi1),
      Math.cos(angularDistance) - Math.sin(phi1) * Math.sin(phi2)
    );

  return {
    latitude: phi2 * (180 / Math.PI),
    longitude: ((lambda2 * (180 / Math.PI) + 540) % 360) - 180,
  };
}

// ============================================================
// Spatial Analysis
// ============================================================

/**
 * Calculate the spherical centroid of a set of geographic points.
 * This handles the ±180° antimeridian correctly by working in 3D space.
 */
export function calculateCentroid(
  points: { lat: number; lng: number }[]
): WGS84Coordinates | null {
  if (points.length === 0) return null;

  // Convert to 3D Cartesian points on the unit sphere
  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;

  for (const p of points) {
    const phi = p.lat * (Math.PI / 180);
    const lambda = p.lng * (Math.PI / 180);
    const cosPhi = Math.cos(phi);

    sumX += cosPhi * Math.cos(lambda);
    sumY += cosPhi * Math.sin(lambda);
    sumZ += Math.sin(phi);
  }

  // Average the Cartesian vectors
  const n = points.length;
  const avgX = sumX / n;
  const avgY = sumY / n;
  const avgZ = sumZ / n;

  // Convert back to spherical coordinates
  const r = Math.sqrt(avgX * avgX + avgY * avgY + avgZ * avgZ);
  if (r < 1e-10) {
    // Points are evenly distributed around the sphere; return first point
    return { latitude: points[0].lat, longitude: points[0].lng };
  }

  const lat = Math.asin(avgZ / r) * (180 / Math.PI);
  const lng = Math.atan2(avgY, avgX) * (180 / Math.PI);

  return {
    latitude: lat,
    longitude: ((lng + 540) % 360) - 180,
  };
}

/**
 * Calculate the bounding box of a set of geographic points
 */
export function calculateBounds(
  points: { lat: number; lng: number }[]
): SpatialBounds | null {
  if (points.length === 0) return null;

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  }

  return { minLat, maxLat, minLng, maxLng };
}

/**
 * Check if a point is within a bounding box
 */
export function isPointInBounds(
  point: { lat: number; lng: number },
  bounds: SpatialBounds
): boolean {
  return (
    point.lat >= bounds.minLat &&
    point.lat <= bounds.maxLat &&
    point.lng >= bounds.minLng &&
    point.lng <= bounds.maxLng
  );
}

/**
 * Calculate the nearest neighbor index distance for a set of points
 * Useful for detecting clustering or dispersion
 */
export function calculateNearestNeighborIndex(
  points: { lat: number; lng: number }[]
): number {
  if (points.length < 2) return 0;

  // Calculate observed mean distance to nearest neighbor
  let totalNearestDistance = 0;
  let nearestFound = 0;

  for (let i = 0; i < points.length; i++) {
    let minDist = Infinity;
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const dist = haversineDistance(
        points[i].lat,
        points[i].lng,
        points[j].lat,
        points[j].lng
      );
      if (dist < minDist) minDist = dist;
    }
    if (minDist !== Infinity) {
      totalNearestDistance += minDist;
      nearestFound++;
    }
  }

  const observedMean = totalNearestDistance / nearestFound;

  // Calculate expected mean distance for random distribution
  const area = (points.length > 2) ? calculateArea(points) : 0;
  const density = area > 0 ? points.length / area : 0;
  const expectedMean = 1 / (2 * Math.sqrt(density));

  // Return the nearest neighbor index (R)
  // R > 1 = dispersed, R < 1 = clustered
  return expectedMean > 0 ? observedMean / expectedMean : 1;
}

/**
 * Calculate approximate area (in sq km) of a polygon defined by points
 * Using the spherical area formula (Shoelace on sphere)
 */
export function calculateArea(points: { lat: number; lng: number }[]): number {
  if (points.length < 3) return 0;

  // Convert to radians and use the spherical area formula
  let area = 0;
  const R = EARTH_MEAN_RADIUS_KM;

  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const lat1 = points[i].lat * (Math.PI / 180);
    const lat2 = points[j].lat * (Math.PI / 180);
    const lng1 = points[i].lng * (Math.PI / 180);
    const lng2 = points[j].lng * (Math.PI / 180);

    area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  return Math.abs(area * R * R) / 2;
}

// ============================================================
// Diagnostic Analysis
// ============================================================

/**
 * Calculate node density around a target point
 */
export function calculateNodeDensity(
  nodes: { lat: number; lng: number }[],
  target: { lat: number; lng: number },
  radiusKm: number
): number {
  let count = 0;
  for (const node of nodes) {
    const dist = haversineDistance(
      target.lat,
      target.lng,
      node.lat,
      node.lng
    );
    if (dist <= radiusKm) count++;
  }
  return count;
}

/**
 * Find the nearest node to a target point
 */
export function findNearestNode<T extends { lat: number; lng: number }>(
  target: { lat: number; lng: number },
  nodes: T[]
): T | null {
  if (nodes.length === 0) return null;

  let nearest = nodes[0];
  let minDist = haversineDistance(
    target.lat,
    target.lng,
    nodes[0].lat,
    nodes[0].lng
  );

  for (let i = 1; i < nodes.length; i++) {
    const dist = haversineDistance(
      target.lat,
      target.lng,
      nodes[i].lat,
      nodes[i].lng
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = nodes[i];
    }
  }

  return nearest;
}

/**
 * Calculate the average distance between all node pairs
 */
export function calculateAveragePairwiseDistance(
  nodes: { lat: number; lng: number }[]
): number {
  if (nodes.length < 2) return 0;

  let totalDist = 0;
  let pairs = 0;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      totalDist += haversineDistance(
        nodes[i].lat,
        nodes[i].lng,
        nodes[j].lat,
        nodes[j].lng
      );
      pairs++;
    }
  }

  return pairs > 0 ? totalDist / pairs : 0;
}

// ============================================================
// Layer Provider Types
// ============================================================

export interface GISLayerProvider {
  type: GISImageryProviderType;
  getTextureUrl: () => string;
  getResolution: () => number;
  getOpacity: () => number;
}

export class GISLayerProviderManager {
  private providers: Map<GISImageryProviderType, GISLayerProvider> = new Map();

  registerProvider(provider: GISLayerProvider): void {
    this.providers.set(provider.type, provider);
  }

  getProvider(type: GISImageryProviderType): GISLayerProvider | undefined {
    return this.providers.get(type);
  }

  getDefaultProviders(): GISLayerProvider[] {
    return [
      {
        type: 'DARK_ENGINEERING_GIS',
        getTextureUrl: () => '',
        getResolution: () => 4096,
        getOpacity: () => 0.95,
      },
      {
        type: 'TOPOGRAPHIC_RELIEF',
        getTextureUrl: () => '',
        getResolution: () => 2048,
        getOpacity: () => 0.7,
      },
    ];
  }
}

// ============================================================
// Utility Functions
// ============================================================

/**
 * Format latitude/longitude coordinates for display
 */
export function formatCoordinates(
  lat: number,
  lng: number,
  precision = 4
): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(precision)}° ${latDir}, ${Math.abs(lng).toFixed(precision)}° ${lngDir}`;
}

/**
 * Parse a coordinate string in various formats
 */
export function parseCoordinateString(
  str: string
): { lat: number; lng: number } | null {
  // Try to parse "lat,lng" or "lat lng" or "lat° N, lng° E" formats
  const cleaned = str.replace(/[°NSEW,]/gi, ' ').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }

  // Try JSON format
  try {
    const parsed = JSON.parse(str);
    if (typeof parsed === 'object' && parsed.lat !== undefined && parsed.lng !== undefined) {
      return { lat: parsed.lat, lng: parsed.lng };
    }
  } catch {
    // Not JSON
  }

  return null;
}

/**
 * Generate a unique ID for geographic features
 */
export function generateGeoId(prefix = 'geo'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Converts degrees to radians
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Converts radians to degrees
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}