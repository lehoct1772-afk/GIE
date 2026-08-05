import { useMemo } from "react";
import { Line } from "@react-three/drei";

export default function Connections() {
  const lines = useMemo(() => {
    return [
      [[-1.2, 0.8, 1.5], [1.4, -0.5, 1.6]],
      [[-0.7, -1.5, 1.2], [1.3, 1.1, 0.9]],
      [[-1.7, 0.2, 0.8], [0.5, 1.7, 1.0]],
      [[0.0, -1.8, 1.0], [1.8, 0.4, 0.8]],
      [[-1.6, 1.3, 0.4], [1.5, 1.0, 0.5]],
    ];
  }, []);

  return (
    <>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#00e5ff"
          lineWidth={1}
          transparent
          opacity={0.45}
        />
      ))}
    </>
  );
}