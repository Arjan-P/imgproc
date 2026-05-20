import { create } from "zustand";
import { type Op, type OpParams, OP_DEFAULTS } from "@imgproc/shared";
import type { RawImage } from "@imgproc/wasm";

export type PipelineOp = Op & { id: string };

export interface PipelineState {
  source: RawImage | null;
  ops: PipelineOp[];
  processing: boolean;
  error: string | null;
}

export interface PipelineActions {
  setSource: (img: RawImage) => void;
  clearSource: () => void;
  addOp: (type: Op["type"]) => void;
  removeOp: (id: string) => void;
  updateOp: <K extends Op["type"]>(id: string, params: OpParams<K>) => void;
  moveOp: (id: string, direction: "up" | "down") => void;
  setProcessing: (v: boolean) => void;
  setError: (msg: string | null) => void;
}

export const usePipelineStore = create<PipelineState & PipelineActions>()(
  (set) => ({
    // state
    source: null,
    ops: [],
    processing: false,
    error: null,

    // actions
    setSource: (img) => set({ source: img, error: null }),
    clearSource: () => set({ source: null, ops: [], error: null }),

    addOp: (type) =>
      set((s) => ({
        ops: [...s.ops, { ...OP_DEFAULTS[type], id: crypto.randomUUID() }],
      })),

    removeOp: (id) =>
      set((s) => ({
        ops: s.ops.filter((o) => o.id !== id),
      })),

    updateOp: (id, params) =>
      set((s) => ({
        ops: s.ops.map((o) => (o.id === id ? { ...o, ...params } : o)),
      })),

    moveOp: (id, dir) =>
      set((s) => {
        const i = s.ops.findIndex((o) => o.id === id);
        if (i === -1) return s;
        const j = dir === "up" ? i - 1 : i + 1;
        if (j < 0 || j >= s.ops.length) return s;
        const next = [...s.ops];
        [next[i], next[j]] = [next[j], next[i]];
        return { ops: next };
      }),

    setProcessing: (v) => set({ processing: v }),
    setError: (msg) => set({ error: msg }),
  }),
);
