import type { MindMapDocument, MindMapNode } from '../types/mindmap'

export function getDescendantIds(
  nodes: Record<string, MindMapNode>,
  nodeId: string,
): string[] {
  const result: string[] = []
  const stack = [nodeId]
  while (stack.length > 0) {
    const id = stack.pop()!
    const node = nodes[id]
    if (!node) continue
    for (const childId of node.childIds) {
      result.push(childId)
      stack.push(childId)
    }
  }
  return result
}

export function getVisibleNodeIds(doc: MindMapDocument): Set<string> {
  const visible = new Set<string>()
  const stack = [doc.rootNodeId]
  while (stack.length > 0) {
    const id = stack.pop()!
    const node = doc.nodes[id]
    if (!node) continue
    visible.add(id)
    if (!node.collapsed) {
      for (const childId of node.childIds) {
        stack.push(childId)
      }
    }
  }
  return visible
}

export function getDepth(
  nodes: Record<string, MindMapNode>,
  nodeId: string,
): number {
  let depth = 0
  let current = nodes[nodeId]
  while (current?.parentId) {
    depth++
    current = nodes[current.parentId]
  }
  return depth
}

export function getAncestorIds(
  nodes: Record<string, MindMapNode>,
  nodeId: string,
): string[] {
  const result: string[] = []
  let current = nodes[nodeId]
  while (current?.parentId) {
    result.push(current.parentId)
    current = nodes[current.parentId]
  }
  return result
}
