// lib/media.ts
export function getProxiedImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  // If it's an ngrok URL, proxy it through our server-side route to bypass the browser warning block
  if (url.includes("ngrok-free.dev") || url.includes("ngrok-free.app")) {
    return `/api/media?url=${encodeURIComponent(url)}`;
  }
  
  return url;
}
