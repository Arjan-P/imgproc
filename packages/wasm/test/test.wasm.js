import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { initWasm, resize } from "../bridge/wasm-bridge.js";

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
  before(async () => await initWasm());

  test("resize produces correct dimensions", () => {
    const src = makeTestImage(100, 100);
    const out = resize(src, 50, 30);
    assert.equal(out.width, 50);
    assert.equal(out.height, 30);
    assert.equal(out.data.length, 50 * 30 * 4);
  });

  test("no memory leak: RSS stable over 1000 resize calls", async () => {
    const src = makeTestImage(200, 200);
    const before = process.memoryUsage().rss;
    for (let i = 0; i < 1000; i++) resize(src, 100, 100);
    const after = process.memoryUsage().rss;
    assert.ok(after - before < 5 * 1024 * 1024, "RSS grew by more than 5 MB");
  });
});
