import { ProviderError, type RequestContext, TimeoutError } from "@kiyota/core";
import { generateId } from "@kiyota/utils";
import { type RequestConfig, buildHeaders } from "./request.js";
import type { TransportResponse, TransportResponseChunk } from "./response.js";
import type { Transport } from "./transport.js";

export interface FetchTransportOptions {
  fetch?: typeof fetch;
  baseURL?: string;
  defaultTimeout?: number;
}

export class FetchTransport implements Transport {
  private readonly fetch: typeof fetch;
  private readonly baseURL?: string;
  private readonly defaultTimeout: number;

  constructor(options: FetchTransportOptions = {}) {
    this.fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
    this.baseURL = options.baseURL;
    this.defaultTimeout = options.defaultTimeout ?? 30000;
  }

  async request<T>(config: RequestConfig): Promise<TransportResponse<T>> {
    const response = await this.fetchWithTimeout(config);
    const data = (await this.parseBody(response)) as T;

    if (!response.ok) {
      throw new ProviderError(`HTTP ${response.status}: ${response.statusText}`, {
        statusCode: response.status,
      });
    }

    return {
      status: response.status,
      headers: this.recordHeaders(response.headers),
      data,
    };
  }

  async *stream(config: RequestConfig): AsyncIterable<TransportResponseChunk> {
    const response = await this.fetchWithTimeout(config);

    if (!response.ok) {
      throw new ProviderError(`HTTP ${response.status}: ${response.statusText}`, {
        statusCode: response.status,
      });
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new ProviderError("Response body is not readable");
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        yield { bytes: value ?? new Uint8Array(0), done };
        if (done) break;
      }
    } finally {
      reader.releaseLock();
    }
  }

  private async fetchWithTimeout(config: RequestConfig): Promise<Response> {
    const url = this.buildURL(config.url);
    const timeout = config.timeout ?? this.defaultTimeout;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      return await this.fetch(url, {
        method: config.method ?? "GET",
        headers: buildHeaders(config),
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new TimeoutError(`Request timed out after ${timeout}ms`, {
          timeoutMs: timeout,
          cause: error,
        });
      }
      throw new ProviderError(
        `Request failed: ${error instanceof Error ? error.message : String(error)}`,
        {
          cause: error,
        },
      );
    } finally {
      clearTimeout(timer);
    }
  }

  private buildURL(path: string): string {
    if (this.baseURL && !path.startsWith("http://") && !path.startsWith("https://")) {
      const base = this.baseURL.endsWith("/") ? this.baseURL.slice(0, -1) : this.baseURL;
      const p = path.startsWith("/") ? path : `/${path}`;
      return `${base}${p}`;
    }
    return path;
  }

  private async parseBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return undefined;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  private recordHeaders(headers: Headers): Record<string, string> {
    const record: Record<string, string> = {};
    headers.forEach((value, key) => {
      record[key] = value;
    });
    return record;
  }
}

export function createRequestContext(context?: Partial<RequestContext>): RequestContext {
  return {
    requestId: context?.requestId ?? generateId(),
    timestamp: context?.timestamp ?? Date.now(),
    metadata: context?.metadata,
  };
}
