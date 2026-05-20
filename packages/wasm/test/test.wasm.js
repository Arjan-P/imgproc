import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { grayscale, resize, invert } from "../bridge/wasm-bridge.js";

// 4×4 solid red RGBA test image
function makeTestImage(w = 4, h = 4) {
  const data = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    data[i * 4] = 255; // R
    data[i * 4 + 3] = 255; // A
  }
  return { data, width: w, height: h, channels: 4 };
}

describe("WASM image engine", () => {
  test("resize produces correct dimensions", async () => {
    const src = makeTestImage(100, 100);
    const out = await resize(src, 50, 30);
    assert.equal(out.width, 50);
    assert.equal(out.height, 30);
    assert.equal(out.data.length, 50 * 30 * 4);
  });

  test("grayscale: R=G=B for every pixel", async () => {
    const out = await grayscale(makeTestImage());
    for (let i = 0; i < 4 * 4; i++) {
      assert.equal(out.data[i * 4], out.data[i * 4 + 1]);
      assert.equal(out.data[i * 4], out.data[i * 4 + 2]);
    }
  });

  test("invert: colors are inverted", async () => {
    const src = makeTestImage();

    const out = await invert(src);

    for (let i = 0; i < 4 * 4; i++) {
      assert.equal(out.data[i * 4], 0); // R: 255 -> 0
      assert.equal(out.data[i * 4 + 1], 255); // G: 0 -> 255
      assert.equal(out.data[i * 4 + 2], 255); // B: 0 -> 255
      assert.equal(out.data[i * 4 + 3], 255); // A unchanged
    }
  });

  test("no memory leak: RSS stable over 1000 resize calls", async () => {
    const src = makeTestImage(100, 100);

    global.gc?.();
    const before = process.memoryUsage().heapUsed;

    for (let i = 0; i < 1000; i++) {
      let out = await resize(src, 100, 100);
      out = await invert(src);
      out = await grayscale(src);
    }

    global.gc?.();
    const after = process.memoryUsage().heapUsed;

    assert.ok(after - before < 2 * 1024 * 1024);
  });
});
