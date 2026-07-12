import { describe, expect, it } from "vitest";
import {
  AIError,
  AuthenticationError,
  ConfigurationError,
  ModelNotFoundError,
  ProviderError,
  RateLimitError,
  RetryError,
  SDKError,
  TimeoutError,
  ValidationError,
} from "../src/errors/index.js";

describe("errors", () => {
  it("SDKError is the root", () => {
    const err = new SDKError("SDKError", "root");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("SDKError");
    expect(SDKError.isInstance(err)).toBe(true);
  });

  it("AIError extends SDKError", () => {
    const err = new AIError("ai");
    expect(err).toBeInstanceOf(SDKError);
    expect(AIError.isInstance(err)).toBe(true);
    expect(SDKError.isInstance(err)).toBe(true);
  });

  it("ProviderError carries provider metadata", () => {
    const err = new ProviderError("provider failed", {
      providerId: "openai",
      statusCode: 500,
    });
    expect(err.providerId).toBe("openai");
    expect(err.statusCode).toBe(500);
    expect(ProviderError.isInstance(err)).toBe(true);
    expect(AIError.isInstance(err)).toBe(true);
  });

  it("RetryError carries attempts", () => {
    const err = new RetryError("exhausted", { attempts: 3 });
    expect(err.attempts).toBe(3);
    expect(RetryError.isInstance(err)).toBe(true);
  });

  it("TimeoutError carries timeoutMs", () => {
    const err = new TimeoutError("timeout", { timeoutMs: 5000 });
    expect(err.timeoutMs).toBe(5000);
    expect(TimeoutError.isInstance(err)).toBe(true);
  });

  it("RateLimitError carries retryAfter", () => {
    const err = new RateLimitError("rate limited", { retryAfter: 30 });
    expect(err.retryAfter).toBe(30);
    expect(RateLimitError.isInstance(err)).toBe(true);
  });

  it("ModelNotFoundError carries model", () => {
    const err = new ModelNotFoundError("missing", { model: "gpt-5" });
    expect(err.model).toBe("gpt-5");
    expect(ModelNotFoundError.isInstance(err)).toBe(true);
  });

  it("ValidationError carries field", () => {
    const err = new ValidationError("bad input", { field: "model" });
    expect(err.field).toBe("model");
    expect(ValidationError.isInstance(err)).toBe(true);
  });

  it("AuthenticationError extends ProviderError", () => {
    const err = new AuthenticationError("unauthorized", { providerId: "openai" });
    expect(err).toBeInstanceOf(ProviderError);
    expect(AuthenticationError.isInstance(err)).toBe(true);
  });

  it("ConfigurationError extends AIError", () => {
    const err = new ConfigurationError("bad config");
    expect(err).toBeInstanceOf(AIError);
    expect(ConfigurationError.isInstance(err)).toBe(true);
  });

  it("marker detection works across package boundaries", () => {
    const plainError = new Error("plain");
    expect(SDKError.isInstance(plainError)).toBe(false);
    expect(ProviderError.isInstance(plainError)).toBe(false);

    const providerError = new ProviderError("p");
    expect(ProviderError.isInstance(providerError)).toBe(true);
  });
});
