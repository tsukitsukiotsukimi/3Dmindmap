import { useMindMapStore } from '../../store/useMindMapStore'

export function StatusBar() {
  const doc = useMindMapStore((s) => s.document)
  const selectedNodeId = useMindMapStore((s) => s.selectedNodeId)

  const nodeCount = Object.keys(doc.nodes).length
  const selectedLabel = selectedNodeId
    ? doc.nodes[selectedNodeId]?.label ?? ''
    : 'None'

  return (
    <div className="statusbar">
      <span>Nodes: {nodeCount}</span>
      <span>Selected: {selectedLabel}</span>
      <span>Click to select · Double-click to focus · Scroll to zoom</span>
    </div>
  )
}
