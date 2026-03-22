import { Canvas } from '@react-three/fiber'
import { useCallback, useMemo, Suspense, useState } from 'react'
import { useMindMapStore } from '../store/useMindMapStore'
import { getVisibleNodes, getVisibleEdges } from '../domain/visibility'
import { NodeMesh } from './NodeMesh'
import { EdgeLines } from './EdgeLines'
import { SceneLights } from './SceneLights'
import { CameraController } from './CameraController'
import { SceneGrid } from './helpers/Grid'

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#4a90d9" wireframe />
    </mesh>
  )
}

export function MindMapScene() {
  const doc = useMindMapStore((s) => s.document)
  const selectedNodeId = useMindMapStore((s) => s.selectedNodeId)
  const focusedNodeId = useMindMapStore((s) => s.focusedNodeId)
  const selectNode = useMindMapStore((s) => s.selectNode)
  const setFocusedNode = useMindMapStore((s) => s.setFocusedNode)
  const [glError, setGlError] = useState<string | null>(null)

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

  if (glError) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a2e',
          color: '#e0e0e0',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ color: '#e74c3c' }}>WebGL の初期化に失敗しました</div>
        <div style={{ fontSize: '12px', color: '#a0a0b0' }}>{glError}</div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [15, 15, 15], fov: 60 }}
        onPointerMissed={handleCanvasClick}
        style={{ background: '#1a1a2e' }}
        fallback={
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1a1a2e',
              color: '#a0a0b0',
              fontSize: '14px',
            }}
          >
            WebGL がサポートされていません
          </div>
        }
        onCreated={(state) => {
          const gl = state.gl
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            setGlError('WebGL コンテキストが失われました。ページを再読み込みしてください。')
          })
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
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
