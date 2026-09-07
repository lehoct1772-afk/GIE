/**
 * GIE Core Diagnostic Engine Service
 *
 * Central computational/diagnostic layer between uploaded platform data and GIE's visualization system.
 *
 * Responsibilities:
 * - Consume UploadedData, UploadedNode, and UploadedArc structures
 * - Analyze node/relationship status, load, capacity, flow, latency, connectivity
 * - Identify bottlenecks, overloaded paths, stalled/lost information, broken relationships
 * - Produce deterministic diagnostic results for GlobeSphere.tsx, toolbars, and UI
 * - Preserve severity priority: critical > warning > healthy > unknown
 * - No permanent hard limits on nodes or arches
 * - Compatible with approved gisEngine.ts and current GIE types
 * - No rendering responsibilities
 */

import { UploadedData, UploadedNode, UploadedArc } from '../types';

// ============================================================
// Types
// ============================================================

export type DiagnosticSeverity = 'critical' | 'warning' | 'healthy' | 'unknown';

export interface NodeDiagnostic {
  nodeId: string;
  nodeName: string;
  severity: DiagnosticSeverity;
  load: number; // 0-100 (can exceed 100)
  connections: number;
  utilization: number; // 0+ (can exceed 1)
  flow: number;
  capacity: number;
  issues: string[];
  suggestions: string[];
  latency?: number;
  rawStatus?: string;
  isBottleneck: boolean; // Explicit bottleneck classification
}

export interface ArcDiagnostic {
  arcId: string;
  source: string;
  target: string;
  severity: DiagnosticSeverity;
  flow: number;
  capacity: number;
  utilization: number; // 0+ (can exceed 1)
  latency?: number;
  issues: string[];
  suggestions: string[];
  rawStatus?: string;
  isBroken: boolean;
  isStalled: boolean;
  isOverloaded: boolean;
}

export interface EngineDiagnosticResult {
  nodes: NodeDiagnostic[];
  arcs: ArcDiagnostic[];
  bottlenecks: NodeDiagnostic[];
  overloadedPaths: ArcDiagnostic[];
  brokenRelationships: ArcDiagnostic[];
  stalledInformation: ArcDiagnostic[];
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  unknownCount: number;
  timestamp: string;
}

export interface EngineAnalysisConfig {
  loadThresholds?: {
    warning: number; // 0-100
    critical: number; // 0-100
  };
  latencyThresholds?: {
    warning: number; // ms
    critical: number; // ms
  };
  utilizationThresholds?: {
    warning: number; // 0+ (can exceed 1)
    critical: number; // 0+ (can exceed 1)
  };
  bottleneckThresholds?: {
    load: number; // 0-100
    utilization: number; // 0+ (can exceed 1)
    connectionCount: number;
  };
}

export enum EngineEventType {
  ANALYSIS_STARTED = 'ANALYSIS_STARTED',
  ANALYSIS_COMPLETE = 'ANALYSIS_COMPLETE',
  BOTTLENECK_DETECTED = 'BOTTLENECK_DETECTED',
  OVERLOADED_PATH_DETECTED = 'OVERLOADED_PATH_DETECTED',
  BROKEN_RELATIONSHIP_DETECTED = 'BROKEN_RELATIONSHIP_DETECTED',
  STALLED_INFORMATION_DETECTED = 'STALLED_INFORMATION_DETECTED',
}

export interface EngineEvent {
  type: EngineEventType;
  timestamp: string;
  data: any;
}

// ============================================================
// Default Configuration
// ============================================================

const DEFAULT_CONFIG: EngineAnalysisConfig = {
  loadThresholds: {
    warning: 65,
    critical: 85,
  },
  latencyThresholds: {
    warning: 50,
    critical: 100,
  },
  utilizationThresholds: {
    warning: 0.65,
    critical: 0.85,
  },
  bottleneckThresholds: {
    load: 80,
    utilization: 0.80,
    connectionCount: 20,
  },
};

// ============================================================
// Severity Priority
// ============================================================

export const SEVERITY_PRIORITY: Record<DiagnosticSeverity, number> = {
  critical: 4,
  warning: 3,
  healthy: 2,
  unknown: 1,
};

