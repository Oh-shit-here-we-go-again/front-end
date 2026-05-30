import { cn } from "@/lib/utils";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  // Some versions of @hugeicons/react have inconsistent typings for strokeWidth.
  // Runtime value is always a number; we cast only to satisfy TS/ESLint in this repo.

  const hugeProps = {
    icon: Loading03Icon,
    strokeWidth: 2,
    role: "status",
    "aria-label": "Loading",
    className: cn("size-4 animate-spin", className),
    ...props,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return <HugeiconsIcon {...hugeProps} />;
}

export { Spinner };
