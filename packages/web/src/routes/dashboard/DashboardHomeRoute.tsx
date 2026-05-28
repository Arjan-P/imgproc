import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import { formatDistanceToNow } from "date-fns";
import {
  WorkflowIcon,
  PlusCircleIcon,
  ListIcon,
  SlidersHorizontalIcon,
  Loader2Icon,
  GhostIcon,
} from "lucide-react";
import { usePipelines } from "@/features/pipeline/hooks/usePipelines";
import { useDeletePipeline } from "@/features/pipeline/hooks/useDeletePipeline";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ROUTES } from "@/app/router/router";
import { type SavedPipeline, type Op } from "@imgproc/shared";
import { cn } from "@/lib/utils";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const OP_BADGE: { [K in Op["type"]]: string } = {
  resize: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  grayscale: "bg-neutral-500/10 text-neutral-600 border-neutral-500/20",
  invert: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  brightness: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  flipHorizontal: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  flipVertical: "bg-teal-500/10 text-teal-600 border-teal-500/20",
};

function MetCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-muted/40 rounded-lg p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-medium">{value}</p>
    </div>
  );
}

function QuickCard({
  icon: Icon,
  color,
  title,
  desc,
  onClick,
}: {
  icon: React.ElementType;
  color: string;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-card border border-border rounded-lg p-4 hover:bg-accent/30 transition-colors"
    >
      <div
        className={cn(
          "w-9 h-9 rounded-md flex items-center justify-center mb-3",
          color,
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </button>
  );
}

// TODO: clean up dashboard
export function DashboardHomeRoute() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: pipelines = [], isLoading } = usePipelines();
  const { mutateAsync: deletePipeline } = useDeletePipeline();

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

  async function handleDelete(p: SavedPipeline) {
    try {
      await deletePipeline(p.id);
      toast.success(`"${p.name}" deleted`);
    } catch {
      toast.error("Failed to delete");
    }
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2Icon className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="p-6 w-full space-y-6">
      {/* header */}
      <div>
        <h2 className="text-lg font-medium">
          {greeting()}
          {user?.firstName ? `, ${user.firstName}` : ""}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Here's what's happening in your workspace
        </p>
      </div>

      {/* metrics */}
      <div className="grid grid-cols-4 gap-3">
        <MetCard label="Saved pipelines" value={metrics.total} />
        <MetCard label="Total operations" value={metrics.totalOps} />
        <MetCard label="Most used op" value={metrics.topOp} />
        <MetCard label="Avg ops / pipeline" value={metrics.avg} />
      </div>

      {/* quick start */}
      <div className="grid grid-cols-3 gap-3">
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

      {/* two-col */}
      <div className="grid grid-cols-2 gap-4">
        {/* recent pipelines */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium">Recent pipelines</span>
            <button
              onClick={() => navigate(ROUTES.pipelines)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </button>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <GhostIcon className="w-8 h-8 opacity-30" />
              <p className="text-sm">No pipelines yet</p>
            </div>
          ) : (
            recent.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => navigate(ROUTES.pipeline(p.id))}
              >
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <WorkflowIcon className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.ops.length} op{p.ops.length !== 1 ? "s" : ""}·
                    {formatDistanceToNow(new Date(p.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {p.ops.slice(0, 2).map((o, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className={cn(
                        "text-[10px] font-mono px-1.5 py-0",
                        OP_BADGE[o.type],
                      )}
                    >
                      {o.type}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* op breakdown */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-sm font-medium">Operation breakdown</span>
          </div>
          {opBreakdown.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              No data yet
            </div>
          ) : (
            opBreakdown.map(([type, count]) => (
              <div key={type} className="flex items-center gap-3 px-4 py-2">
                <span className="text-xs font-mono text-foreground w-28 shrink-0">
                  {type}
                </span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/70 rounded-full transition-all"
                    style={{
                      width: `${Math.round((count / maxOpCount) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-4 text-right">
                  {count}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
