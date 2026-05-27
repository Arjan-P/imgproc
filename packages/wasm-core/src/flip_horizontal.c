#include "imgproc.h"

Image* img_flip_horizontal(const Image* src) {
  Image* out = img_create(src->w, src->h, src->channels);
  if(!out) return NULL;
  const size_t ch = src->channels;
  size_t row_size = src->w * src->channels;
  for(size_t i = 0; i < src->h; i++) {
    uint8_t* sr = src->data + i * row_size;
    uint8_t* dr = out->data + i * row_size;
    for(size_t j = 0; j < src->w; j++) {
      uint8_t* sp = sr + j * ch;
      uint8_t* dp = dr + ((size_t)src->w - j - 1) * ch;

      memcpy(dp, sp, ch);
    }
  }
  return out;
}
