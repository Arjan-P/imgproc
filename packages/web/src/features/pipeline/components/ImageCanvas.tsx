import { useEffect, useRef } from "react";
import { type RawImage } from "@imgproc/wasm";
import { usePipelineStore } from "../store/pipeline.store.js";
import { useProcessedImage } from "../hooks/useProcessedImage.js";
import { Loader2Icon } from "lucide-react";

function draw(canvas: HTMLCanvasElement, img: RawImage) {
  canvas.width = img.width;
  canvas.height = img.height;
  canvas
    .getContext("2d")!
    .putImageData(
      new ImageData(new Uint8ClampedArray(img.data), img.width, img.height),
      0,
      0,
    );
}

export function ImageCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const source = usePipelineStore((s) => s.source);
  const processing = usePipelineStore((s) => s.processing);
  const result = useProcessedImage();
  const display = result ?? source;

  useEffect(() => {
    if (ref.current && display) draw(ref.current, display);
  }, [display]);

  if (!source)
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Drop an image to start
      </div>
    );

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-auto p-4">
      <canvas
        ref={ref}
        className="max-w-full max-h-full rounded-md border border-border object-contain"
        style={{ opacity: processing ? 0.5 : 1, transition: "opacity 0.15s" }}
      />
      {processing && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 text-xs text-muted-foreground bg-card/90 border border-border rounded-md px-2 py-1">
          <Loader2Icon className="w-3 h-3 animate-spin" /> processing
        </div>
      )}
    </div>
  );
}
