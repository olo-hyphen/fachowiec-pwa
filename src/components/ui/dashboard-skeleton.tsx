import { Skeleton } from "./skeleton";

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 md:space-y-10">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="glass-subtle rounded-lg p-6 animate-slide-up-fade"
            style={{ animationDelay: `${100 + i * 100}ms` }}
          >
            <div className="flex flex-col h-full">
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-10 w-1/2 mb-auto" />
              <Skeleton className="h-6 w-1/3 mt-4" />
            </div>
          </div>
        ))}
      </div>

       {/* Recent Jobs Skeleton */}
       <div className="space-y-6">
        <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-10 w-36" />
        </div>
        <div className="glass-premium border-none shadow-strong rounded-lg p-6 md:p-8">
            <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl glass-subtle">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="space-y-2 text-right">
                        <Skeleton className="h-6 w-24 ml-auto" />
                        <Skeleton className="h-4 w-20 ml-auto" />
                    </div>
                </div>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}