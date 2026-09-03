export function siteBasePath(siteUrl: string): string {
  const pathname = new URL(siteUrl).pathname.replace(/\/+$/u, "");
  return pathname === "/" ? "" : pathname;
}

export function prefixSitePath(value: string, basePath: string): string {
  if (!value.startsWith("/") || value.startsWith("//") || !basePath) return value;
  if (value === basePath || value.startsWith(`${basePath}/`)) return value;
  return `${basePath}${value}`;
}
