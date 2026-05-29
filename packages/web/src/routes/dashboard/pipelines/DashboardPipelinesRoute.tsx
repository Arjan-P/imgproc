import { useDeletePipeline, usePipelines } from "@/features/pipeline";
import type { SavedPipeline } from "@imgproc/shared";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { TrashIcon, PlayIcon, WorkflowIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ROUTES } from "@/app/router/router";
import { useEffect } from "react";
import { Loading } from "@/components/Loading";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

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

  if (isLoading) return <Loading />;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
      {/* header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Saved pipelines
          </h1>

          <p className="text-sm text-muted-foreground">
            {pipelines.length} pipeline
            {pipelines.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Button onClick={() => navigate(ROUTES.newPipeline)}>
          New pipeline
        </Button>
      </div>

      {/* empty state */}
      {pipelines.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <WorkflowIcon className="h-6 w-6" />
                </EmptyMedia>

                <EmptyTitle>No saved pipelines yet</EmptyTitle>

                <EmptyDescription>
                  Create your first image processing workflow
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent>
                <Button onClick={() => navigate(ROUTES.newPipeline)}>
                  Create pipeline
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pipelines.map((p) => (
            <Card key={p.id} className="transition-colors hover:bg-muted/30">
              <CardContent className="flex items-center gap-4 p-4">
                {/* icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <WorkflowIcon className="h-4 w-4 text-primary" />
                </div>

                {/* content */}
                <button
                  onClick={() => openPipeline(p)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-medium">{p.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {p.ops.length} op
                    {p.ops.length !== 1 ? "s" : ""} · updated{" "}
                    {formatDistanceToNow(new Date(p.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </button>

                {/* ops */}
                <div className="hidden shrink-0 gap-1 lg:flex">
                  {p.ops.map((op, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="px-1.5 py-0 font-mono text-[10px]"
                    >
                      {op.type}
                    </Badge>
                  ))}
                </div>

                {/* actions */}
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openPipeline(p)}
                  >
                    <PlayIcon className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-destructive"
                    onClick={() => handleDelete(p.id, p.name)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
