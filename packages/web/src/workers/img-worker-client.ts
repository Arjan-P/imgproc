import type { WorkerRequest, WorkerResponse } from "./img-worker.js";
import type { RawImage } from "@imgproc/wasm";

import ImgWorker from "./img-worker.ts?worker";

const worker = new ImgWorker();

type Pending = {
  resolve: (img: RawImage) => void;
  reject: (err: Error) => void;
};

const pending = new Map<string, Pending>();

worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
  const p = pending.get(e.data.id);
  if (!p) return;
  pending.delete(e.data.id);
  e.data.ok ? p.resolve(e.data.result) : p.reject(new Error(e.data.error));
};

worker.onerror = (e) => {
  pending.forEach((p) => p.reject(new Error(`Worker crashed: ${e.message}`)));
  pending.clear();
};

function send(req: WorkerRequest): Promise<RawImage> {
  return new Promise((resolve, reject) => {
    pending.set(req.id, { resolve, reject });
    worker.postMessage(req, [req.img.data.buffer]);
  });
}

function makeId() {
  return crypto.randomUUID();
}

export function workerResize(img: RawImage, nw: number, nh: number) {
  return send({ id: makeId(), img, type: "resize", nh, nw });
}
export function workerGrayscale(img: RawImage) {
  return send({ id: makeId(), img, type: "grayscale" });
}
export function workerInvert(img: RawImage) {
  return send({ id: makeId(), img, type: "invert" });
}
