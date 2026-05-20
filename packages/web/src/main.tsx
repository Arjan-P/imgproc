import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App.js";
import { initServiceWorker } from "./lib/register-sw.js";

initServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
