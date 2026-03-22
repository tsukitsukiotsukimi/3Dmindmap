import { useMindMapStore } from '../../store/useMindMapStore'

export function NodeInspector() {
  const doc = useMindMapStore((s) => s.document)
  const selectedNodeId = useMindMapStore((s) => s.selectedNodeId)
  const updateNode = useMindMapStore((s) => s.updateNode)
  const addChild = useMindMapStore((s) => s.addChild)
  const addSibling = useMindMapStore((s) => s.addSibling)
  const deleteNode = useMindMapStore((s) => s.deleteNode)
  const toggleCollapse = useMindMapStore((s) => s.toggleCollapse)
  const setFocusedNode = useMindMapStore((s) => s.setFocusedNode)

  const node = selectedNodeId ? doc.nodes[selectedNodeId] : null
  const isRoot = selectedNodeId === doc.rootNodeId

  if (!node) {
    return (
      <div className="inspector-panel">
        <div className="inspector-empty">
          Select a node to inspect
        </div>
      </div>
    )
  }

  return (
    <div className="inspector-panel">
      <div className="inspector-section">
        <label className="inspector-label">Label</label>
        <input
          className="inspector-input"
          type="text"
          value={node.label}
          onChange={(e) => updateNode(node.id, { label: e.target.value })}
        />
      </div>

      <div className="inspector-section">
        <label className="inspector-label">Note</label>
        <textarea
          className="inspector-textarea"
          value={node.note}
          onChange={(e) => updateNode(node.id, { note: e.target.value })}
          rows={3}
        />
      </div>

      <div className="inspector-section">
        <label className="inspector-label">Color</label>
        <input
          className="inspector-color"
          type="color"
          value={node.color}
          onChange={(e) => updateNode(node.id, { color: e.target.value })}
        />
      </div>

      <div className="inspector-section">
        <label className="inspector-label">Tags (comma separated)</label>
        <input
          className="inspector-input"
          type="text"
          value={node.tags.join(', ')}
          onChange={(e) =>
            updateNode(node.id, {
              tags: e.target.value
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
        />
      </div>

      <div className="inspector-actions">
        <button onClick={() => addChild(node.id)}>Add Child</button>
        {!isRoot && (
          <button onClick={() => addSibling(node.id)}>Add Sibling</button>
        )}
        {node.childIds.length > 0 && (
          <button onClick={() => toggleCollapse(node.id)}>
            {node.collapsed ? 'Expand' : 'Collapse'}
          </button>
        )}
        <button onClick={() => setFocusedNode(node.id)}>Focus</button>
        {!isRoot && (
          <button
            className="btn-danger"
            onClick={() => deleteNode(node.id)}
          >
            Delete
          </button>
        )}
      </div>

      <div className="inspector-info">
        <div>Children: {node.childIds.length}</div>
        <div>ID: {node.id.slice(0, 8)}</div>
      </div>
    </div>
  )
}
