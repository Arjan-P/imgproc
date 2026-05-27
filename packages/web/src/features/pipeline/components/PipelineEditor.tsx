import { usePipelineStore } from "@/features/pipeline";
import { DropZone } from "./DropZone";
import { ImageCanvas } from "./ImageCanvas";
import { OpToolbar } from "./OpToolbar";
import { PipelineGraph } from "./flow/PipelineGraph";
import { SavePipelineButton } from "./SavePipelineButton";
import { ReactFlowProvider } from "@xyflow/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function PipelineEditor() {
  const pipelineName = usePipelineStore((s) => s.name);
  const source = usePipelineStore((s) => s.source);
  return (
    <ReactFlowProvider>
      {/* fill the SidebarInset — it's already h-full from DashboardLayout */}
      <div className="h-full flex flex-col">
        {/* top toolbar strip */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border shrink-0">
          <span className="text-sm font-medium">{pipelineName}</span>
          {source && (
            <span className="text-xs text-muted-foreground font-mono">
              {source.width}×{source.height}
            </span>
          )}
          <div className="ml-auto">
            <SavePipelineButton />
          </div>
        </div>

        {/* main area — resizable 3 panels */}
        <ResizablePanelGroup
          orientation="horizontal"
          className="flex-1 min-h-0"
        >
          {/* left: drop zone + op toolbar */}
          <ResizablePanel defaultSize={"18%"} minSize="15%" maxSize="20%">
            <div className="h-full flex flex-col gap-3 p-3 overflow-y-auto">
              <DropZone />
              {source && <OpToolbar />}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* center: ReactFlow graph */}
          <ResizablePanel defaultSize={"32%"} minSize="30%">
            <div className="h-full">
              <PipelineGraph />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* right: canvas preview */}
          <ResizablePanel defaultSize="45%" minSize="30%">
            <ImageCanvas />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ReactFlowProvider>
  );
}