export function getHighestSeverity(
  severities: DiagnosticSeverity[]
): DiagnosticSeverity {
  let highest: DiagnosticSeverity = 'unknown';
  let highestPriority = 0;

  for (const severity of severities) {
    const priority = SEVERITY_PRIORITY[severity];
    if (priority > highestPriority) {
      highestPriority = priority;
      highest = severity;
    }
  }

  return highest;
}

// ============================================================
// Core Engine Class
// ============================================================

export class Engine {
  private events: EngineEvent[] = [];
  private config: EngineAnalysisConfig;
  private lastResult: EngineDiagnosticResult | null = null;

  constructor(config: Partial<EngineAnalysisConfig> = {}) {
    this.config = {
      loadThresholds: {
        warning: config.loadThresholds?.warning ?? DEFAULT_CONFIG.loadThresholds!.warning,
        critical: config.loadThresholds?.critical ?? DEFAULT_CONFIG.loadThresholds!.critical,
      },
      latencyThresholds: {
        warning: config.latencyThresholds?.warning ?? DEFAULT_CONFIG.latencyThresholds!.warning,
        critical: config.latencyThresholds?.critical ?? DEFAULT_CONFIG.latencyThresholds!.critical,
      },
      utilizationThresholds: {
        warning: config.utilizationThresholds?.warning ?? DEFAULT_CONFIG.utilizationThresholds!.warning,
        critical: config.utilizationThresholds?.critical ?? DEFAULT_CONFIG.utilizationThresholds!.critical,
      },
      bottleneckThresholds: {
        load: config.bottleneckThresholds?.load ?? DEFAULT_CONFIG.bottleneckThresholds!.load,
        utilization: config.bottleneckThresholds?.utilization ?? DEFAULT_CONFIG.bottleneckThresholds!.utilization,
        connectionCount: config.bottleneckThresholds?.connectionCount ?? DEFAULT_CONFIG.bottleneckThresholds!.connectionCount,
      },
    };
  }

  // ============================================================
  // Event Management
  // ============================================================

  public getEvents(): EngineEvent[] {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
  }

  private emitEvent(type: EngineEventType, data: any): void {
    this.events.push({
      type,
      timestamp: new Date().toISOString(),
      data,
    });
  }

  // ============================================================
  // Core Analysis
  // ============================================================

