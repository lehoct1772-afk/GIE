import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { GeoNode, GlobeLayers } from "../../types";
import { GEO_NODES } from "../../data/mockData";
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
  numPoints = 32
): THREE.Vector3[] {
  const distance = v1.distanceTo(v2);
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
  const midLength = mid.length();
  mid.normalize().multiplyScalar(midLength + distance * 0.22);

  const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
  return curve.getPoints(numPoints);
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

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize());
    return q;
  }, [position]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const pulse = Math.sin(elapsed * 2.1);

    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + pulse * 0.12);
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = 0.92 + pulse * 0.08;
    }
    if (haloRef.current) {
      haloRef.current.scale.setScalar(1.05 + pulse * 0.1);
    }
    if (pulseRef.current) {
      const cycle = (elapsed * 0.5) % 1;
      pulseRef.current.scale.setScalar(0.8 + cycle * 2.25);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - cycle) * 0.65;
    }
  });

  return (
    <group position={position}>
      <mesh ref={coreRef} onClick={onClick} renderOrder={30}>
        <sphereGeometry args={[isSelected ? 0.085 : 0.055, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>

      <mesh ref={haloRef} renderOrder={29}>
        <sphereGeometry args={[isSelected ? 0.15 : 0.105, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.42} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>

      <mesh ref={pulseRef} quaternion={quaternion} renderOrder={31}>
        <ringGeometry args={[0.06, 0.078, 24]} />
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

  const radius = 2.1;

  // Load the NASA texture directly from the public folder
  const earthTexture = useTexture("/images/earth-map.jpg");

  useMemo(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.anisotropy = 4;
    }
  }, [earthTexture]);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;

    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.055;
      globeRef.current.rotation.x = Math.sin(elapsed * 0.18) * 0.025;
    }

    if (goldRingRef.current) {
      goldRingRef.current.rotation.z += delta * 0.035;
    }
  });

  // Using real lat/lng from your data so nodes stay over their actual countries
  const nodePositions = useMemo(() => {
    return GEO_NODES.map((node) => ({
      ...node,
      position: latLngToVector3(node.lat, node.lng, radius * 1.025),
    }));
  }, []);

  const nodeMap = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    nodePositions.forEach((node) => map.set(node.id, node.position));
    return map;
  }, [nodePositions]);

  const arcs = useMemo(() => {
    const lines: { id: string; points: THREE.Vector3[]; isSelected: boolean; }[] = [];
    const addedPairs = new Set<string>();

    GEO_NODES.forEach((sourceNode) => {
      sourceNode.connections.forEach((targetId) => {
        const pairKey = [sourceNode.id, targetId].sort().join("--");
        if (addedPairs.has(pairKey)) return;
        addedPairs.add(pairKey);

        const sourcePosition = nodeMap.get(sourceNode.id);
        const targetPosition = nodeMap.get(targetId);

        if (!sourcePosition || !targetPosition) return;

        lines.push({
          id: pairKey,
          points: createArcPoints(sourcePosition, targetPosition),
          isSelected: sourceNode.id === selectedNodeId || targetId === selectedNodeId,
        });
      });
    });

    return lines;
  }, [nodeMap, selectedNodeId]);

  const latitudeGeometries = useMemo(() => {
    const latitudes = [-60, -30, 0, 30, 60];
    return latitudes.map((lat) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        points.push(latLngToVector3(lat, (i / 128) * 360 - 180, radius * 1.01));
      }
      return { geometry: new THREE.BufferGeometry().setFromPoints(points), equator: lat === 0 };
    });
  }, []);

  const longitudeGeometries = useMemo(() => {
    const longitudes = [0, 30, 60, 90, 120, 150];
    return longitudes.map((lng) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        points.push(latLngToVector3((i / 128) * 180 - 90, lng, radius * 1.01));
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `varying vec3 vNormal; void main() { float fresnel = pow(0.82 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.15); gl_FragColor = vec4(vec3(0.0, 1.0, 1.0), fresnel * 0.78); }`,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  );

  return (
    <group ref={globeRef}>
      {/* NASA TEXTURE EARTH */}
      <mesh renderOrder={1}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial map={earthTexture} color="#ffffff" transparent opacity={1} side={THREE.FrontSide} depthWrite={true} depthTest={true} toneMapped={false} />
      </mesh>

      <mesh renderOrder={0}>
        <sphereGeometry args={[radius * 0.994, 32, 32]} />
        <meshBasicMaterial color="#001018" transparent opacity={0.25} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      <mesh material={atmosphereMaterial} renderOrder={2}>
        <sphereGeometry args={[radius * 1.075, 32, 32]} />
      </mesh>

      {showWireframe && (
        <mesh renderOrder={3}>
          <sphereGeometry args={[radius * 1.004, 32, 32]} />
          <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      )}

      {latitudeGeometries.map((ring, index) => (
        <line key={`lat-${index}`} geometry={ring.geometry} renderOrder={8}>
          <lineBasicMaterial color={ring.equator ? "#ffd400" : "#00ffff"} transparent opacity={ring.equator ? 1 : 0.72} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </line>
      ))}

      {longitudeGeometries.map((geometry, index) => (
        <line key={`lng-${index}`} geometry={geometry} renderOrder={8}>
          <lineBasicMaterial color="#00ffff" transparent opacity={0.68} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </line>
      ))}

      <group ref={goldRingRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={12}>
          <ringGeometry args={[radius * 1.16, radius * 1.17, 64]} />
          <meshBasicMaterial color="#ffd400" transparent opacity={1} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={11}>
          <ringGeometry args={[radius * 1.14, radius * 1.19, 64]} />
          <meshBasicMaterial color="#ffb700" transparent opacity={0.22} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      <Globe3DLayers layers={layers} radius={radius} />

      {arcs.map((arc) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(arc.points);
        return (
          <line key={arc.id} geometry={geometry} renderOrder={14}>
            <lineBasicMaterial color={arc.isSelected ? "#ffd400" : "#00ff9d"} transparent opacity={arc.isSelected ? 1 : 0.82} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </line>
        );
      })}

      {showNodes && nodePositions.map((node) => (
        <PulsingDataMarker
          key={node.id}
          position={node.position}
          isSelected={node.id === selectedNodeId}
          type={node.type}
          onClick={(event) => {
            event.stopPropagation();
            onSelectNode(node);
          }}
        />
      ))}
    </group>
  );
};