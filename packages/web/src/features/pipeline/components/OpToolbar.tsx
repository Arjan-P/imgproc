import { usePipelineStore } from "../store/pipeline.store.js";
import { type Op } from "@imgproc/shared";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ScanIcon,
  CircleIcon,
  ArrowRightLeftIcon,
  SunIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
} from "lucide-react";

const OP_META: {
  [K in Op["type"]]: { label: string; Icon: React.ElementType };
} = {
  resize: { label: "Resize", Icon: ScanIcon },
  grayscale: { label: "Grayscale", Icon: CircleIcon },
  invert: { label: "Invert", Icon: ArrowRightLeftIcon },
  brightness: { label: "Brightness", Icon: SunIcon },
  flipHorizontal: { label: "Flip Horizontal", Icon: FlipHorizontalIcon },
  flipVertical: { label: "Flip Vertical", Icon: FlipVerticalIcon },
};

export function OpToolbar() {
  const addOp = usePipelineStore((s) => s.addOp);
  const source = usePipelineStore((s) => s.source);

  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-0.5 mb-0.5">
        Add operation
      </p>
      <Separator className="mb-1" />
      {(
        Object.entries(OP_META) as [
          Op["type"],
          { label: string; Icon: React.ElementType },
        ][]
      ).map(([type, { label, Icon }]) => (
        <Button
          key={type}
          variant="ghost"
          size="sm"
          className="justify-start gap-2 h-8 text-xs font-mono"
          disabled={!source}
          onClick={() => addOp(type)}
        >
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          {label}
        </Button>
      ))}
    </div>
  );
}
