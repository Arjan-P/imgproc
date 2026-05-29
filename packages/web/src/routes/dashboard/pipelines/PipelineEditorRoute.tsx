import { ROUTES } from "@/app/router/router";
import { Loading } from "@/components/Loading";
import {
  PipelineEditor,
  usePipeline,
  usePipelineStore,
} from "@/features/pipeline";
import { AlertCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

export function PipelineEditorRoute() {
  const { pipelineId } = useParams();
  const setName = usePipelineStore((s) => s.setName);
  const setId = usePipelineStore((s) => s.setId);
  const loadPipeline = usePipelineStore((s) => s.loadPipeline);

  if (!pipelineId) {
    return <Navigate to={ROUTES.newPipeline} replace />;
  }

  const { data, isLoading, error } = usePipeline(pipelineId);

  useEffect(() => {
    if (data) {
      setId(data.id);
      setName(data.name);
      loadPipeline(data.ops);
    }
  }, [data, loadPipeline, setId, setName]);

  if (isLoading) return <Loading />;

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

  return <PipelineEditor />;
}
