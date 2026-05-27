import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { type PipelineOp } from "../../../store/pipeline.store.js";
import { type OpParams } from "@imgproc/shared";
import { useDebounced } from "@/hooks/useDebounced";

interface Props {
  op: Extract<PipelineOp, { type: "brightness" }>;
  onUpdate: (p: OpParams<"brightness">) => void;
}

export function BrightnessControls({ op, onUpdate }: Props) {
  const [delta, setDelta] = useState(op.delta);
  const debouncedAmount = useDebounced(delta);
  useEffect(() => {
    onUpdate({ delta: debouncedAmount });
  }, [debouncedAmount]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground font-mono">
            Delta
          </span>
          <span className="text-[10px] font-mono text-foreground">{delta}</span>
        </div>
        <Slider
          min={-100}
          max={100}
          step={1}
          value={[delta]}
          onValueChange={([v]) => setDelta(v)}
          className="h-1"
        />
      </div>
    </div>
  );
}
