import { ProviderError, TimeoutError } from "@nurovia/core";
import { describe, expect, it } from "vitest";
import { postJsonToApi } from "../src/api/post-json-to-api.js";

describe("postJsonToApi", () => {
  it("posts JSON and returns the response", async () => {
    const fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.method).toBe("POST");
      expect(init?.headers).toMatchObject({ "Content-Type": "application/json" });
      expect(JSON.parse(init?.body as string)).toEqual({ key: "value" });

      return new Response('{"ok":true}', {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    const response = await postJsonToApi({
      url: "https://api.example.com/v1/test",
      headers: { authorization: "Bearer token" },
      body: { key: "value" },
      fetch,
    });

    expect(response.status).toBe(200);
  });

  it("aborts when the signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      postJsonToApi({
        url: "https://api.example.com/v1/test",
        body: {},
        abortSignal: controller.signal,
      }),
    ).rejects.toBeInstanceOf(ProviderError);
  });

  it("aborts when the signal is aborted after the request starts", async () => {
    const controller = new AbortController();

    const fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      const promise = new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("The operation was aborted.", "AbortError"));
        });
      });

      setTimeout(() => controller.abort(), 10);

      return promise;
    };

    await expect(
      postJsonToApi({
        url: "https://api.example.com/v1/test",
        body: {},
        fetch,
        abortSignal: controller.signal,
      }),
    ).rejects.toBeInstanceOf(ProviderError);
  });

  it("times out when the request exceeds the timeout", async () => {
    const fetch = async (_input: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("The operation was aborted.", "AbortError"));
        });
      });

    await expect(
      postJsonToApi({
        url: "https://api.example.com/v1/test",
        body: {},
        fetch,
        timeout: 10,
      }),
    ).rejects.toBeInstanceOf(TimeoutError);
  });
});
