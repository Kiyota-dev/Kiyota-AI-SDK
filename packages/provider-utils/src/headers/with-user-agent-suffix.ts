export function withUserAgentSuffix(
  headers: Record<string, string | undefined>,
  suffix: string,
): Record<string, string | undefined> {
  const userAgent = headers["User-Agent"] ?? headers["user-agent"];
  return {
    ...headers,
    "User-Agent": userAgent ? `${userAgent} ${suffix}` : suffix,
  };
}
