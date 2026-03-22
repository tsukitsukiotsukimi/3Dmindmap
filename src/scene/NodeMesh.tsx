import { useRef, useState, useCallback } from 'react'
import { Billboard, Text } from '@react-three/drei'
import type { Mesh } from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import type { MindMapNode } from '../types/mindmap'

type NodeMeshProps = {
  node: MindMapNode
  isSelected: boolean
  isRoot: boolean
  onSelect: (id: string) => void
  onDoubleClick: (id: string) => void
}

export function NodeMesh({
  node,
  isSelected,
  isRoot,
  onSelect,
  onDoubleClick,
}: NodeMeshProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const size = isRoot ? 1.0 : 0.6
  const emissiveIntensity = isSelected ? 0.6 : hovered ? 0.3 : 0

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      onSelect(node.id)
    },
    [node.id, onSelect],
  )

  const handleDoubleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      onDoubleClick(node.id)
    },
    [node.id, onDoubleClick],
  )

  return (
    <group position={[node.position.x, node.position.y, node.position.z]}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {isSelected && (
        <mesh>
          <ringGeometry args={[size + 0.2, size + 0.35, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      )}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, size + 0.6, 0]}
          fontSize={isRoot ? 0.6 : 0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.04}
          outlineColor="#000000"
          maxWidth={6}
        >
          {node.label}
        </Text>
      </Billboard>
    </group>
  )
}
