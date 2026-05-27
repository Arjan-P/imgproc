#define STB_IMAGE_RESIZE_IMPLEMENTATION
#include "../vendor/stb_image_resize2.h"
#include "imgproc.h"

Image* img_resize(const Image* src, int nw, int nh) {
  Image* out = img_create(nw, nh, src->channels);
  if(!out) return NULL;

    stbir_resize_uint8_linear(
    src->data, src->w, src->h, 0,
    out->data, nw, nh, 0,
    (stbir_pixel_layout)src->channels
  );

  return out;
}
