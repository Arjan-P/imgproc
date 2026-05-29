import type { Op } from "@imgproc/shared";

export const OP_COLORS: { [K in Op["type"]]: string } = {
  resize: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  grayscale: "bg-neutral-500/10 text-neutral-600 border-neutral-500/20",
  invert: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  brightness: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  flipHorizontal: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  flipVertical: "bg-teal-500/10 text-teal-600 border-teal-500/20",
};
