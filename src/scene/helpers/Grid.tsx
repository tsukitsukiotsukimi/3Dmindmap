import { Grid as DreiGrid } from '@react-three/drei'

export function SceneGrid() {
  return (
    <DreiGrid
      args={[100, 100]}
      cellSize={2}
      cellColor="#333333"
      sectionSize={10}
      sectionColor="#555555"
      fadeDistance={80}
      fadeStrength={1}
      position={[0, -15, 0]}
    />
  )
}
