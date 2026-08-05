import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import Globe from "./Globe";
import GeometryGrid from "./GeometryGrid";
import Atmosphere from "./Atmosphere";
import Connections from "./Connections";
import Nodes from "./Nodes";
import FormulaOverlay from "./FormulaOverlay";
import CropCirclePreview from "./CropCirclePreview";
import CameraRig from "./CameraRig";

export default function BlueprintEarth() {
  return (
    <div className="absolute inset-0">

      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 45,
        }}
      >

        <color attach="background" args={["#02060d"]} />

        <ambientLight intensity={0.4} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          color="#6efcff"
        />

        <Stars
          radius={250}
          depth={60}
          count={4000}
          factor={4}
          fade
        />

        <CameraRig />

        <Atmosphere />

        <Globe />

        <GeometryGrid />

        <Connections />

        <Nodes />

        <FormulaOverlay />

        <CropCirclePreview />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          autoRotate
          autoRotateSpeed={0.35}
        />

      </Canvas>

    </div>
  );
}