  /**
   * Analyze uploaded platform data and produce diagnostic results.
   * This is the main entry point for the engine.
   */
  public analyze(data: UploadedData): EngineDiagnosticResult {
    this.emitEvent(EngineEventType.ANALYSIS_STARTED, { nodeCount: data.nodes.length, arcCount: data.arcs.length });

    // Build connectivity maps
    const nodeMap = new Map<string, UploadedNode>();
    for (const node of data.nodes) {
      nodeMap.set(node.id, node);
    }

    const connectionCount = new Map<string, number>();
    const incomingCount = new Map<string, number>();
    const outgoingCount = new Map<string, number>();

    for (const node of data.nodes) {
      connectionCount.set(node.id, 0);
      incomingCount.set(node.id, 0);
      outgoingCount.set(node.id, 0);
    }

    for (const arc of data.arcs) {
      connectionCount.set(arc.source, (connectionCount.get(arc.source) || 0) + 1);
      connectionCount.set(arc.target, (connectionCount.get(arc.target) || 0) + 1);
      outgoingCount.set(arc.source, (outgoingCount.get(arc.source) || 0) + 1);
      incomingCount.set(arc.target, (incomingCount.get(arc.target) || 0) + 1);
    }

    // Analyze nodes
    const nodeDiagnostics: NodeDiagnostic[] = [];
    const bottlenecks: NodeDiagnostic[] = [];

    for (const node of data.nodes) {
      const diagnostic = this.analyzeNode(
        node,
        connectionCount.get(node.id) || 0,
        incomingCount.get(node.id) || 0,
        outgoingCount.get(node.id) || 0,
        data.arcs
      );
      nodeDiagnostics.push(diagnostic);

      // Only classify as bottleneck if the explicit isBottleneck flag is true
      if (diagnostic.isBottleneck) {
        bottlenecks.push(diagnostic);
      }
    }

    // Sort bottlenecks by severity and utilization
    bottlenecks.sort((a, b) => {
      const severityOrder = SEVERITY_PRIORITY[b.severity] - SEVERITY_PRIORITY[a.severity];
      if (severityOrder !== 0) return severityOrder;
      return b.utilization - a.utilization;
    });

    // Analyze arcs
    const arcDiagnostics: ArcDiagnostic[] = [];
    const overloadedPaths: ArcDiagnostic[] = [];
    const brokenRelationships: ArcDiagnostic[] = [];
    const stalledInformation: ArcDiagnostic[] = [];

    for (const arc of data.arcs) {
      const diagnostic = this.analyzeArc(arc, nodeMap);
      arcDiagnostics.push(diagnostic);

      // Only classify as overloaded if utilization exceeds threshold
      if (diagnostic.isOverloaded) {
        overloadedPaths.push(diagnostic);
      }

      // Broken relationships: source or target missing, or explicitly broken
      if (diagnostic.isBroken) {
        brokenRelationships.push(diagnostic);
      }

      // Stalled information: high latency or stalled flow
      if (diagnostic.isStalled) {
        stalledInformation.push(diagnostic);
      }
    }

    // Count severities
    let healthyCount = 0;
    let warningCount = 0;
    let criticalCount = 0;
    let unknownCount = 0;

    for (const node of nodeDiagnostics) {
      switch (node.severity) {
        case 'healthy': healthyCount++; break;
        case 'warning': warningCount++; break;
        case 'critical': criticalCount++; break;
        default: unknownCount++; break;
      }
    }

    const result: EngineDiagnosticResult = {
      nodes: nodeDiagnostics,
      arcs: arcDiagnostics,
      bottlenecks,
      overloadedPaths,
      brokenRelationships,
      stalledInformation,
      healthyCount,
      warningCount,
      criticalCount,
      unknownCount,
      timestamp: new Date().toISOString(),
    };

    this.lastResult = result;

    // Emit events for significant findings
    if (bottlenecks.length > 0) {
      this.emitEvent(EngineEventType.BOTTLENECK_DETECTED, { count: bottlenecks.length });
    }
    if (overloadedPaths.length > 0) {
      this.emitEvent(EngineEventType.OVERLOADED_PATH_DETECTED, { count: overloadedPaths.length });
    }
    if (brokenRelationships.length > 0) {
      this.emitEvent(EngineEventType.BROKEN_RELATIONSHIP_DETECTED, { count: brokenRelationships.length });
    }
    if (stalledInformation.length > 0) {
      this.emitEvent(EngineEventType.STALLED_INFORMATION_DETECTED, { count: stalledInformation.length });
    }

    this.emitEvent(EngineEventType.ANALYSIS_COMPLETE, {
      healthyCount,
      warningCount,
      criticalCount,
      unknownCount,
      bottleneckCount: bottlenecks.length,
    });

    return result;
  }

  // ============================================================
  // Node Analysis
  // ============================================================

