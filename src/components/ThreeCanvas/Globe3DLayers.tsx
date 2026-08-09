import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GlobeLayers } from "../../types";
import { latLngToVector3 } from "./GlobeSphere";

interface Globe3DLayersProps {
  layers: GlobeLayers;
  radius: number;
}

const ANCIENT_SITES = [
  { name: "Great Pyramid of Giza", lat: 29.9792, lng: 31.1342 },
  { name: "Stonehenge", lat: 51.1789, lng: -1.8262 },
  { name: "Teotihuacan", lat: 19.6925, lng: -98.8438 },
  { name: "Machu Picchu", lat: -13.1631, lng: -72.545 },
  { name: "Easter Island", lat: -27.1127, lng: -109.3497 },
  { name: "Angkor Wat", lat: 13.4125, lng: 103.867 },
  { name: "Mount Kailash", lat: 31.0672, lng: 81.3119 },
  { name: "Parthenon", lat: 37.9715, lng: 23.7267 },
  { name: "Nazca Lines", lat: -14.739, lng: -75.13 },
  { name: "Mohenjo-Daro", lat: 27.3292, lng: 68.1386 },
];

const CROP_CIRCLES = [
  { lat: 51.415, lng: -1.854 },
  { lat: 51.147, lng: -2.337 },
  { lat: 51.378, lng: -1.776 },
  { lat: 51.178, lng: -1.826 },
  { lat: 52.133, lng: -0.466 },
];

const VOLCANOES = [
  { name: "Mount Fuji", lat: 35.3606, lng: 138.7274 },
  { name: "Mauna Loa", lat: 19.4756, lng: -155.6054 },
  { name: "Krakatoa", lat: -6.1021, lng: 105.423 },
  { name: "Mount Etna", lat: 37.751, lng: 14.9934 },
  { name: "Mount Popocatepetl", lat: 19.0225, lng: -98.6278 },
  { name: "Cotopaxi", lat: -0.6838, lng: -78.4372 },
];

const EARTHQUAKES = [
  { lat: 38.322, lng: 142.369, mag: 9.1 },
  { lat: 3.316, lng: 95.854, mag: 9.1 },
  { lat: -38.29, lng: -73.05, mag: 9.5 },
  { lat: 61.02, lng: -147.65, mag: 9.2 },
];

const TECTONIC_PLATES: [number, number][][] = [
  [
    [60, -150],
    [50, -170],
    [30, 140],
    [10, 130],
    [-10, 150],
    [-30, 180],
    [-50, -140],
    [-60, -80],
    [-20, -75],
    [10, -85],
    [30, -115],
    [60, -150],
  ],
  [
    [70, -20],
    [50, -30],
    [20, -40],
    [0, -20],
    [-30, -15],
    [-50, -10],
  ],
  [
    [35, -10],
    [40, 15],
    [38, 40],
    [35, 70],
    [28, 90],
    [10, 100],
    [-5, 120],
  ],
];

/* =========================================================
   MAGNETIC FIELD
   ========================================================= */

function createMagneticFieldLine(
  earthRadius: number,
  shell: number,
  rotation: number
) {
  const points: THREE.Vector3[] = [];

  const L = earthRadius * shell;
  const steps = 180;

  for (let i = 0; i <= steps; i++) {
    const theta =
      0.30 + (i / steps) * (Math.PI - 0.60);

    const distance =
      L * Math.pow(Math.sin(theta), 2);

    if (distance < earthRadius * 1.025) continue;

    const x = distance * Math.sin(theta);
    const y = distance * Math.cos(theta);

    const point = new THREE.Vector3(x, y, 0);

    point.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      rotation
    );

    points.push(point);
  }

  return points;
}

export const Globe3DLayers: React.FC<
  Globe3DLayersProps
