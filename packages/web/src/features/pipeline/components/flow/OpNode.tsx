import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  usePipelineStore,
  type PipelineOp,
} from "../../store/pipeline.store.js";
import { OpControls } from "../OpControls.js";
import { XIcon, DotsSixVerticalIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils.js";

export type OpNodeData = { op: PipelineOp };

export function OpNode({ data, selected }: NodeProps) {
  const { op } = data as OpNodeData;
  const { removeOp, updateOp } = usePipelineStore();

  return (
    <div
      className={cn(
        "bg-card border rounded-md overflow-hidden select-none",
        selected ? "border-ring shadow-sm" : "border-border",
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary" />

      <div className="flex items-center gap-2 px-3 py-2 bg-muted/60 border-b border-border">
        <DotsSixVerticalIcon
          size={12}
          className="text-muted-foreground cursor-grab active:cursor-grabbing"
        />
        <span className="flex-1 text-xs font-medium font-mono">{op.type}</span>
        <button
          onClick={() => removeOp(op.id)}
          className="text-muted-foreground hover:text-destructive transition-colors"
          aria-label="remove op"
        >
          <XIcon size={12} />
        </button>
      </div>

      <div className="px-3 py-2">
        <OpControls op={op} onUpdate={(params) => updateOp(op.id, params)} />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary"
      />
    </div>
  );
}
