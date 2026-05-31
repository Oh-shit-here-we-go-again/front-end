export function proxyImage(url: string | null | undefined): string {
  if (!url) return "";
  if (url.includes("ngrok")) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}
