CC      = emcc
CFLAGS  = -O3 -I vendor/
SRCS    = src/memory.c src/resize.c
OUT     = dist/imgproc

EXPORTS = '["_img_create","_img_from_ptr","_img_free","_img_resize","_malloc","_free"]'

RUNTIME = '["ccall","cwrap","getValue"]'

all: dist/imgproc.wasm

dist/:
	mkdir -p dist

dist/imgproc.wasm: $(SRCS) src/imgproc.h | dist/
	$(CC) $(CFLAGS) $(SRCS) \
	  -s WASM=1 \
	  -s EXPORTED_FUNCTIONS=$(EXPORTS) \
	  -s EXPORTED_RUNTIME_METHODS=$(RUNTIME) \
	  -s ALLOW_MEMORY_GROWTH=1 \
	  -s MAXIMUM_MEMORY=256MB \
	  -s NO_FILESYSTEM=1 \
	  -s MODULARIZE=1 \
	  -s EXPORT_ES6=1 \
	  -s EXPORT_NAME=ImgProcModule \
	  --no-entry \
	  -o $(OUT).js

clean:
	rm -rf dist/
