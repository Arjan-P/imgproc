import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type NodeChange,
  type NodeTypes,
  applyNodeChanges,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { usePipelineStore } from "../../store/pipeline.store.js";
import {
  opsToNodes,
  opsToEdges,
  nodesToOpOrder,
} from "../../lib/pipeline-to-flow.js";
import { OpNode } from "./OpNode.js";
import { SourceNode } from "./SourceNode.js";
import { SinkNode } from "./SinkNode.js";

const nodeTypes: NodeTypes = {
  opNode: OpNode,
  sourceNode: SourceNode,
  sinkNode: SinkNode,
};

export function PipelineWorkspace() {
  const ops = usePipelineStore((s) => s.ops);
  const reorderOps = usePipelineStore((s) => s.reorderOps);
  const removeOp = usePipelineStore((s) => s.removeOp);

  // derive nodes + edges from store — always in sync
  const nodes = useMemo(() => opsToNodes(ops), [ops]);
  const edges = useMemo(() => opsToEdges(ops), [ops]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // handle deletes from keyboard (Delete/Backspace on selected node)
      for (const change of changes) {
        if (change.type === "remove") removeOp(change.id);
      }

      // handle drag-to-reorder: when a node stops being dragged, re-sort by Y
      const hasDragEnd = changes.some(
        (c) => c.type === "position" && !c.dragging,
      );
      if (hasDragEnd) {
        // apply position changes to get updated Y values
        const updated = applyNodeChanges(changes, nodes);
        const newOrder = nodesToOpOrder(updated);
        reorderOps(newOrder);
      }
    },
    [nodes, reorderOps, removeOp],
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        deleteKeyCode={["Backspace", "Delete"]}
        connectOnClick={false} // prevent manual edge drawing
        nodesConnectable={false} // edges are derived, not user-drawn
        className="rounded-lg border border-border bg-muted/20"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="oklch(0.708 0 0 / 30%)"
        />
        <Controls
          className="!shadow-none !border !border-border !bg-card"
          showInteractive={false}
        />
        <MiniMap
          nodeColor="oklch(0.922 0 0)"
          maskColor="oklch(0.97 0 0 / 70%)"
          className="!border !border-border !bg-card !rounded-md"
        />
      </ReactFlow>
    </div>
  );
}
