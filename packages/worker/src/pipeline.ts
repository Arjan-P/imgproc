import { resize, grayscale, invert } from "@imgproc/wasm";
import { type Op } from "@imgproc/shared";

// Re-export RawImage from wasm — shared doesn't own it
import { type RawImage as WasmRawImage } from "@imgproc/wasm";

export async function runPipeline(
  rawPixels: Buffer,
  ops: Op[],
): Promise<WasmRawImage> {
  // decode raw PNG/JPEG Buffer into RGBA pixels
  // assume rawPixels IS already RGBA w=100 h=100
  // TODO: use sharp.raw() to decode any format
  let img: WasmRawImage = {
    data: new Uint8Array(rawPixels.buffer),
    width: 100,
    height: 100,
    channels: 4,
  };

  for (const op of ops) {
    switch (op.type) {
      case "resize":
        img = await resize(img, op.nw, op.nh);
        break;
      case "grayscale":
        img = await grayscale(img);
        break;
      case "invert":
        img = await invert(img);
        break;
    }
  }
  return img;
}
