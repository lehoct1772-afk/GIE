import React, { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GeoNode, GlobeLayers, UploadedData } from "../../types";
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
  uploadedData?: UploadedData | null;
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
  numPoints = 48
): THREE.Vector3[] {
  const distance = v1.distanceTo(v2);
  const mid = new THREE.Vector3()
    .addVectors(v1, v2)
    .multiplyScalar(0.5);
  const midLength = mid.length();
  mid
    .normalize()
    .multiplyScalar(midLength + Math.min(distance * 0.055, 0.22));
  const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
  return curve.getPoints(numPoints);
}

const ARC_COLORS = ["#00f5ff", "#00ff9d", "#ffd400", "#a855f7", "#ff8a00", "#38bdf8"] as const;
const BASE_SHIELD_LONGITUDES = [-162, -126, -90, -54, -18, 18, 54, 90, 126, 162];

// Status-based diagnostic behavior
type DiagnosticState = 'healthy' | 'warning' | 'critical' | 'unknown';

interface DiagnosticBehavior {
  color: string;
  opacity: number;
  pulseSpeed: number;
  pulseIntensity: number;
  glowIntensity: number;
}

const DIAGNOSTIC_BEHAVIOR: Record<DiagnosticState, DiagnosticBehavior> = {
  healthy: {
    color: '#00ff9d',
    opacity: 0.45,
    pulseSpeed: 0,
    pulseIntensity: 0,
    glowIntensity: 0.2,
  },
  warning: {
    color: '#ffb700',
    opacity: 0.75,
    pulseSpeed: 1.8,
    pulseIntensity: 0.15,
    glowIntensity: 0.6,
  },
  critical: {
    color: '#ff0055',
    opacity: 1.0,
    pulseSpeed: 3.2,
    pulseIntensity: 0.4,
    glowIntensity: 1.0,
  },
  unknown: {
    color: '#4a5568',
    opacity: 0.3,
    pulseSpeed: 0,
    pulseIntensity: 0,
    glowIntensity: 0,
  },
};

// Determine node diagnostic state
function getNodeDiagnosticState(node: any): DiagnosticState {
  if (node.status) {
    if (node.status === 'critical' || node.status === 'warning' || node.status === 'healthy') {
      return node.status;
    }
  }
  if (node.load !== undefined) {
    if (node.load > 85) return 'critical';
    if (node.load > 65) return 'warning';
    if (node.load > 0) return 'healthy';
  }
  if (node.capacity && node.flow) {
    const util = node.flow / node.capacity;
    if (util > 0.85) return 'critical';
    if (util > 0.65) return 'warning';
    return 'healthy';
  }
  return 'unknown';
}

