import { useMemo } from "react";
import * as THREE from "three";
import type { SystemGraph, GraphNode } from "../../../../engine/buildGraph";
import { latLngToVector3 } from "./GlobeSphere";

type Props = {
  graph: SystemGraph;
  radius: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const SEVERITY_COLOR: Record<string, string> = {
  nominal: "#00ff9d",
  degraded: "#ffb700",
  critical: "#ff0055",
  unknown: "#4a5568",
};

export function EngineNodes({ graph, radius, selectedId, onSelect }: Props) {
  const nodes = useMemo(() => Array.from(graph.nodes.values()), [graph]);

  return (
    <group>
      {nodes.map((node) => (
        <NodeDot
          key={node.id}
          node={node}
          radius={radius}
          selected={node.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function NodeDot({
  node,
  radius,
  selected,
  onSelect,
}: {
  node: GraphNode;
  radius: number;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const position = useMemo(() => {
    const angle = hash(node.id) * Math.PI * 2;
    const lat = ((node.depth % 8) - 4) * 15;
    const lng = ((angle * 180) / Math.PI) % 360 - 180;
    return latLngToVector3(lat, lng, radius * (1.05 + node.depth * 0.03));
  }, [node.id, node.depth, radius]);

  const color = SEVERITY_COLOR[node.severity] ?? SEVERITY_COLOR.unknown;
  const size = selected ? 0.06 : node.severity === "critical" ? 0.045 : 0.03;

  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}