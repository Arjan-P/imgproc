import { RawImage } from "@imgproc/wasm";

export async function fileToRawImage(file: File): Promise<RawImage> {
  const bmp = await createImageBitmap(file);
  const c = new OffscreenCanvas(bmp.width, bmp.height);
  const ctx = c.getContext("2d")!;
  ctx.drawImage(bmp, 0, 0);
  const id = ctx.getImageData(0, 0, bmp.width, bmp.height);
  return {
    data: new Uint8Array(id.data.buffer),
    width: bmp.width,
    height: bmp.height,
    channels: 4,
  };
}
