import { useEffect, useRef } from "react";

import { Loader2Icon, ImageIcon } from "lucide-react";

import { type RawImage } from "@imgproc/wasm";

import { usePipelineStore } from "../store/pipeline.store.js";
import { useProcessedImage } from "../hooks/useProcessedImage.js";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Badge } from "@/components/ui/badge";

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
    if (ref.current && display) {
      draw(ref.current, display);
    }
  }, [display]);

  if (!source) {
    return (
      <Card className="flex h-full items-center justify-center border-dashed">
        <CardContent className="w-full py-16">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon className="h-6 w-6" />
              </EmptyMedia>

              <EmptyTitle>No image loaded</EmptyTitle>

              <EmptyDescription>
                Drop an image to start processing
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative h-full overflow-hidden">
      <CardContent className="flex h-full items-center justify-center overflow-auto p-4">
        <canvas
          ref={ref}
          className={cn(
            "max-h-full max-w-full rounded-lg border bg-background object-contain transition-opacity",
            processing && "opacity-50",
          )}
        />

        {processing && (
          <Badge
            variant="secondary"
            className="absolute right-3 top-3 gap-1.5 px-2 py-1"
          >
            <Loader2Icon className="h-3 w-3 animate-spin" />
            processing
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
