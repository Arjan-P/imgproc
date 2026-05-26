import { useDeletePipeline, usePipelines } from "@/features/pipeline";
import type { SavedPipeline } from "@imgproc/shared";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { TrashIcon, PlayIcon, Loader2Icon, WorkflowIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ROUTES } from "@/app/router/router";
import { useEffect } from "react";

export function DashboardPipelinesRoute() {
  const { data: pipelines = [], isLoading, error } = usePipelines();

  const { mutateAsync: remove } = useDeletePipeline();
  const navigate = useNavigate();

  function openPipeline(p: SavedPipeline) {
    navigate(ROUTES.pipeline(p.id));
  }

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  async function handleDelete(id: string, name: string) {
    try {
      await remove(id);
      toast.success(`"${name}" deleted`);
    } catch {
      toast.error("Failed to delete pipeline");
    }
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2Icon className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Saved Pipelines</h2>
          <p className="text-sm text-muted-foreground">
            {pipelines.length} pipeline{pipelines.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.newPipeline)}>
          New pipeline
        </Button>
      </div>

      {pipelines.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <WorkflowIcon className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No saved pipelines yet
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.newPipeline)}
          >
            Create your first pipeline
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {pipelines.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors group"
          >
            <WorkflowIcon className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.ops.length} op{p.ops.length !== 1 ? "s" : ""} · updated
                {formatDistanceToNow(new Date(p.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {p.ops.map((op, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-[10px] font-mono px-1.5 py-0 hidden sm:inline-flex"
                >
                  {op.type}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => openPipeline(p)}
              >
                <PlayIcon className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-destructive"
                onClick={() => handleDelete(p.id, p.name)}
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
