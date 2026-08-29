export interface GeoNode {
  id: string;
  label: string;
  lat: number;
  lng: number;
  value: number;
}

export interface GeoArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  stroke: number;
  altitude: number;
}

// 1. High-density blueprint coordinate nodes
export const GEO_NODES: GeoNode[] = [
  { id: '1', label: 'NA-ENG-01', lat: 39.0438, lng: -77.4874, value: 85 },
  { id: '2', label: 'EU-ENG-02', lat: 53.3498, lng: -6.2603, value: 92 },
  { id: '3', label: 'AS-ENG-03', lat: 35.6762, lng: 139.6503, value: 78 },
  { id: '4', label: 'SA-ENG-04', lat: -23.5505, lng: -46.6333, value: 64 },
  { id: '5', label: 'US-WST-05', lat: 45.7285, lng: -121.1710, value: 88 },
  { id: '6', label: 'SEA-ENG-06', lat: 1.3521, lng: 103.8198, value: 73 },
  { id: '7', label: 'OC-ENG-07', lat: -33.8688, lng: 151.2093, value: 81 },
  { id: '8', label: 'AFR-ENG-08', lat: -26.2041, lng: 28.0473, value: 55 },
  { id: '9', label: 'ME-ENG-09', lat: 25.2048, lng: 55.2708, value: 90 },
  { id: '10', label: 'IN-ENG-10', lat: 12.9716, lng: 77.5946, value: 84 }
];

// 2. Generate a heavy, complex network mesh matrix from the coordinates
const generateMatrix = (): GeoArc[] => {
  const links: GeoArc[] = [];
  const colors = ['#00ffff', '#9d4edd', '#3a7bd5']; // Cyan, Purple, Electric Blue
  
  GEO_NODES.forEach((start, i) => {
    GEO_NODES.forEach((end, j) => {
      if (i !== j && Math.random() > 0.3) { // Dense connectivity fallback
        links.push({
          startLat: start.lat,
          startLng: start.lng,
          endLat: end.lat,
          endLng: end.lng,
          color: colors[(i + j) % colors.length],
          stroke: 0.15 + Math.random() * 0.25,
          altitude: 0.15 + Math.random() * 0.35
        });
      }
    });
  });
  return links;
};

export const MATRIX_ARCS = generateMatrix();