  private analyzeNode(
    node: UploadedNode,
    connectionCount: number,
    incomingCount: number,
    outgoingCount: number,
    arcs: UploadedArc[]
  ): NodeDiagnostic {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const severityEvidence: DiagnosticSeverity[] = [];

    // Determine load
    let load = node.load ?? 0;
    let flow = node.flow ?? 0;
    let capacity = node.capacity ?? 0;

    // If load is not provided, try to calculate from flow/capacity
    if (load === 0 && capacity > 0 && flow > 0) {
      load = (flow / capacity) * 100;
    }

    // Calculate utilization — DO NOT CAP at 1
    const utilization = capacity > 0 ? flow / capacity : 0;

    // ============================================================
    // BOTTLENECK CLASSIFICATION — DETERMINISTIC
    // ============================================================

    let isBottleneck = false;

    // A node is a bottleneck if it meets ANY of these criteria:
    // 1. Critical load (>= critical threshold)
    // 2. Critical utilization (>= critical utilization threshold)
    // 3. High connection count AND high load OR high utilization
    // 4. Flow/capacity pressure with high connection count

    const isLoadCritical = load >= this.config.loadThresholds!.critical;
    const isUtilizationCritical = utilization >= this.config.utilizationThresholds!.critical;
    const isHighConnectionCount = connectionCount >= this.config.bottleneckThresholds!.connectionCount;
    const isLoadHigh = load >= this.config.bottleneckThresholds!.load;
    const isUtilizationHigh = utilization >= this.config.bottleneckThresholds!.utilization;

    // Critical load alone is a bottleneck
    if (isLoadCritical) {
      isBottleneck = true;
    }

    // Critical utilization alone is a bottleneck
    if (isUtilizationCritical) {
      isBottleneck = true;
    }

    // High connection count with high load is a bottleneck
    if (isHighConnectionCount && isLoadHigh) {
      isBottleneck = true;
    }

    // High connection count with high utilization is a bottleneck
    if (isHighConnectionCount && isUtilizationHigh) {
      isBottleneck = true;
    }

    // Flow/capacity pressure with high connection count
    if (isHighConnectionCount && flow > 0 && capacity > 0 && utilization > 0.5) {
      isBottleneck = true;
    }

    // ============================================================
    // SEVERITY AGGREGATION
    // ============================================================

    // 1. Explicit status
    if (node.status === 'critical') {
      severityEvidence.push('critical');
      issues.push('Explicit critical status');
    } else if (node.status === 'warning') {
      severityEvidence.push('warning');
      issues.push('Explicit warning status');
    } else if (node.status === 'healthy') {
      severityEvidence.push('healthy');
    }

    // 2. Load thresholds
    if (load >= this.config.loadThresholds!.critical) {
      severityEvidence.push('critical');
      issues.push('Critical load (' + load.toFixed(0) + '% of capacity)');
      suggestions.push('Increase capacity, add load balancing, or distribute workload');
    } else if (load >= this.config.loadThresholds!.warning) {
      severityEvidence.push('warning');
      issues.push('High load (' + load.toFixed(0) + '% of capacity)');
      suggestions.push('Monitor closely; consider capacity planning');
    } else if (load > 0) {
      severityEvidence.push('healthy');
    }

    // 3. Utilization thresholds (uncapped)
    if (utilization >= this.config.utilizationThresholds!.critical) {
      severityEvidence.push('critical');
      if (!issues.some(i => i.includes('utilization'))) {
        issues.push('Critical utilization (' + (utilization * 100).toFixed(0) + '% of capacity)');
        suggestions.push('Increase capacity or reduce flow');
      }
    } else if (utilization >= this.config.utilizationThresholds!.warning) {
      severityEvidence.push('warning');
      if (!issues.some(i => i.includes('utilization'))) {
        issues.push('High utilization (' + (utilization * 100).toFixed(0) + '% of capacity)');
        suggestions.push('Monitor utilization; consider capacity planning');
      }
    }

    // 4. Connection health
    if (connectionCount === 0 && flow === 0 && load === 0) {
      severityEvidence.push('warning');
      issues.push('Isolated node with no connections or activity');
      suggestions.push('Consider removing this node or connecting it to the system');
    }

    // 5. Connection imbalance
    if (incomingCount > 0 && outgoingCount === 0) {
      issues.push('Sink node (only incoming connections)');
      suggestions.push('Consider if this node should have outgoing connections');
    }
    if (outgoingCount > 0 && incomingCount === 0) {
      issues.push('Source node (only outgoing connections)');
      suggestions.push('Consider if this node should have incoming connections');
    }

    // 6. High connection count
    if (connectionCount > 50) {
      issues.push('High connection count (' + connectionCount + ' connections)');
      suggestions.push('Consider load balancing or clustering if performance degrades');
    }

    // Determine final severity using priority aggregation
    const severity = getHighestSeverity(severityEvidence);

    // If no evidence, mark as unknown
    const finalSeverity = severityEvidence.length > 0 ? severity : 'unknown';

    return {
      nodeId: node.id,
      nodeName: node.name || node.id,
      severity: finalSeverity,
      load,
      connections: connectionCount,
      utilization,
      flow,
      capacity,
      issues: [...new Set(issues)],
      suggestions: [...new Set(suggestions)],
      rawStatus: node.status,
      isBottleneck,
    };
  }

