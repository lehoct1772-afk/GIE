
Today 2:04 AM

Pasted text(20260816-070423).txt
Document

Generated image


Edit



GIE-CURRENT-WEBSITE.zip
Zip Archive

a73405c5-8d0f-4e29-9fc0-373c50450e2f.png
i am really really really angry i thought you implementedthe code i gave you to fix this

4002c46f-d2ad-4f7a-bc25-59826c438036.png

114e6fd2-9054-4f5d-9e09-bd2923512885.png
HOW DO YOU FUCK THAT U WHEN I GAVE YOU EVERYTHING      WOW


frontend.docx
Document

aeb1f12c-eb34-45be-8797-9867829a0af6.png

b6e23ad7-bbc6-47f2-a2ac-9a5008eeb3fc.png

ef42515a-2783-4cb3-8b00-f4d11b13bdba.png

485a6ef9-2fea-42c2-b3b1-3efff20b9b1d.png


3070e9b1-d0bf-4e73-97a1-abacefd9b503.tsx
TypeScript

97f33905-19c5-4169-88fd-54ea856058b0.png

178baa99-994d-437f-b618-debd8b655c9b.png

c8e6f263-a48f-44ed-8a40-1624ebd626de.png

438fddf2-96bb-46e2-8ccd-a36645f00156.png

7cd0a198-b86b-47af-9b3c-d5cc0e734949.png

4a38fd05-7510-4921-a0c9-0421f52c5a51.png

fcb14089-62c2-4e91-af54-017bd3915d02.png

b7a43fe1-c423-4d5b-bfaf-259dbddc78c9.png

65597414-22b6-433f-9262-5df011981f09.png

6ba55ebb-e372-4dd8-b978-3ce525430209.png

0640825c-c607-4396-ac8e-1fd5fef0931e.png

6fe72b1c-2451-4e51-9043-238c04749db9.png


Pasted code(20260816-110011).ts
TypeScript

Found it. The arches are already in this GlobeSphere.tsx. We do not need to invent another arch component.

The file defines 10 fixed pole-to-pole shield arches at longitudes -162 through 162, with the crown lifted above the globe. 

 It also renders them only when layers.connectionArcs is true. 


And your default configuration already has:

connectionArcs: true,


The problem
The arches currently use:

depthTest={true}
That allows the Earth to hide most of each arch. Combined with how close the arches hug the sphere (1.018 → 1.075 × radius), that's why you're only seeing pieces instead of the strong static shield we want. 


We're not touching the globe, continents, nodes, camera, rotation, or anything else.

Change only this around line 888:

depthTest={true}
to:

depthTest={false}
Then build:

cd "C:\Users\larry\OneDrive\Desktop\GIE AI ZIP 2\GIE Website\project"; npm run build
That is the first correction I want because it preserves the arch geometry you already built and makes the complete ten-arch shield visible instead of redesigning it.


wheres my code for sphere

You already gave me the full GlobeSphere code — the 923-line file. 


If you mean “give me the corrected GlobeSphere.tsx back as a downloadable file”, yes. I’ll take this exact file you supplied, make only the arch visibility correction, and hand the complete .tsx back to you.


i deleted by accident

No problem — I still have the complete file you uploaded. I recovered it and applied only the arch visibility correction we just identified. Your uploaded sphere already contains the ten static arches. 


Download recovered GlobeSphere.tsx
Put it back here:

src\components\ThreeCanvas\GlobeSphere.tsx
Nothing else in your sphere code was intentionally redesigned. 


GlobeSphere.tsx
Code


Library
/
GlobeSphere.tsx


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
    .multiplyScalar(midLength + Math.min(distance * 0.055, 0.22));

  const curve = new THREE.QuadraticBezierCurve3(
    v1,
    mid,
    v2
  );

  return curve.getPoints(numPoints);
}

const ARC_COLORS = ["#00f5ff", "#00ff9d", "#ffd400", "#a855f7", "#ff8a00", "#38bdf8"] as const;

function arcColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return ARC_COLORS[hash % ARC_COLORS.length];
}


const VISUAL_NETWORK_COORDS: Array<[number, number]> = [
  [64,-150],[55,-120],[48,-90],[40,-74],[32,-110],[25,-98],[18,-80],[8,-74],[-5,-78],[-18,-70],[-34,-58],[-50,-72],
  [58,-20],[51,0],[45,15],[36,31],[29,45],[22,60],[31,78],[40,95],[35,120],[44,140],[35,155],[18,138],
  [8,105],[-6,112],[-18,130],[-34,151],[-12,50],[-25,28],[-34,18],[-8,20],[5,10],[16,-4],[25,-15],[38,-8]
];

const NETWORK_COLORS = ["#00f5ff", "#00ff75", "#ffd400", "#a855f7", "#ff7a00", "#38bdf8"] as const;

