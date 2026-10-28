import * as THREE from 'three';
import { GlobeLayers } from '../../types';
import { NaturalEarthDatasets } from '../../services/naturalEarthData';
import { mesh, merge } from 'topojson-client';
import countries110m from 'world-atlas/countries-110m.json';
// To sharpen coastlines later, try swapping the line above for:
//   import countries110m from 'world-atlas/countries-50m.json';
// (same package, more detail, bigger download). Revert if the build complains.

/**
 * Equirectangular (WGS84 / EPSG:4326) Earth texture.
 *
 * Data: Natural Earth via world-atlas (countries-110m).
 *  - Coastline  = all countries merged into one land shape (no internal borders)
 *  - Borders    = real shared country borders (mesh), shown by the "countries" layer
 *
 * NOT real data (hand-placed approximations, kept from the previous version):
 *  rivers, mountains. Replace with Natural Earth rivers / an elevation dataset
 *  if they need to be accurate.
 */

type GeoPosition = [number, number];
type GeoRing = GeoPosition[];
type GeoPolygon = GeoRing[];
type GeoMultiPolygon = GeoPolygon[];

const TOPOLOGY = countries110m as any;

// All countries dissolved into one land mask: coastline only, no inner borders.
const LAND_GEOMETRY = merge(
  TOPOLOGY,
  TOPOLOGY.objects.countries.geometries
) as any;

// Only borders shared between two countries.
const BORDER_GEOMETRY = mesh(
  TOPOLOGY,
  TOPOLOGY.objects.countries,
  (a: any, b: any) => a !== b
) as any;

interface PathBundle {
  land: Path2D;
  borders: Path2D;
}

// Paths are built once per canvas size and reused (building them is the slow part).
const pathCache = new Map<string, PathBundle>();

function getPaths(width: number, height: number): PathBundle {
  const key = `${width}x${height}`;
  const cached = pathCache.get(key);
  if (cached) return cached;

  const scaleX = width / 360;
  const scaleY = height / 180;
  const toX = (lng: number) => (lng + 180) * scaleX;
  const toY = (lat: number) => (90 - lat) * scaleY;

  const land = new Path2D();
  const polygons: GeoMultiPolygon =
    LAND_GEOMETRY?.type === 'MultiPolygon'
      ? (LAND_GEOMETRY.coordinates as GeoMultiPolygon)
      : LAND_GEOMETRY?.type === 'Polygon'
        ? [LAND_GEOMETRY.coordinates as GeoPolygon]
        : [];

  for (const polygon of polygons) {
    for (const ring of polygon) {
      if (!ring?.length) continue;
      land.moveTo(toX(ring[0][0]), toY(ring[0][1]));
      for (let i = 1; i < ring.length; i += 1) {
        land.lineTo(toX(ring[i][0]), toY(ring[i][1]));
      }
      land.closePath();
    }
  }

  const borders = new Path2D();
  const lines: GeoPosition[][] =
    BORDER_GEOMETRY?.type === 'MultiLineString'
      ? (BORDER_GEOMETRY.coordinates as GeoPosition[][])
      : BORDER_GEOMETRY?.type === 'LineString'
        ? [BORDER_GEOMETRY.coordinates as GeoPosition[]]
        : [];

  for (const line of lines) {
    if (!line?.length) continue;
    borders.moveTo(toX(line[0][0]), toY(line[0][1]));
    for (let i = 1; i < line.length; i += 1) {
      borders.lineTo(toX(line[i][0]), toY(line[i][1]));
    }
  }

  const bundle = { land, borders };
  pathCache.set(key, bundle);
  return bundle;
}

