export async function chatCommand(args: string[]): Promise<void> {
  const message = args.join(" ").trim();
  if (!message) {
    console.error("Usage: kiyota chat <message>");
    process.exit(1);
  }

  const providerName = process.env.KIYOTA_PROVIDER ?? "openai";

  // Providers are loaded dynamically by the user via local configuration.
  // This CLI depends only on @kiyota/client to stay provider-agnostic.
  // In a real scenario, the user instantiates AI with a registered provider here.
  // This command demonstrates the CLI structure; actual provider registration
  // requires a config file or dynamic import provided by the user.
  console.error(
    `Provider "${providerName}" selected. Register a provider in your local config to use this command.`,
  );
  console.log(`Would send: ${message}`);
}
