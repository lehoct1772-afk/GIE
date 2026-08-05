import { Text } from "@react-three/drei";

export default function FormulaOverlay() {
  return (
    <>
      <Text
        position={[0, 3.0, 0]}
        fontSize={0.14}
        color="#00F5FF"
        anchorX="center"
      >
        GIE • GEOMETRIC INTELLIGENCE ENGINE
      </Text>

      <Text
        position={[-3.0, 2.2, 0]}
        fontSize={0.08}
        color="#66FFFF"
      >
        π • φ • Fibonacci
      </Text>

      <Text
        position={[3.0, 1.6, 0]}
        fontSize={0.08}
        color="#66FFFF"
      >
        Blueprint Coordinate System
      </Text>

      <Text
        position={[-2.8, -2.0, 0]}
        fontSize={0.07}
        color="#44DFFF"
      >
        Geometry • Mathematics • Engineering
      </Text>

      <Text
        position={[2.7, -2.5, 0]}
        fontSize={0.07}
        color="#44DFFF"
      >
        Written Through Mathematics
      </Text>
    </>
  );
}