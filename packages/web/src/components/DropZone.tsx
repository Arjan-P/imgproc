import { useCallback, useState } from "react";
import { usePipelineStore } from "../store/pipeline.store.js";
import { type RawImage } from "@imgproc/wasm";

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
  const clearSource = usePipelineStore((s) => s.clearSource);
  const [dragging, setDragging] = useState(false);

  const load = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      clearSource();
      const raw = await fileToRawImage(file);
      setSource(raw);
    },
    [setSource, clearSource],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) load(file);
      }}
      style={{
        border: `1.5px dashed ${dragging ? "var(--color-border-info)" : "var(--color-border-secondary)"}`,
        borderRadius: "var(--border-radius-lg)",
        padding: "32px",
        textAlign: "center",
        cursor: "pointer",
        background: dragging ? "var(--color-background-info)" : "transparent",
        transition: "background 0.1s, border-color 0.1s",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          color: "var(--color-text-secondary)",
          marginBottom: "8px",
        }}
      >
        Drop an image here
      </p>
      <label
        style={{
          fontSize: "12px",
          color: "var(--color-text-info)",
          cursor: "pointer",
        }}
      >
        or click to browse
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) load(f);
          }}
        />
      </label>
    </div>
  );
}
