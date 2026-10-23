import DashboardPageSkeleton from "./DashboardPageSkeleton";
import Skeleton from "./Skeleton";

export default function DashboardShellSkeleton() {
  return (
    <div
      className="flex h-screen overflow-hidden bg-slate-100 font-sans text-slate-900"
      role="status"
      aria-label="Memuat dashboard"
    >
      <span className="sr-only">Memuat dashboard...</span>

      <aside className="hidden w-64 flex-col border-r border-slate-800/80 bg-slate-950 p-3 md:flex">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-1">
          <Skeleton className="size-8 rounded-xl" tone="white" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-32" tone="white" />
            <Skeleton className="h-2.5 w-20" tone="white" />
          </div>
        </div>

        <div className="mt-5 space-y-6">
          {Array.from({ length: 4 }, (_, group) => (
            <div key={group}>
              <Skeleton className="ml-3 h-2.5 w-16" tone="white" />
              <div className="mt-2 space-y-2">
                {Array.from({ length: group === 0 ? 2 : 3 }, (_, item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  >
                    <Skeleton className="size-5 rounded-md" tone="white" />
                    <Skeleton className="h-3.5 w-28" tone="white" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden space-y-1.5 text-right sm:block">
              <Skeleton className="ml-auto h-3.5 w-24" />
              <Skeleton className="ml-auto h-3 w-16" />
            </div>
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-xl" />
          </div>
        </header>

        <main className="relative flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_34rem)] p-4 md:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <DashboardPageSkeleton />
          </div>
        </main>
      </div>
    </div>
  );
}
