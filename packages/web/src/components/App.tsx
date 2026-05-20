import { useState, useCallback } from "react";
import {
  workerGrayscale,
  workerResize,
  workerInvert,
} from "../workers/img-worker-client.js";
import type { RawImage } from "@imgproc/wasm";
import type { Op, OpParams } from "@imgproc/shared";

function fileToRawImage(file: File): Promise<RawImage> {
  return createImageBitmap(file).then((bmp) => {
    const c = new OffscreenCanvas(bmp.width, bmp.height);
    c.getContext("2d")!.drawImage(bmp, 0, 0);
    const id = c.getContext("2d")!.getImageData(0, 0, bmp.width, bmp.height);
    return {
      data: new Uint8Array(id.data),
      width: bmp.width,
      height: bmp.height,
      channels: 4,
    };
  });
}

export function App() {
  const [src, setSrc] = useState<RawImage | null>(null);
  const [out, setOut] = useState<RawImage | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const raw = await fileToRawImage(file);
    setSrc(raw);
    setOut(null);
  }, []);

  const run = useCallback(
    async <K extends Op["type"]>(op: K, params: OpParams<K>) => {
      const ops: {
        [K in Op["type"]]: (
          params: RawImage & OpParams<K>,
        ) => Promise<RawImage>;
      } = {
        grayscale: workerGrayscale,
        resize: workerResize,
        invert: workerInvert,
      };
      if (!src || busy) return;
      setBusy(true);
      try {
        // slice() copies before transfer — src stays valid for further ops
        const copy = { ...src, data: src.data.slice() };
        const result = await ops[op]({
          ...copy,
          ...params,
        });
        setOut(result);
      } finally {
        setBusy(false);
      }
    },
    [src, busy],
  );

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <input type="file" accept="image/*" onChange={onFile} />
      <div style={{ display: "flex", gap: "8px", margin: "12px 0" }}>
        <button onClick={() => run("grayscale", {})} disabled={!src || busy}>
          Grayscale
        </button>
        <button
          onClick={() => run("resize", { nw: 300, nh: 200 })}
          disabled={!src || busy}
        >
          Resize 300×200
        </button>
        <button onClick={() => run("invert", {})} disabled={!src || busy}>
          Invert
        </button>
      </div>
      {out && <PixelCanvas img={out} />}
    </div>
  );
}

function PixelCanvas({ img }: { img: RawImage }) {
  const ref = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    canvas.width = img.width;
    canvas.height = img.height;
    const id = new ImageData(
      new Uint8ClampedArray(img.data),
      img.width,
      img.height,
    );
    canvas.getContext("2d")!.putImageData(id, 0, 0);
  };
  return (
    <canvas ref={ref} style={{ border: "1px solid #ccc", maxWidth: "100%" }} />
  );
}
