import { registerSW } from "virtual:pwa-register";

export function initServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  registerSW({
    onRegistered(r) {
      console.info("SW registered", r);
    },
    onRegisterError(e) {
      console.error("SW registration failed", e);
    },
    onNeedRefresh() {
      // new version deployed — prompt user to refresh
      console.info("New content available");
    },
  });
}
