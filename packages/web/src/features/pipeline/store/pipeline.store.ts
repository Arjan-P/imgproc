import { create } from "zustand";
import { type Op, type OpParams, OP_DEFAULTS } from "@imgproc/shared";
import type { RawImage } from "@imgproc/wasm";

export type PipelineOp = Op & { id: string };

export interface PipelineState {
  source: RawImage | null;
  id?: string;
  name: string;
  ops: PipelineOp[];
  processing: boolean;
  error: string | null;
}

export interface PipelineActions {
  setSource: (img: RawImage) => void;
  setId: (id?: string) => void;
  setName: (name: string) => void;
  clearSource: () => void;
  loadPipeline: (ops: Op[]) => void;
  resetWorkspace: () => void;
  addOp: (type: Op["type"]) => void;
  removeOp: (id: string) => void;
  reorderOps: (orderedIds: string[]) => void;
  updateOp: <K extends Op["type"]>(id: string, params: OpParams<K>) => void;
  moveOp: (id: string, direction: "up" | "down") => void;
  setProcessing: (v: boolean) => void;
  setError: (msg: string | null) => void;
}

export const usePipelineStore = create<PipelineState & PipelineActions>()(
  (set) => ({
    // state
    source: null,
    name: "Untitled Pipeline",
    ops: [],
    processing: false,
    error: null,

    // actions
    setSource: (img) => set({ source: img, error: null }),
    setId: (id) => set({ id }),
    setName: (name) => set({ name }),
    clearSource: () => set({ source: null }),

    loadPipeline: (ops) =>
      set({
        ops: ops.map((op) => ({
          ...op,
          id: crypto.randomUUID(),
        })),
      }),
    resetWorkspace: () =>
      set({
        id: undefined,
        name: "Untitled Pipeline",
        source: null,
        ops: [],
        error: null,
        processing: false,
      }),
    addOp: (type) =>
      set((s) => ({
        ops: [...s.ops, { ...OP_DEFAULTS[type], id: crypto.randomUUID() }],
      })),

    removeOp: (id) =>
      set((s) => ({
        ops: s.ops.filter((o) => o.id !== id),
      })),

    reorderOps: (orderedIds) =>
      set((s) => {
        const map = new Map(s.ops.map((o) => [o.id, o]));
        const reordered = orderedIds
          .map((id) => map.get(id))
          .filter(Boolean) as PipelineOp[];
        return { ops: reordered };
      }),

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
