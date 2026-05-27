#include "imgproc.h"

// adjust brightness from 0.5x to 1.5x
// delta [-100, 100]
Image* img_brightness(const Image* src, int delta) {
  Image* out = img_create(src->w, src->h, src->channels);
  float f = 1 + (float)delta / 200; // [-0.5, 0.5]
  if(!out) return NULL;
  for(size_t i = 0; i < (size_t)(src->w * src->h); i++) {
    uint8_t* s = src->data + i * src->channels;
    uint8_t* d = out->data + i * out->channels; 
    d[0] = (uint8_t)img_clamp((int)(s[0] * f), 0, 255);
    d[1] = (uint8_t)img_clamp((int)(s[1] * f), 0, 255);
    d[2] = (uint8_t)img_clamp((int)(s[2] * f), 0, 255);
    if(src->channels == 4) {
      d[3] = s[3];
    }
  }
  return out;
}
