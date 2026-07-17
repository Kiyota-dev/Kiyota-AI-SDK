import type { LanguageModelV1 } from "@kiyota/core";
import {
  type SimpleMessage,
  convertToLanguageModelPrompt,
} from "../prompt/convert-to-language-model-prompt.js";

export interface StreamObjectOptions<T = unknown> {
  model: LanguageModelV1;
  messages: SimpleMessage[];
  schema?: { parse: (value: unknown) => T };
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string | undefined>;
  providerOptions?: Record<string, Record<string, unknown>>;
}

export interface StreamObjectResult<T = unknown> {
  object: Promise<T>;
  partialObjectStream: AsyncIterable<Partial<T>>;
}

export async function streamObject<T>(
  options: StreamObjectOptions<T>,
): Promise<StreamObjectResult<T>> {
  const responseFormat: { type: "json" } = { type: "json" };

  const { stream } = await options.model.doStream({
    prompt: convertToLanguageModelPrompt(options.messages),
    responseFormat,
    maxOutputTokens: options.maxTokens,
    temperature: options.temperature,
    topP: options.topP,
    abortSignal: options.abortSignal,
    headers: options.headers,
    providerOptions: options.providerOptions,
  });

  let resolveObject: (value: T) => void;
  const objectPromise = new Promise<T>((resolve) => {
    resolveObject = resolve;
  });

  async function* partialStream(): AsyncIterable<Partial<T>> {
    const chunks: string[] = [];
    let depth = 0;
    let inString = false;
    let isEscaped = false;

    for await (const part of stream) {
      if (part.type !== "text") continue;
      const text = part.text;
      chunks.push(text);

      for (const char of text) {
        if (isEscaped) {
          isEscaped = false;
          continue;
        }
        if (char === "\\") {
          isEscaped = true;
          continue;
        }
        if (char === '"' && !inString) {
          inString = true;
        } else if (char === '"' && inString) {
          inString = false;
        } else if (!inString) {
          if (char === "{" || char === "[") depth++;
          if (char === "}" || char === "]") depth--;
        }
      }

      if (depth > 0 || inString) {
        const partialText = chunks.join("");
        const partial = tryParsePartial<T>(partialText);
        if (partial != null) {
          yield partial;
        }
      }
    }

    const fullText = chunks.join("");
    const cleaned = fullText.replace(/^```json\s*|\s*```$/g, "").trim();
    const parsed = JSON.parse(cleaned) as unknown;
    const object = options.schema ? options.schema.parse(parsed) : (parsed as T);
    resolveObject(object);
  }

  return {
    partialObjectStream: partialStream(),
    object: objectPromise,
  };
}

function tryParsePartial<T>(text: string): Partial<T> | undefined {
  const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
  try {
    return JSON.parse(cleaned) as Partial<T>;
  } catch {
    return undefined;
  }
}
