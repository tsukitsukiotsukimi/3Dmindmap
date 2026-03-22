export type Position3D = {
  x: number
  y: number
  z: number
}

export type MindMapNode = {
  id: string
  parentId: string | null
  childIds: string[]
  label: string
  note: string
  color: string
  tags: string[]
  position: Position3D
  collapsed: boolean
  pinned: boolean
  createdAt: number
  updatedAt: number
}

export type MindMapMeta = {
  title: string
  createdAt: number
  updatedAt: number
}

export type MindMapDocument = {
  version: '1.0'
  rootNodeId: string
  nodes: Record<string, MindMapNode>
  meta: MindMapMeta
}
