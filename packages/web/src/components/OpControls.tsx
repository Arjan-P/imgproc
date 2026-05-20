import { type PipelineOp } from "../store/pipeline.store.js";
import { type OpParams, type Op } from "@imgproc/shared";
import { useDebounced } from "../hooks/useDebounced.js";
import { useEffect, useState } from "react";

interface Props {
  op: PipelineOp;
  onUpdate: <K extends Op["type"]>(p: OpParams<K>) => void;
}

export function OpControls({ op, onUpdate }: Props) {
  if (op.type === "grayscale" || op.type === "invert") {
    return (
      <p style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
        no parameters
      </p>
    );
  }
  if (op.type === "resize")
    return <ResizeControls op={op} onUpdate={onUpdate} />;
  return null;
}

function ResizeControls({ op, onUpdate }: Props) {
  // local slider state — debounced before hitting the store
  const [nw, setNw] = useState(op.type === "resize" ? op.nw : 800);
  const [nh, setNh] = useState(op.type === "resize" ? op.nh : 600);
  const dNw = useDebounced(nw);
  const dNh = useDebounced(nh);

  useEffect(() => {
    onUpdate({ nw: dNw, nh: dNh });
  }, [dNw, dNh]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <label
          style={{
            fontSize: "11px",
            color: "var(--color-text-secondary)",
            width: "28px",
          }}
        >
          W
        </label>
        <input
          type="range"
          min="16"
          max="2048"
          step="1"
          value={nw}
          onChange={(e) => setNw(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span
          style={{
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-secondary)",
            minWidth: "38px",
            textAlign: "right",
          }}
        >
          {nw}px
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <label
          style={{
            fontSize: "11px",
            color: "var(--color-text-secondary)",
            width: "28px",
          }}
        >
          H
        </label>
        <input
          type="range"
          min="16"
          max="2048"
          step="1"
          value={nh}
          onChange={(e) => setNh(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span
          style={{
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-secondary)",
            minWidth: "38px",
            textAlign: "right",
          }}
        >
          {nh}px
        </span>
      </div>
    </div>
  );
}
