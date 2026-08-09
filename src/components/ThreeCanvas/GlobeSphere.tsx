import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GeoNode, GlobeLayers } from '../../types';
import { GEO_NODES } from '../../data/mockData';
import { createGISWorldTexture, createGISElevationBumpMap } from './worldTexture';
import { geodeticToCartesian } from '../../services/gisEngine';
import { Globe3DLayers } from './Globe3DLayers';

interface GlobeSphereProps {
  viewMode: string;
  selectedNodeId: string | null;
  onSelectNode: (node: GeoNode) => void;
  showNodes: boolean;
  showWireframe: boolean;
  layers?: GlobeLayers;
}

// Convert lat/long to 3D spherical coordinates using WGS84 Geodetic transform
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  return geodeticToCartesian(lat, lng, 0, radius);
}

// Create curved quadratic arc line points between two 3D vectors
function createArcPoints(v1: THREE.Vector3, v2: THREE.Vector3, numPoints = 32): THREE.Vector3[] {
  const distance = v1.distanceTo(v2);
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
  const midLength = mid.length();
  mid.normalize().multiplyScalar(midLength + distance * 0.25);

  const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
  return curve.getPoints(numPoints);
}

// Default Layers fallback
const DEFAULT_LAYERS: GlobeLayers = {
  continents: true,
  countries: false,
  coastlines: true,
  rivers: false,
  mountains: false,
  bathymetry: false,
  oceanTrenches: false,
  volcanoes: false,
  earthquakes: false,
  tectonicPlates: false,
  leyLines: false,
  ancientSites: false,
  cropCircles: false,
  mathOverlays: true,
  userUploads: false,
  researchMarkers: false
};

