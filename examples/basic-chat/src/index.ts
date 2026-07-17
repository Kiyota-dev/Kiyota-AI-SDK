import { AI } from "@kiyota/client";
import { OpenAIProvider } from "@kiyota/provider-openai";

const ai = new AI({
  logger: console,
});

ai.register(
  new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY ?? "",
  })
);

async function main() {
  const result = await ai.chat({
    provider: "openai",
    model: "gpt-4o",
    messages: [{ role: "user", content: "Hello, Kiyota!" }],
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
