import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  type NodeChange,
  type NodeTypes,
  applyNodeChanges,
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

export function PipelineGraph() {
  const ops = usePipelineStore((s) => s.ops);
  const reorderOps = usePipelineStore((s) => s.reorderOps);
  const removeOp = usePipelineStore((s) => s.removeOp);

  const nodes = useMemo(() => opsToNodes(ops), [ops]);
  const edges = useMemo(() => opsToEdges(ops), [ops]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Delete key removes op from store
      changes.filter((c) => c.type === "remove").forEach((c) => removeOp(c.id));
      // Drag-end reorders by Y position
      if (changes.some((c) => c.type === "position" && !c.dragging)) {
        reorderOps(nodesToOpOrder(applyNodeChanges(changes, nodes)));
      }
    },
    [nodes, reorderOps, removeOp],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      deleteKeyCode={["Backspace", "Delete"]}
      nodesConnectable={false}
      connectOnClick={false}
      className="rounded-lg"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={16}
        size={1}
        color="hsl(var(--border))"
      />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
