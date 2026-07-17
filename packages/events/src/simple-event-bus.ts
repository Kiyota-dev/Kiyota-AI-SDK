import type { EventBus, EventHandler, KiyotaEvent } from "./types.js";

export class SimpleEventBus implements EventBus {
  private readonly handlers = new Map<string, Set<EventHandler>>();

  on<TPayload>(type: string, handler: EventHandler<TPayload>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }

    const set = this.handlers.get(type)!;
    const wrapped = handler as EventHandler;
    set.add(wrapped);

    return () => {
      set.delete(wrapped);
      if (set.size === 0) {
        this.handlers.delete(type);
      }
    };
  }

  once<TPayload>(type: string, handler: EventHandler<TPayload>): () => void {
    let unsubscribe: (() => void) | undefined;

    const wrapped: EventHandler<TPayload> = (event) => {
      unsubscribe?.();
      return handler(event);
    };

    unsubscribe = this.on(type, wrapped);
    return unsubscribe;
  }

  emit<TPayload>(
    event: Omit<KiyotaEvent<TPayload>, "timestamp" | "version"> & { version?: number },
  ): void {
    const fullEvent: KiyotaEvent<TPayload> = {
      ...event,
      version: event.version ?? 1,
      timestamp: new Date(),
    };

    const set = this.handlers.get(event.type);
    if (!set) return;

    for (const handler of set) {
      try {
        const result = handler(fullEvent);
        if (result instanceof Promise) {
          result.catch((error) => {
            console.error(`[KiyotaEvents] Handler for "${event.type}" failed:`, error);
          });
        }
      } catch (error) {
        console.error(`[KiyotaEvents] Handler for "${event.type}" failed:`, error);
      }
    }
  }
}

export function createEventBus(): EventBus {
  return new SimpleEventBus();
}
