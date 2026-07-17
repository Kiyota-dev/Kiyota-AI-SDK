import { ConfigurationError } from "@kiyota/core";
import { describe, expect, it } from "vitest";
import { loadApiKey } from "../src/api/load-api-key.js";

describe("loadApiKey", () => {
  it("returns the provided API key", () => {
    expect(
      loadApiKey({ apiKey: "sk-test", environmentVariableName: "TEST_KEY", description: "Test" }),
    ).toBe("sk-test");
  });

  it("falls back to environment variable", () => {
    process.env.TEST_FALLBACK_KEY = "env-key";
    expect(
      loadApiKey({
        apiKey: undefined,
        environmentVariableName: "TEST_FALLBACK_KEY",
        description: "Test",
      }),
    ).toBe("env-key");
    Reflect.deleteProperty(process.env, "TEST_FALLBACK_KEY");
  });

  it("throws ConfigurationError when missing", () => {
    expect(() =>
      loadApiKey({
        apiKey: undefined,
        environmentVariableName: "MISSING_KEY",
        description: "Test",
      }),
    ).toThrow(ConfigurationError);
  });
});
