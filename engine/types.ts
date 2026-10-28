export type NodeId = string;

export type OS = "unix" | "linux" | "windows" | "macos" | "unknown";

export type Runtime =
  | "java"
  | "python"
  | "node"
  | "dotnet"
  | "native"
  | null;

export type Severity = "nominal" | "degraded" | "critical" | "unknown";

export type Cause = "human" | "machine" | "unknown";

export type Direction = "forward" | "backward";

export type Evidence = {
  kind: "file" | "record" | "header" | "manifest" | "signature";
  path?: string;
  reason: string;
};

export type FileEntry = {
  path: string;
  size: number;
  hash: string;
  content?: string;
};

export type CsvTable = {
  name: string;
  headers: string[];
  rows: string[][];
};

export type SystemSnapshot = {
  source: "zip" | "csv" | "folder";
  root: string;
  files: FileEntry[];
  records: CsvTable[];
};

export type Identification = {
  os: OS;
  runtime: Runtime;
  scriptLayer: string[];
  state: "certain" | "insufficient";
  evidence: Evidence[];
};

export type Diagnosis = {
  nodeId: NodeId;
  severity: Severity;
  cause: Cause;
  issue: string;
  recommendation: string;
  owner?: string;
  evidence: Evidence[];
};

export type MathModule = {
  name: string;
  rootForward: (
    snapshot: SystemSnapshot,
    identification: Identification
  ) => Map<NodeId, Diagnosis>;
  clientBackward: (
    snapshot: SystemSnapshot,
    identification: Identification
  ) => Map<NodeId, Diagnosis>;
};