  // ============================================================
  // Arc Analysis
  // ============================================================

  private analyzeArc(
    arc: UploadedArc,
    nodeMap: Map<string, UploadedNode>
  ): ArcDiagnostic {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const severityEvidence: DiagnosticSeverity[] = [];

    const source = nodeMap.get(arc.source);
    const target = nodeMap.get(arc.target);

    let isBroken = false;
    let isStalled = false;
    let isOverloaded = false;

    // Check for broken relationships
    if (!source) {
      isBroken = true;
      severityEvidence.push('critical');
      issues.push('Source node "' + arc.source + '" not found');
      suggestions.push('Create source node or correct the arc source reference');
    }
    if (!target) {
      isBroken = true;
      severityEvidence.push('critical');
      issues.push('Target node "' + arc.target + '" not found');
      suggestions.push('Create target node or correct the arc target reference');
    }

    const flow = arc.flow ?? 0;
    const capacity = arc.capacity ?? 0;
    const latency = arc.latency;

    // Calculate utilization — DO NOT CAP at 1
    const utilization = capacity > 0 ? flow / capacity : 0;

    // ============================================================
    // ARC CLASSIFICATION
    // ============================================================

    // Overloaded: utilization exceeds critical or warning thresholds
    if (utilization >= this.config.utilizationThresholds!.critical) {
      isOverloaded = true;
    } else if (utilization >= this.config.utilizationThresholds!.warning) {
      isOverloaded = true;
    }

    // Stalled: high latency OR zero flow with capacity
    if (latency !== undefined && latency > this.config.latencyThresholds!.warning) {
      isStalled = true;
    }
    if (capacity > 0 && utilization < 0.1 && flow === 0 && !isBroken) {
      isStalled = true;
    }

    // Broken: missing endpoints OR critical status with zero flow
    if (!source || !target) {
      isBroken = true;
    }
    if (arc.status === 'critical' && flow === 0 && !isBroken) {
      isBroken = true;
    }

    // ============================================================
    // SEVERITY AGGREGATION
    // ============================================================

    // 1. Explicit status
    if (arc.status === 'critical') {
      severityEvidence.push('critical');
      issues.push('Explicit critical status');
    } else if (arc.status === 'warning') {
      severityEvidence.push('warning');
      issues.push('Explicit warning status');
    } else if (arc.status === 'healthy') {
      severityEvidence.push('healthy');
    }

    // 2. Latency thresholds
    if (latency !== undefined) {
      if (latency > this.config.latencyThresholds!.critical) {
        severityEvidence.push('critical');
        issues.push('Critical latency (' + latency + 'ms)');
        suggestions.push('Investigate network path, upgrade connection, or reduce distance');
      } else if (latency > this.config.latencyThresholds!.warning) {
        severityEvidence.push('warning');
        issues.push('High latency (' + latency + 'ms)');
        suggestions.push('Monitor network performance; consider optimization');
      }
    }

    // 3. Utilization thresholds (uncapped)
    if (utilization >= this.config.utilizationThresholds!.critical) {
      severityEvidence.push('critical');
      issues.push('Critical utilization (' + (utilization * 100).toFixed(0) + '% of capacity)');
      suggestions.push('Increase capacity, add redundant paths, or throttle flow');
    } else if (utilization >= this.config.utilizationThresholds!.warning) {
      severityEvidence.push('warning');
      issues.push('High utilization (' + (utilization * 100).toFixed(0) + '% of capacity)');
      suggestions.push('Monitor utilization; consider capacity planning');
    }

    // 4. Stalled information
    if (capacity > 0 && utilization < 0.1 && flow === 0 && !isBroken) {
      severityEvidence.push('warning');
      issues.push('Stalled/zero flow');
      suggestions.push('Check if this path is intentionally inactive or needs attention');
    }

    // 5. Capacity mismatch
    if (capacity > 0 && source?.capacity && source.capacity < capacity) {
      issues.push('Arc capacity exceeds source capacity');
      suggestions.push('Reduce arc capacity or increase source capacity');
    }
    if (capacity > 0 && target?.capacity && target.capacity < capacity) {
      issues.push('Arc capacity exceeds target capacity');
      suggestions.push('Reduce arc capacity or increase target capacity');
    }

    // 6. Broken relationship
    if (isBroken && !issues.some(i => i.includes('broken'))) {
      issues.push('Broken relationship');
      suggestions.push('Repair the connection or remove the arc');
    }

    // Determine final severity using priority aggregation
    const severity = getHighestSeverity(severityEvidence);

    // If no evidence, mark as unknown
    const finalSeverity = severityEvidence.length > 0 ? severity : 'unknown';

    return {
      arcId: arc.id || `${arc.source}->${arc.target}`,
      source: arc.source,
      target: arc.target,
      severity: finalSeverity,
      flow,
      capacity,
      utilization,
      latency,
      issues: [...new Set(issues)],
      suggestions: [...new Set(suggestions)],
      rawStatus: arc.status,
      isBroken,
      isStalled,
      isOverloaded,
    };
  }

