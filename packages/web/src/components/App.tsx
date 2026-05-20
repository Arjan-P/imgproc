import { DropZone } from "./DropZone.js";
import { Canvas } from "./Canvas.js";
import { PipelinePanel } from "./PipelinePanel.js";
import { usePipelineStore } from "../store/pipeline.store.js";

export function App() {
  const source = usePipelineStore((s) => s.source);

  return (
    <div
      style={{
        padding: "24px",
        display: "grid",
        gridTemplateColumns: source ? "1fr 280px" : "1fr",
        gap: "20px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <DropZone />
        <Canvas />
      </div>
      {source && <PipelinePanel />}
    </div>
  );
}
