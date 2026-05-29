import { useCallback, useState } from "react";

import { UploadCloudIcon } from "lucide-react";

import { type RawImage } from "@imgproc/wasm";

import { usePipelineStore } from "../store/pipeline.store.js";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

async function fileToRawImage(file: File): Promise<RawImage> {
  const bmp = await createImageBitmap(file);

  const c = new OffscreenCanvas(bmp.width, bmp.height);

  const ctx = c.getContext("2d")!;

  ctx.drawImage(bmp, 0, 0);

  const id = ctx.getImageData(0, 0, bmp.width, bmp.height);

  return {
    data: new Uint8Array(id.data.buffer),
    width: bmp.width,
    height: bmp.height,
    channels: 4,
  };
}

export function DropZone() {
  const setSource = usePipelineStore((s) => s.setSource);

  const [dragging, setDragging] = useState(false);

  const load = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        return;
      }

      const img = await fileToRawImage(file);

      setSource(img);
    },
    [setSource],
  );

  return (
    <label className="block cursor-pointer">
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          dragging
            ? "border-primary bg-accent"
            : "hover:border-primary/50 hover:bg-accent/30",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();

          setDragging(false);

          const file = e.dataTransfer.files?.[0];

          if (file) {
            load(file);
          }
        }}
      >
        <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <UploadCloudIcon className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Drop image here</p>

            <p className="text-xs text-muted-foreground">
              Drag & drop or click to upload
            </p>
          </div>

          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                load(file);
              }
            }}
          />
        </CardContent>
      </Card>
    </label>
  );
}
