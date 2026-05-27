import { PipelineEditor, usePipelineStore } from "@/features/pipeline";
import { useEffect } from "react";

export function CreatePipelineRoute() {
  const resetWorkspace = usePipelineStore((s) => s.resetWorkspace);

  useEffect(() => {
    resetWorkspace();
  }, [resetWorkspace]);
  return <PipelineEditor mode="create" />;
}
