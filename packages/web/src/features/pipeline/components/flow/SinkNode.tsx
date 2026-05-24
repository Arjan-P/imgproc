import { Handle, Position } from "@xyflow/react";
import { usePipelineStore } from "../../store/pipeline.store.js";

export function SinkNode() {
  const processing = usePipelineStore((s) => s.processing);
  return (
    <div className="bg-card border border-border rounded-md px-3 py-2 flex items-center gap-2 text-xs">
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <span
        className="w-2 h-2 rounded-full"
        style={{
          background: processing
            ? "oklch(0.708 0 0)"
            : "oklch(0.577 0.245 27.325)",
        }}
      />
      <span className="text-muted-foreground">
        {processing ? "processing…" : "output"}
      </span>
    </div>
  );
}
