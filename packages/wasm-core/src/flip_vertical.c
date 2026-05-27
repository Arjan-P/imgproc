#include "imgproc.h"

Image* img_flip_vertical(const Image* src) {
  Image* out = img_create(src->w, src->h, src->channels);
  if(!out) return NULL;
  size_t row_size = src->w * src->channels;
  for(size_t i = 0; i < src->h; i++) {
    uint8_t* s = src->data + i * row_size;
    uint8_t* d = out->data + ((size_t)out->h - i - 1) * row_size;
    memcpy(d, s, row_size);
  }
  return out;
}
