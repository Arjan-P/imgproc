import { Handle, Position } from "@xyflow/react";
import { ImageIcon } from "lucide-react";
import { usePipelineStore } from "../../store/pipeline.store.js";
import { cn } from "@/lib/utils";

export function SourceNode() {
  const source = usePipelineStore((s) => s.source);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs min-w-[220px]">
      <div
        className={cn(
          "flex items-center justify-center w-6 h-6 rounded-md",
          source
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        <ImageIcon className="w-3.5 h-3.5" />
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-foreground">Source</span>
        <span className="text-muted-foreground text-[10px]">
          {source ? `${source.width}×${source.height} · RGBA` : "no image"}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
