export interface RawImage {
  data: Uint8Array;
  width: number;
  height: number;
  channels: number;
}

export type OpName = "resize";
