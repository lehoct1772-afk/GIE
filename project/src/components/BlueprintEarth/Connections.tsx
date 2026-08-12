import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const RADIUS = 0.84;

function spherePoint(lat: number, lon: number): [number, number, number] {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  return [
    -(RADIUS * Math.sin(phi) * Math.cos(theta)),
    RADIUS * Math.cos(phi),
    RADIUS * Math.sin(phi) * Math.sin(theta),
  ];
}

function arc(
  a: [number, number],
  b: [number, number],
  lift = 0.18
) {
  const p1 = new THREE.Vector3(...spherePoint(a[0], a[1]));
  const p2 = new THREE.Vector3(...spherePoint(b[0], b[1]));

  const mid = p1
    .clone()
    .add(p2)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(RADIUS + lift);

  return new THREE.QuadraticBezierCurve3(
    p1,
    mid,
    p2
  ).getPoints(60);
}

export default function Connections() {
  const lines = useMemo(
    () => [
      arc([55, -100], [40, -10], 0.22),
      arc([40, -10], [25, 45], 0.20),
      arc([25, 45], [0, 80], 0.25),
      arc([0, 80], [-28, 135], 0.28),
      arc([-28, 135], [52, 120], 0.34),
      arc([52, 120], [20, -150], 0.45),
      arc([20, -150], [-35, -60], 0.28),
      arc([-35, -60], [10, 15], 0.18),
      arc([10, 15], [55, -100], 0.32),
      arc([40, -10], [52, 120], 0.36),
      arc([25, 45], [-35, -60], 0.42),
      arc([55, -100], [0, 80], 0.46),
    ],
    []
  );

  return (
    <>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#00F5FF"
          lineWidth={2.2}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      ))}
    </>
  );
}