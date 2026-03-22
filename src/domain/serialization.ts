import { z } from 'zod'
import type { MindMapDocument } from '../types/mindmap'

const Position3DSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
})

const MindMapNodeSchema = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  childIds: z.array(z.string()),
  label: z.string(),
  note: z.string().default(''),
  color: z.string().default('#4a90d9'),
  tags: z.array(z.string()).default([]),
  position: Position3DSchema,
  collapsed: z.boolean().default(false),
  pinned: z.boolean().default(false),
  createdAt: z.number(),
  updatedAt: z.number(),
})

const MindMapDocumentSchema = z.object({
  version: z.literal('1.0'),
  rootNodeId: z.string(),
  nodes: z.record(z.string(), MindMapNodeSchema),
  meta: z.object({
    title: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
  }),
})

export function validateDocument(
  data: unknown,
): { success: true; data: MindMapDocument } | { success: false; error: string } {
  const result = MindMapDocumentSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data as MindMapDocument }
  }
  return {
    success: false,
    error: result.error.issues.map((i) => i.message).join(', '),
  }
}

export function serializeDocument(doc: MindMapDocument): string {
  return JSON.stringify(doc, null, 2)
}

export function deserializeDocument(
  json: string,
): { success: true; data: MindMapDocument } | { success: false; error: string } {
  try {
    const parsed: unknown = JSON.parse(json)
    return validateDocument(parsed)
  } catch {
    return { success: false, error: 'Invalid JSON format' }
  }
}
