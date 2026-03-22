import { useRef, useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MindMapNode } from '../types/mindmap'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

type CameraControllerProps = {
  focusedNode: MindMapNode | null
}

export function CameraController({ focusedNode }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()

  useEffect(() => {
    if (!focusedNode || !controlsRef.current) return

    const target = new THREE.Vector3(
      focusedNode.position.x,
      focusedNode.position.y,
      focusedNode.position.z,
    )

    const offset = new THREE.Vector3(5, 5, 5)
    const newCamPos = target.clone().add(offset)

    const startPos = camera.position.clone()
    const startTarget = controlsRef.current.target.clone()
    const duration = 600
    const startTime = Date.now()

    function animate() {
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)

      camera.position.lerpVectors(startPos, newCamPos, ease)
      controlsRef.current!.target.lerpVectors(startTarget, target, ease)
      controlsRef.current!.update()

      if (t < 1) requestAnimationFrame(animate)
    }

    animate()
  }, [focusedNode, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.1}
      minDistance={3}
      maxDistance={100}
    />
  )
}
