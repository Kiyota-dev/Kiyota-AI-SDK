export interface Telemetry {
  track(event: string, data?: unknown): void;
}
