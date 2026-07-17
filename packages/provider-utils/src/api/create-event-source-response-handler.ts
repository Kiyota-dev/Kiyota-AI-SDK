import { ProviderError } from "@kiyota/core";

export type EventSourceChunk = {
  event?: string;
  data: string;
};

export function createEventSourceResponseHandler() {
  return async function* (response: Response): AsyncGenerator<EventSourceChunk, void, unknown> {
    if (!response.body) {
      throw new ProviderError("Response body is not readable");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let currentEvent: string | undefined;
        let currentData = "";

        for (const line of lines) {
          if (line.startsWith("event:")) {
            currentEvent = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            currentData = line.slice(5).trim();
          } else if (line.trim() === "" && currentData !== "") {
            yield { event: currentEvent, data: currentData };
            currentEvent = undefined;
            currentData = "";
          }
        }
      }

      if (buffer.trim() !== "") {
        throw new ProviderError(`Malformed SSE line: ${buffer}`);
      }
    } finally {
      reader.releaseLock();
    }
  };
}
