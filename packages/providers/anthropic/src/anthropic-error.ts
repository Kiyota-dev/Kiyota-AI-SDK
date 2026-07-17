import { ProviderError } from "@kiyota/core";

export async function anthropicFailedResponseHandler(response: Response): Promise<never> {
  const text = await response.text();
  let body: { error?: { message?: string; type?: string } } | undefined;

  try {
    body = JSON.parse(text) as typeof body;
  } catch {
    body = undefined;
  }

  throw new ProviderError(
    body?.error?.message ?? `Anthropic API error: ${response.status} ${response.statusText}`,
    {
      statusCode: response.status,
    },
  );
}
