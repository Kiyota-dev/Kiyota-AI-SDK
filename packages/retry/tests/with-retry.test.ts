import { ProviderError, RetryError, ValidationError } from "@kiyota/core";
import { describe, expect, it, vi } from "vitest";
import { defaultRetryable, withRetry } from "../src/index.js";

describe("withRetry", () => {
  it("returns result on success", async () => {
    const result = await withRetry({
      fn: async () => "ok",
      context: { requestId: "r1", timestamp: Date.now() },
    });
    expect(result).toBe("ok");
  });

  it("retries on ProviderError and succeeds", async () => {
    const fn = vi.fn();
    fn.mockRejectedValueOnce(new ProviderError("boom"));
    fn.mockResolvedValueOnce("ok");

    const result = await withRetry({
      fn,
      context: { requestId: "r2", timestamp: Date.now() },
      options: { delayMs: 1, jitter: false },
    });

    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not retry ValidationError", async () => {
    const fn = vi.fn().mockRejectedValue(new ValidationError("bad"));

    await expect(
      withRetry({
        fn,
        context: { requestId: "r3", timestamp: Date.now() },
        options: { delayMs: 1, jitter: false },
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("throws RetryError when exhausted", async () => {
    const fn = vi.fn().mockRejectedValue(new ProviderError("boom"));

    await expect(
      withRetry({
        fn,
        context: { requestId: "r4", timestamp: Date.now() },
        options: { maxAttempts: 2, delayMs: 1, jitter: false },
      }),
    ).rejects.toBeInstanceOf(RetryError);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("defaultRetryable excludes auth and validation", () => {
    expect(defaultRetryable(new ValidationError("bad"))).toBe(false);
    expect(defaultRetryable(new ProviderError("boom"))).toBe(true);
  });
});
