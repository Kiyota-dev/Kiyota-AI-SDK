import { ProviderError, TimeoutError } from "@kiyota/core";
import { describe, expect, it } from "vitest";
import { FetchTransport } from "../src/index.js";

describe("FetchTransport", () => {
  it("makes a JSON request", async () => {
    const fetch = async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    const transport = new FetchTransport({ fetch });
    const response = await transport.request<unknown>({ url: "https://api.example.com/test" });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ok: true });
  });

  it("throws ProviderError on HTTP error", async () => {
    const fetch = async () =>
      new Response(JSON.stringify({ error: "bad" }), {
        status: 500,
        statusText: "Internal Server Error",
      });

    const transport = new FetchTransport({ fetch });
    await expect(transport.request({ url: "https://api.example.com/test" })).rejects.toBeInstanceOf(
      ProviderError,
    );
  });

  it("throws TimeoutError on timeout", async () => {
    const fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_, reject) => {
        const signal = init?.signal;
        if (!signal) {
          reject(new Error("Missing signal"));
          return;
        }
        signal.addEventListener("abort", () => {
          reject(Object.assign(new Error("The operation was aborted"), { name: "AbortError" }));
        });
      });
    };

    const transport = new FetchTransport({ fetch });
    await expect(
      transport.request({ url: "https://api.example.com/test", timeout: 1 }),
    ).rejects.toBeInstanceOf(TimeoutError);
  });

  it("streams chunks", async () => {
    const encoder = new TextEncoder();
    const fetch = async () =>
      new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode("hello"));
            controller.enqueue(encoder.encode(" world"));
            controller.close();
          },
        }),
        { status: 200 },
      );

    const transport = new FetchTransport({ fetch });
    const chunks: string[] = [];
    for await (const chunk of transport.stream({ url: "https://api.example.com/stream" })) {
      chunks.push(new TextDecoder().decode(chunk.bytes));
      if (chunk.done) break;
    }

    expect(chunks.join("")).toBe("hello world");
  });

  it("attaches X-Request-ID header", async () => {
    const capturedHeaders: Record<string, string> = {};
    const fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      headers.forEach((value, key) => {
        capturedHeaders[key] = value;
      });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    const transport = new FetchTransport({ fetch });
    await transport.request({
      url: "https://api.example.com/test",
      context: { requestId: "req-123", timestamp: Date.now() },
    });

    expect(capturedHeaders["x-request-id"]).toBe("req-123");
  });
});
