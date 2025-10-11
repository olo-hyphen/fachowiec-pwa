import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/70 dark:bg-muted/10",
        "after:absolute after:inset-0 after:transform after:bg-shimmer-gradient after:animate-shimmer",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
