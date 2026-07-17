import { describe, expect, it, vi } from "vitest";
import { createEventBus } from "../src/index.js";

describe("SimpleEventBus", () => {
  it("emits events to subscribers", () => {
    const bus = createEventBus();
    const handler = vi.fn();

    bus.on("test", handler);
    bus.emit({ type: "test", payload: { hello: "world" } });

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0];
    expect(event.type).toBe("test");
    expect(event.payload).toEqual({ hello: "world" });
    expect(event.version).toBe(1);
    expect(event.timestamp).toBeInstanceOf(Date);
  });

  it("supports once subscriptions", () => {
    const bus = createEventBus();
    const handler = vi.fn();

    bus.once("test", handler);
    bus.emit({ type: "test", payload: {} });
    bus.emit({ type: "test", payload: {} });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("allows unsubscribing", () => {
    const bus = createEventBus();
    const handler = vi.fn();

    const unsubscribe = bus.on("test", handler);
    unsubscribe();
    bus.emit({ type: "test", payload: {} });

    expect(handler).not.toHaveBeenCalled();
  });

  it("defaults version to 1", () => {
    const bus = createEventBus();
    const handler = vi.fn();

    bus.on("test", handler);
    bus.emit({ type: "test", payload: {} });

    expect(handler.mock.calls[0][0].version).toBe(1);
  });

  it("respects explicit version", () => {
    const bus = createEventBus();
    const handler = vi.fn();

    bus.on("test", handler);
    bus.emit({ type: "test", version: 2, payload: {} });

    expect(handler.mock.calls[0][0].version).toBe(2);
  });
});
