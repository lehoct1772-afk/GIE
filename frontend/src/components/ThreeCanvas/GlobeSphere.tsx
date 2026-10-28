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
    const pulse = Math.sin(elapsed * 2.5);

    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + pulse * 0.05);
    }
    if (pulseRef.current) {
      const cycle = (elapsed * 0.8) % 1;
      pulseRef.current.scale.setScalar(1 + cycle * 1.5);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - cycle) * 0.6;
    }
  });

  return (
    <group position={position}>
      <mesh ref={coreRef} onClick={onClick} renderOrder={30}>
        <sphereGeometry args={[isSelected ? 0.035 : 0.02, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={1} depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>

      <mesh ref={pulseRef} quaternion={quaternion} renderOrder={31}>
        <ringGeometry args={[0.04, 0.045, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>

      {isSelected && (
        <mesh quaternion={quaternion} renderOrder={31}>
          <ringGeometry args={[0.06, 0.065, 32]} />
          <meshBasicMaterial color="#ffd400" transparent opacity={1} side={THREE.DoubleSide} depthWrite={false} depthTest={false} toneMapped={false} />
        </mesh>
      )}
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
          <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.18} depthWrite={false} toneMapped={false} />
        </mesh>
      )}

      {latitudeGeometries.map((ring, index) => {
        const mat = new THREE.LineBasicMaterial({
          color: ring.equator ? "#ffd400" : "#00ffff",
          transparent: true,
          opacity: ring.equator ? 0.5 : 0.12,
          depthWrite: false,
          toneMapped: false,
        });
        const lineObj = new THREE.Line(ring.geometry, mat);
        return <primitive key={`lat-${index}`} object={lineObj} renderOrder={8} />;
      })}

      {longitudeGeometries.map((geometry, index) => {
        const mat = new THREE.LineBasicMaterial({
          color: "#00ffff",
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
          toneMapped: false,
        });
        const lineObj = new THREE.Line(geometry, mat);
        return <primitive key={`lng-${index}`} object={lineObj} renderOrder={8} />;
      })}

      <group ref={goldRingRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={12}>
          <ringGeometry args={[radius * 1.15, radius * 1.155, 64]} />
          <meshBasicMaterial color="#ffd400" transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      <Globe3DLayers layers={layers} radius={radius} />

      {arcs.map((arc) => {
        const g = new THREE.BufferGeometry().setFromPoints(arc.points);
        const m = new THREE.LineBasicMaterial({ 
          color: arc.isSelected ? "#ffd400" : "#00d9ff", 
          transparent: true, 
          opacity: arc.isSelected ? 0.9 : 0.25, 
          depthWrite: false, 
          toneMapped: false 
        });
        return <primitive key={arc.id} object={new THREE.Line(g, m)} renderOrder={14} />;
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