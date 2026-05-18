#include "imgproc.h"

Image* img_invert(Image* src) {
  Image* out = img_create(src->w, src->h, src->channels);
  size_t size = img_size(src);

  for(size_t i = 0; i < size; i++) {
    out->data[i] = 255 - src->data[i];
  }

  return out;
}
