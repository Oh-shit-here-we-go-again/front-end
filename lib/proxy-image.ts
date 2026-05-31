export function proxyImage(url: string | null | undefined): string {
  if (!url) return "";
  if (url.includes("/api/image-proxy")) return url;
  if (url.includes("ngrok")) {
    const clean = url.split("?")[0];
    return `/api/image-proxy?url=${encodeURIComponent(clean)}`;
  }
  return url;
}
