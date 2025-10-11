import { Skeleton } from "./skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function JobsPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <Skeleton className="h-12 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-12 w-40" />
      </div>

      {/* Filters Skeleton */}
      <Card className="mb-6 md:mb-8 glass-premium border-none shadow-medium">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-5 w-32" />
          </div>
        </CardContent>
      </Card>

      {/* Jobs List Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(6)].map((_, index) => (
          <Card
            key={index}
            className="glass-premium border-none shadow-medium overflow-hidden"
          >
            <Skeleton className="h-1.5 w-full" />
            <div className="p-5 md:p-6">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex justify-between items-end pt-3 border-t border-primary/10">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}