export interface TerrainPoint {
  id: string;
  lat: number;
  lng: number;
  elevation: number;
  coordinates: [number, number];
  timestamp: string;
  accuracy: number;
}

export interface TerrainMapData {
  id: string;
  name: string;
  description: string;
  bounds: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  zoomLevel: GISZoomLevel;
  terrainPoints: TerrainPoint[];
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, string>;
}

export interface GISZoomLevel {
  'GLOBAL' | 'REGIONAL' | 'GEOLOGICAL' | 'RESEARCH' | 'LOCAL';
}

export const defaultTerrainMap: TerrainMapData = {
  id: 'default-terrain',
  name: 'Global Terrain Overview',
  description: 'Base terrain mapping data for global analysis',
  bounds: [-180, -90, 180, 90],
  zoomLevel: 'GLOBAL',
  terrainPoints: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {},
};

export function calculateDistance(
  point1: TerrainPoint,
  point2: TerrainPoint
): number {
  const R = 6371; // Earth's radius in kilometers
  const lat1 = point1.lat * Math.PI / 180;
  const lat2 = point2.lat * Math.PI / 180;
  const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
  const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}