// Single Pulsing Data Marker Component for Authentic GIE Dataset Nodes
const PulsingDataMarker: React.FC<{
  position: THREE.Vector3;
  isSelected: boolean;
  type: string;
  onClick: (e: any) => void;
}> = ({ position, isSelected, type, onClick }) => {
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const color = isSelected
    ? '#ffb700'
    : type === 'CORE'
    ? '#00f0ff'
    : type === 'HARMONIC'
    ? '#00ff9d'
    : '#00a8ff';

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (pulseRingRef.current) {
      const t = (elapsed * 0.8) % 1;
      pulseRingRef.current.scale.setScalar(0.8 + t * 1.8);
      (pulseRingRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.55;
    }
    if (coreRef.current) {
      // Soft natural glisten & pulse (never flashes randomly)
      const pulseOpacity = Math.sin(elapsed * 1.8) * 0.2 + 0.8;
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = pulseOpacity;
    }
  });

  const normal = useMemo(() => position.clone().normalize(), [position]);
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [normal]);

  return (
    <group position={position}>
      {/* Core Node Glisten */}
      <mesh ref={coreRef} onClick={onClick}>
        <sphereGeometry args={[isSelected ? 0.08 : 0.05, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>

      {/* Outer Halo Ring */}
      <mesh>
        <sphereGeometry args={[isSelected ? 0.12 : 0.08, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
      </mesh>

      {/* Pulsing Shockwave Marker */}
      <mesh ref={pulseRingRef} quaternion={quaternion}>
        <ringGeometry args={[0.06, 0.08, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export const GlobeSphere: React.FC<GlobeSphereProps> = ({
  selectedNodeId,
  onSelectNode,
  showNodes,
  showWireframe,
  layers = DEFAULT_LAYERS
}) => {
  const sphereGroupRef = useRef<THREE.Group>(null);
  const ringsGroupRef = useRef<THREE.Group>(null);
  const animatedGridRef = useRef<THREE.Group>(null);

  // Globe radius - standard scale fitting screen frame
  const radius = 2.4;

  // Generate GIS continent & features texture dynamically based on layers
  const continentTexture = useMemo(() => {
    return createGISWorldTexture(layers);
  }, [layers]);

  // Generate SRTM/ETOPO1 elevation & bathymetry bump map for realistic terrain relief
  const elevationBumpMap = useMemo(() => {
    return createGISElevationBumpMap();
  }, []);

  // Slow smooth globe rotation
  useFrame((_, delta) => {
    if (sphereGroupRef.current) {
      sphereGroupRef.current.rotation.y += delta * 0.08;
      sphereGroupRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.05;
    }
    if (ringsGroupRef.current) {
      ringsGroupRef.current.rotation.y -= delta * 0.04;
    }
    if (animatedGridRef.current) {
      animatedGridRef.current.rotation.y += delta * 0.12;
    }
  });

  // Node 3D positions for genuine GIE dataset nodes only
  const nodePositions = useMemo(() => {
    return GEO_NODES.map(node => ({
      ...node,
      position: latLngToVector3(node.lat, node.lng, radius)
    }));
  }, [radius]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    nodePositions.forEach(n => map.set(n.id, n.position));
    return map;
  }, [nodePositions]);

  // Real GIE Node connection arcs mapped directly from GEO_NODES connections
  const arcs = useMemo(() => {
    const lines: { id: string; points: THREE.Vector3[]; isSelected: boolean }[] = [];
    const addedPairs = new Set<string>();

    GEO_NODES.forEach(sourceNode => {
      sourceNode.connections.forEach(targetId => {
        const pairKey = [sourceNode.id, targetId].sort().join('--');
        if (!addedPairs.has(pairKey)) {
          addedPairs.add(pairKey);
          const sourcePos = nodeMap.get(sourceNode.id);
          const targetPos = nodeMap.get(targetId);
          if (sourcePos && targetPos) {
            const points = createArcPoints(sourcePos, targetPos);
            const isSelected = sourceNode.id === selectedNodeId || targetId === selectedNodeId;
            lines.push({ id: pairKey, points, isSelected });
          }
        }
      });
    });

    return lines;
  }, [nodeMap, selectedNodeId]);

  // Latitude & longitude grid
  const gridRings = useMemo(() => {
    const rings: { points: THREE.Vector3[]; isEquator?: boolean }[] = [];

    // Latitude rings
    const lats = [-30, 0, 30];
    lats.forEach(lat => {
      const points: THREE.Vector3[] = [];
      const segs = 64;
      for (let i = 0; i <= segs; i++) {
        const lng = (i / segs) * 360 - 180;
        points.push(latLngToVector3(lat, lng, radius * 1.002));
      }
      rings.push({ points, isEquator: lat === 0 });
    });

    // Longitude meridian rings
    const lngs = [0, 60, 120];
    lngs.forEach(lng => {
      const points: THREE.Vector3[] = [];
      const segs = 64;
      for (let i = 0; i <= segs; i++) {
        const lat = (i / segs) * 180 - 90;
        points.push(latLngToVector3(lat, lng, radius * 1.002));
      }
      rings.push({ points });
    });

    return rings;
  }, [radius]);

  // Custom Fresnel Shader for Atmospheric Glowing Shell
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.0, 0.94, 1.0, 1.0) * intensity * 0.95;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
  }, []);

  return (
    <group ref={sphereGroupRef}>
      {/* 1. Illuminated GIS Earth Globe Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          map={continentTexture}
          transparent
          opacity={0.94}
        />
      </mesh>

      {/* 2. Glowing Atmospheric Shell */}
      <mesh material={atmosphereMaterial}>
        <sphereGeometry args={[radius * 1.12, 64, 64]} />
      </mesh>

      {/* 3. Outer Blueprint Wireframe */}
      {showWireframe && (
        <mesh>
          <sphereGeometry args={[radius * 1.001, 24, 24]} />
          <meshBasicMaterial
            color="#00f0ff"
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      )}

      {/* 4. Latitude / Longitude Grid */}
      <group ref={animatedGridRef}>
        {gridRings.map((ring, idx) => {
          const lineGeo = new THREE.BufferGeometry().setFromPoints(ring.points);
          return (
            <line key={idx}>
              <primitive object={lineGeo} />
              <lineBasicMaterial
                color={ring.isEquator ? '#ffb700' : '#00f0ff'}
                transparent
                opacity={ring.isEquator ? 0.55 : 0.22}
                linewidth={ring.isEquator ? 2 : 1}
              />
            </line>
          );
        })}
      </group>

      {/* 5. Sleek Equatorial Harmonic Orbit Line */}
      <group ref={ringsGroupRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.22, radius * 1.23, 64]} />
          <meshBasicMaterial color="#00ff9d" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 6. Dynamic 3D Layer Overlays */}
      <Globe3DLayers layers={layers} radius={radius} />

      {/* 7. Glowing GIE Node Harmonic Relationship Arcs */}
      {arcs.map(arc => {
        const arcGeo = new THREE.BufferGeometry().setFromPoints(arc.points);
        return (
          <line key={arc.id}>
            <primitive object={arcGeo} />
            <lineBasicMaterial
              color={arc.isSelected ? '#ffb700' : '#00ff9d'}
              transparent
              opacity={arc.isSelected ? 0.95 : 0.5}
              linewidth={arc.isSelected ? 2.5 : 1.2}
            />
          </line>
        );
      })}

      {/* 8. Pulsing Data Markers for GIE Geographic Dataset Nodes */}
      {showNodes &&
        nodePositions.map(node => (
          <PulsingDataMarker
            key={node.id}
            position={node.position}
            isSelected={node.id === selectedNodeId}
            type={node.type}
            onClick={e => {
              e.stopPropagation();
              onSelectNode(node);
            }}
          />
        ))}
    </group>
  );
};
