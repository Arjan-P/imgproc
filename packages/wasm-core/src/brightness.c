#include "imgproc.h"

int clamp(int val, int min, int max) {
  if (val > max) {
    return max;
  }
  if ( val < min ) {
    return min;
  }
  return val;
}

Image* img_brightness(Image* src, int delta) {
  Image* out = img_create(src->w, src->h, src->channels);
  if(!out) return NULL;
  for(size_t i = 0; i < (size_t)(src->w * src->h); i++) {
    uint8_t* s = src->data + i * src->channels;
    uint8_t* d = out->data + i * out->channels; 
    d[0] = clamp(s[0] + delta, 0, 255);
    d[1] = clamp(s[1] + delta, 0, 255);
    d[2] = clamp(s[2] + delta, 0, 255);
    if(src->channels == 4) {
      d[3] = s[3];
    }
  }
  return out;
}
