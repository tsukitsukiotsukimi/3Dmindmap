export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} />
      <directionalLight position={[-10, -10, -10]} intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.4} />
    </>
  )
}
