import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GeoNode, GlobeLayers } from "../../types";
import { GEO_NODES } from "../../data/mockData";
import {
  createGISWorldTexture,
  createGISElevationBumpMap,
} from "./worldTexture";
import { geodeticToCartesian } from "../../services/gisEngine";
import { Globe3DLayers } from "./Globe3DLayers";

interface GlobeSphereProps {
  viewMode: string;
  selectedNodeId: string | null;
  onSelectNode: (node: GeoNode) => void;
  showNodes: boolean;
  showWireframe: boolean;
  layers?: GlobeLayers;
}

export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number
): THREE.Vector3 {
  return geodeticToCartesian(lat, lng, 0, radius);
}

function createArcPoints(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  numPoints = 64
): THREE.Vector3[] {
  const distance = v1.distanceTo(v2);
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
  const midLength = mid.length();
  mid.normalize().multiplyScalar(midLength + Math.min(distance * 0.055, 0.22));

  const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
  return curve.getPoints(numPoints);
}

const ARC_COLORS = ["#00f5ff", "#00ff9d", "#ffd400", "#a855f7", "#ff8a00", "#38bdf8"] as const;

function arcColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return ARC_COLORS[hash % ARC_COLORS.length];
}

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
  researchMarkers: false,
  latitudeLongitude: false,
  connectionArcs: true,
  harmonicRing: false,
  gieNodes: true,
  globeWireframe: false,
};

// Custom Shader Material for Lightning-Fast Data Pulse Arches
const CustomStaticArcShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uSpeed;
    varying float vProgress;
    void main() {
      vProgress = uv.x; // Tracks path progression from 0 to 1
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uTime;
    varying float vProgress;
    void main() {
      // Math formula creating a looping, crackling dash pattern moving across uv vectors
      float dash = sin(vProgress * 45.0 - uTime * 22.0); 
      if (dash < 0.1) discard; // Cuts empty gaps cleanly out of line structures
      
      gl_FragColor = vec4(uColor, 0.95);
    }
  `
};

const PulsingDataMarker: React.FC<{
  position: THREE.Vector3;
  isSelected: boolean;
  type: string;
  onClick: (event: any) => void;
}> = ({ position, isSelected, type, onClick }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const color = isSelected
    ? "#ffd400"
    : type === "CORE"
    ? "#00ffff"
    : type === "HARMONIC"
    ? "#00ff88"
    : "#00d9ff";

  const normal = useMemo(() => position.clone().normalize(), [position]);
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [normal]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (coreRef.current) {
      const material = coreRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.92 + Math.sin(elapsed * 2.1) * 0.08;
      coreRef.current.scale.setScalar(1 + Math.sin(elapsed * 2.1) * 0.12);
    }
    if (haloRef.current) {
      const material = haloRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.38 + Math.sin(elapsed * 1.4) * 0.12;
      haloRef.current.scale.setScalar(1.05 + Math.sin(elapsed * 1.4) * 0.1);
    }
    if (pulseRef.current) {
      const cycle = (elapsed * 0.5) % 1;
      pulseRef.current.scale.setScalar(0.82 + cycle * 1.65);
      const material = pulseRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (1 - cycle) * 0.42;
    }
  });

  return (
    <group position={position}>
      <mesh ref={coreRef} onClick={onClick} renderOrder={30}>
        <sphereGeometry args={[isSelected ? 0.046 : 0.026, 20, 20]} />
        <meshBasicMaterial color={color} transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>
      <mesh ref={haloRef} renderOrder={29}>
        <sphereGeometry args={[isSelected ? 0.072 : 0.047, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.42} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>
      <mesh ref={pulseRef} quaternion={quaternion} renderOrder={31}>
        <ringGeometry args={[0.042, 0.052, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>
    </group>
  );
};

export const GlobeSphere: React.FC<GlobeSphereProps> = ({
  selectedNodeId,
  onSelectNode,
  showNodes,
  showWireframe,
  layers = DEFAULT_LAYERS,
}) => {
  const globeRef = useRef<THREE.Group>(null);
  const goldRingRef = useRef<THREE.Group>(null);
  
  // Custom uniform refs to feed time delta data smoothly into WebGL shaders
  const shaderUniforms = useRef({
    uTime: { value: 0 },
    uSpeed: { value: 1.0 }
  });

  const radius = 2.4;

  const continentTexture = useMemo(() => {
    const texture = createGISWorldTexture(layers);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, [layers]);

  const elevationBumpMap = useMemo(() => createGISElevationBumpMap(), []);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    
    // Increment shader time metrics on every single frame render
    shaderUniforms.current.uTime.value = elapsed;

    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.055;
      globeRef.current.rotation.x = 0;
    }
    if (goldRingRef.current) {
      goldRingRef.current.rotation.z += delta * 0.035;
    }
  });

  const nodePositions = useMemo(() => {
    return GEO_NODES.map((node) => ({
      ...node,
      position: latLngToVector3(node.lat, node.lng, radius * 1.025),
    }));
  }, []);

  const nodeMap = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    nodePositions.forEach((node) => { map.set(node.id, node.position); });
    return map;
  }, [nodePositions]);

  // Connects active nodes with high-speed animated shader paths
  const arcs = useMemo(() => {
    const lines: any[] = [];
    const addedPairs = new Set<string>();

    GEO_NODES.forEach((sourceNode) => {
      sourceNode.connections.forEach((targetId) => {
        const pairKey = [sourceNode.id, targetId].sort().join("--");
        if (addedPairs.has(pairKey)) return;
        addedPairs.add(pairKey);

        const sourcePosition = nodeMap.get(sourceNode.id);
        const targetPosition = nodeMap.get(targetId);

        if (sourcePosition && targetPosition) {
          const points = createArcPoints(sourcePosition, targetPosition);
          
          // Generate customized uv mapping indexes manually so shader calculates line progression
          const uvs = new Float32Array(points.length);
          for (let i = 0; i < points.length; i++) {
            uvs[i] = i / (points.length - 1);
          }

          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 1));

          lines.push({
            id: pairKey,
            geometry,
            color: sourceNode.id === selectedNodeId || targetId === selectedNodeId ? '#ffd400' : '#00ff9d'
          });
        }
      });
    });
    return lines;
  }, [nodeMap, selectedNodeId]);

  const atmosphereMaterial = useMemo(() => new THREE.ShaderMaterial({
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
        float fresnel = pow(0.82 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.15);
        gl_FragColor = vec4(vec3(0.0, 1.0, 1.0), fresnel * 0.78);
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  }), []);

  return (
    <group ref={globeRef}>
      {/* SOLID BODY LAYERS */}
      <mesh renderOrder={1}>
        <sphereGeometry args={[radius, 96, 96]} />
        <meshStandardMaterial map={continentTexture} bumpMap={elevationBumpMap} bumpScale={0.060} roughness={0.72} metalness={0.0} emissive="#07131a" emissiveIntensity={0.10} color="#ffffff" transparent opacity={1} side={THREE.FrontSide} depthWrite={true} depthTest={true} toneMapped={false} />
      </mesh>

      <mesh renderOrder={0}>
        <sphereGeometry args={[radius * 0.994, 64, 64]} />
        <meshBasicMaterial color="#001018" transparent opacity={0.48} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      <mesh material={atmosphereMaterial} renderOrder={2}>
        <sphereGeometry args={[radius * 1.055, 64, 64]} />
      </mesh>

      {showWireframe && (
        <mesh renderOrder={3}>
          <sphereGeometry args={[radius * 1.004, 32, 32]} />
          <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      )}

