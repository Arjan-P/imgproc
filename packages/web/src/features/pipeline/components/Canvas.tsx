import { useEffect, useRef } from "react";
import { type RawImage } from "@imgproc/wasm";
import { usePipelineStore } from "../store/pipeline.store.js";
import { useProcessedImage } from "../hooks/useProcessedImage.js";

function drawToCanvas(canvas: HTMLCanvasElement, img: RawImage) {
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.putImageData(
    new ImageData(new Uint8ClampedArray(img.data), img.width, img.height),
    0,
    0,
  );
}

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processing = usePipelineStore((s) => s.processing);
  const error = usePipelineStore((s) => s.error);
  const source = usePipelineStore((s) => s.source);
  const result = useProcessedImage();

  // show result if available, fall back to source
  const display = result ?? source;

  useEffect(() => {
    if (canvasRef.current && display) drawToCanvas(canvasRef.current, display);
  }, [display]);

  if (!source) return null;

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: "100%",
          display: "block",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-md)",
          opacity: processing ? 0.5 : 1,
          transition: "opacity 0.15s",
        }}
      />
      {processing && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            fontSize: "11px",
            color: "var(--color-text-secondary)",
            background: "var(--color-background-secondary)",
            padding: "2px 8px",
            borderRadius: "var(--border-radius-md)",
          }}
        >
          processing…
        </div>
      )}
      {error && (
        <p
          style={{
            color: "var(--color-text-danger)",
            fontSize: "12px",
            marginTop: "6px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
