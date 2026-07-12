export function parseProviderOptions<T>({
  provider,
  providerOptions,
}: {
  provider: string;
  providerOptions: Record<string, Record<string, unknown>> | undefined;
}): T | undefined {
  const value = providerOptions?.[provider];
  if (value === undefined) return undefined;
  return value as T;
}
