export interface EngineState {
  isRunning: boolean;
  mode: ViewMode;
  activeNodes: GeoNode[];
  lastCalculation: MathConstant | null;
  uptime: number;
  errorState: string | null;
  reconstructionActive: boolean;
  targetGeometry: string | null;
}

export interface EngineLaunchConfig {
  mode?: ViewMode;
  focusArea?: 'GLOBAL' | 'REGIONAL' | 'GEOLOGICAL' | 'RESEARCH' | 'LOCAL';
  autoSync?: boolean;
  reconstruct?: boolean;
}

export interface EngineStatus {
  isActive: boolean;
  currentMode: ViewMode;
  nodeCount: number;
  activeStreams: DataStream[];
  recentActivity: ActivityFeedItem[];
  timestamp: string;
  reconstructionActive: boolean;
  targetGeometry: string | null;
}

export const engineState: EngineState = {
  isRunning: false,
  mode: 'ORBIT_VIEW',
  activeNodes: [],
  lastCalculation: null,
  uptime: 0,
  errorState: null,
  reconstructionActive: false,
  targetGeometry: null,
};

export const engineStart = (config: EngineLaunchConfig = {}): void => {
  if (engineState.isRunning) return;

  engineState.isRunning = true;
  engineState.mode = config.mode || 'ORBIT_VIEW';
  engineState.uptime = Date.now();
  engineState.reconstructionActive = !!config.reconstruct;
  engineState.targetGeometry = config.reconstruct ? 'GEOMETRIC_RECONSTRUCTION' : null;

  // Generate initial activity entry
  const activityEntry: ActivityFeedItem = {
    id: 'engine-launch-' + Date.now(),
    text: 'Geometry Engine activated' + (engineState.reconstructionActive ? ' with reconstruction' : ''),
    timestamp: new Date().toISOString(),
    timeAgo: 'just now',
    type: 'INFO',
  };
};

export const engineStop = (): void => {
  if (!engineState.isRunning) return;

  engineState.isRunning = false;
  engineState.uptime = 0;
  engineState.reconstructionActive = false;
  engineState.targetGeometry = null;

  const activityEntry: ActivityFeedItem = {
    id: 'engine-shutdown-' + Date.now(),
    text: 'Geometry Engine deactivated',
    timestamp: new Date().toISOString(),
    timeAgo: 'just now',
    type: 'INFO',
  };
};

export const engineSetMode = (mode: ViewMode): void => {
  engineState.mode = mode;
};

export const engineGetStatus = (): EngineStatus => {
  return {
    isActive: engineState.isRunning,
    currentMode: engineState.mode,
    nodeCount: engineState.activeNodes.length,
    activeStreams: [],
    recentActivity: [],
    timestamp: new Date().toISOString(),
    reconstructionActive: engineState.reconstructionActive,
    targetGeometry: engineState.targetGeometry,
  };
};
