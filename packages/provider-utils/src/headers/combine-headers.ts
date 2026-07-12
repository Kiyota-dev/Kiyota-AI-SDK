export function combineHeaders(
  ...headers: Array<Record<string, string | undefined> | undefined>
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of Object.entries(header)) {
      if (value != null) {
        result[key] = value;
      }
    }
  }

  return result;
}
