import type {
  LanguageModelV1,
  LanguageModelV1GenerateResult,
  LanguageModelV1StreamPart,
  LanguageModelV1StreamResult,
  LanguageModelV1Usage,
  Warning,
} from "@kiyota/core";
import type { EventBus } from "@kiyota/events";
import { runModelMiddleware, type ModelMiddleware } from "@kiyota/middleware";
import {
  type SimpleMessage,
  convertToLanguageModelPrompt,
} from "../prompt/convert-to-language-model-prompt.js";

export interface StreamTextOptions {
  model: LanguageModelV1;
  messages: SimpleMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  seed?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string | undefined>;
  providerOptions?: Record<string, Record<string, unknown>>;
  eventBus?: EventBus;
  middleware?: ModelMiddleware[];
}

export interface StreamTextResult {
  textStream: AsyncIterable<string>;
  text: Promise<string>;
  finishReason: Promise<LanguageModelV1GenerateResult["finishReason"]>;
  usage: Promise<LanguageModelV1Usage>;
  warnings: Promise<Warning[]>;
}

export async function streamText(options: StreamTextOptions): Promise<StreamTextResult> {
  const eventBus = options.eventBus;
  const model = options.model;
  const provider = model.provider;
  const modelId = model.modelId;

  eventBus?.emit({
    type: "stream:start",
    version: 1,
    payload: {
      model: modelId,
      provider,
    },
  });

  const prompt = convertToLanguageModelPrompt(options.messages);
  const request = {
    prompt,
    maxOutputTokens: options.maxTokens,
    temperature: options.temperature,
    topP: options.topP,
    topK: options.topK,
    frequencyPenalty: options.frequencyPenalty,
    presencePenalty: options.presencePenalty,
    stopSequences: options.stopSequences,
    seed: options.seed,
    abortSignal: options.abortSignal,
    headers: options.headers,
    providerOptions: options.providerOptions,
  };

  const middleware = options.middleware ?? [];

  let streamError: unknown;
  let { stream } = (await runModelMiddleware(
    model,
    request,
    middleware,
    async (req) => model.doStream(req),
  )) as LanguageModelV1StreamResult;

  let finishReasonResolve: (value: LanguageModelV1GenerateResult["finishReason"]) => void;
  let usageResolve: (value: LanguageModelV1Usage) => void;
  let warningsResolve: (value: Warning[]) => void;
  let textResolve: (value: string) => void;

  const finishReasonPromise = new Promise<LanguageModelV1GenerateResult["finishReason"]>(
    (resolve) => {
      finishReasonResolve = resolve;
    },
  );
  const usagePromise = new Promise<LanguageModelV1Usage>((resolve) => {
    usageResolve = resolve;
  });
  const warningsPromise = new Promise<Warning[]>((resolve) => {
    warningsResolve = resolve;
  });
  const fullTextPromise = new Promise<string>((resolve) => {
    textResolve = resolve;
  });

  async function* generator(): AsyncIterable<string> {
    const chunks: string[] = [];
    const warnings: Warning[] = [];
    let finishReason: LanguageModelV1GenerateResult["finishReason"] = "other";
    let usage: LanguageModelV1Usage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };

    try {
      for await (const part of stream) {
        const streamed = handleStreamPart(part, {
          onWarning: (warning) => warnings.push(warning),
          onFinishReason: (reason) => {
            finishReason = reason;
          },
          onUsage: (value) => {
            usage = value;
          },
        });

        if (streamed != null) {
          chunks.push(streamed);
          eventBus?.emit({
            type: "stream:chunk",
            version: 1,
            payload: {
              model: modelId,
              provider,
              text: streamed,
            },
          });
          yield streamed;
        }
      }
    } catch (error) {
      streamError = error;
      throw error;
    } finally {
      textResolve(chunks.join(""));
      finishReasonResolve(finishReason);
      usageResolve(usage);
      warningsResolve(warnings);

      if (streamError) {
        eventBus?.emit({
          type: "stream:error",
          version: 1,
          payload: {
            model: modelId,
            provider,
            error: streamError,
          },
        });
      } else {
        eventBus?.emit({
          type: "stream:finish",
          version: 1,
          payload: {
            model: modelId,
            provider,
            finishReason,
            usage,
          },
        });
      }
    }
  }

  return {
    textStream: generator(),
    text: fullTextPromise,
    finishReason: finishReasonPromise,
    usage: usagePromise,
    warnings: warningsPromise,
  };
}

function handleStreamPart(
  part: LanguageModelV1StreamPart,
  callbacks: {
    onWarning: (warning: Warning) => void;
    onFinishReason: (reason: LanguageModelV1GenerateResult["finishReason"]) => void;
    onUsage: (usage: LanguageModelV1Usage) => void;
  },
): string | undefined {
  switch (part.type) {
    case "text":
      return part.text;
    case "finish":
      callbacks.onFinishReason(part.finishReason);
      if (part.usage) {
        callbacks.onUsage(part.usage);
      }
      return undefined;
    case "error":
      if (part.error instanceof Error) {
        callbacks.onWarning({
          type: "other",
          message: part.error.message,
        });
      }
      return undefined;
    default:
      return undefined;
  }
}
