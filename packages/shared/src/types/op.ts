// Discriminated union of every pipeline operation.
// Add a new variant here when a new C op is added.
// flat params — no nested objects.

export interface ResizeOp {
  type: "resize";
  nw: number;
  nh: number;
}

export interface GrayscaleOp {
  type: "grayscale";
}

export interface InvertOp {
  type: "invert";
}

export interface BrightnessOp {
  type: "brightness";
  delta: number;
}

export type Op = ResizeOp | GrayscaleOp | InvertOp | BrightnessOp;

// Narrows to the op's params -> everything except `type`
export type OpParams<T extends Op["type"]> = Omit<
  Extract<Op, { type: T }>,
  "type"
>;

// Default params per op — used by the pipeline store when adding a new op
export const OP_DEFAULTS: { [K in Op["type"]]: Extract<Op, { type: K }> } = {
  resize: { type: "resize", nw: 800, nh: 600 },
  grayscale: { type: "grayscale" },
  invert: { type: "invert" },
  brightness: { type: "brightness", delta: 0 },
};
