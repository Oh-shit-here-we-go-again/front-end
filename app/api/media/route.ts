import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    const headers: Record<string, string> = {};
    if (targetUrl.includes("ngrok")) {
      headers["ngrok-skip-browser-warning"] = "true";
    }

    const res = await fetch(targetUrl, { headers });
    if (!res.ok) {
      return new Response(`Failed to fetch image: ${res.status}`, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await res.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error: any) {
    return new Response(`Error proxying image: ${error.message}`, { status: 500 });
  }
}
