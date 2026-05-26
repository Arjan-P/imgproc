import { Handle, Position, type NodeProps } from "@xyflow/react";
import { XIcon, GripVerticalIcon } from "lucide-react";
import {
  usePipelineStore,
  type PipelineOp,
} from "../../store/pipeline.store.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ResizeControls } from "./controls/ResizeControls.js";

export type OpNodeData = { op: PipelineOp };

const OP_COLORS: Record<PipelineOp["type"], string> = {
  resize: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  grayscale:
    "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20",
  invert:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
};

export function OpNode({ data, selected }: NodeProps) {
  const { op } = data as OpNodeData;
  const { removeOp, updateOp } = usePipelineStore();

  return (
    <div
      className={cn(
        "bg-card border rounded-lg overflow-hidden min-w-[220px] select-none",
        selected ? "border-ring shadow-sm" : "border-border",
      )}
    >
      <Handle type="target" position={Position.Top} />

      {/* header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
        <GripVerticalIcon className="w-3.5 h-3.5 text-muted-foreground cursor-grab active:cursor-grabbing shrink-0" />
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-mono px-1.5 py-0",
            OP_COLORS[op.type],
          )}
        >
          {op.type}
        </Badge>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-muted-foreground hover:text-destructive"
          onClick={() => removeOp(op.id)}
        >
          <XIcon className="w-3 h-3" />
        </Button>
      </div>

      {/* body — per-op controls */}
      <div className="px-3 py-2.5">
        {op.type === "resize" && (
          <ResizeControls op={op} onUpdate={(p) => updateOp(op.id, p)} />
        )}
        {(op.type === "grayscale" || op.type === "invert") && (
          <p className="text-[11px] text-muted-foreground">no parameters</p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
