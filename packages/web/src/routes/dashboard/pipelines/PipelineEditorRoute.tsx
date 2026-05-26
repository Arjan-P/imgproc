import { ROUTES } from "@/app/router/router";
import {
  PipelineEditor,
  usePipeline,
  usePipelineStore,
} from "@/features/pipeline";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

export function PipelineEditorRoute() {
  const { pipelineId } = useParams();
  const loadPipeline = usePipelineStore((s) => s.loadPipeline);

  if (!pipelineId) {
    return <Navigate to={ROUTES.newPipeline} replace />;
  }

  const { data, isLoading, error } = usePipeline(pipelineId);

  useEffect(() => {
    if (data) {
      loadPipeline(data.ops);
    }
  }, [data, loadPipeline]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2Icon className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center gap-2 h-full text-center">
        <AlertCircleIcon className="w-6 h-6 text-destructive" />

        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    );

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        Pipeline not found
      </div>
    );
  }

  return <PipelineEditor pipelineName={data.name} />;
}
