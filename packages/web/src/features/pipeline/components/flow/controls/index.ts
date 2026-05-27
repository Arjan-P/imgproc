import { ResizeControls } from "./ResizeControls";
import { BrightnessControls } from "./BrightnessControls";

export const CONTROL_COMPONENTS = {
  resize: ResizeControls,
  brightness: BrightnessControls,
} as const;
