#pragma once
#include <stddef.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
  uint8_t *data;
  int      w, h, channels;
} Image;

static inline size_t img_size(const Image* img) {
  return (size_t)img->w * img->h * img->channels;
}

static inline int img_clamp(int val, int min, int max) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

Image* img_create(int w, int h, int ch);
Image* img_from_ptr(uint8_t* px, int w, int h, int ch);
void   img_free(Image* img);

Image* img_resize(const Image* src, int new_w, int new_h);
Image* img_invert(const Image* src);
Image* img_grayscale(const Image* src);
Image* img_brightness(const Image* src, int delta);
Image* img_flip_horizontal(const Image* src);
Image* img_flip_vertical(const Image* src);
