import { usePipelineStore } from "../../store/pipeline.store.js";
import { type Op, OP_DEFAULTS } from "@imgproc/shared";
import {
  ResizeIcon,
  DropIcon,
  ArrowCounterClockwiseIcon,
} from "@phosphor-icons/react";

const OP_META: Record<
  Op["type"],
  { label: string; icon: React.ReactNode; desc: string }
> = {
  resize: {
    label: "Resize",
    icon: <ResizeIcon size={14} />,
    desc: "Scale to new dimensions",
  },
  grayscale: {
    label: "Grayscale",
    icon: <DropIcon size={14} />,
    desc: "Remove colour",
  },
  invert: {
    label: "Invert",
    icon: <ArrowCounterClockwiseIcon size={14} />,
    desc: "Invert all channels",
  },
};

export function OpToolbar() {
  const addOp = usePipelineStore((s) => s.addOp);
  const source = usePipelineStore((s) => s.source);

  return (
    <div className="flex flex-col gap-1 p-2 border border-border rounded-lg bg-card">
      <p className="text-xs text-muted-foreground px-1 pb-1 border-b border-border mb-1">
        Add operation
      </p>
      {(Object.keys(OP_META) as Op["type"][]).map((type) => {
        const meta = OP_META[type];
        return (
          <button
            key={type}
            onClick={() => addOp(type)}
            disabled={!source}
            className="flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span className="text-muted-foreground">{meta.icon}</span>
            <span className="flex-1 font-mono">{meta.label}</span>
            <span className="text-muted-foreground/60 text-[10px]">
              {meta.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
