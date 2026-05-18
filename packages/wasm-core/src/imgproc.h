#pragma once
#include <stddef.h>
#include <stdint.h>

typedef struct {
  uint8_t *data;
  int      w, h, channels;
} Image;

static inline size_t img_size(const Image* img) {
  return (size_t)img->w * img->h * img->channels;
}

Image* img_create(int w, int h, int ch);
Image* img_from_ptr(uint8_t* px, int w, int h, int ch);
void   img_free(Image* img);

Image* img_resize(Image* src, int new_w, int new_h);
Image* img_invert(Image* src);
Image* img_grayscale(Image* src);
