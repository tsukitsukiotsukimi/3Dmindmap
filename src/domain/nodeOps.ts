import type { MindMapNode, Position3D } from '../types/mindmap'
import { generateId } from '../utils/id'

export function createNode(
  parentId: string | null,
  label: string,
  position: Position3D = { x: 0, y: 0, z: 0 },
): MindMapNode {
  const now = Date.now()
  return {
    id: generateId(),
    parentId,
    childIds: [],
    label,
    note: '',
    color: '#4a90d9',
    tags: [],
    position,
    collapsed: false,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  }
}

export function createRootNode(label = 'Root'): MindMapNode {
  return createNode(null, label, { x: 0, y: 0, z: 0 })
}
