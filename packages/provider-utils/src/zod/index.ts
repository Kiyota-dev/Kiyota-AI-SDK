export interface Schema<T> {
  parse: (value: unknown) => T;
}

export function zodSchema<T>(schema: Schema<T>): Schema<T> {
  return schema;
}

export function parseProviderOptionsWithZod<T>({
  provider,
  providerOptions,
  schema,
}: {
  provider: string;
  providerOptions: Record<string, Record<string, unknown>> | undefined;
  schema: Schema<T>;
}): T | undefined {
  const options = providerOptions?.[provider];
  if (!options) return undefined;
  return schema.parse(options);
}
