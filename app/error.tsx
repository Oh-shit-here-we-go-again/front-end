// app/error.tsx
"use client";

import { InternalServerError } from "@/components/status-page";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <InternalServerError />;
}
