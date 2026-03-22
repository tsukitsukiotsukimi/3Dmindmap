import { useRef } from 'react'
import { useMindMapStore } from '../../store/useMindMapStore'
import { serializeDocument, deserializeDocument } from '../../domain/serialization'

export function TopBar() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const doc = useMindMapStore((s) => s.document)
  const autoLayout = useMindMapStore((s) => s.autoLayout)
  const importDocument = useMindMapStore((s) => s.importDocument)
  const newDocument = useMindMapStore((s) => s.newDocument)
  const setFocusedNode = useMindMapStore((s) => s.setFocusedNode)

  const handleExport = () => {
    const json = serializeDocument(doc)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.meta.title || 'mindmap'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = deserializeDocument(reader.result as string)
      if (result.success) {
        importDocument(result.data)
      } else {
        alert(`Import failed: ${result.error}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleResetView = () => {
    setFocusedNode(doc.rootNodeId)
  }

  return (
    <div className="topbar">
      <div className="topbar-title">3D MindMap</div>
      <div className="topbar-actions">
        <button onClick={newDocument} title="New Mind Map">New</button>
        <button onClick={handleImport} title="Import JSON">Import</button>
        <button onClick={handleExport} title="Export JSON">Export</button>
        <button onClick={autoLayout} title="Auto Layout">Layout</button>
        <button onClick={handleResetView} title="Reset View">Reset View</button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}
