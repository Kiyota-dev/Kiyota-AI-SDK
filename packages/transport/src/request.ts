import type { RequestContext } from "@nurovia/core";

export interface RequestConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  context?: RequestContext;
}

export function buildHeaders(config: RequestConfig): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  };

  if (config.context?.requestId) {
    headers["X-Request-ID"] = config.context.requestId;
  }

  return headers;
}