const VisualNetworkMarker: React.FC<{ position: THREE.Vector3; color: string; phase: number }> = ({ position, color, phase }) => {
  const ref = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    const pulse = 0.90 + Math.sin(t * 2.2) * 0.18;
    ref.current?.scale.setScalar(pulse);
    glow.current?.scale.setScalar(1.05 + Math.sin(t * 1.6) * 0.22);
  });
  return (
    <group position={position}>
      <mesh ref={glow} renderOrder={27}>
        <sphereGeometry args={[0.115, 14, 14]} />
        <meshBasicMaterial color={color} transparent opacity={0.34} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>
      <mesh ref={ref} renderOrder={28}>
        <sphereGeometry args={[0.052, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.98} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>
    </group>
  );
};

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
        0.82 + cycle * 1.65
      );

      const material =
        pulseRef.current.material as THREE.MeshBasicMaterial;

      material.opacity =
        (1 - cycle) * 0.42;
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
            isSelected ? 0.046 : 0.026,
            20,
            20,
          ]}
        />

        <meshStandardMaterial
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
            isSelected ? 0.072 : 0.047,
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
          args={[0.042, 0.052, 32]}
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



  /*
    KEEP EXISTING ROTATION.
    THIS IS THE MOVEMENT WE ALREADY HAVE.
  */
  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;

    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.055;

      globeRef.current.rotation.x = 0;
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

  const visualNetworkNodes = useMemo(() =>
    VISUAL_NETWORK_COORDS.map(([lat, lng], index) => ({
      id: `visual-${index}`,
      position: latLngToVector3(lat, lng, radius * 1.028),
      color: NETWORK_COLORS[index % NETWORK_COLORS.length],
      phase: index * 0.37,
    })), []);

  const visualNetworkArcs = useMemo(() => {
    const links: Array<{ id: string; points: THREE.Vector3[]; color: string }> = [];
    const pairs = new Set<string>();
    const connect = (a: number, b: number) => {
      if (a === b) return;
      const aa = Math.min(a,b), bb = Math.max(a,b);
      const key = `${aa}-${bb}`;
      if (pairs.has(key)) return;
      pairs.add(key);
      const p1 = visualNetworkNodes[a].position;
      const p2 = visualNetworkNodes[b].position;
      if (p1.distanceTo(p2) > radius * 3.25) return;
      links.push({ id: key, points: createArcPoints(p1, p2, 28), color: NETWORK_COLORS[(a+b) % NETWORK_COLORS.length] });
    };
    visualNetworkNodes.forEach((_, i) => {
      connect(i, (i + 1) % visualNetworkNodes.length);
      connect(i, (i + 5) % visualNetworkNodes.length);
      if (i % 2 === 0) connect(i, (i + 11) % visualNetworkNodes.length);
    });
    return links;
  }, [visualNetworkNodes]);

  // Ten fixed pole-to-pole shield arches. Each arch is a stationary raised
  // meridian shield anchored at the poles. The geometry does not animate; it
  // rotates only with the globe group. Existing GIE nodes are the only nodes.
  const staticShieldArches = useMemo(() => {
    const poleRadius = radius * 1.018;
    const crownRadius = radius * 1.075;
    const samples = 160;
    const longitudes = [-162, -126, -90, -54, -18, 18, 54, 90, 126, 162];

    return longitudes.flatMap((lng, archIndex) => {
      const baseColor = ARC_COLORS[archIndex % ARC_COLORS.length];
      const sampled: THREE.Vector3[] = [];

      for (let i = 0; i <= samples; i += 1) {
        const t = i / samples;
        const lat = -90 + t * 180;
        // Raised shield crown: flush at both poles, highest at the equator.
        const lift = Math.sin(Math.PI * t);
        const r = poleRadius + (crownRadius - poleRadius) * lift;
        sampled.push(latLngToVector3(lat, lng, r));
      }

      return sampled.slice(0, -1).map((point, i) => {
        const next = sampled[i + 1];
        const midpoint = point.clone().add(next).multiplyScalar(0.5);
        let color = baseColor;
        let nearest = Number.POSITIVE_INFINITY;

        nodePositions.forEach((node) => {
          const d = midpoint.distanceTo(node.position);
          if (d < 0.30 && d < nearest) {
            nearest = d;
            color = arcColor(node.id);
          }
        });

        return {
          id: `static-shield-arch-${archIndex + 1}-${i}`,
          points: [point, next],
          color,
        };
      });
    });
  }, [nodePositions]);

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
          opacity={0.48}
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
            radius * 1.055,
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

      {layers.latitudeLongitude && latitudeLines.map(
        (ring, index) => {
          const geometry =
            new THREE.BufferGeometry()
              .setFromPoints(ring.points);

          return (
            <primitive object={new THREE.Line()}
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
            </primitive>
          );
        }
      )}

      {/* ========================================
          LONGITUDE GRID
          ======================================== */}

      {layers.latitudeLongitude && longitudeLines.map(
        (points, index) => {
          const geometry =
            new THREE.BufferGeometry()
              .setFromPoints(points);

          return (
            <primitive object={new THREE.Line()}
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
            </primitive>
          );
        }
      )}

      {/* ========================================
          GOLD EQUATOR / HARMONIC RING
          ======================================== */}

      {layers.harmonicRing && (
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
              radius * 1.012,
              radius * 1.018,
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
              radius * 1.006,
              radius * 1.024,
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
      )}

      {/* ========================================
          GIS / RESEARCH LAYERS
          ======================================== */}

      <Globe3DLayers
        layers={layers}
        radius={radius}
      />

      {/* ========================================
          TEN STATIC POLE-TO-POLE SHIELD ARCHES
          ======================================== */}

      {layers.connectionArcs && staticShieldArches.map((arc) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(arc.points);

        return (
          <primitive
            object={new THREE.Line()}
            key={arc.id}
            renderOrder={14}
          >
            <primitive object={geometry} />
            <lineBasicMaterial
              color={arc.color}
              transparent
              opacity={0.90}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              depthTest={false}
              toneMapped={false}
            />
          </primitive>
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






