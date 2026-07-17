import { describe, expect, it } from "vitest";
import { createMemoryCache } from "../src/index.js";

describe("InMemoryCache", () => {
  it("stores and retrieves values", async () => {
    const cache = createMemoryCache<string>();
    await cache.set("key", "value");

    expect(await cache.get("key")).toBe("value");
  });

  it("returns undefined for missing keys", async () => {
    const cache = createMemoryCache<string>();
    expect(await cache.get("missing")).toBeUndefined();
  });

  it("respects ttl", async () => {
    const cache = createMemoryCache<string>();
    await cache.set("key", "value", 1);

    expect(await cache.get("key")).toBe("value");

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(await cache.get("key")).toBeUndefined();
  });

  it("deletes keys", async () => {
    const cache = createMemoryCache<string>();
    await cache.set("key", "value");
    await cache.delete("key");

    expect(await cache.get("key")).toBeUndefined();
  });

  it("clears all entries", async () => {
    const cache = createMemoryCache<string>();
    await cache.set("a", "1");
    await cache.set("b", "2");
    await cache.clear();

    expect(await cache.get("a")).toBeUndefined();
    expect(await cache.get("b")).toBeUndefined();
  });

  it("evicts oldest entries when maxSize is reached", async () => {
    const cache = createMemoryCache<string>({ maxSize: 2 });
    await cache.set("a", "1");
    await cache.set("b", "2");
    await cache.set("c", "3");

    expect(await cache.get("a")).toBeUndefined();
    expect(await cache.get("b")).toBe("2");
    expect(await cache.get("c")).toBe("3");
  });
});
