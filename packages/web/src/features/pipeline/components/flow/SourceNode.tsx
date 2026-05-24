import { Handle, Position } from "@xyflow/react";
import { usePipelineStore } from "../../store/pipeline.store.js";

export function SourceNode() {
  const source = usePipelineStore((s) => s.source);
  return (
    <div className="bg-card border border-border rounded-md px-3 py-2 flex items-center gap-2 text-xs">
      <span className="w-2 h-2 rounded-full bg-primary" />
      <span className="text-muted-foreground">
        {source ? `${source.width}×${source.height} source` : "no image loaded"}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary"
      />
    </div>
  );
}
