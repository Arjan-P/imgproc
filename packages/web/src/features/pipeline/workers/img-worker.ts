/// <reference no-default-lib="true"/>
/// <reference lib="ES2022" />
/// <reference lib="WebWorker" />

import { resize, grayscale, invert, brightness } from "@imgproc/wasm";
import type { RawImage } from "@imgproc/wasm";
import type { Op } from "@imgproc/shared";

export type WorkerRequest = { id: string; img: RawImage } & Op;
export type WorkerResponse =
  | { id: string; ok: true; result: RawImage }
  | { id: string; ok: false; error: string };

const ops: { [K in Op["type"]]: (req: WorkerRequest) => Promise<RawImage> } = {
  resize: (r) => {
    if (r.type !== "resize") throw new Error("unreachable");
    return resize(r.img, r.nw, r.nh);
  },
  grayscale: (r) => grayscale(r.img),
  invert: (r) => invert(r.img),
  brightness: (r) => {
    if (r.type !== "brightness") throw new Error("unreachable");
    return brightness(r.img, r.delta);
  },
};

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const req = e.data;
  try {
    const result = await ops[req.type](req);
    self.postMessage(
      { id: req.id, ok: true, result } satisfies WorkerResponse,
      [result.data.buffer],
    );
  } catch (err) {
    self.postMessage({
      id: req.id,
      ok: false,
      error: String(err),
    } satisfies WorkerResponse);
  }
};
