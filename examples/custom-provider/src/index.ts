import { AI } from "@nurovia/client";
import type {
  ChatRequest,
  ChatResult,
  Provider,
  ProviderCapabilities,
  StreamChunk,
} from "@nurovia/core";

class EchoProvider implements Provider {
  readonly id = "echo";
  readonly name = "Echo";
  readonly version = "0.1.0";

  capabilities(): ProviderCapabilities {
    return {
      streaming: true,
      functionCalling: false,
      vision: false,
      jsonMode: false,
      systemMessages: true,
      maxTokens: false,
    };
  }

  async chat(request: ChatRequest): Promise<ChatResult> {
    const lastMessage = request.messages.at(-1);
    return {
      content: `Echo: ${lastMessage?.content ?? ""}`,
      model: "echo",
      provider: this.id,
      finishReason: "stop",
    };
  }

  async *stream(request: ChatRequest): AsyncIterable<StreamChunk> {
    const lastMessage = request.messages.at(-1);
    yield { content: `Echo: ${lastMessage?.content ?? ""}` };
  }
}

const ai = new AI();
ai.register(new EchoProvider());

async function main() {
  const result = await ai.chat({
    provider: "echo",
    model: "echo",
    messages: [{ role: "user", content: "Hello, custom provider!" }],
  });

  if (Symbol.asyncIterator in result) {
    for await (const chunk of result) {
      process.stdout.write(chunk.content);
    }
    process.stdout.write("\n");
  } else {
    console.log(result.content);
  }
}

main().catch(console.error);
