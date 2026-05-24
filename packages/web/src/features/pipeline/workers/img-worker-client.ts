import type { WorkerRequest, WorkerResponse } from "./img-worker.js";
import type { RawImage } from "@imgproc/wasm";

import ImgWorker from "./img-worker.ts?worker";
import { Op, OpParams } from "@imgproc/shared";

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
  // TODO: add worker restart after crash
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

function workerResize({
  data,
  width,
  height,
  channels,
  nw,
  nh,
}: RawImage & OpParams<"resize">) {
  return send({
    id: makeId(),
    img: { data, width, height, channels },
    type: "resize",
    nw,
    nh,
  });
}

function workerGrayscale({
  data,
  width,
  height,
  channels,
}: RawImage & OpParams<"grayscale">) {
  return send({
    id: makeId(),
    img: { data, width, height, channels },
    type: "grayscale",
  });
}

function workerInvert({
  data,
  width,
  height,
  channels,
}: RawImage & OpParams<"invert">) {
  return send({
    id: makeId(),
    img: { data, width, height, channels },
    type: "invert",
  });
}

export const workerOp: {
  [K in Op["type"]]: (params: RawImage & OpParams<K>) => Promise<RawImage>;
} = {
  resize: workerResize,
  grayscale: workerGrayscale,
  invert: workerInvert,
};
