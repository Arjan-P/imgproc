/// <reference no-default-lib="true"/>
/// <reference lib="ES2022" />
/// <reference lib="WebWorker" />

import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { BackgroundSyncPlugin } from "workbox-background-sync";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
self.skipWaiting();

// Vite injects the precache manifest here — includes imgproc.wasm
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// WASM binary: cache-first, long TTL (it's content-addressed by hash)
registerRoute(
  ({ url }) => url.pathname.endsWith(".wasm"),
  new CacheFirst({
    cacheName: "wasm-bin",
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  }),
);

// API requests: network-first, queue when offline
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 5,
    plugins: [
      new BackgroundSyncPlugin("api-queue", {
        maxRetentionTime: 24 * 60,
      }),
    ],
  }),
);
