import { useMindMapStore } from '../../store/useMindMapStore'
import { OutlineNode } from './OutlineNode'

export function OutlineTree() {
  const doc = useMindMapStore((s) => s.document)
  const selectedNodeId = useMindMapStore((s) => s.selectedNodeId)
  const searchQuery = useMindMapStore((s) => s.searchQuery)
  const setSearchQuery = useMindMapStore((s) => s.setSearchQuery)

  const root = doc.nodes[doc.rootNodeId]
  if (!root) return null

  return (
    <div className="outline-panel">
      <div className="outline-header">
        <input
          className="search-input"
          type="text"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="outline-tree">
        <OutlineNode
          node={root}
          nodes={doc.nodes}
          selectedNodeId={selectedNodeId}
          depth={0}
        />
      </div>
    </div>
  )
}
