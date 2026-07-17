import { ProviderError, TimeoutError } from "@kiyota/core";

export type FetchFunction = typeof fetch;

export interface PostJsonToApiOptions {
  url: string;
  headers?: Record<string, string | undefined>;
  body: unknown;
  fetch?: FetchFunction;
  timeout?: number;
  abortSignal?: AbortSignal;
}

export async function postJsonToApi({
  url,
  headers,
  body,
  fetch: fetchFn,
  timeout = 30000,
  abortSignal,
}: PostJsonToApiOptions): Promise<Response> {
  const fetchImpl = fetchFn ?? globalThis.fetch.bind(globalThis);
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);

  if (abortSignal) {
    if (abortSignal.aborted) {
      controller.abort();
    } else {
      abortSignal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }

  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...combineHeaders(headers),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      if (timedOut) {
        throw new TimeoutError(`Request timed out after ${timeout}ms`, {
          timeoutMs: timeout,
          cause: error,
        });
      }

      throw new ProviderError("Request was aborted", { cause: error });
    }

    throw new ProviderError(
      `Request failed: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  } finally {
    clearTimeout(timer);
  }
}

function combineHeaders(
  headers: Record<string, string | undefined> | undefined,
): Record<string, string> {
  const result: Record<string, string> = {};
  if (!headers) return result;
  for (const [key, value] of Object.entries(headers)) {
    if (value != null) result[key] = value;
  }
  return result;
}
