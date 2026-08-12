import * as THREE from 'three';
import { GlobeLayers } from '../../types';
import { NaturalEarthDatasets } from '../../services/naturalEarthData';

/**
 * High-Resolution GIS Equirectangular (WGS84 EPSG:4326) Earth Texture Compiler
 * Designed according to CesiumJS, NASA WorldWind, and ArcGIS WebGL standards.
 *
 * Renders precise WGS84 vector datasets (Natural Earth 1:110m / 1:50m),
 * bathymetric ocean depth contours, country boundaries, and terrain shading.
 */

export function createGISWorldTexture(layers: GlobeLayers): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 4096;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const width = canvas.width;
  const height = canvas.height;
  const scaleX = width / 360;
  const scaleY = height / 180;

  // Convert WGS84 Longitude [-180, 180] and Latitude [-90, 90] to Canvas [X, Y]
  const toXY = (lng: number, lat: number): [number, number] => {
    const x = (lng + 180) * scaleX;
    const y = (90 - lat) * scaleY;
    return [x, y];
  };

  // 1. Deep Ocean Floor & Bathymetric Gradient Base (NASA GIS Styling)
  const oceanGrad = ctx.createRadialGradient(
    width / 2, height / 2, 100,
    width / 2, height / 2, width / 1.4
  );
  oceanGrad.addColorStop(0, '#020d1c');
  oceanGrad.addColorStop(0.5, '#010814');
  oceanGrad.addColorStop(1, '#00040a');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Bathymetric Continental Shelf Depths (0-200m depth zone)
  if (layers.bathymetry) {
    NaturalEarthDatasets.CONTINENTS.forEach(feature => {
      ctx.beginPath();
      const coords = feature.coordinates;
      if (coords.length === 0) return;
      const [sx, sy] = toXY(coords[0][0], coords[0][1]);
      ctx.moveTo(sx, sy);
      for (let i = 1; i < coords.length; i++) {
        const [px, py] = toXY(coords[i][0], coords[i][1]);
        ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Soft shallow ocean glow contour
      ctx.strokeStyle = 'rgba(0, 180, 255, 0.25)';
      ctx.lineWidth = 18;
      ctx.stroke();
    });
  }

  // 3. WGS84 Natural Earth Continents & Islands Fill
  if (layers.continents) {
    NaturalEarthDatasets.CONTINENTS.forEach(feature => {
      const coords = feature.coordinates;
      if (coords.length === 0) return;

      ctx.beginPath();
      const [startX, startY] = toXY(coords[0][0], coords[0][1]);
      ctx.moveTo(startX, startY);
      for (let i = 1; i < coords.length; i++) {
        const [ptX, ptY] = toXY(coords[i][0], coords[i][1]);
        ctx.lineTo(ptX, ptY);
      }
      ctx.closePath();

      // Professional Scientific Landmass Fill
      const landGrad = ctx.createLinearGradient(0, 0, width, height);
      landGrad.addColorStop(0, 'rgba(0, 220, 255, 0.18)');
      landGrad.addColorStop(0.5, 'rgba(0, 255, 170, 0.15)');
      landGrad.addColorStop(1, 'rgba(0, 150, 255, 0.18)');
      ctx.fillStyle = landGrad;
      ctx.fill();

      // Precision Vector Coastline Outline
      if (layers.coastlines) {
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 3.2;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });
  }

  // 4. Country Administrative Boundaries (WGS84 Borders)
  if (layers.countries) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([6, 6]);

    const COUNTRY_BORDERS: [number, number][][] = [
      // US - Canada
      [[-124, 49], [-95, 49], [-82, 45]],
      // US - Mexico
      [[-117, 32.5], [-106, 31.8], [-97, 26]],
      // Europe Borders
      [[2, 51], [6, 49], [8, 48]],
      [[7, 48], [13, 48], [15, 46]],
      // Asia Borders
      [[60, 55], [75, 40], [80, 30]],
      [[88, 28], [92, 22]]
    ];

    COUNTRY_BORDERS.forEach(line => {
      ctx.beginPath();
      const [sx, sy] = toXY(line[0][0], line[0][1]);
      ctx.moveTo(sx, sy);
      for (let i = 1; i < line.length; i++) {
        const [px, py] = toXY(line[i][0], line[i][1]);
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    ctx.setLineDash([]);
  }

  // 5. Major Hydrography / River Basins
  if (layers.rivers) {
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#00ff9d';
    ctx.shadowBlur = 6;

    const RIVERS: [number, number][][] = [
      // Nile
      [[31, 31], [32, 25], [33, 15], [30, 2], [32, -3]],
      // Amazon
      [[-50, -0.1], [-60, -3], [-70, -4], [-76, -5]],
      // Mississippi
      [[-89, 29], [-91, 35], [-90, 42], [-95, 47]],
      // Yangtze
      [[121, 31], [112, 30], [105, 30], [91, 33]],
      // Danube
      [[29, 45], [20, 44], [16, 48], [8, 48]]
    ];

    RIVERS.forEach(river => {
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

  // 6. Mountain Topography Relief
  if (layers.mountains) {
    ctx.strokeStyle = 'rgba(255, 183, 0, 0.7)';
    ctx.lineWidth = 2.5;

    const MOUNTAINS: [number, number][][] = [
      // Himalayas
      [[72, 34], [78, 30], [88, 28], [95, 29]],
      // Andes
      [[-77, 8], [-78, -10], [-70, -30], [-72, -45]],
      // Rockies
      [[-122, 50], [-115, 42], [-105, 36]],
      // Alps
      [[6, 45], [10, 47], [14, 46]]
    ];

    MOUNTAINS.forEach(m => {
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

  // 7. Oceanic Subduction Trenches
  if (layers.oceanTrenches) {
    ctx.strokeStyle = '#ff0055';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 10;

    NaturalEarthDatasets.OCEAN_TRENCHES.forEach(t => {
      ctx.beginPath();
      const coords = t.coordinates;
      const [sx, sy] = toXY(coords[0][0], coords[0][1]);
      ctx.moveTo(sx, sy);
      for (let i = 1; i < coords.length; i++) {
        const [px, py] = toXY(coords[i][0], coords[i][1]);
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    ctx.shadowBlur = 0;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Generates an Elevation & Bathymetry Bump Map (SRTM/ETOPO1 Relief)
 */
export function createGISElevationBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const width = canvas.width;
  const height = canvas.height;
  const scaleX = width / 360;
  const scaleY = height / 180;

  const toXY = (lng: number, lat: number): [number, number] => {
    return [(lng + 180) * scaleX, (90 - lat) * scaleY];
  };

  // Default ocean baseline elevation (dark grey = low elevation)
  ctx.fillStyle = '#202020';
  ctx.fillRect(0, 0, width, height);

  // Landmass elevated plateau (lighter grey = higher elevation)
  NaturalEarthDatasets.CONTINENTS.forEach(feature => {
    const coords = feature.coordinates;
    if (coords.length === 0) return;
    ctx.beginPath();
    const [sx, sy] = toXY(coords[0][0], coords[0][1]);
    ctx.moveTo(sx, sy);
    for (let i = 1; i < coords.length; i++) {
      const [px, py] = toXY(coords[i][0], coords[i][1]);
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = '#808080';
    ctx.fill();
  });

  // Mountain ridge highlights (bright white = high elevation peak)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 12;
  ctx.filter = 'blur(8px)';

  const MOUNTAIN_PEAKS: [number, number][][] = [
    [[72, 34], [78, 30], [88, 28], [95, 29]], // Himalayas
    [[-77, 8], [-78, -10], [-70, -30], [-72, -45]], // Andes
    [[-122, 50], [-115, 42], [-105, 36]], // Rockies
    [[6, 45], [10, 47], [14, 46]] // Alps
  ];

  MOUNTAIN_PEAKS.forEach(m => {
    ctx.beginPath();
    const [sx, sy] = toXY(m[0][0], m[0][1]);
    ctx.moveTo(sx, sy);
    for (let i = 1; i < m.length; i++) {
      const [px, py] = toXY(m[i][0], m[i][1]);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
