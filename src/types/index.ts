export type ViewMode = 
  | 'ORBIT_VIEW'
  | 'GEOMETRIC_LAYERS'
  | 'DATA_POINTS'
  | 'SYMMETRY_MAP'
  | 'FIBONACCI_SPIRAL'
  | 'PRIME_PATTERNS'
  | 'SACRED_GEOMETRY'
  | 'MATH_VISUALIZER';

export type NavTab = 
  | 'HOME'
  | 'ENGINE'
  | 'PROJECTS'
  | 'BLUEPRINT_LIBRARY'
  | 'RESEARCH'
  | 'DOCUMENTATION'
  | 'PUBLIC_ACTIVITY'
  | 'SUPPORT_GIE';

export interface GeoNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  latLabel: string;
  lngLabel: string;
  type: 'CORE' | 'HARMONIC' | 'BLUEPRINT' | 'SATELLITE' | 'SERVER' | 'DATABASE' | 'API' | 'CLIENT' | 'WORKER';
  intensity: number;
  connections: string[];
  formula: string;
  status?: 'healthy' | 'warning' | 'critical' | 'unknown';
  load?: number;
  capacity?: number;
  flow?: number;
}

export interface ActivityFeedItem {
  id: string;
  text: string;
  timestamp: string;
  timeAgo: string;
  type: 'INFO' | 'DETECTED' | 'VERIFIED' | 'CONFIRMED' | 'ANALYZED';
}

export interface MathConstant {
  symbol: string;
  name: string;
  value: string;
  fullValue: string;
  formula: string;
  description: string;
  geometricSignificance: string;
}

export interface DataStream {
  id: string;
  name: string;
  value: string;
  rawBytes: number;
  percent: number;
  color: string;
}

export interface ActiveUpload {
  id: string;
  filename: string;
  status: 'Analyzing' | 'Queued' | 'Processing' | 'Complete';
  progress: number;
  fileType: 'image' | 'cad' | 'pdf' | 'blueprint';
  size: string;
  extractedNodes?: number;
  symmetryScore?: number;
}

export interface BlueprintPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  ratio: string;
  symmetryGroup: string;
  formula: string;
  complexity: string;
  author: string;
  svgPath: string;
}

export interface GlobeLayers {
  continents: boolean;
  countries: boolean;
  coastlines: boolean;
  rivers: boolean;
  mountains: boolean;
  bathymetry: boolean;
  oceanTrenches: boolean;
  volcanoes: boolean;
  earthquakes: boolean;
  tectonicPlates: boolean;
  leyLines: boolean;
  ancientSites: boolean;
  cropCircles: boolean;
  mathOverlays: boolean;
  userUploads: boolean;
  researchMarkers: boolean;
  latitudeLongitude: boolean;
  connectionArcs: boolean;
  harmonicRing: boolean;
  gieNodes: boolean;
  globeWireframe: boolean;
}

export type GISZoomLevel = 'GLOBAL' | 'REGIONAL' | 'GEOLOGICAL' | 'RESEARCH' | 'LOCAL';

export interface CityInfrastructureBlueprint {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
  areaSqKm: number;
  roadNetworkKm: number;
  buildingCount: number;
  keyLandmarks: string[];
  formula: string;
  complexity: string;
  author: string;
  svgPath: string;
  associatedProjectIds: string[];
  zoomLevel: GISZoomLevel;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// NEW TYPES FOR UPLOADED DATA
// ============================================

export interface UploadedNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type?: 'CORE' | 'HARMONIC' | 'BLUEPRINT' | 'SATELLITE' | 'SERVER' | 'DATABASE' | 'API' | 'CLIENT' | 'WORKER';
  status?: 'healthy' | 'warning' | 'critical' | 'unknown';
  load?: number;
  capacity?: number;
  flow?: number;
  connections?: string[];
  metadata?: Record<string, any>;
}

export interface UploadedArc {
  id: string;
  source: string;
  target: string;
  flow?: number;
  capacity?: number;
  latency?: number;
  status?: 'healthy' | 'warning' | 'critical' | 'unknown';
  color?: string;
}

export interface UploadedData {
  nodes: UploadedNode[];
  arcs: UploadedArc[];
}

export interface DataLoadCallback {
  (data: UploadedData): void;
}