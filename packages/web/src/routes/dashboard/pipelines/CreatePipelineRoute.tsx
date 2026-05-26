import { PipelineEditor, usePipelineStore } from "@/features/pipeline";
import { useEffect } from "react";

export function CreatePipelineRoute() {
  const clearPipeline = usePipelineStore((s) => s.clearPipeline);

  useEffect(() => {
    clearPipeline();
  }, [clearPipeline]);
  return <PipelineEditor pipelineName="New Pipeline" />;
}
