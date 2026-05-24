import { ReactFlowProvider } from "@xyflow/react";

import { DropZone } from "@/features/upload/components/DropZone";

import {
  Canvas,
  PipelineWorkspace,
  OpToolbar,
  usePipelineStore,
} from "@/features/pipeline";

export function WorkspaceShell() {
  const source = usePipelineStore((s) => s.source);

  return (
    <ReactFlowProvider>
      <div className="h-screen grid grid-rows-[auto_1fr]">
        <div className="border-b border-border px-4 py-2 flex items-center gap-4">
          <span className="font-mono text-sm font-medium">imgproc</span>

          {source && (
            <span className="text-xs text-muted-foreground">
              {source.width}×{source.height}
            </span>
          )}
        </div>

        <div
          className="grid overflow-hidden"
          style={{
            gridTemplateColumns: source ? "220px 1fr 1fr" : "1fr",
          }}
        >
          <div className="border-r border-border flex flex-col gap-3 p-3 overflow-y-auto">
            <DropZone />
            {source && <OpToolbar />}
          </div>

          {source && (
            <>
              <div className="border-r border-border overflow-hidden">
                <PipelineWorkspace />
              </div>

              <div className="overflow-auto p-4">
                <Canvas />
              </div>
            </>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}
