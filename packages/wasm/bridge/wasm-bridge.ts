import ImgProcModuleFactory, { type ImgProcModule } from "@imgproc/wasm-core";
import type { RawImage } from "./types.js";
import { readImageStruct } from "./struct.js";

let modulePromise: Promise<ImgProcModule> | null = null;

function getModule(): Promise<ImgProcModule> {
  if (!modulePromise) {
    modulePromise = ImgProcModuleFactory();
  }
  return modulePromise;
}

function withImage(
  Module: ImgProcModule,
  img: RawImage,
  cb: (ptr: number) => number,
): RawImage {
  const inPtr = Module._malloc(img.data.length);
  Module.HEAPU8.set(img.data, inPtr);
  const imgPtr = Module._img_from_ptr(
    inPtr,
    img.width,
    img.height,
    img.channels,
  );
  Module._free(inPtr);
  let outPtr = 0;
  try {
    outPtr = cb(imgPtr);
    if (!outPtr) throw new Error(`WASM op returned null pointer`);
    return readImageStruct(Module, outPtr);
  } finally {
    if (outPtr) Module._img_free(outPtr);
    Module._img_free(imgPtr);
  }
}

export async function resize(
  img: RawImage,
  nw: number,
  nh: number,
): Promise<RawImage> {
  const mod = await getModule();
  return withImage(mod, img, (p) => mod._img_resize(p, nw, nh));
}

export async function grayscale(img: RawImage): Promise<RawImage> {
  const mod = await getModule();
  return withImage(mod, img, (p) => mod._img_grayscale(p));
}

export async function invert(img: RawImage): Promise<RawImage> {
  const mod = await getModule();
  return withImage(mod, img, (p) => mod._img_invert(p));
}
