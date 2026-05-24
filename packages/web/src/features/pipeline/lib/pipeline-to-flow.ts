import type { Node, Edge } from "@xyflow/react";
import type { PipelineOp } from "../store/pipeline.store.js";

export const SOURCE_NODE_ID = "__source__";
export const SINK_NODE_ID = "__sink__";

// Vertical spacing between nodes in the linear layout
const NODE_HEIGHT = 80;
const NODE_GAP = 40;
const NODE_WIDTH = 260;
const X = 0;

export function opsToNodes(ops: PipelineOp[]): Node[] {
  const step = NODE_HEIGHT + NODE_GAP;

  const sourceNode: Node = {
    id: SOURCE_NODE_ID,
    type: "sourceNode",
    position: { x: X, y: 0 },
    data: {},
    deletable: false,
    draggable: false,
    width: NODE_WIDTH,
  };

  const opNodes: Node[] = ops.map((op, i) => ({
    id: op.id,
    type: "opNode",
    position: { x: X, y: step * (i + 1) },
    data: { op },
    width: NODE_WIDTH,
  }));

  const sinkNode: Node = {
    id: SINK_NODE_ID,
    type: "sinkNode",
    position: { x: X, y: step * (ops.length + 1) },
    data: {},
    deletable: false,
    draggable: false,
    width: NODE_WIDTH,
  };

  return [sourceNode, ...opNodes, sinkNode];
}

export function opsToEdges(ops: PipelineOp[]): Edge[] {
  const ids = [SOURCE_NODE_ID, ...ops.map((o) => o.id), SINK_NODE_ID];
  return ids.slice(0, -1).map((id, i) => ({
    id: `${id}->${ids[i + 1]}`,
    source: id,
    target: ids[i + 1],
    type: "smoothstep",
    animated: false,
  }));
}

// Given a drag-reordered node list, return the new op order by Y position
export function nodesToOpOrder(nodes: Node[]): string[] {
  return nodes
    .filter((n) => n.id !== SOURCE_NODE_ID && n.id !== SINK_NODE_ID)
    .sort((a, b) => a.position.y - b.position.y)
    .map((n) => n.id);
}
