export const BUILD_INFO = {
  version: '0.1.0-beta',
  buildNumber: '2026.07.30.001',
  buildTimestamp: '2026-07-30T12:00:00Z',
  phase: 'Public Beta',
} as const;

export function formatBuildTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    timeZone: 'UTC',
  });
}
