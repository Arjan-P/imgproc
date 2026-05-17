import ImgProcModuleFactory, { type ImgProcModule } from "@imgproc/wasm-core";
import type { RawImage } from "./types.js";

let Module: ImgProcModule;

// TODO: If two callers await initWasm() before the first resolves (e.g. two workers starting simultaneously),
// Module will be initialised twice and the second assignment will overwrite the first mid-flight.
// This causes random crashes under load.
export async function initWasm() {
  if (Module) return;
  Module = await ImgProcModuleFactory();
}

function withImage(img: RawImage, cb: (ptr: number) => number): RawImage {
  const inPtr = Module._malloc(img.data.length); // uint8_t* inPtr = (uint8_t*)malloc(img.w * img.h * img.ch);
  Module.HEAPU8.set(img.data, inPtr); // memcyp(img.data, inPtr, img.w * img.h * img.ch);
  const imgPtr = Module._img_from_ptr(
    // Image* imgPtr = _img_from_ptr(inPtr, img.w, img.h, img.ch);
    inPtr,
    img.width,
    img.height,
    img.channels,
  );
  const outPtr = cb(imgPtr); // transform
  const result = readImage(outPtr); // decode struct manually
  Module._img_free(imgPtr); // _img_free(imgPtr);                                               // Free Image* along with uint8_t* for image data
  Module._img_free(outPtr); // _img_free(outPtr);                                               // Free Image* along with uint8_t* for image data
  Module._free(inPtr); // _free(inPtr);                                                    // Free uint8_t*
  return result; //
}

function readImage(ptr: number): RawImage {
  // read struct fields through manual offsets
  const dataPtr = Module.getValue(ptr, "i32");
  const w = Module.getValue(ptr + 4, "i32");
  const h = Module.getValue(ptr + 8, "i32");
  const channels = Module.getValue(ptr + 12, "i32");
  const data = Module.HEAPU8.slice(dataPtr, dataPtr + w * h * channels);
  return { data, width: w, height: h, channels };
}

export function resize(img: RawImage, nw: number, nh: number): RawImage {
  return withImage(img, (p) => Module._img_resize(p, nw, nh));
}
