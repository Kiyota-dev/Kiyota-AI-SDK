import { ConfigurationError } from "@kiyota/core";

export function loadApiKey({
  apiKey,
  environmentVariableName,
  description,
}: {
  apiKey: string | undefined;
  environmentVariableName: string;
  description: string;
}): string {
  const value = apiKey ?? process.env[environmentVariableName];

  if (!value) {
    throw new ConfigurationError(
      `${description} API key is missing. Pass it via options or set the ${environmentVariableName} environment variable.`,
    );
  }

  return value;
}
