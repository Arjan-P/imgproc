import { useCallback, useState } from "react";
import { UploadCloudIcon } from "lucide-react";
import { usePipelineStore } from "../store/pipeline.store.js";
import { type RawImage } from "@imgproc/wasm";
import { cn } from "@/lib/utils";

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
  const { setSource, clearSource } = usePipelineStore();
  const [dragging, setDragging] = useState(false);

  const load = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      clearSource();
      setSource(await fileToRawImage(file));
    },
    [setSource, clearSource],
  );

  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
        dragging
          ? "border-ring bg-accent"
          : "border-border hover:border-ring/50 hover:bg-accent/30",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) load(f);
      }}
    >
      <UploadCloudIcon className="w-8 h-8 text-muted-foreground" />
      <span className="text-xs text-muted-foreground text-center">
        Drop image or click
      </span>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) load(f);
        }}
      />
    </label>
  );
}