> = ({ layers, radius }) => {
  const magneticGroupRef =
    useRef<THREE.Group>(null);

  const northPulseRef =
    useRef<THREE.Mesh>(null);

  const southPulseRef =
    useRef<THREE.Mesh>(null);

  /* ---------------------------------------------------------
     ANCIENT SITE CONNECTIONS
     --------------------------------------------------------- */

  const leyLinePoints = useMemo(() => {
    const lines: THREE.Vector3[][] = [];

    for (let i = 0; i < ANCIENT_SITES.length; i++) {
      for (
        let j = i + 1;
        j < ANCIENT_SITES.length;
        j++
      ) {
        const p1 = latLngToVector3(
          ANCIENT_SITES[i].lat,
          ANCIENT_SITES[i].lng,
          radius * 1.003
        );

        const p2 = latLngToVector3(
          ANCIENT_SITES[j].lat,
          ANCIENT_SITES[j].lng,
          radius * 1.003
        );

        const distance = p1.distanceTo(p2);

        if (distance < radius * 1.8) {
          const midpoint = new THREE.Vector3()
            .addVectors(p1, p2)
            .multiplyScalar(0.5);

          midpoint
            .normalize()
            .multiplyScalar(
              radius *
                (1.003 + distance * 0.08)
            );

          const curve =
            new THREE.QuadraticBezierCurve3(
              p1,
              midpoint,
              p2
            );

          lines.push(curve.getPoints(32));
        }
      }
    }

    return lines;
  }, [radius]);

  /* ---------------------------------------------------------
     TECTONIC PLATES
     --------------------------------------------------------- */

  const plateLines = useMemo(() => {
    return TECTONIC_PLATES.map((plate) =>
      plate.map(([lat, lng]) =>
        latLngToVector3(
          lat,
          lng,
          radius * 1.006
        )
      )
    );
  }, [radius]);

  /* ---------------------------------------------------------
     MAGNETIC SHELLS
     Keep the field controlled — no giant spaghetti cage.
     --------------------------------------------------------- */

  const magneticFieldLines = useMemo(() => {
    const lines: {
      points: THREE.Vector3[];
      major: boolean;
    }[] = [];

    const shells = [
      1.38,
      1.52,
      1.68,
      1.86,
      2.06,
    ];

    const rotations = 10;

    shells.forEach((shell, shellIndex) => {
      for (
        let i = 0;
        i < rotations;
        i++
      ) {
        const rotation =
          (i / rotations) * Math.PI * 2;

        const points =
          createMagneticFieldLine(
            radius,
            shell,
            rotation
          );

        if (points.length > 1) {
          lines.push({
            points,
            major:
              shellIndex === 1 ||
              shellIndex === 3,
          });
        }
      }
    });

    return lines;
  }, [radius]);

  /* ---------------------------------------------------------
     FIELD ANIMATION
     --------------------------------------------------------- */

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (magneticGroupRef.current) {
      /*
        VERY subtle breathing.
        Not rotating independently from Gaia.
      */

      const breathe =
        1 + Math.sin(time * 0.8) * 0.008;

      magneticGroupRef.current.scale.setScalar(
        breathe
      );
    }

    /*
      Polar energy pulses.
      Small enough to remain technical rather than cartoonish.
    */

    if (northPulseRef.current) {
      const pulse =
        1 + Math.sin(time * 2.2) * 0.22;

      northPulseRef.current.scale.setScalar(
        pulse
      );
    }

    if (southPulseRef.current) {
      const pulse =
        1 +
        Math.sin(time * 2.2 + Math.PI) *
          0.22;

      southPulseRef.current.scale.setScalar(
        pulse
      );
    }
  });

  const showMagneticField =
    layers.mathOverlays;

  return (
    <group>

      {/* =====================================================
          GEOMAGNETIC FIELD V2
          ===================================================== */}

      {showMagneticField && (
        <group
          ref={magneticGroupRef}
          rotation={[
            THREE.MathUtils.degToRad(11),
            0,
            THREE.MathUtils.degToRad(-7),
          ]}
          userData={{
            layer: "GEOMAGNETIC FIELD",
            model:
              "Dipole field-line visualization",
          }}
        >
          {magneticFieldLines.map(
            ({ points, major }, index) => {
              const geometry =
                new THREE.BufferGeometry()
                  .setFromPoints(points);

              return (
                <line
                  key={`mag-${index}`}
                  renderOrder={18}
                  userData={{
                    layer:
                      "GEOMAGNETIC FIELD",
                  }}
                >
                  <primitive
                    object={geometry}
                  />

                  <lineBasicMaterial
                    color={
                      major
                        ? "#c45cff"
                        : "#7048ff"
                    }
                    transparent
                    opacity={
                      major ? 0.95 : 0.67
                    }
                    blending={
                      THREE.AdditiveBlending
                    }
                    depthWrite={false}
                    toneMapped={false}
                  />
                </line>
              );
            }
          )}

          {/* NORTH MAGNETIC ENERGY POINT */}

          <mesh
            ref={northPulseRef}
            position={[
              0,
              radius * 1.065,
              0,
            ]}
            renderOrder={30}
            userData={{
              layer:
                "GEOMAGNETIC NORTH",
            }}
          >
            <sphereGeometry
              args={[0.065, 18, 18]}
            />

            <meshBasicMaterial
              color="#e9a7ff"
              transparent
              opacity={0.95}
              blending={
                THREE.AdditiveBlending
              }
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          {/* NORTH GLOW */}

          <mesh
            position={[
              0,
              radius * 1.065,
              0,
            ]}
            renderOrder={29}
          >
            <sphereGeometry
              args={[0.14, 18, 18]}
            />

            <meshBasicMaterial
              color="#a855ff"
              transparent
              opacity={0.22}
              blending={
                THREE.AdditiveBlending
              }
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          {/* SOUTH MAGNETIC ENERGY POINT */}

          <mesh
            ref={southPulseRef}
            position={[
              0,
              -radius * 1.065,
              0,
            ]}
            renderOrder={30}
            userData={{
              layer:
                "GEOMAGNETIC SOUTH",
            }}
          >
            <sphereGeometry
              args={[0.065, 18, 18]}
            />

            <meshBasicMaterial
              color="#e9a7ff"
              transparent
              opacity={0.95}
              blending={
                THREE.AdditiveBlending
              }
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          {/* SOUTH GLOW */}

          <mesh
            position={[
              0,
              -radius * 1.065,
              0,
            ]}
            renderOrder={29}
          >
            <sphereGeometry
              args={[0.14, 18, 18]}
            />

            <meshBasicMaterial
              color="#a855ff"
              transparent
              opacity={0.22}
              blending={
                THREE.AdditiveBlending
              }
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}

      {/* =====================================================
          ANCIENT SITE CONNECTION NETWORK
          ===================================================== */}

      {layers.leyLines &&
        leyLinePoints.map(
          (points, index) => {
            const geometry =
              new THREE.BufferGeometry()
                .setFromPoints(points);

            return (
              <line
                key={`ley-${index}`}
                renderOrder={13}
                userData={{
                  layer:
                    "ANCIENT-SITE CONNECTION NETWORK",
                }}
              >
                <primitive
                  object={geometry}
                />

                <lineBasicMaterial
                  color="#00ff9d"
                  transparent
                  opacity={0.82}
                  blending={
                    THREE.AdditiveBlending
                  }
                  depthWrite={false}
                  toneMapped={false}
                />
              </line>
            );
          }
        )}

      {/* =====================================================
          TECTONIC PLATES
          ===================================================== */}

      {layers.tectonicPlates &&
        plateLines.map(
          (points, index) => {
            const geometry =
              new THREE.BufferGeometry()
                .setFromPoints(points);

            return (
              <line
                key={`plate-${index}`}
                userData={{
                  layer:
                    "TECTONIC PLATE BOUNDARY",
                }}
              >
                <primitive
                  object={geometry}
                />

                <lineBasicMaterial
                  color="#ff8a00"
                  transparent
                  opacity={0.8}
                  depthWrite={false}
                  toneMapped={false}
                />
              </line>
            );
          }
        )}

      {/* =====================================================
          ANCIENT SITES
          ===================================================== */}

      {layers.ancientSites &&
        ANCIENT_SITES.map((site) => {
          const position =
            latLngToVector3(
              site.lat,
              site.lng,
              radius * 1.025
            );

          return (
            <mesh
              key={site.name}
              position={position}
              renderOrder={20}
              userData={{
                layer: "ANCIENT SITE",
                name: site.name,
              }}
            >
              <sphereGeometry
                args={[0.045, 16, 16]}
              />

              <meshBasicMaterial
                color="#ffd000"
                toneMapped={false}
              />
            </mesh>
          );
        })}

      {/* =====================================================
          CROP CIRCLES
          ===================================================== */}

      {layers.cropCircles &&
        CROP_CIRCLES.map(
          (site, index) => {
            const position =
              latLngToVector3(
                site.lat,
                site.lng,
                radius * 1.026
              );

            return (
              <mesh
                key={`crop-${index}`}
                position={position}
                renderOrder={20}
                userData={{
                  layer:
                    "CROP-CIRCLE SITE",
                }}
              >
                <sphereGeometry
                  args={[
                    0.04,
                    16,
                    16,
                  ]}
                />

                <meshBasicMaterial
                  color="#00ff9d"
                  toneMapped={false}
                />
              </mesh>
            );
          }
        )}

      {/* =====================================================
          VOLCANOES
          ===================================================== */}

      {layers.volcanoes &&
        VOLCANOES.map((volcano) => {
          const position =
            latLngToVector3(
              volcano.lat,
              volcano.lng,
              radius * 1.025
            );

          return (
            <mesh
              key={volcano.name}
              position={position}
              userData={{
                layer: "VOLCANO",
                name: volcano.name,
              }}
            >
              <sphereGeometry
                args={[0.04, 14, 14]}
              />

              <meshBasicMaterial
                color="#ff305f"
                toneMapped={false}
              />
            </mesh>
          );
        })}

      {/* =====================================================
          EARTHQUAKES
          ===================================================== */}

      {layers.earthquakes &&
        EARTHQUAKES.map(
          (earthquake, index) => {
            const position =
              latLngToVector3(
                earthquake.lat,
                earthquake.lng,
                radius * 1.027
              );

            return (
              <mesh
                key={`quake-${index}`}
                position={position}
                userData={{
                  layer: "EARTHQUAKE",
                  magnitude:
                    earthquake.mag,
                }}
              >
                <sphereGeometry
                  args={[
                    0.035 +
                      earthquake.mag *
                        0.002,
                    14,
                    14,
                  ]}
                />

                <meshBasicMaterial
                  color="#ff6500"
                  toneMapped={false}
                />
              </mesh>
            );
          }
        )}
    </group>
  );
};