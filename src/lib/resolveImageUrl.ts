/**
 * Resolves image URLs relative to the Vite base path.
 * External URLs (http/https) are returned unchanged.
 * Local absolute paths (e.g. "/images/...") get the base path prepended.
 */
export function resolveImageUrl(url: string): string {
  // External URLs — leave as-is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  const base = import.meta.env.BASE_URL; // e.g. "/PatenteNext/" or "/"
  
  // If the URL already starts with the base, don't double-prefix
  if (url.startsWith(base)) {
    return url;
  }
  
  // Strip leading slash from url since base already ends with one
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return `${base}${cleanUrl}`;
}
