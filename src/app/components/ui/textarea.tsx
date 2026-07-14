import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-32 w-full resize-none rounded-[18px] border-[2px] border-input bg-input-background px-4 py-3 text-sm font-medium shadow-[4px_4px_0_0_var(--color-border)] outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-[4px] focus-visible:ring-warning/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/25",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
