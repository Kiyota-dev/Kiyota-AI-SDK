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
    const err = new SDKError("root");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("SDKError");
  });

  it("AIError extends SDKError", () => {
    const err = new AIError("ai");
    expect(err).toBeInstanceOf(SDKError);
  });

  it("ProviderError carries provider metadata", () => {
    const err = new ProviderError("provider failed", {
      providerId: "openai",
      statusCode: 500,
    });
    expect(err.providerId).toBe("openai");
    expect(err.statusCode).toBe(500);
  });

  it("RetryError carries attempts", () => {
    const err = new RetryError("exhausted", { attempts: 3 });
    expect(err.attempts).toBe(3);
  });

  it("TimeoutError carries timeoutMs", () => {
    const err = new TimeoutError("timeout", { timeoutMs: 5000 });
    expect(err.timeoutMs).toBe(5000);
  });

  it("RateLimitError carries retryAfter", () => {
    const err = new RateLimitError("rate limited", { retryAfter: 30 });
    expect(err.retryAfter).toBe(30);
  });

  it("ModelNotFoundError carries model", () => {
    const err = new ModelNotFoundError("missing", { model: "gpt-5" });
    expect(err.model).toBe("gpt-5");
  });

  it("ValidationError carries field", () => {
    const err = new ValidationError("bad input", { field: "model" });
    expect(err.field).toBe("model");
  });

  it("AuthenticationError extends ProviderError", () => {
    const err = new AuthenticationError("unauthorized", { providerId: "openai" });
    expect(err).toBeInstanceOf(ProviderError);
  });

  it("ConfigurationError extends AIError", () => {
    const err = new ConfigurationError("bad config");
    expect(err).toBeInstanceOf(AIError);
  });
});
