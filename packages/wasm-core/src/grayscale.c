#include "imgproc.h"

Image* img_grayscale(const Image* src) {
  Image* out = img_create(src->w, src->h, src->channels);
  if(!out) return NULL;
 
  for(size_t i = 0; i < (size_t)(src->h * src->w); i++) {
    uint8_t* s = src->data + i * src->channels;
    float g = s[0] * .299f + s[1] * .587f + s[2] * .114f;
    uint8_t* d = out->data + i * out->channels;
    d[0] = d[1] = d[2] = (uint8_t)g;
    if(src->channels == 4) d[3] = s[3];
  }
  return out;
}
