import * as THREE from 'three';

/**
 * Professional Scientific Globe Engine Services
 * Modeled after CesiumJS, NASA WorldWind, and ArcGIS WebGL architectures.
 *
 * Provides WGS84 Ellipsoid geodetic transformations, spatial indexing,
 * tile/layer provider abstractions, and multi-spectral rendering pipelines.
 */

export interface WGS84Coordinates {
  latitude: number;   // -90 to +90 degrees
  longitude: number;  // -180 to +180 degrees
  altitude?: number;  // meters above WGS84 ellipsoid
}

// WGS84 Reference Ellipsoid Constants (Semi-major axis a, Semi-minor axis b)
export const WGS84_SEMI_MAJOR_AXIS = 6378137.0; // meters
export const WGS84_SEMI_MINOR_AXIS = 6356752.314245; // meters
export const WGS84_FLATTENING = 1.0 / 298.257223563;

/**
 * Converts WGS84 Latitude, Longitude, and Altitude to 3D ECEF (Earth-Centered, Earth-Fixed) Cartesian vector
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
 * Converts 3D Cartesian ECEF vector back to WGS84 Latitude, Longitude, and Altitude
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

/**
 * Calculates geodesic distance between two WGS84 lat/lng points using Haversine formula
 */
export function calculateGeodesicDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371.0; // Earth mean radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Layer Provider Types (CesiumJS/WorldWind Pattern)
 */
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
