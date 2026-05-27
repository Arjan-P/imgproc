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
  DownloadIcon,
} from "lucide-react";
import { useProcessedImage } from "../hooks/useProcessedImage.js";

function downloadImage(data: Uint8Array, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.putImageData(
    new ImageData(new Uint8ClampedArray(data), width, height),
    0,
    0,
  );

  canvas.toBlob((blob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "processed-image.png";
    a.click();

    URL.revokeObjectURL(url);
  }, "image/png");
}

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
  // TODO: try and have central result instead of running pipeline again for download
  const result = useProcessedImage();
  const display = result ?? source;

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

      <Separator className="my-2" />

      <Button
        variant="secondary"
        size="sm"
        className="justify-start gap-2 h-8 text-xs font-mono"
        disabled={!display}
        onClick={() => {
          if (!display) return;

          downloadImage(display.data, display.width, display.height);
        }}
      >
        <DownloadIcon className="w-3.5 h-3.5" />
        Download PNG
      </Button>
    </div>
  );
}
