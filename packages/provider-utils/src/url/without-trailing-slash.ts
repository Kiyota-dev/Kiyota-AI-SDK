export function withoutTrailingSlash(url: string | undefined): string | undefined {
  if (url == null) return undefined;
  return url.endsWith("/") ? url.slice(0, -1) : url;
}
