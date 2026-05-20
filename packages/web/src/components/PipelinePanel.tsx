import { usePipelineStore, type PipelineOp } from "../store/pipeline.store.js";
import { OpControls } from "./OpControls.js";

export function PipelinePanel() {
  const ops = usePipelineStore((s) => s.ops);
  const source = usePipelineStore((s) => s.source);
  const { addOp, removeOp, moveOp, updateOp } = usePipelineStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {ops.map((op, i) => (
        <div
          key={op.id}
          style={{
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-md)",
            overflow: "hidden",
            background: "var(--color-background-primary)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              background: "var(--color-background-secondary)",
              borderBottom: "0.5px solid var(--color-border-tertiary)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-text-tertiary)",
              }}
            >
              {i + 1}
            </span>
            <span style={{ flex: 1, fontSize: "12px", fontWeight: 500 }}>
              {op.type}
            </span>
            <button
              onClick={() => moveOp(op.id, "up")}
              disabled={i === 0}
              aria-label="move up"
              style={{ fontSize: "11px", padding: "2px 6px" }}
            >
              ↑
            </button>
            <button
              onClick={() => moveOp(op.id, "down")}
              disabled={i === ops.length - 1}
              aria-label="move down"
              style={{ fontSize: "11px", padding: "2px 6px" }}
            >
              ↓
            </button>
            <button
              onClick={() => removeOp(op.id)}
              aria-label="remove op"
              style={{
                fontSize: "11px",
                padding: "2px 6px",
                color: "var(--color-text-danger)",
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ padding: "10px 12px" }}>
            <OpControls
              op={op}
              onUpdate={(params) => updateOp(op.id, params)}
            />
          </div>
        </div>
      ))}

      {source && (
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginTop: "4px",
          }}
        >
          {(["resize", "grayscale", "invert"] as const).map((t) => (
            <button
              key={t}
              onClick={() => addOp(t)}
              style={{ fontSize: "12px", padding: "4px 10px" }}
            >
              + {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