  // ============================================================
  // Utility Methods
  // ============================================================

  public getLastResult(): EngineDiagnosticResult | null {
    return this.lastResult;
  }

  public getOverallHealth(): { status: DiagnosticSeverity; score: number } | null {
    if (!this.lastResult) return null;

    const total = this.lastResult.healthyCount + this.lastResult.warningCount + this.lastResult.criticalCount + this.lastResult.unknownCount;
    if (total === 0) return null;

    // Weighted score: healthy=100, warning=60, critical=20, unknown=50
    const score =
      (this.lastResult.healthyCount * 100 +
        this.lastResult.warningCount * 60 +
        this.lastResult.criticalCount * 20 +
        this.lastResult.unknownCount * 50) /
      total;

    let status: DiagnosticSeverity = 'healthy';
    if (this.lastResult.criticalCount > 0) status = 'critical';
    else if (this.lastResult.warningCount > 0) status = 'warning';
    else if (this.lastResult.unknownCount > 0 && this.lastResult.healthyCount === 0) status = 'unknown';

    return { status, score };
  }

  public getBottleneckSummary(): string {
    if (!this.lastResult || this.lastResult.bottlenecks.length === 0) {
      return 'No bottlenecks detected.';
    }

    const critical = this.lastResult.bottlenecks.filter(b => b.severity === 'critical');
    const warnings = this.lastResult.bottlenecks.filter(b => b.severity === 'warning');

    let summary = '';
    if (critical.length > 0) {
      summary += `${critical.length} critical bottleneck(s): `;
      summary += critical.slice(0, 3).map(b => b.nodeName).join(', ');
      if (critical.length > 3) summary += ` and ${critical.length - 3} more`;
    }
    if (warnings.length > 0) {
      if (summary) summary += '; ';
      summary += `${warnings.length} warning(s)`;
    }

    return summary || 'No critical bottlenecks detected.';
  }

  public getTopBottlenecks(limit = 5): NodeDiagnostic[] {
    if (!this.lastResult) return [];
    return this.lastResult.bottlenecks.slice(0, limit);
  }

  public getTopOverloadedPaths(limit = 5): ArcDiagnostic[] {
    if (!this.lastResult) return [];
    return this.lastResult.overloadedPaths.slice(0, limit);
  }

  public getBrokenRelationships(limit = 10): ArcDiagnostic[] {
    if (!this.lastResult) return [];
    return this.lastResult.brokenRelationships.slice(0, limit);
  }

  public getStalledInformation(limit = 10): ArcDiagnostic[] {
    if (!this.lastResult) return [];
    return this.lastResult.stalledInformation.slice(0, limit);
  }
}

// ============================================================
// Singleton Export
// ============================================================

let engineInstance: Engine | null = null;

export function getEngine(config?: Partial<EngineAnalysisConfig>): Engine {
  if (!engineInstance) {
    engineInstance = new Engine(config);
  }
  return engineInstance;
}

export function resetEngine(): void {
  if (engineInstance) {
    engineInstance.clearEvents();
  }
  engineInstance = null;
}