#include "imgproc.h"
#include <stdint.h>

Image *img_invert(Image *src) {
  Image *out = img_create(src->w, src->h, src->channels);
  if (!out) return NULL;

  for (size_t i = 0; i < (size_t)(src->h * src->w); i ++) {
    uint8_t* s = src->data + i * src->channels;
    uint8_t* d = out->data + i * src->channels;
    d[0] = 255 - s[0];
    d[1] = 255 - s[1];
    d[2] = 255 - s[2];
    if(src->channels == 4) d[3] = s[3];
  }

  return out;
}