function getArcDiagnosticState(arc: any): DiagnosticState {
  if (arc.status) {
    if (arc.status === 'critical' || arc.status === 'warning' || arc.status === 'healthy') {
      return arc.status;
    }
  }
  if (arc.capacity && arc.flow) {
    const util = arc.flow / arc.capacity;
    if (util > 0.85) return 'critical';
    if (util > 0.65) return 'warning';
    return 'healthy';
  }
  if (arc.latency !== undefined) {
    if (arc.latency > 100) return 'critical';
    if (arc.latency > 50) return 'warning';
    return 'healthy';
  }
  return 'unknown';
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

// ============================================================
// DIAGNOSTIC DATA MARKER WITH OWN DISPOSAL
// ============================================================

const DiagnosticDataMarker: React.FC<{
  position: THREE.Vector3;
  isSelected: boolean;
  type: string;
  state: DiagnosticState;
  load?: number;
  onClick: (event: any) => void;
}> = React.memo(({
  position,
  isSelected,
  type,
  state = 'unknown',
  load = 50,
  onClick,
}) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const loadRingRef = useRef<THREE.Mesh>(null);

  const behavior = DIAGNOSTIC_BEHAVIOR[state];
  const color = behavior.color;
  const size = state === 'critical' ? 0.045 : state === 'warning' ? 0.035 : 0.026;

  const normal = useMemo(() => position.clone().normalize(), [position]);
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [normal]);

  // Create geometries
  const coreGeo = useMemo(() => new THREE.SphereGeometry(isSelected ? 0.046 : size, 20, 20), [isSelected, size]);
  const haloGeo = useMemo(() => new THREE.SphereGeometry(isSelected ? 0.072 : size * 1.8, 16, 16), [isSelected, size]);
  const pulseGeo = useMemo(() => new THREE.RingGeometry(size * 1.6, size * 2.0, 32), [size]);
  const loadRingGeo = useMemo(() => new THREE.RingGeometry(size * 2.5, size * 2.8, 32), [size]);

  // Dispose geometries on unmount
  useEffect(() => {
    return () => {
      coreGeo.dispose();
      haloGeo.dispose();
      pulseGeo.dispose();
      loadRingGeo.dispose();
    };
  }, [coreGeo, haloGeo, pulseGeo, loadRingGeo]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // Healthy = NO pulse
    if (state === 'healthy') {
      if (coreRef.current) {
        coreRef.current.scale.setScalar(1);
        (coreRef.current.material as THREE.MeshBasicMaterial).opacity = 0.92;
      }
      if (haloRef.current) {
        haloRef.current.scale.setScalar(1);
        (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.25;
      }
      if (pulseRef.current) {
        pulseRef.current.scale.setScalar(0.8);
        (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2;
      }
      return;
    }

    // Unknown = minimal/no animation
    if (state === 'unknown') {
      if (coreRef.current) {
        coreRef.current.scale.setScalar(1);
        (coreRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5;
      }
      if (haloRef.current) {
        haloRef.current.scale.setScalar(1);
        (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1;
      }
      if (pulseRef.current) {
        pulseRef.current.scale.setScalar(0.8);
        (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1;
      }
      return;
    }

    // Warning and Critical: animate with defined speeds
    const pulseSpeed = behavior.pulseSpeed;
    const pulseIntensity = behavior.pulseIntensity;

    if (coreRef.current) {
      const material = coreRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.85 + Math.sin(elapsed * pulseSpeed) * (0.08 + pulseIntensity * 0.2);
      const scale = 1 + Math.sin(elapsed * pulseSpeed) * (0.05 + pulseIntensity * 0.2);
      coreRef.current.scale.setScalar(scale);
    }

    if (haloRef.current) {
      const material = haloRef.current.material as THREE.MeshBasicMaterial;
      const baseOpacity = state === 'critical' ? 0.6 : 0.4;
      material.opacity = baseOpacity + Math.sin(elapsed * pulseSpeed * 0.8) * (0.05 + pulseIntensity * 0.15);
      const scale = 1.05 + Math.sin(elapsed * pulseSpeed * 0.8) * (0.03 + pulseIntensity * 0.15);
      haloRef.current.scale.setScalar(scale);
    }

    if (pulseRef.current) {
      const cycle = (elapsed * (state === 'critical' ? 0.8 : 0.5)) % 1;
      const scale = 0.8 + cycle * (1.5 + pulseIntensity * 1.0);
      pulseRef.current.scale.setScalar(scale);
      const material = pulseRef.current.material as THREE.MeshBasicMaterial;
      const baseOpacity = state === 'critical' ? 0.6 : 0.4;
      material.opacity = (1 - cycle) * (baseOpacity + pulseIntensity * 0.4);
    }

    if (loadRingRef.current && load !== undefined) {
      const loadOpacity = 0.2 + (load / 100) * 0.5;
      const material = loadRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = loadOpacity;
    }
  });

  return (
    <group position={position}>
      <mesh ref={coreRef} onClick={onClick} renderOrder={30} geometry={coreGeo}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={state === 'healthy' ? 0.92 : 0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
          emissive={color}
          emissiveIntensity={state === 'critical' ? 1.0 : state === 'warning' ? 0.5 : state === 'healthy' ? 0.1 : 0}
        />
      </mesh>

      <mesh ref={haloRef} renderOrder={29} geometry={haloGeo}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={state === 'healthy' ? 0.25 : state === 'unknown' ? 0.1 : 0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={pulseRef} quaternion={quaternion} renderOrder={31} geometry={pulseGeo}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={state === 'healthy' ? 0.2 : state === 'unknown' ? 0.1 : 0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>

      {load !== undefined && (
        <mesh ref={loadRingRef} quaternion={quaternion} renderOrder={32} geometry={loadRingGeo}>
          <meshBasicMaterial
            color={state === 'critical' ? '#ff0055' : state === 'warning' ? '#ffb700' : '#00ff9d'}
            transparent
            opacity={state === 'healthy' ? 0.2 : state === 'unknown' ? 0.1 : 0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
});

// ============================================================
// ATMOSPHERE SHADER
// ============================================================

const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  void main() {
    float fresnel = pow(0.82 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.15);
    vec3 cyan = vec3(0.0, 1.0, 1.0);
    gl_FragColor = vec4(cyan, fresnel * 0.78);
  }
`;

// ============================================================
// MAIN COMPONENT
// ============================================================

export const GlobeSphere: React.FC<GlobeSphereProps> = ({
  selectedNodeId,
  onSelectNode,
  showNodes,
  showWireframe,
  layers = DEFAULT_LAYERS,
  uploadedData = null,
}) => {
  const globeRef = useRef<THREE.Group>(null);
  const goldRingRef = useRef<THREE.Group>(null);
  const radius = 2.4;

  const { camera, size } = useThree();

  // Responsive camera — recalculates when viewport changes
  useEffect(() => {
    const fov = camera.fov * Math.PI / 180;
    const aspect = size.width / size.height;
    const globeRadius = radius * 1.15;
    let targetDistance = globeRadius / Math.tan(fov / 2);

    if (aspect < 1) {
      targetDistance = Math.max(targetDistance, globeRadius / (Math.tan(fov / 2) * aspect));
    } else if (aspect > 2) {
      targetDistance *= 1.2;
    }

    targetDistance = Math.max(3.5, Math.min(10, targetDistance));

    const dir = camera.position.clone().normalize();
    const currentDist = camera.position.length();
    if (Math.abs(currentDist - targetDistance) > 0.05) {
      camera.position.copy(dir.multiplyScalar(targetDistance));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [camera, size, radius]);

  // Texture refs
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const bumpRef = useRef<THREE.CanvasTexture | null>(null);
  const atmosphereMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Cleanup all resources on unmount
  useEffect(() => {
    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      if (bumpRef.current) {
        bumpRef.current.dispose();
        bumpRef.current = null;
      }
      if (atmosphereMaterialRef.current) {
        atmosphereMaterialRef.current.dispose();
        atmosphereMaterialRef.current = null;
      }
    };
  }, []);

  const continentTexture = useMemo(() => {
    if (textureRef.current) return textureRef.current;
    const texture = createGISWorldTexture(layers);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    textureRef.current = texture;
    return texture;
  }, [layers]);

  const elevationBumpMap = useMemo(() => {
    if (bumpRef.current) return bumpRef.current;
    const texture = createGISElevationBumpMap();
    bumpRef.current = texture;
    return texture;
  }, []);

  const atmosphereMaterial = useMemo(() => {
    if (atmosphereMaterialRef.current) return atmosphereMaterialRef.current;
    const mat = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    atmosphereMaterialRef.current = mat;
    return mat;
  }, []);

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.055;
      globeRef.current.rotation.x = 0;
    }
    if (goldRingRef.current) {
      goldRingRef.current.rotation.z += delta * 0.035;
    }
  });

  // ============================================================
  // NODE POSITIONS
  // ============================================================

  const nodePositions = useMemo(() => {
    const nodes = (uploadedData && uploadedData.nodes && uploadedData.nodes.length > 0)
      ? uploadedData.nodes
      : GEO_NODES;

    return nodes.map((node) => ({
      ...node,
      position: latLngToVector3(
        node.lat || 0,
        node.lng || 0,
        radius * 1.025
      ),
      connections: (node as any).connections || [],
      type: (node as any).type || 'SERVER',
      state: getNodeDiagnosticState(node as any),
      load: (node as any).load || 0,
    }));
  }, [uploadedData, radius]);

  // ============================================================
  // GRID GEOMETRY — memoized, cleanup via useEffect
  // ============================================================

  const gridGeometries = useMemo(() => {
    const latGeos: { geometry: THREE.BufferGeometry; equator: boolean }[] = [];
    const lngGeos: THREE.BufferGeometry[] = [];

    const latitudes = [-60, -30, 0, 30, 60];
    latitudes.forEach((lat) => {
      const points: THREE.Vector3[] = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const lng = (i / segments) * 360 - 180;
        points.push(latLngToVector3(lat, lng, radius * 1.01));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      latGeos.push({ geometry: geo, equator: lat === 0 });
    });

    const longitudes = [0, 30, 60, 90, 120, 150];
    longitudes.forEach((lng) => {
      const points: THREE.Vector3[] = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const lat = (i / segments) * 180 - 90;
        points.push(latLngToVector3(lat, lng, radius * 1.01));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      lngGeos.push(geo);
    });

    return { latGeos, lngGeos };
  }, [radius]);

  // Cleanup grid geometries when they change
  useEffect(() => {
    return () => {
      for (const item of gridGeometries.latGeos) {
        item.geometry.dispose();
      }
      for (const geo of gridGeometries.lngGeos) {
        geo.dispose();
      }
    };
  }, [gridGeometries]);

  // ============================================================
  // DYNAMIC ARCS — memoized, cleanup via useEffect
  // ============================================================

  const arcs = useMemo(() => {
    const lines: {
      id: string;
      points: THREE.Vector3[];
      geometry: THREE.BufferGeometry;
      isSelected: boolean;
      state: DiagnosticState;
      color: string;
      opacity: number;
      flow?: number;
      latency?: number;
    }[] = [];
    const addedPairs = new Set<string>();

    const nodeMap = new Map<string, THREE.Vector3>();
    nodePositions.forEach((n: any) => {
      nodeMap.set(n.id, n.position);
    });

    let arcData: any[] = [];
    if (uploadedData && uploadedData.arcs && uploadedData.arcs.length > 0) {
      arcData = uploadedData.arcs;
    } else {
      const demoArcs: { source: string; target: string; status?: string; flow?: number; latency?: number }[] = [];
      GEO_NODES.forEach((source) => {
        source.connections.forEach((targetId) => {
          demoArcs.push({ source: source.id, target: targetId });
        });
      });
      arcData = demoArcs;
    }

    arcData.forEach((arc) => {
      const pairKey = [arc.source, arc.target].sort().join("--");
      if (addedPairs.has(pairKey)) return;
      addedPairs.add(pairKey);

      const sourcePosition = nodeMap.get(arc.source);
      const targetPosition = nodeMap.get(arc.target);
      if (!sourcePosition || !targetPosition) return;

      const isSelected = arc.source === selectedNodeId || arc.target === selectedNodeId;
      const state = getArcDiagnosticState(arc);
      const behavior = DIAGNOSTIC_BEHAVIOR[state];
      const color = arc.color || behavior.color;
      const points = createArcPoints(sourcePosition, targetPosition);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      lines.push({
        id: pairKey,
        points,
        geometry,
        isSelected,
        state,
        color,
        opacity: behavior.opacity + (isSelected ? 0.3 : 0),
        flow: arc.flow,
        latency: arc.latency,
      });
    });

    return lines;
  }, [nodePositions, selectedNodeId, uploadedData]);

  // Cleanup arc geometries when they change
  useEffect(() => {
    return () => {
      for (const arc of arcs) {
        arc.geometry.dispose();
      }
    };
  }, [arcs]);

  // ============================================================
  // SHIELD ARCHES — memoized, cleanup via useEffect
  // ============================================================

  const shieldArchCount = useMemo(() => {
    const baseCount = 10;
    const nodeCount = nodePositions.length;
    if (nodeCount <= 10) return baseCount;
    const additional = Math.min(Math.floor((nodeCount - 10) / 5) * 2, 20);
    return Math.min(baseCount + additional, 30);
  }, [nodePositions.length]);

  const shieldLongitudes = useMemo(() => {
    const count = shieldArchCount;
    if (count === 10) return BASE_SHIELD_LONGITUDES;
    const step = 360 / count;
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
      let lng = -180 + i * step + step / 2;
      if (lng > 180) lng -= 360;
      result.push(Math.round(lng));
    }
    return result;
  }, [shieldArchCount]);

  const isPointNearArch = (point: THREE.Vector3, sampled: THREE.Vector3[], threshold: number): boolean => {
    for (const p of sampled) {
      if (p.distanceTo(point) < threshold) {
        return true;
      }
    }
    return false;
  };

  const staticShieldArches = useMemo(() => {
    const poleRadius = radius * 1.018;
    const crownRadius = radius * 1.075;
    const samples = 160;
    const result: {
      id: string;
      geometry: THREE.BufferGeometry;
      color: string;
      opacity: number;
      state: DiagnosticState;
    }[] = [];

    shieldLongitudes.forEach((lng, archIndex) => {
      const baseColor = ARC_COLORS[archIndex % ARC_COLORS.length];
      const sampled: THREE.Vector3[] = [];
      for (let i = 0; i <= samples; i += 1) {
        const t = i / samples;
        const lat = -90 + t * 180;
        const lift = Math.sin(Math.PI * t);
        const r = poleRadius + (crownRadius - poleRadius) * lift;
        sampled.push(latLngToVector3(lat, lng, r));
      }

      let archState: DiagnosticState = 'unknown';
      let maxLoad = 0;

      for (const node of nodePositions as any[]) {
        if (isPointNearArch(node.position, sampled, 0.45)) {
          const nodeState = getNodeDiagnosticState(node);
          if (nodeState === 'critical') {
            archState = 'critical';
          } else if (nodeState === 'warning' && archState !== 'critical') {
            archState = 'warning';
          } else if (nodeState === 'healthy' && archState === 'unknown') {
            archState = 'healthy';
          }
          if (node.load && node.load > maxLoad) maxLoad = node.load;
        }
      }

      if (archState === 'unknown') {
        for (const arc of arcs) {
          for (const p of arc.points) {
            if (isPointNearArch(p, sampled, 0.4)) {
              if (arc.state === 'critical') {
                archState = 'critical';
              } else if (arc.state === 'warning' && archState !== 'critical') {
                archState = 'warning';
              } else if (arc.state === 'healthy' && archState === 'unknown') {
                archState = 'healthy';
              }
            }
          }
        }
      }

      const behavior = DIAGNOSTIC_BEHAVIOR[archState];
      const color = archState === 'unknown' ? baseColor : behavior.color;

      const geometry = new THREE.BufferGeometry().setFromPoints(sampled);

      result.push({
        id: `shield-${archIndex}-${lng}`,
        geometry,
        color,
        opacity: archState === 'critical' ? 1.0 : archState === 'warning' ? 0.8 : 0.5,
        state: archState,
      });
    });

    return result;
  }, [shieldLongitudes, nodePositions, arcs]);

  // Cleanup shield geometries when they change
  useEffect(() => {
    return () => {
      for (const arch of staticShieldArches) {
        arch.geometry.dispose();
      }
    };
  }, [staticShieldArches]);

  return (
    <group ref={globeRef}>
      {/* EARTH */}
      <mesh renderOrder={1}>
        <sphereGeometry args={[radius, 96, 96]} />
        <meshStandardMaterial
          map={continentTexture}
          bumpMap={elevationBumpMap}
          bumpScale={0.060}
          roughness={0.72}
          metalness={0.0}
          emissive="#07131a"
          emissiveIntensity={0.10}
          color="#ffffff"
          transparent
          opacity={1}
          side={THREE.FrontSide}
          depthWrite={true}
          depthTest={true}
          toneMapped={false}
        />
      </mesh>

      {/* DARK GLASS CORE */}
      <mesh renderOrder={0}>
        <sphereGeometry args={[radius * 0.994, 64, 64]} />
        <meshBasicMaterial color="#001018" transparent opacity={0.48} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {/* ATMOSPHERE */}
      <mesh material={atmosphereMaterial} renderOrder={2}>
        <sphereGeometry args={[radius * 1.055, 64, 64]} />
      </mesh>

      {/* WIREFRAME */}
      {showWireframe && (
        <mesh renderOrder={3}>
          <sphereGeometry args={[radius * 1.004, 32, 32]} />
          <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      )}

      {/* LATITUDE GRID */}
      {layers.latitudeLongitude && gridGeometries.latGeos.map((item, index) => (
        <line key={`lat-${index}`} renderOrder={8}>
          <primitive object={item.geometry} />
          <lineBasicMaterial color={item.equator ? "#ffd400" : "#00ffff"} transparent opacity={item.equator ? 1 : 0.72} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </line>
      ))}

      {/* LONGITUDE GRID */}
      {layers.latitudeLongitude && gridGeometries.lngGeos.map((geometry, index) => (
        <line key={`lng-${index}`} renderOrder={8}>
          <primitive object={geometry} />
          <lineBasicMaterial color="#00ffff" transparent opacity={0.68} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </line>
      ))}

      {/* HARMONIC RING */}
      {layers.harmonicRing && (
        <group ref={goldRingRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={12}>
            <ringGeometry args={[radius * 1.012, radius * 1.018, 128]} />
            <meshBasicMaterial color="#ffd400" transparent opacity={1} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={11}>
            <ringGeometry args={[radius * 1.006, radius * 1.024, 128]} />
            <meshBasicMaterial color="#ffb700" transparent opacity={0.22} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        </group>
      )}

      {/* GIS LAYERS */}
      <Globe3DLayers layers={layers} radius={radius} />

      {/* STATIC SHIELD ARCHES */}
      {layers.connectionArcs && staticShieldArches.map((arch) => (
        <line key={arch.id} renderOrder={14}>
          <primitive object={arch.geometry} />
          <lineBasicMaterial
            color={arch.color}
            transparent
            opacity={arch.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
          />
        </line>
      ))}

      {/* DYNAMIC ARCS */}
      {layers.connectionArcs && arcs.map((arc) => {
        const behavior = DIAGNOSTIC_BEHAVIOR[arc.state];
        const opacity = arc.isSelected ? 1.0 : behavior.opacity;
        const color = arc.color || behavior.color;

        return (
          <line key={arc.id} renderOrder={14}>
            <primitive object={arc.geometry} />
            <lineBasicMaterial
              color={color}
              transparent
              opacity={opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              depthTest={false}
              toneMapped={false}
            />
          </line>
        );
      })}

      {/* NODES */}
      {showNodes && nodePositions.map((node: any) => (
        <DiagnosticDataMarker
          key={node.id}
          position={node.position}
          isSelected={node.id === selectedNodeId}
          type={node.type || 'SERVER'}
          state={node.state || 'unknown'}
          load={node.load || 0}
          onClick={(event) => {
            event.stopPropagation();
            onSelectNode(node);
          }}
        />
      ))}
    </group>
  );
};