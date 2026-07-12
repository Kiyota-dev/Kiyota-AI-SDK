import { ProviderError } from "@nurovia/core";

export interface JsonResponseHandlerOptions<T> {
  schema?: {
    parse: (value: unknown) => T;
  };
  errorHandler?: (response: Response, body: unknown) => Promise<never> | never;
}

export function createJsonResponseHandler<T>({
  schema,
  errorHandler,
}: JsonResponseHandlerOptions<T> = {}) {
  return async (response: Response): Promise<T> => {
    const text = await response.text();
    const json = text ? (JSON.parse(text) as unknown) : undefined;

    if (!response.ok) {
      if (errorHandler) {
        await errorHandler(response, json);
      }
      throw new ProviderError(`HTTP ${response.status}: ${response.statusText}`, {
        statusCode: response.status,
      });
    }

    if (schema) {
      return schema.parse(json);
    }

    return json as T;
  };
}
