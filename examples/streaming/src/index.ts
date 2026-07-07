import { AI } from "@nurovia/client";
import { OpenAIProvider } from "@nurovia/provider-openai";

const ai = new AI();

ai.register(
  new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY ?? "",
  })
);

async function main() {
  const stream = await ai.chat({
    provider: "openai",
    model: "gpt-4o",
    messages: [{ role: "user", content: "Count from 1 to 5" }],
    stream: true,
  });

  if (Symbol.asyncIterator in stream) {
    for await (const chunk of stream) {
      process.stdout.write(chunk.content);
    }
    process.stdout.write("\n");
  }
}

main().catch(console.error);
