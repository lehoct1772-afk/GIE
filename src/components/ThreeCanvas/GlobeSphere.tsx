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
  numPoints = 48
): THREE.Vector3[] {
  const distance = v1.distanceTo(v2);

  const mid = new THREE.Vector3()
    .addVectors(v1, v2)
    .multiplyScalar(0.5);

  const midLength = mid.length();

  mid
    .normalize()
    .multiplyScalar(midLength + distance * 0.22);

  const curve = new THREE.QuadraticBezierCurve3(
    v1,
    mid,
    v2
  );

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
}> = ({
  position,
  isSelected,
  type,
  onClick,
}) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  const color =
    isSelected
      ? "#ffd400"
      : type === "CORE"
      ? "#00ffff"
      : type === "HARMONIC"
      ? "#00ff88"
      : "#00d9ff";

  const normal = useMemo(
    () => position.clone().normalize(),
    [position]
  );

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();

    q.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      normal
    );

    return q;
  }, [normal]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (coreRef.current) {
      const material =
        coreRef.current.material as THREE.MeshBasicMaterial;

      material.opacity =
        0.92 + Math.sin(elapsed * 2.1) * 0.08;

      const scale =
        1 + Math.sin(elapsed * 2.1) * 0.12;

      coreRef.current.scale.setScalar(scale);
    }

    if (haloRef.current) {
      const material =
        haloRef.current.material as THREE.MeshBasicMaterial;

      material.opacity =
        0.38 + Math.sin(elapsed * 1.4) * 0.12;

      const scale =
        1.05 + Math.sin(elapsed * 1.4) * 0.1;

      haloRef.current.scale.setScalar(scale);
    }

    if (pulseRef.current) {
      const cycle = (elapsed * 0.5) % 1;

      pulseRef.current.scale.setScalar(
        0.8 + cycle * 2.25
      );

      const material =
        pulseRef.current.material as THREE.MeshBasicMaterial;

      material.opacity =
        (1 - cycle) * 0.65;
    }
  });

  return (
    <group position={position}>
      {/* BRIGHT NODE CORE */}
      <mesh
        ref={coreRef}
        onClick={onClick}
        renderOrder={30}
      >
        <sphereGeometry
          args={[
            isSelected ? 0.085 : 0.055,
            20,
            20,
          ]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>

      {/* NODE GLOW */}
      <mesh
        ref={haloRef}
        renderOrder={29}
      >
        <sphereGeometry
          args={[
            isSelected ? 0.15 : 0.105,
            16,
            16,
          ]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>

      {/* EXPANDING NODE PULSE */}
      <mesh
        ref={pulseRef}
        quaternion={quaternion}
        renderOrder={31}
      >
        <ringGeometry
          args={[0.06, 0.078, 32]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

export const GlobeSphere: React.FC<
  GlobeSphereProps
> = ({
  selectedNodeId,
  onSelectNode,
  showNodes,
  showWireframe,
  layers = DEFAULT_LAYERS,
}) => {
  const globeRef = useRef<THREE.Group>(null);
  const goldRingRef = useRef<THREE.Group>(null);

  const radius = 2.4;

  const continentTexture = useMemo(() => {
    const texture = createGISWorldTexture(layers);

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return texture;
  }, [layers]);

  const elevationBumpMap = useMemo(() => {
    return createGISElevationBumpMap();
  }, []);

  void elevationBumpMap;

  /*
    KEEP EXISTING ROTATION.
    THIS IS THE MOVEMENT WE ALREADY HAVE.
  */
  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;

    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.055;

      globeRef.current.rotation.x =
        Math.sin(elapsed * 0.18) * 0.025;
    }

    if (goldRingRef.current) {
      goldRingRef.current.rotation.z +=
        delta * 0.035;
    }
  });

  const nodePositions = useMemo(() => {
    return GEO_NODES.map((node) => ({
      ...node,

      position: latLngToVector3(
        node.lat,
        node.lng,
        radius * 1.025
      ),
    }));
  }, []);

  const nodeMap = useMemo(() => {
    const map =
      new Map<string, THREE.Vector3>();

    nodePositions.forEach((node) => {
      map.set(node.id, node.position);
    });

    return map;
  }, [nodePositions]);

  const arcs = useMemo(() => {
    const lines: {
      id: string;
      points: THREE.Vector3[];
      isSelected: boolean;
    }[] = [];

    const addedPairs = new Set<string>();

    GEO_NODES.forEach((sourceNode) => {
      sourceNode.connections.forEach(
        (targetId) => {
          const pairKey = [
            sourceNode.id,
            targetId,
          ]
            .sort()
            .join("--");

          if (addedPairs.has(pairKey)) {
            return;
          }

          addedPairs.add(pairKey);

          const sourcePosition =
            nodeMap.get(sourceNode.id);

          const targetPosition =
            nodeMap.get(targetId);

          if (
            !sourcePosition ||
            !targetPosition
          ) {
            return;
          }

          lines.push({
            id: pairKey,

            points: createArcPoints(
              sourcePosition,
              targetPosition
            ),

            isSelected:
              sourceNode.id === selectedNodeId ||
              targetId === selectedNodeId,
          });
        }
      );
    });

    return lines;
  }, [nodeMap, selectedNodeId]);

  const latitudeLines = useMemo(() => {
    const rings: {
      points: THREE.Vector3[];
      equator: boolean;
    }[] = [];

    const latitudes = [
      -60,
      -30,
      0,
      30,
      60,
    ];

    latitudes.forEach((lat) => {
      const points: THREE.Vector3[] = [];

      const segments = 128;

      for (
        let i = 0;
        i <= segments;
        i++
      ) {
        const lng =
          (i / segments) * 360 - 180;

        points.push(
          latLngToVector3(
            lat,
            lng,
            radius * 1.01
          )
        );
      }

      rings.push({
        points,
        equator: lat === 0,
      });
    });

    return rings;
  }, []);

  const longitudeLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];

    const longitudes = [
      0,
      30,
      60,
      90,
      120,
      150,
    ];

    longitudes.forEach((lng) => {
      const points: THREE.Vector3[] = [];

      const segments = 128;

      for (
        let i = 0;
        i <= segments;
        i++
      ) {
        const lat =
          (i / segments) * 180 - 90;

        points.push(
          latLngToVector3(
            lat,
            lng,
            radius * 1.01
          )
        );
      }

      lines.push(points);
    });

    return lines;
  }, []);

  /*
    STRONGER CYAN ATMOSPHERE.
  */
  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;

          void main() {
            vNormal =
              normalize(normalMatrix * normal);

            gl_Position =
              projectionMatrix *
              modelViewMatrix *
              vec4(position, 1.0);
          }
        `,

        fragmentShader: `
          varying vec3 vNormal;

          void main() {

            float fresnel =
              pow(
                0.82 -
                dot(
                  vNormal,
                  vec3(0.0, 0.0, 1.0)
                ),
                2.15
              );

            vec3 cyan =
              vec3(
                0.0,
                1.0,
                1.0
              );

            gl_FragColor =
              vec4(
                cyan,
                fresnel * 0.78
              );
          }
        `,

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

      {/* ========================================
          BRIGHT TRANSPARENT EARTH
          ======================================== */}

      <mesh renderOrder={1}>
        <sphereGeometry
          args={[radius, 96, 96]}
        />

        <meshPhongMaterial
          map={continentTexture}
          transparent
          opacity={0.88}
          color="#d5ffff"
          emissive="#007d92"
          emissiveIntensity={0.72}
          shininess={55}
          depthWrite
          toneMapped={false}
        />
      </mesh>

      {/* ========================================
          DARK GLASS CORE
          ======================================== */}

      <mesh renderOrder={0}>
        <sphereGeometry
          args={[
            radius * 0.994,
            64,
            64,
          ]}
        />

        <meshBasicMaterial
          color="#001018"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* ========================================
          BRIGHT CYAN ATMOSPHERE
          ======================================== */}

      <mesh
        material={atmosphereMaterial}
        renderOrder={2}
      >
        <sphereGeometry
          args={[
            radius * 1.075,
            64,
            64,
          ]}
        />
      </mesh>

      {/* ========================================
          BLUEPRINT WIREFRAME
          ======================================== */}

      {showWireframe && (
        <mesh renderOrder={3}>
          <sphereGeometry
            args={[
              radius * 1.004,
              32,
              32,
            ]}
          />

          <meshBasicMaterial
            color="#00ffff"
            wireframe
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* ========================================
          LATITUDE GRID
          EQUATOR REMAINS GOLD
          ======================================== */}

      {latitudeLines.map(
        (ring, index) => {
          const geometry =
            new THREE.BufferGeometry()
              .setFromPoints(ring.points);

          return (
            <line
              key={`lat-${index}`}
              renderOrder={8}
            >
              <primitive
                object={geometry}
              />

              <lineBasicMaterial
                color={
                  ring.equator
                    ? "#ffd400"
                    : "#00ffff"
                }
                transparent
                opacity={
                  ring.equator
                    ? 1
                    : 0.72
                }
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </line>
          );
        }
      )}

      {/* ========================================
          LONGITUDE GRID
          ======================================== */}

      {longitudeLines.map(
        (points, index) => {
          const geometry =
            new THREE.BufferGeometry()
              .setFromPoints(points);

          return (
            <line
              key={`lng-${index}`}
              renderOrder={8}
            >
              <primitive
                object={geometry}
              />

              <lineBasicMaterial
                color="#00ffff"
                transparent
                opacity={0.68}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </line>
          );
        }
      )}

      {/* ========================================
          GOLD EQUATOR / HARMONIC RING
          ======================================== */}

      <group ref={goldRingRef}>
        <mesh
          rotation={[
            Math.PI / 2,
            0,
            0,
          ]}
          renderOrder={12}
        >
          <ringGeometry
            args={[
              radius * 1.16,
              radius * 1.17,
              128,
            ]}
          />

          <meshBasicMaterial
            color="#ffd400"
            transparent
            opacity={1}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* GOLD OUTER GLOW */}
        <mesh
          rotation={[
            Math.PI / 2,
            0,
            0,
          ]}
          renderOrder={11}
        >
          <ringGeometry
            args={[
              radius * 1.14,
              radius * 1.19,
              128,
            ]}
          />

          <meshBasicMaterial
            color="#ffb700"
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ========================================
          GIS / RESEARCH LAYERS
          ======================================== */}

      <Globe3DLayers
        layers={layers}
        radius={radius}
      />

      {/* ========================================
          BRIGHT GIE CONNECTION ARCS
          ======================================== */}

      {arcs.map((arc) => {
        const geometry =
          new THREE.BufferGeometry()
            .setFromPoints(arc.points);

        return (
          <line
            key={arc.id}
            renderOrder={14}
          >
            <primitive
              object={geometry}
            />

            <lineBasicMaterial
              color={
                arc.isSelected
                  ? "#ffd400"
                  : "#00ff9d"
              }
              transparent
              opacity={
                arc.isSelected
                  ? 1
                  : 0.82
              }
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </line>
        );
      })}

      {/* ========================================
          BRIGHT PULSING GIE NODES
          ======================================== */}

      {showNodes &&
        nodePositions.map((node) => (
          <PulsingDataMarker
            key={node.id}
            position={node.position}
            isSelected={
              node.id === selectedNodeId
            }
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
