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
  const outPtr = cb(imgPtr);
  const result = readImageStruct(Module, outPtr);
  Module._img_free(outPtr);
  Module._img_free(imgPtr);
  return result;
}

export async function resize(
  img: RawImage,
  nw: number,
  nh: number,
): Promise<RawImage> {
  const mod = await getModule();
  return withImage(mod, img, (p) => mod._img_resize(p, nw, nh));
}
