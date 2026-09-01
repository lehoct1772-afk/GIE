import React, { useRef, useEffect, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { LightningStrike } from 'three/examples/jsm/geometries/LightningStrike.js';

// ⚡ PROCEDURAL FRACTAL LIGHTNING CONFIGURATION
const lightningParams = {
  sourceOffset: new THREE.Vector3(0, 0, 0),
  destOffset: new THREE.Vector3(0, 0, 0),
  radius0: 0.12,
  radius1: 0.02,
  minRadius: 0.008,
  maxIterations: 6,
  isRay: true,
  shorten: 1.0,
  roughness: 0.88,
  straightness: 0.55,
  bireindex: 0.12,
  upcorner: 0.1
};

// Precise mathematical coordinates matching your architectural core
const BLUEPRINT_NODES = [
  { lat: 39.0438, lng: -77.4874 },  // Node 1: North America
  { lat: 53.3498, lng: -6.2603 },   // Node 2: Europe
  { lat: 35.6762, lng: 139.6503 },  // Node 3: Asia
  { lat: -23.5505, lng: -46.6333 }, // Node 4: South America
  { lat: 45.7285, lng: -121.1710 }, // Node 5: West Coast
  { lat: 1.3521, lng: 103.8198 },   // Node 6: Southeast Asia
  { lat: -33.8688, lng: 151.2093 }  // Node 7: Oceania
];

const generateMatrixData = () => {
  const links: any[] = [];
  BLUEPRINT_NODES.forEach((start, i) => {
    BLUEPRINT_NODES.forEach((end, j) => {
      if (i !== j) {
        links.push({
          startLat: start.lat,
          startLng: start.lng,
          endLat: end.lat,
          endLng: end.lng,
          color: ['rgba(6,182,212,0.6)', 'rgba(168,85,247,0.6)', 'rgba(37,99,235,0.6)'][parseInt((Math.random() * 3).toString())],
          stroke: 0.15 + Math.random() * 0.2,
          altitude: 0.1 + Math.random() * 0.4
        });
      }
    });
  });
  return links;
};

export const GlobeScene: React.FC = () => {
  const globeRef = useRef<any>();
  const matrixArcs = useMemo(() => generateMatrixData(), []);

  useEffect(() => {
    if (!globeRef.current) return;

    // 1. Force the custom dark vector look onto the core globe sphere layer
    const globeMaterial = globeRef.current.globeMaterial();
    globeMaterial.color = new THREE.Color(0x020617);
    globeMaterial.emissive = new THREE.Color(0x010a15);
    globeMaterial.roughness = 0.4;
    globeMaterial.metalness = 0.9;
    globeMaterial.transparent = true;
    globeMaterial.opacity = 0.85;

    const scene = globeRef.current.scene();

    // 2. Add multiple overlapping high-tech holographic orbital grid rings
    const orbitalGroup = new THREE.Group();
    const ringRadii = [100.6, 101.4, 102.2];
    const ringColors = [0x00f3ff, 0xa855f7, 0x1d4ed8];

    ringRadii.forEach((radius, index) => {
      const geometry = new THREE.IcosahedronGeometry(radius, 2);
      const material = new THREE.MeshBasicMaterial({
        color: ringColors[index],
        transparent: true,
        opacity: 0.22,
        wireframe: true,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(geometry, material);
      orbitalGroup.add(mesh);
    });
    scene.add(orbitalGroup);

    // 3. INITIALIZE PROCEDURAL LIGHTNING ARCS IN 3D SPACE
    const lightningGeometries: any[] = [];
    const lightningGroup = new THREE.Group();

    for (let i = 0; i < BLUEPRINT_NODES.length - 1; i++) {
      const startNode = BLUEPRINT_NODES[i];
      const endNode = BLUEPRINT_NODES[i + 1];

      // Convert Lat/Lng coordinates directly to 3D Cartesian vectors
      const p1 = globeRef.current.getCoords(startNode.lat, startNode.lng, 0.04);
      const p2 = globeRef.current.getCoords(endNode.lat, endNode.lng, 0.04);
      const startVec = new THREE.Vector3(p1.x, p1.y, p1.z);
      const endVec = new THREE.Vector3(p2.x, p2.y, p2.z);

      const strikeGeo = new LightningStrike(startVec, endVec, lightningParams);
      lightningGeometries.push(strikeGeo);

      const strikeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x22d3ee),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const strikeMesh = new THREE.Mesh(strikeGeo, strikeMat);
      lightningGroup.add(strikeMesh);
    }
    scene.add(lightningGroup);

    // 4. Core Engine update loop
    let frameId: number;
    const clock = new THREE.Clock();

    const updateEngine = () => {
      const elapsedTime = clock.getElapsedTime();

      orbitalGroup.rotation.y += 0.0012;
      orbitalGroup.rotation.x += 0.0004;

      lightningGeometries.forEach((geo) => {
        geo.update(elapsedTime);
      });

      frameId = requestAnimationFrame(updateEngine);
    };
    updateEngine();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-transparent flex items-center justify-center">
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0,0,0,0)"
        
        // Disable the default map layer texture files completely to stop fallbacks
        showGlobe={true}
        showAtmosphere={true}
        atmosphereColor="#06b6d4"
        atmosphereAltitude={0.28}
        
        // Crackling data arc system parameters
        arcsData={matrixArcs}
        arcStartLat={(d: any) => d.startLat}
        arcStartLng={(d: any) => d.startLng}
        arcEndLat={(d: any) => d.endLat}
        arcEndLng={(d: any) => d.endLng}
        arcColor={(d: any) => d.color}
        arcAltitude={(d: any) => d.altitude}
        arcStroke={(d: any) => d.stroke}
        arcDashLength={0.4}
        arcDashGap={0.15}
        arcDashAnimateTime={800}
        
        // Blazing node point grids
        pointsData={BLUEPRINT_NODES}
        pointLat={(d: any) => d.lat}
        pointLng={(d: any) => d.lng}
        pointColor={() => '#22d3ee'}
        pointRadius={0.45}
        pointAltitude={0.02}
      />
    </div>
  );
};
