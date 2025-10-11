import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted dark:bg-white/15 backdrop-blur-lg relative overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