export function createGISWorldTexture(layers: GlobeLayers): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const width = canvas.width;
  const height = canvas.height;
  const scaleX = width / 360;
  const scaleY = height / 180;
  const { land, borders } = getPaths(width, height);

  // Convert WGS84 Longitude [-180, 180] and Latitude [-90, 90] to Canvas [X, Y]
  const toXY = (lng: number, lat: number): [number, number] => [
    (lng + 180) * scaleX,
    (90 - lat) * scaleY,
  ];

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // ============================================================
  // 1. Ocean: deep blue, lighter toward the equator so the globe has depth
  // ============================================================
  const ocean = ctx.createLinearGradient(0, 0, 0, height);
  ocean.addColorStop(0, '#061a3c');
  ocean.addColorStop(0.5, '#0a3f7e');
  ocean.addColorStop(1, '#061a3c');
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, width, height);

  // ============================================================
  // 2. Coordinate grid (every 10 degrees, faint)
  // ============================================================
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.07)';
  ctx.lineWidth = 1;

  for (let y = 0; y <= height; y += height / 18) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let x = 0; x <= width; x += width / 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // ============================================================
  // 3. Continental shelf outlines (existing dataset), if enabled
  // ============================================================
  if (layers.bathymetry) {
    NaturalEarthDatasets.CONTINENTS.forEach((shape) => {
      const coords = shape.coordinates;
      if (coords.length === 0) return;
      ctx.beginPath();
      const [sx, sy] = toXY(coords[0][0], coords[0][1]);
      ctx.moveTo(sx, sy);
      for (let i = 1; i < coords.length; i++) {
        const [px, py] = toXY(coords[i][0], coords[i][1]);
        ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.12)';
      ctx.lineWidth = 12;
      ctx.stroke();
    });
  }

  // ============================================================
  // 4. Land: stylized "biome" coloring (no borders, color carries the detail)
  //    NOTE: approximate. Bands + soft patches placed by hand, not satellite data.
  //    The accurate version is a real Earth photo texture.
  // ============================================================
  if (layers.continents) {
    // Soft turquoise glow in shallow water along the coast
    ctx.strokeStyle = 'rgba(70, 200, 255, 0.06)';
    ctx.lineWidth = 40;
    ctx.stroke(land);
    ctx.strokeStyle = 'rgba(70, 200, 255, 0.09)';
    ctx.lineWidth = 20;
    ctx.stroke(land);

    // Base land color by latitude (climate bands)
    const latStop = (lat: number) => (90 - lat) / 180;
    const landFill = ctx.createLinearGradient(0, 0, 0, height);
    landFill.addColorStop(latStop(90), '#e6eef2'); // arctic ice
    landFill.addColorStop(latStop(72), '#aebfae'); // tundra
    landFill.addColorStop(latStop(60), '#2a5238'); // boreal forest
    landFill.addColorStop(latStop(45), '#47703f'); // temperate
    landFill.addColorStop(latStop(30), '#6f7a45'); // dry subtropics
    landFill.addColorStop(latStop(12), '#2f6a33'); // tropical
    landFill.addColorStop(latStop(-8), '#2a6232'); // equatorial
    landFill.addColorStop(latStop(-25), '#5f7040'); // southern dry
    landFill.addColorStop(latStop(-45), '#43673f'); // southern temperate
    landFill.addColorStop(latStop(-58), '#5c6e5c');
    landFill.addColorStop(latStop(-64), '#e6eef2'); // Antarctica
    landFill.addColorStop(1, '#f4f8fb');
    ctx.fillStyle = landFill;
    ctx.fill(land, 'evenodd');

    // Everything below is clipped to land only
    ctx.save();
    ctx.clip(land, 'evenodd');

    // Soft colored patches: [lng, lat, half-width deg, half-height deg, 'r,g,b', strength]
    const PATCHES: [number, number, number, number, string, number][] = [
      // Deserts
      [12, 23, 24, 9, '205,168,92', 0.85], // Sahara
      [46, 24, 12, 8, '200,160,95', 0.8], // Arabian
      [60, 35, 10, 5, '170,150,105', 0.55], // Iran / Central Asia
      [95, 41, 14, 5, '182,156,108', 0.6], // Gobi / Taklamakan
      [134, -25, 17, 9, '184, 120, 72', 0.8], // Australian interior
      [21, -24, 8, 5, '196,158,100', 0.65], // Kalahari / Namib
      [-111, 33, 9, 5, '190,156,100', 0.6], // US Southwest / Mexico
      // Rainforest
      [-62, -4, 13, 8, '12,72,32', 0.7], // Amazon
      [23, 0, 9, 6, '14,76,34', 0.65], // Congo
      [108, 2, 12, 6, '16,78,36', 0.55], // Southeast Asia
      // Boreal forest
      [92, 60, 42, 7, '24,62,44', 0.5], // Siberia
      [-100, 57, 26, 7, '26,64,46', 0.5], // Canada
      // Highlands
      [88, 32, 13, 4, '150,140,118', 0.55], // Tibet / Himalaya
      [-70, -20, 3, 18, '138,120,96', 0.6], // Andes
      [-112, 45, 4, 10, '128,128,106', 0.45], // Rockies
      // Ice
      [-42, 73, 13, 8, '240,247,251', 0.95], // Greenland
    ];

    for (const [lng, lat, rx, ry, rgb, strength] of PATCHES) {
      const [cx, cy] = toXY(lng, lat);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(rx * scaleX, ry * scaleY);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      g.addColorStop(0, `rgba(${rgb}, ${strength})`);
      g.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(-1, -1, 2, 2);
      ctx.restore();
    }

    // Gentle light rim along the inner edge of each coast
    ctx.strokeStyle = 'rgba(120, 220, 255, 0.08)';
    ctx.lineWidth = 24;
    ctx.stroke(land);

    ctx.restore();
  }

  // ============================================================
  // 5. Coastline: crisp bright line with a cheap glow (no shadowBlur)
  // ============================================================
  if (layers.coastlines) {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.10)';
    ctx.lineWidth = 12;
    ctx.stroke(land);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 6;
    ctx.stroke(land);
    ctx.strokeStyle = '#5cf7ff';
    ctx.lineWidth = 2;
    ctx.stroke(land);
  }

  // ============================================================
  // 6. Country borders: real shared borders from the dataset
  // ============================================================
  if (layers.countries) {
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(140, 255, 240, 0.40)';
    ctx.lineWidth = 1.5;
    ctx.stroke(borders);
  }

  // ============================================================
  // 7. Rivers (hand-placed approximations, not survey data)
  // ============================================================
  if (layers.rivers) {
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#00ff9d';
    ctx.shadowBlur = 4;

    const RIVERS: [number, number][][] = [
      [[31, 31], [32, 25], [33, 15], [30, 2], [32, -3]], // Nile
      [[-50, -0.1], [-60, -3], [-70, -4], [-76, -5]], // Amazon
      [[-89, 29], [-91, 35], [-90, 42], [-95, 47]], // Mississippi
      [[121, 31], [112, 30], [105, 30], [91, 33]], // Yangtze
      [[29, 45], [20, 44], [16, 48], [8, 48]], // Danube
    ];

    RIVERS.forEach((river) => {
      ctx.beginPath();
      const [sx, sy] = toXY(river[0][0], river[0][1]);
      ctx.moveTo(sx, sy);
      for (let i = 1; i < river.length; i++) {
        const [px, py] = toXY(river[i][0], river[i][1]);
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    ctx.shadowBlur = 0;
  }

  // ============================================================
  // 8. Mountain ranges (hand-placed approximations, not elevation data)
  // ============================================================
  if (layers.mountains) {
    ctx.strokeStyle = 'rgba(255, 183, 0, 0.5)';
    ctx.lineWidth = 2.0;

    const MOUNTAINS: [number, number][][] = [
      [[72, 34], [78, 30], [88, 28], [95, 29]], // Himalayas
      [[-77, 8], [-78, -10], [-70, -30], [-72, -45]], // Andes
      [[-122, 50], [-115, 42], [-105, 36]], // Rockies
      [[6, 45], [10, 47], [14, 46]], // Alps
    ];

    MOUNTAINS.forEach((m) => {
      ctx.beginPath();
      const [sx, sy] = toXY(m[0][0], m[0][1]);
      ctx.moveTo(sx, sy);
      for (let i = 1; i < m.length; i++) {
        const [px, py] = toXY(m[i][0], m[i][1]);
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Bump map: a soft step at every shoreline so coasts catch the light.
 * This is a stylized shoreline bevel, NOT real elevation. For true relief,
 * replace this with a heightmap image (e.g. ETOPO / SRTM) drawn into the canvas.
 */
export function createGISElevationBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024; // was 1048; must be 2:1 to match the 4096x2048 map
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const { land } = getPaths(canvas.width, canvas.height);

  ctx.fillStyle = '#505050'; // ocean level
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.filter = 'blur(6px)'; // softens the shoreline step (ignored where unsupported)
  ctx.fillStyle = '#9a9a9a'; // land level
  ctx.fill(land, 'evenodd');
  ctx.filter = 'none';

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}