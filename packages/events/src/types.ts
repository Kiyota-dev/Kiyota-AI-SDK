export interface KiyotaEvent<TPayload = unknown> {
  /** Event type namespace, e.g. "request:start". */
  type: string;
  /** Event schema version. Increment when the payload shape changes. */
  version: number;
  /** UTC timestamp when the event was emitted. */
  timestamp: Date;
  /** Event payload. */
  payload: TPayload;
}

export type EventHandler<TPayload = unknown> = (
  event: KiyotaEvent<TPayload>,
) => void | Promise<void>;

export interface EventBus {
  /** Subscribe to all events of a given type. Returns an unsubscribe function. */
  on<TPayload>(type: string, handler: EventHandler<TPayload>): () => void;
  /** Subscribe once to an event type. */
  once<TPayload>(type: string, handler: EventHandler<TPayload>): () => void;
  /** Emit an event. */
  emit<TPayload>(
    event: Omit<KiyotaEvent<TPayload>, "timestamp" | "version"> & { version?: number },
  ): void | Promise<void>;
}
