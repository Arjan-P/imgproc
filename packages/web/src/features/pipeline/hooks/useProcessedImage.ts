import { useEffect, useRef, useState } from "react";
import { usePipelineStore } from "../store/pipeline.store.js";
import { workerOp } from "../workers/img-worker-client.js";
import { type RawImage } from "@imgproc/wasm";
import { type PipelineOp } from "../store/pipeline.store.js";

async function runPipeline(
  source: RawImage,
  ops: PipelineOp[],
  signal: AbortSignal,
): Promise<RawImage> {
  // start from a copy
  let img: RawImage = { ...source, data: source.data.slice() };

  for (const op of ops) {
    if (signal.aborted)
      throw new DOMException("pipeline aborted", "AbortError");
    switch (op.type) {
      case "resize":
        img = await workerOp.resize({ ...img, nw: op.nw, nh: op.nh });
        break;
      case "grayscale":
        img = await workerOp.grayscale(img);
        break;
      case "invert":
        img = await workerOp.invert(img);
        break;
    }
    // result buffer is now owned by img
  }
  return img;
}

export function useProcessedImage() {
  const source = usePipelineStore((s) => s.source);
  const ops = usePipelineStore((s) => s.ops);
  const { setProcessing, setError } = usePipelineStore();

  const [result, setResult] = useState<RawImage | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!source) {
      setResult(null);
      return;
    }

    // cancel previous run before starting new one
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setProcessing(true);
    setError(null);

    runPipeline(source, ops, ctrl.signal)
      .then((img) => {
        if (!ctrl.signal.aborted) setResult(img);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(String(err));
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setProcessing(false);
      });

    return () => ctrl.abort();
  }, [source, ops]);

  return result;
}
