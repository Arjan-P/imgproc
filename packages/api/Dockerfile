# Build wasm to obtain build artifacts
FROM emscripten/emsdk:3.1.51 as wasm-build

WORKDIR /wasm

COPY packages/wasm-core/src/ ./src/
COPY packages/wasm-core/vendor/ ./vendor/
COPY packages/wasm-core/Makefile ./Makefile

RUN make -j4

# Build api type script 
FROM node:22-alpine AS ts-build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json     ./packages/shared/
COPY packages/wasm/package.json       ./packages/wasm/
COPY packages/wasm-core/package.json  ./packages/wasm-core/
COPY packages/api/package.json        ./packages/api/

RUN pnpm install --frozen-lockfile --ignore-scripts

# copy source
COPY tsconfig.json ./
COPY packages/shared/   ./packages/shared/
COPY packages/wasm/     ./packages/wasm/
COPY packages/wasm-core/types/ ./packages/wasm-core/types/
COPY packages/api/      ./packages/api/

# get required build files from wasm-core
COPY --from=wasm-build /wasm/dist/ ./packages/wasm-core/dist/

# build shared -> wasm -> api
RUN pnpm --filter @imgproc/shared build
RUN pnpm --filter @imgproc/wasm build
RUN pnpm --filter @imgproc/api build

# production image
FROM node:22-alpine AS prod
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json    ./packages/shared/
COPY packages/wasm/package.json      ./packages/wasm/
COPY packages/wasm-core/package.json ./packages/wasm-core/
COPY packages/api/package.json       ./packages/api/

RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# compiled JS
COPY --from=ts-build /app/packages/shared/dist/    ./packages/shared/dist/
COPY --from=ts-build /app/packages/wasm/dist/      ./packages/wasm/dist/
COPY --from=ts-build /app/packages/api/dist/       ./packages/api/dist/

# WASM binary — needed at runtime by wasm-bridge in Node.js
COPY --from=wasm-build /wasm/dist/ ./packages/wasm-core/dist/

ENV NODE_ENV=prod
EXPOSE 5000

CMD ["node", "packages/api/dist/start.js"]
