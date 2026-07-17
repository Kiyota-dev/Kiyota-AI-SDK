import type {
  LanguageModelV1,
  LanguageModelV1CallOptions,
  LanguageModelV1GenerateResult,
  LanguageModelV1StreamResult,
} from "@kiyota/core";
import type { ModelMiddleware } from "./types.js";

export function runModelMiddleware(
  model: LanguageModelV1,
  request: LanguageModelV1CallOptions,
  middleware: ModelMiddleware[],
  final: (
    req: LanguageModelV1CallOptions,
  ) => Promise<LanguageModelV1GenerateResult | LanguageModelV1StreamResult>,
): Promise<LanguageModelV1GenerateResult | LanguageModelV1StreamResult> {
  let index = 0;

  async function dispatch(
    currentRequest: LanguageModelV1CallOptions,
  ): Promise<LanguageModelV1GenerateResult | LanguageModelV1StreamResult> {
    if (index >= middleware.length) {
      return final(currentRequest);
    }

    const middlewareFn = middleware[index];
    index += 1;

    return middlewareFn({
      model,
      request: currentRequest,
      next: () => dispatch(currentRequest),
    });
  }

  return dispatch(request);
}
