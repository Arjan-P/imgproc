export interface ImgProcModule {
  HEAPU8: Uint8Array;
  _malloc(size: number): number;
  _free(ptr: number): void;
  getValue(ptr: number, type: string): number;
  _img_create(w: number, h: number, ch: number): number;
  _img_from_ptr(ptr: number, w: number, h: number, ch: number): number;
  _img_resize(ptr: number, w: number, h: number): number;
  _img_grayscale(ptr: number): number;
  _img_invert(ptr: number): number;
  _img_free(ptr: number): void;
}

declare function ImgProcModuleFactory(): Promise<ImgProcModule>;
export default ImgProcModuleFactory;
