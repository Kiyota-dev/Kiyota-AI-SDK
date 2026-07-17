import { chatCommand } from "./commands/chat.js";

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "chat":
      await chatCommand(args);
      break;
    default:
      console.error("Usage: kiyota <command> [args]");
      console.error("Commands: chat");
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
