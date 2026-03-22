import type { MindMapDocument, MindMapNode, Position3D } from '../types/mindmap'

function countVisibleDescendants(
  nodes: Record<string, MindMapNode>,
  nodeId: string,
): number {
  const node = nodes[nodeId]
  if (!node || node.collapsed) return 0
  let count = node.childIds.length
  for (const childId of node.childIds) {
    count += countVisibleDescendants(nodes, childId)
  }
  return count
}

export function computeRadialLayout(doc: MindMapDocument): Record<string, Position3D> {
  const positions: Record<string, Position3D> = {}
  const { nodes, rootNodeId } = doc

  const root = nodes[rootNodeId]
  if (!root) return positions

  positions[rootNodeId] = { x: 0, y: 0, z: 0 }

  function place(
    nodeId: string,
    depth: number,
    startAngle: number,
    endAngle: number,
  ): void {
    const node = nodes[nodeId]
    if (!node || node.collapsed) return

    const children = node.childIds.filter((id) => nodes[id])
    if (children.length === 0) return

    const radius = 8 + depth * 7
    const yOffset = -(depth + 1) * 3

    const weights = children.map(
      (id) => 1 + countVisibleDescendants(nodes, id),
    )
    const totalWeight = weights.reduce((a, b) => a + b, 0)

    let currentAngle = startAngle
    children.forEach((childId, i) => {
      const angleSpan =
        ((endAngle - startAngle) * weights[i]) / totalWeight
      const angle = currentAngle + angleSpan / 2

      positions[childId] = {
        x: Math.cos(angle) * radius,
        y: yOffset,
        z: Math.sin(angle) * radius,
      }

      place(childId, depth + 1, currentAngle, currentAngle + angleSpan)
      currentAngle += angleSpan
    })
  }

  place(rootNodeId, 0, 0, Math.PI * 2)
  return positions
}
