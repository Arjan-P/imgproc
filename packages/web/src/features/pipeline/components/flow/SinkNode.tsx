import { Handle, Position } from "@xyflow/react";
import { CheckCircleIcon, Loader2Icon } from "lucide-react";
import { usePipelineStore } from "../../store/pipeline.store.js";

export function SinkNode() {
  const processing = usePipelineStore((s) => s.processing);
  const error = usePipelineStore((s) => s.error);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs min-w-[220px]">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-muted">
        {processing ? (
          <Loader2Icon className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
        ) : (
          <CheckCircleIcon className="w-3.5 h-3.5 text-primary" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-foreground">Output</span>
        <span className="text-muted-foreground text-[10px]">
          {error ? (
            <span className="text-destructive">{error}</span>
          ) : processing ? (
            "processing…"
          ) : (
            "ready"
          )}
        </span>
      </div>
    </div>
  );
}
