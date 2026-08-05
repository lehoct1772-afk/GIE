import { useMemo } from "react";

export default function Nodes() {
  const nodes = useMemo(() => {
    return [
      [-1.4, 0.9, 1.4],
      [1.2, -0.4, 1.6],
      [-0.6, -1.4, 1.3],
      [1.5, 1.0, 0.8],
      [-1.7, 0.1, 0.7],
      [0.3, 1.8, 0.6],
      [0.0, -1.8, 0.9],
      [1.8, 0.3, 0.7],
      [-1.3, 1.5, 0.5],
      [0.9, -1.2, 1.5],
      [-0.2, 0.4, 2.2],
      [0.6, -0.9, 2.0],
    ];
  }, []);

  return (
    <>
      {nodes.map((position, i) => (
        <mesh key={i} position={position as [number, number, number]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial
            color="#00F5FF"
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}