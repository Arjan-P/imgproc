#include "imgproc.h"
#include <stdlib.h>
#include <string.h>

Image* img_create(int w, int h, int ch) {
  Image* img = (Image*)malloc(sizeof(Image));
  if(!img) return NULL;

  img->w = w;
  img->h = h;
  img->channels = ch;

  img->data = (uint8_t*)malloc(img_size(img));
  if(!img->data) {
    free(img);
    return NULL;
  }

  return img;
}

Image* img_from_ptr(uint8_t* px, int w, int h, int ch) {
  Image* img = img_create(w, h, ch);
  memcpy(img->data, px, img_size(img));
  return img;
}

void img_free(Image* img) {
  if (!img) return;
  free(img->data);
  free(img);
}
