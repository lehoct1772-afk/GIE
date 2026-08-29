import React, { useRef, useEffect, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

// Precise coordinates matching your core architectural solid shapes
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
          color: ['#00ffff', '#b55fe6', '#3b82f6'][parseInt((Math.random() * 3).toString())],
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

    // 1. Force the custom dark vector look onto the core globe sphere
    const globeMaterial = globeRef.current.globeMaterial();
    globeMaterial.color = new THREE.Color(0x030d1a);
    globeMaterial.emissive = new THREE.Color(0x01050d);
    globeMaterial.roughness = 0.4;
    globeMaterial.metalness = 0.8;

    const scene = globeRef.current.scene();

    // 2. Add multiple overlapping high-tech holographic orbital rings
    const orbitalGroup = new THREE.Group();
    const ringRadii = [100.5, 101.2, 102.0];
    const ringColors = [0x00ffff, 0xb55fe6, 0x1d4ed8];

    ringRadii.forEach((radius, index) => {
      const geometry = new THREE.IcosahedronGeometry(radius, 2);
      const material = new THREE.MeshBasicMaterial({
        color: ringColors[index],
        transparent: true,
        opacity: 0.15,
        wireframe: true,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(geometry, material);
      orbitalGroup.add(mesh);
    });

    scene.add(orbitalGroup);

    // 3. Engine continuous rotation loop
    let frameId: number;
    const updateEngine = () => {
      orbitalGroup.rotation.y += 0.001;
      orbitalGroup.rotation.x += 0.0003;
      frameId = requestAnimationFrame(updateEngine);
    };
    updateEngine();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="w-full h-full relative bg-transparent flex items-center justify-center">
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//://unpkg.com"
        bumpImageUrl="//://unpkg.com"
        
        showAtmosphere={true}
        atmosphereColor="#00ffff"
        atmosphereAltitude={0.25}

        // 4. Crackling Static Data Arcs Configuration
        arcsData={matrixArcs}
        arcStartLat={(d: any) => d.startLat}
        arcStartLng={(d: any) => d.startLng}
        arcEndLat={(d: any) => d.endLat}
        arcEndLng={(d: any) => d.endLng}
        arcColor={(d: any) => d.color}
        arcAltitude={(d: any) => d.altitude}
        arcStroke={(d: any) => d.stroke}
        arcDashLength={0.6}
        arcDashGap={0.1}
        arcDashAnimateTime={1000} // High-velocity lightning pulse speed

        // 5. Blazing Node Points
        pointsData={BLUEPRINT_NODES}
        pointLat={(d: any) => d.lat}
        pointLng={(d: any) => d.lng}
        pointColor={() => '#00ffff'}
        pointRadius={0.4}
        pointAltitude={0.01}
      />
    </div>
  );
};
