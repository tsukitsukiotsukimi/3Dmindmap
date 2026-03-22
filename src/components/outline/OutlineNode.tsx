import { useCallback } from 'react'
import type { MindMapNode } from '../../types/mindmap'
import { useMindMapStore } from '../../store/useMindMapStore'

type OutlineNodeProps = {
  node: MindMapNode
  nodes: Record<string, MindMapNode>
  selectedNodeId: string | null
  depth: number
}

export function OutlineNode({
  node,
  nodes,
  selectedNodeId,
  depth,
}: OutlineNodeProps) {
  const selectNode = useMindMapStore((s) => s.selectNode)
  const toggleCollapse = useMindMapStore((s) => s.toggleCollapse)
  const setFocusedNode = useMindMapStore((s) => s.setFocusedNode)

  const isSelected = node.id === selectedNodeId
  const hasChildren = node.childIds.length > 0

  const handleClick = useCallback(() => {
    selectNode(node.id)
  }, [selectNode, node.id])

  const handleDoubleClick = useCallback(() => {
    setFocusedNode(node.id)
  }, [setFocusedNode, node.id])

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      toggleCollapse(node.id)
    },
    [toggleCollapse, node.id],
  )

  return (
    <div className="outline-node">
      <div
        className={`outline-node-row ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {hasChildren ? (
          <span className="outline-toggle" onClick={handleToggle}>
            {node.collapsed ? '▸' : '▾'}
          </span>
        ) : (
          <span className="outline-toggle-placeholder">·</span>
        )}
        <span
          className="outline-color-dot"
          style={{ backgroundColor: node.color }}
        />
        <span className="outline-label">{node.label}</span>
      </div>
      {hasChildren && !node.collapsed && (
        <div className="outline-children">
          {node.childIds.map((childId) => {
            const child = nodes[childId]
            if (!child) return null
            return (
              <OutlineNode
                key={childId}
                node={child}
                nodes={nodes}
                selectedNodeId={selectedNodeId}
                depth={depth + 1}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
