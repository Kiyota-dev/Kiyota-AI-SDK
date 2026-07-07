export async function chatCommand(args: string[]): Promise<void> {
  const message = args.join(" ").trim();
  if (!message) {
    console.error("Usage: nurovia chat <message>");
    process.exit(1);
  }

  const providerName = process.env.NUROVIA_PROVIDER ?? "openai";

  // Providers are loaded dynamically by the user via local configuration.
  // This CLI depends only on @nurovia/client to stay provider-agnostic.
  // In a real scenario, the user instantiates AI with a registered provider here.
  // This command demonstrates the CLI structure; actual provider registration
  // requires a config file or dynamic import provided by the user.
  console.error(
    `Provider "${providerName}" selected. Register a provider in your local config to use this command.`,
  );
  console.log(`Would send: ${message}`);
}
