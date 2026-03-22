import type { MindMapDocument, MindMapNode } from '../types/mindmap'
import { getVisibleNodeIds } from './treeOps'

export type VisibleEdge = {
  from: string
  to: string
}

export function getVisibleNodes(doc: MindMapDocument): MindMapNode[] {
  const ids = getVisibleNodeIds(doc)
  return Array.from(ids)
    .map((id) => doc.nodes[id])
    .filter(Boolean)
}

export function getVisibleEdges(doc: MindMapDocument): VisibleEdge[] {
  const ids = getVisibleNodeIds(doc)
  const edges: VisibleEdge[] = []
  for (const id of ids) {
    const node = doc.nodes[id]
    if (node?.parentId && ids.has(node.parentId)) {
      edges.push({ from: node.parentId, to: id })
    }
  }
  return edges
}
