#pragma once
#include <stdint.h>

typedef struct {
  uint8_t *data;
  int      w, h, channels;
} Image;

Image* img_create(int w, int h, int ch);
Image* img_from_ptr(uint8_t* px, int w, int h, int ch);
void   img_free(Image* img);

Image* img_resize(Image* src, int new_w, int new_h);
