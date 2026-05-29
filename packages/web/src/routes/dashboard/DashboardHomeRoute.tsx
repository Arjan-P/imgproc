import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import { formatDistanceToNow } from "date-fns";

import {
  WorkflowIcon,
  PlusCircleIcon,
  ListIcon,
  SlidersHorizontalIcon,
  GhostIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loading } from "@/components/Loading";

import { ROUTES } from "@/app/router/router";
import { OP_COLORS, usePipelines } from "@/features/pipeline";
import { greeting, MetCard, QuickCard } from "@/features/dashboard";

export function DashboardHomeRoute() {
  const navigate = useNavigate();

  const { user } = useUser();

  const { data: pipelines = [], isLoading } = usePipelines();

  const metrics = useMemo(() => {
    const allOps = pipelines.flatMap((p) => p.ops);

    const freq = allOps.reduce(
      (acc, o) => {
        acc[o.type] = (acc[o.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topOp =
      Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    const avg = pipelines.length
      ? (allOps.length / pipelines.length).toFixed(1)
      : "0";

    return {
      total: pipelines.length,
      totalOps: allOps.length,
      topOp,
      avg,
      freq,
    };
  }, [pipelines]);

  const recent = useMemo(
    () =>
      [...pipelines]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 5),
    [pipelines],
  );

  const opBreakdown = useMemo(
    () => Object.entries(metrics.freq).sort((a, b) => b[1] - a[1]),
    [metrics.freq],
  );

  const maxOpCount = opBreakdown[0]?.[1] ?? 1;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full space-y-6 p-6">
      {/* header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {greeting()}
          {user?.firstName ? `, ${user.firstName}` : ""}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening in your workspace
        </p>
      </div>

      {/* metrics */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetCard label="Saved pipelines" value={metrics.total} />

        <MetCard label="Total operations" value={metrics.totalOps} />

        <MetCard label="Most used op" value={metrics.topOp} />

        <MetCard label="Avg ops / pipeline" value={metrics.avg} />
      </div>

      {/* quick actions */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <QuickCard
          icon={PlusCircleIcon}
          color="bg-purple-500/10 text-purple-600"
          title="New pipeline"
          desc="Start with a blank pipeline editor"
          onClick={() => navigate(ROUTES.newPipeline)}
        />

        <QuickCard
          icon={ListIcon}
          color="bg-teal-500/10 text-teal-600"
          title="Browse all"
          desc="View and edit your saved pipelines"
          onClick={() => navigate(ROUTES.pipelines)}
        />

        <QuickCard
          icon={SlidersHorizontalIcon}
          color="bg-amber-500/10 text-amber-600"
          title="Explore ops"
          desc="resize · grayscale · brightness · flip"
          onClick={() => navigate(ROUTES.newPipeline)}
        />
      </div>

      {/* content */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* recent pipelines */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm">Recent pipelines</CardTitle>

              <CardDescription>Your latest edited workflows</CardDescription>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => navigate(ROUTES.pipelines)}
            >
              View all
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            {recent.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                <GhostIcon className="h-8 w-8 opacity-30" />

                <p className="text-sm">No pipelines yet</p>
              </div>
            ) : (
              recent.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(ROUTES.pipeline(p.id))}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <WorkflowIcon className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {p.ops.length} op
                      {p.ops.length !== 1 ? "s" : ""} ·{" "}
                      {formatDistanceToNow(new Date(p.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    {p.ops.slice(0, 2).map((o, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className={cn(
                          "px-1.5 py-0 font-mono text-[10px]",
                          OP_COLORS[o.type],
                        )}
                      >
                        {o.type}
                      </Badge>
                    ))}
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* operation breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Operation breakdown</CardTitle>

            <CardDescription>Most frequently used operations</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {opBreakdown.length === 0 ? (
              <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                No data yet
              </div>
            ) : (
              opBreakdown.map(([type, count]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 font-mono text-xs">
                    {type}
                  </span>

                  <Progress
                    value={(count / maxOpCount) * 100}
                    className="h-2 flex-1"
                  />

                  <span className="w-5 text-right text-xs text-muted-foreground">
                    {count}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
