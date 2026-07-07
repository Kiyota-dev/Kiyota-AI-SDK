import { describe, expect, it } from "vitest";
import { assertDefined, deepMerge, generateId, isNonEmptyString } from "../src/index.js";

describe("utils", () => {
  describe("generateId", () => {
    it("returns a non-empty string", () => {
      const id = generateId();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe("deepMerge", () => {
    it("merges nested objects", () => {
      type T = { a: number; b: Record<string, number> };
      const result = deepMerge<T>({ a: 1, b: { c: 2 } }, { b: { d: 3 } });
      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 } });
    });

    it("overrides primitive values", () => {
      const result = deepMerge({ a: 1 }, { a: 2 });
      expect(result).toEqual({ a: 2 });
    });

    it("skips undefined values", () => {
      const result = deepMerge({ a: 1 }, { a: undefined });
      expect(result).toEqual({ a: 1 });
    });
  });

  describe("assertDefined", () => {
    it("returns the value if defined", () => {
      expect(assertDefined("x", "missing")).toBe("x");
    });

    it("throws if undefined", () => {
      expect(() => assertDefined(undefined, "missing")).toThrow("missing");
    });
  });

  describe("isNonEmptyString", () => {
    it("returns true for non-empty strings", () => {
      expect(isNonEmptyString("hello")).toBe(true);
    });

    it("returns false for empty or non-strings", () => {
      expect(isNonEmptyString("")).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(1)).toBe(false);
    });
  });
});
