import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { type PipelineOp } from "../../../store/pipeline.store.js";
import { type OpParams } from "@imgproc/shared";
import { useDebounced } from "@/hooks/useDebounced";

interface Props {
  op: Extract<PipelineOp, { type: "resize" }>;
  onUpdate: (p: OpParams<"resize">) => void;
}

export function ResizeControls({ op, onUpdate }: Props) {
  const [nw, setNw] = useState(op.nw);
  const [nh, setNh] = useState(op.nh);
  const dNw = useDebounced(nw);
  const dNh = useDebounced(nh);
  useEffect(() => {
    onUpdate({ nw: dNw, nh: dNh });
  }, [dNw, dNh]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground font-mono">W</span>
          <span className="text-[10px] font-mono text-foreground">{nw}px</span>
        </div>
        <Slider
          min={16}
          max={2048}
          step={1}
          value={[nw]}
          onValueChange={([v]) => setNw(v)}
          className="h-1"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground font-mono">H</span>
          <span className="text-[10px] font-mono text-foreground">{nh}px</span>
        </div>
        <Slider
          min={16}
          max={2048}
          step={1}
          value={[nh]}
          onValueChange={([v]) => setNh(v)}
          className="h-1"
        />
      </div>
    </div>
  );
}
