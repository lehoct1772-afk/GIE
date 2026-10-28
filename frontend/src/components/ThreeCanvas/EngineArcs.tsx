import { useMemo } from "react";
import * as THREE from "three";
import type { SystemGraph, GraphArc } from "../../../../engine/buildGraph";
import { latLngToVector3 } from "./GlobeSphere";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      primitive: any;
      [key: string]: any;
    }
  }
}

type Props = {
  graph: SystemGraph;
  radius: number;
  selectedId: string | null;
};

const SEVERITY_COLOR: Record<string, string> = {
  nominal: "#00ff9d",
  degraded: "#ffb700",
  critical: "#ff0055",
  unknown: "#4a5568",
};

export function EngineArcs({ graph, radius, selectedId }: Props) {
  const arcs = useMemo(() => graph.arcs, [graph]);

  return (
    <group>
      {arcs.map((arc) => (
        <ArcLine
          key={arc.id}
          arc={arc}
          graph={graph}
          radius={radius}
          selectedId={selectedId}
        />
      ))}
    </group>
  );
}

function ArcLine({
  arc,
  graph,
  radius,
  selectedId,
}: {
  arc: GraphArc;
  graph: SystemGraph;
  radius: number;
  selectedId: string | null;
}) {
  const parent = graph.nodes.get(arc.parentId);
  const child = graph.nodes.get(arc.childId);
  if (!parent || !child) return null;

  const { geometry, color, opacity } = useMemo(() => {
    const p1 = nodePosition(parent, radius);
    const p2 = nodePosition(child, radius);
    const points = arcPoints(p1, p2);

    return {
      geometry: new THREE.BufferGeometry().setFromPoints(points),
      color: SEVERITY_COLOR[arc.health] ?? SEVERITY_COLOR.unknown,
      opacity:
        selectedId === arc.parentId || selectedId === arc.childId ? 0.95 : 0.35,
    };
  }, [arc, parent, child, radius, selectedId]);

  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </line>
  );
}

function nodePosition(node: { id: string; depth: number }, radius: number): THREE.Vector3 {
  const angle = hash(node.id) * Math.PI * 2;
  const lat = ((node.depth % 8) - 4) * 15;
  const lng = ((angle * 180) / Math.PI) % 360 - 180;
  return latLngToVector3(lat, lng, radius * (1.05 + node.depth * 0.03));
}

function arcPoints(v1: THREE.Vector3, v2: THREE.Vector3, segments = 32): THREE.Vector3[] {
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
  const dir = mid.clone().normalize();
  const lift = v1.distanceTo(v2) * 0.25;
  const control = mid.clone().add(dir.multiplyScalar(lift));

  const curve = new THREE.QuadraticBezierCurve3(v1, control, v2);
  return curve.getPoints(segments);
}

function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}