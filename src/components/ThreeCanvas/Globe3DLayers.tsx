import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GlobeLayers } from '../../types';
import { latLngToVector3 } from './GlobeSphere';

interface Globe3DLayersProps {
  layers: GlobeLayers;
  radius: number;
}

// Data for 3D Layer Elements
const ANCIENT_SITES: { name: string; lat: number; lng: number }[] = [
  { name: 'Great Pyramid of Giza', lat: 29.9792, lng: 31.1342 },
  { name: 'Stonehenge', lat: 51.1789, lng: -1.8262 },
  { name: 'Teotihuacan', lat: 19.6925, lng: -98.8438 },
  { name: 'Machu Picchu', lat: -13.1631, lng: -72.5450 },
  { name: 'Easter Island (Rapa Nui)', lat: -27.1127, lng: -109.3497 },
  { name: 'Angkor Wat', lat: 13.4125, lng: 103.8670 },
  { name: 'Mount Kailash', lat: 31.0672, lng: 81.3119 },
  { name: 'Parthenon', lat: 37.9715, lng: 23.7267 },
  { name: 'Nazca Lines', lat: -14.7390, lng: -75.1300 },
  { name: 'Mohenjo-Daro', lat: 27.3292, lng: 68.1386 }
];

const CROP_CIRCLES: { lat: number; lng: number }[] = [
  { lat: 51.415, lng: -1.854 }, // Avebury
  { lat: 51.147, lng: -2.337 }, // Wiltshire
  { lat: 51.378, lng: -1.776 }, // Alton Barnes
  { lat: 51.178, lng: -1.826 }, // Stonehenge Field
  { lat: 52.133, lng: -0.466 }  // Bedfordshire
];

const VOLCANOES: { name: string; lat: number; lng: number }[] = [
  { name: 'Mount Fuji', lat: 35.3606, lng: 138.7274 },
  { name: 'Mauna Loa', lat: 19.4756, lng: -155.6054 },
  { name: 'Krakatoa', lat: -6.1021, lng: 105.4230 },
  { name: 'Mount Etna', lat: 37.7510, lng: 14.9934 },
  { name: 'Mount Popocatepetl', lat: 19.0225, lng: -98.6278 },
  { name: 'Cotopaxi', lat: -0.6838, lng: -78.4372 }
];

const EARTHQUAKES: { lat: number; lng: number; mag: number }[] = [
  { lat: 38.322, lng: 142.369, mag: 9.1 }, // Tohoku
  { lat: 3.316, lng: 95.854, mag: 9.1 },   // Sumatra
  { lat: -38.29, lng: -73.05, mag: 9.5 },  // Valdivia
  { lat: 61.02, lng: -147.65, mag: 9.2 }   // Alaska
];

const TECTONIC_PLATES: [number, number][][] = [
  // Ring of Fire / Pacific Plate
  [[60, -150], [50, -170], [30, 140], [10, 130], [-10, 150], [-30, 180], [-50, -140], [-60, -80], [-20, -75], [10, -85], [30, -115], [60, -150]],
  // Mid-Atlantic Ridge
  [[70, -20], [50, -30], [20, -40], [0, -20], [-30, -15], [-50, -10]],
  // Alpine-Himalayan belt
  [[35, -10], [40, 15], [38, 40], [35, 70], [28, 90], [10, 100], [-5, 120]]
];

export const Globe3DLayers: React.FC<Globe3DLayersProps> = ({ layers, radius }) => {
  const leyLineGroupRef = useRef<THREE.Group>(null);

  // Soft rotation for subtle animation
  useFrame((_, delta) => {
    if (leyLineGroupRef.current) {
      leyLineGroupRef.current.rotation.y += delta * 0.02;
    }
  });

  // Ley Lines geodesic connections connecting Ancient Sites
  const leyLinePoints = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    for (let i = 0; i < ANCIENT_SITES.length; i++) {
      for (let j = i + 1; j < ANCIENT_SITES.length; j++) {
        const p1 = latLngToVector3(ANCIENT_SITES[i].lat, ANCIENT_SITES[i].lng, radius * 1.003);
        const p2 = latLngToVector3(ANCIENT_SITES[j].lat, ANCIENT_SITES[j].lng, radius * 1.003);

        const dist = p1.distanceTo(p2);
        if (dist < radius * 1.8) {
          const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
          mid.normalize().multiplyScalar(radius * (1.003 + dist * 0.08));
          const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
          lines.push(curve.getPoints(24));
        }
      }
    }
    return lines;
  }, [radius]);

  // Tectonic Plate boundary lines
  const plateLines = useMemo(() => {
    return TECTONIC_PLATES.map(poly => {
      return poly.map(([lat, lng]) => latLngToVector3(lat, lng, radius * 1.002));
    });
  }, [radius]);

  return (
    <group ref={leyLineGroupRef}>
      {/* 1. Ley Lines Layer */}
      {layers.leyLines &&
        leyLinePoints.map((pts, idx) => {
          const geo = new THREE.BufferGeometry().setFromPoints(pts);
          return (
            <line key={idx}>
              <primitive object={geo} />
              <lineBasicMaterial color="#00f0ff" transparent opacity={0.4} linewidth={1.2} />
            </line>
          );
        })}

      {/* 2. Tectonic Plates Layer */}
      {layers.tectonicPlates &&
        plateLines.map((pts, idx) => {
          const geo = new THREE.BufferGeometry().setFromPoints(pts);
          return (
            <line key={idx}>
              <primitive object={geo} />
              <lineBasicMaterial color="#ffb700" transparent opacity={0.65} linewidth={2} />
            </line>
          );
        })}

      {/* 3. Ancient Sites Markers */}
      {layers.ancientSites &&
        ANCIENT_SITES.map((site, idx) => {
          const pos = latLngToVector3(site.lat, site.lng, radius * 1.005);
          return (
            <mesh key={idx} position={pos}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshBasicMaterial color="#ffb700" />
            </mesh>
          );
        })}

      {/* 4. Crop Circles Markers */}
      {layers.cropCircles &&
        CROP_CIRCLES.map((cc, idx) => {
          const pos = latLngToVector3(cc.lat, cc.lng, radius * 1.005);
          return (
            <group key={idx} position={pos}>
              <mesh>
                <ringGeometry args={[0.02, 0.04, 16]} />
                <meshBasicMaterial color="#00ff9d" side={THREE.DoubleSide} />
              </mesh>
            </group>
          );
        })}

      {/* 5. Volcanoes Markers */}
      {layers.volcanoes &&
        VOLCANOES.map((v, idx) => {
          const pos = latLngToVector3(v.lat, v.lng, radius * 1.005);
          return (
            <mesh key={idx} position={pos}>
              <coneGeometry args={[0.03, 0.08, 8]} />
              <meshBasicMaterial color="#ff0055" />
            </mesh>
          );
        })}

      {/* 6. Earthquakes Markers */}
      {layers.earthquakes &&
        EARTHQUAKES.map((eq, idx) => {
          const pos = latLngToVector3(eq.lat, eq.lng, radius * 1.005);
          return (
            <mesh key={idx} position={pos}>
              <ringGeometry args={[0.04, 0.07, 16]} />
              <meshBasicMaterial color="#ff9900" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          );
        })}

      {/* 7. Mathematical Geodesic Grid Overlays */}
      {layers.mathOverlays && (
        <mesh>
          <icosahedronGeometry args={[radius * 1.008, 1]} />
          <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.08} />
        </mesh>
      )}
    </group>
  );
};
