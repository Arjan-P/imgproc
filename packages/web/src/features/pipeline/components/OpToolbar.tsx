import {
  ArrowRightLeftIcon,
  CircleIcon,
  DownloadIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
  ScanIcon,
  SunIcon,
} from "lucide-react";

import { type Op } from "@imgproc/shared";

import { useProcessedImage } from "../hooks/useProcessedImage.js";
import { usePipelineStore } from "../store/pipeline.store.js";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function downloadImage(data: Uint8Array, width: number, height: number) {
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  ctx.putImageData(
    new ImageData(new Uint8ClampedArray(data), width, height),
    0,
    0,
  );

  canvas.toBlob((blob) => {
    if (!blob) {
      return;
    }

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "processed-image.png";

    a.click();

    URL.revokeObjectURL(url);
  }, "image/png");
}

const OP_META: {
  [K in Op["type"]]: {
    label: string;
    Icon: React.ElementType;
  };
} = {
  resize: {
    label: "Resize",
    Icon: ScanIcon,
  },

  grayscale: {
    label: "Grayscale",
    Icon: CircleIcon,
  },

  invert: {
    label: "Invert",
    Icon: ArrowRightLeftIcon,
  },

  brightness: {
    label: "Brightness",
    Icon: SunIcon,
  },

  flipHorizontal: {
    label: "Flip Horizontal",
    Icon: FlipHorizontalIcon,
  },

  flipVertical: {
    label: "Flip Vertical",
    Icon: FlipVerticalIcon,
  },
};

export function OpToolbar() {
  const addOp = usePipelineStore((s) => s.addOp);

  const source = usePipelineStore((s) => s.source);

  // TODO:
  // have a central processed result
  // instead of rerunning pipeline
  const result = useProcessedImage();

  const display = result ?? source;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
          Operations
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex flex-col gap-1">
          {(
            Object.entries(OP_META) as [
              Op["type"],
              {
                label: string;
                Icon: React.ElementType;
              },
            ][]
          ).map(([type, { label, Icon }]) => (
            <Button
              key={type}
              variant="ghost"
              size="sm"
              disabled={!source}
              onClick={() => addOp(type)}
              className="h-9 justify-start gap-2 font-mono text-xs"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />

              {label}
            </Button>
          ))}
        </div>

        <Separator />

        <Button
          variant="secondary"
          size="sm"
          disabled={!display}
          onClick={() => {
            if (!display) {
              return;
            }

            downloadImage(display.data, display.width, display.height);
          }}
          className="w-full justify-start gap-2 font-mono text-xs"
        >
          <DownloadIcon className="h-4 w-4" />
          Download PNG
        </Button>
      </CardContent>
    </Card>
  );
}
