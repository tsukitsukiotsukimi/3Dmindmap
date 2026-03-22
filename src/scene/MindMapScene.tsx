import { Canvas } from '@react-three/fiber'
import { useCallback, useMemo, Suspense } from 'react'
import { useMindMapStore } from '../store/useMindMapStore'
import { getVisibleNodes, getVisibleEdges } from '../domain/visibility'
import { NodeMesh } from './NodeMesh'
import { EdgeLines } from './EdgeLines'
import { SceneLights } from './SceneLights'
import { CameraController } from './CameraController'
import { SceneGrid } from './helpers/Grid'

export function MindMapScene() {
  const doc = useMindMapStore((s) => s.document)
  const selectedNodeId = useMindMapStore((s) => s.selectedNodeId)
  const focusedNodeId = useMindMapStore((s) => s.focusedNodeId)
  const selectNode = useMindMapStore((s) => s.selectNode)
  const setFocusedNode = useMindMapStore((s) => s.setFocusedNode)

  const visibleNodes = useMemo(() => getVisibleNodes(doc), [doc])
  const visibleEdges = useMemo(() => getVisibleEdges(doc), [doc])
  const focusedNode = focusedNodeId ? doc.nodes[focusedNodeId] ?? null : null

  const handleSelect = useCallback(
    (id: string) => selectNode(id),
    [selectNode],
  )

  const handleDoubleClick = useCallback(
    (id: string) => setFocusedNode(id),
    [setFocusedNode],
  )

  const handleCanvasClick = useCallback(() => {
    selectNode(null)
  }, [selectNode])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [15, 15, 15], fov: 60 }}
        onPointerMissed={handleCanvasClick}
        style={{ background: '#1a1a2e' }}
      >
        <Suspense fallback={null}>
          <SceneLights />
          <CameraController focusedNode={focusedNode} />
          <SceneGrid />
          <EdgeLines edges={visibleEdges} nodes={doc.nodes} />
          {visibleNodes.map((node) => (
            <NodeMesh
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              isRoot={node.id === doc.rootNodeId}
              onSelect={handleSelect}
              onDoubleClick={handleDoubleClick}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  )
}
