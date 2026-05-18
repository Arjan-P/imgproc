import type { ImgProcModule } from "@imgproc/wasm-core";
import type { RawImage } from "./types.js";

const FIELD_OFFSETS = {
  data: 0, // uint8_t*
  w: 4, // int
  h: 8, // int
  channels: 12, // int
} as const;

export function readImageStruct(mod: ImgProcModule, ptr: number): RawImage {
  // read struct fields through manual offsets
  const dataPtr = mod.getValue(ptr + FIELD_OFFSETS.data, "i32");
  const w = mod.getValue(ptr + FIELD_OFFSETS.w, "i32");
  const h = mod.getValue(ptr + FIELD_OFFSETS.h, "i32");
  const channels = mod.getValue(ptr + FIELD_OFFSETS.channels, "i32");
  return {
    data: mod.HEAPU8.slice(dataPtr, dataPtr + w * h * channels),
    width: w,
    height: h,
    channels,
  };
}
