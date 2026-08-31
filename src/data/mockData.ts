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

export interface ActivityFeedItem {
  id: string;
  text: string;
  timestamp: string;
  timeAgo: string;
  type: "DETECTED" | "SYNCED" | "CALCULATING";
}

export interface ActiveUpload {
  id: string;
  filename: string;
  fileType: "image" | "cad" | "document";
  progress: number;
  status: string;
  size: string;
}

export interface MathConstant {
  symbol: string;
  name: string;
  value: string;
}

// 1. High-density blueprint coordinate nodes matching your global framework
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

// 2. Structural telemetry array supporting global data stream components
export const DATA_STREAMS = [
  { id: 'ds-1', name: 'GEODESIC MESH NODES', value: '1,424 active', percent: 84, color: '#06b6d4' },
  { id: 'ds-2', name: 'IMAGE DATASETS DECODED', value: '12,847 img', percent: 92, color: '#10b981' },
  { id: 'ds-3', name: 'MATHEMATICAL CORRELATIONS', value: '3.98M found', percent: 76, color: '#f59e0b' },
  { id: 'ds-4', name: 'VECTOR BLUEPRINTS VERIFIED', value: '247 docs', percent: 88, color: '#8b5cf6' }
];

// 3. Mathematical constant values referenced across dashboard monitors
export const MATH_CONSTANTS: MathConstant[] = [
  { symbol: 'Φ', name: 'Golden Ratio (Phi)', value: '1.6180339887' },
  { symbol: 'π', name: 'Archimedes Pi', value: '3.1415926535' },
  { symbol: 'e', name: 'Euler\'s Number', value: '2.7182818284' },
  { symbol: '√2', name: 'Pythagoras Constant', value: '1.4142135623' },
  { symbol: 'ψ', name: 'Super-Golden Ratio', value: '1.4655712318' }
];

// 4. Initial historical entries feeding your live activity streams
export const INITIAL_ACTIVITY_FEED: ActivityFeedItem[] = [
  { id: 'act-1', text: 'Golden Ratio Phi resonance verified', timestamp: '08:42:11 UTC', timeAgo: '2s ago', type: 'DETECTED' },
  { id: 'act-2', text: 'Icosahedron vertex tensor mapped', timestamp: '08:41:55 UTC', timeAgo: '18s ago', type: 'SYNCED' },
  { id: 'act-3', text: 'Euclidean vector norm calculated', timestamp: '08:40:02 UTC', timeAgo: '2m ago', type: 'CALCULATING' },
  { id: 'act-4', text: 'Euler-Poincaré characteristic V-E+F=2', timestamp: '08:38:14 UTC', timeAgo: '4m ago', type: 'DETECTED' }
];

// 5. Asset state descriptors loading up active upload card elements
export const INITIAL_UPLOADS: ActiveUpload[] = [
  { id: 'up-1', filename: 'architectural-blueprint.svg', fileType: 'image', progress: 100, status: 'VERIFIED', size: '2.4 MB' },
  { id: 'up-2', filename: 'crop-circle-analysis.cad', fileType: 'cad', progress: 65, status: 'PARSING VECTOR MATRIX', size: '14.8 MB' }
];

// 6. Generate a balanced, clean network connection map matrix from coordinates
const generateMatrix = (): GeoArc[] => {
  const links: GeoArc[] = [];
  const colors = ['rgba(6,182,212,0.4)', 'rgba(154,78,221,0.4)', 'rgba(58,123,213,0.4)']; // Neon Cyan, Translucent Purple, Electric Blue
  
  GEO_NODES.forEach((start, i) => {
    GEO_NODES.forEach((end, j) => {
      if (i !== j && Math.random() > 0.3) {
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
