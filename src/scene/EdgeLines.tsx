import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import type { MindMapNode } from '../types/mindmap'
import type { VisibleEdge } from '../domain/visibility'

type EdgeLinesProps = {
  edges: VisibleEdge[]
  nodes: Record<string, MindMapNode>
}

export function EdgeLines({ edges, nodes }: EdgeLinesProps) {
  const lines = useMemo(() => {
    return edges
      .map((edge) => {
        const from = nodes[edge.from]
        const to = nodes[edge.to]
        if (!from || !to) return null
        return {
          key: `${edge.from}-${edge.to}`,
          points: [
            [from.position.x, from.position.y, from.position.z] as [number, number, number],
            [to.position.x, to.position.y, to.position.z] as [number, number, number],
          ],
          color: to.color,
        }
      })
      .filter(Boolean) as {
      key: string
      points: [[number, number, number], [number, number, number]]
      color: string
    }[]
  }, [edges, nodes])

  return (
    <>
      {lines.map((line) => (
        <Line
          key={line.key}
          points={line.points}
          color={line.color}
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      ))}
    </>
  )
}
