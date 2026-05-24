import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { initServiceWorker } from "@/lib/register-sw.js";
import "@/styles/index.css";

initServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
