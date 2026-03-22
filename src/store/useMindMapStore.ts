import { create } from 'zustand'
import type { MindMapDocument, MindMapNode } from '../types/mindmap'
import { createNode } from '../domain/nodeOps'
import { getDescendantIds } from '../domain/treeOps'
import { computeRadialLayout } from '../domain/layout'
import { sampleDocument } from '../data/sampleDocument'
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage'
import { debounce } from '../utils/debounce'

export type MindMapState = {
  document: MindMapDocument
  selectedNodeId: string | null
  searchQuery: string
  focusedNodeId: string | null

  selectNode: (id: string | null) => void
  addChild: (parentId: string) => void
  addSibling: (nodeId: string) => void
  updateNode: (id: string, patch: Partial<MindMapNode>) => void
  deleteNode: (id: string) => void
  toggleCollapse: (id: string) => void
  autoLayout: () => void
  setSearchQuery: (query: string) => void
  setFocusedNode: (id: string | null) => void

  importDocument: (doc: MindMapDocument) => void
  exportDocument: () => MindMapDocument
  newDocument: () => void
}

const debouncedSave = debounce((doc: MindMapDocument) => {
  saveToLocalStorage(doc)
}, 500)

function getInitialDocument(): MindMapDocument {
  const saved = loadFromLocalStorage()
  if (saved && saved.version === '1.0' && saved.rootNodeId && saved.nodes) {
    return saved
  }
  return sampleDocument
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  document: getInitialDocument(),
  selectedNodeId: null,
  searchQuery: '',
  focusedNodeId: null,

  selectNode: (id) => set({ selectedNodeId: id }),

  addChild: (parentId) => {
    const state = get()
    const parent = state.document.nodes[parentId]
    if (!parent) return

    const child = createNode(parentId, 'New Node')
    const now = Date.now()

    const newNodes = { ...state.document.nodes }
    newNodes[parent.id] = {
      ...parent,
      childIds: [...parent.childIds, child.id],
      collapsed: false,
      updatedAt: now,
    }
    newNodes[child.id] = child

    const newDoc: MindMapDocument = {
      ...state.document,
      nodes: newNodes,
      meta: { ...state.document.meta, updatedAt: now },
    }

    set({ document: newDoc, selectedNodeId: child.id })
    debouncedSave(newDoc)
  },

  addSibling: (nodeId) => {
    const state = get()
    const node = state.document.nodes[nodeId]
    if (!node || !node.parentId) return

    const parent = state.document.nodes[node.parentId]
    if (!parent) return

    const sibling = createNode(parent.id, 'New Node')
    const now = Date.now()

    const newNodes = { ...state.document.nodes }
    const idx = parent.childIds.indexOf(nodeId)
    const newChildIds = [...parent.childIds]
    newChildIds.splice(idx + 1, 0, sibling.id)

    newNodes[parent.id] = {
      ...parent,
      childIds: newChildIds,
      updatedAt: now,
    }
    newNodes[sibling.id] = sibling

    const newDoc: MindMapDocument = {
      ...state.document,
      nodes: newNodes,
      meta: { ...state.document.meta, updatedAt: now },
    }

    set({ document: newDoc, selectedNodeId: sibling.id })
    debouncedSave(newDoc)
  },

  updateNode: (id, patch) => {
    const state = get()
    const node = state.document.nodes[id]
    if (!node) return

    const now = Date.now()
    const newNodes = { ...state.document.nodes }
    newNodes[id] = { ...node, ...patch, updatedAt: now }

    const newDoc: MindMapDocument = {
      ...state.document,
      nodes: newNodes,
      meta: { ...state.document.meta, updatedAt: now },
    }

    set({ document: newDoc })
    debouncedSave(newDoc)
  },

  deleteNode: (id) => {
    const state = get()
    const node = state.document.nodes[id]
    if (!node || !node.parentId) return

    const descendantIds = getDescendantIds(state.document.nodes, id)
    const idsToRemove = new Set([id, ...descendantIds])

    const parent = state.document.nodes[node.parentId]
    if (!parent) return

    const now = Date.now()
    const newNodes = { ...state.document.nodes }

    newNodes[parent.id] = {
      ...parent,
      childIds: parent.childIds.filter((cid) => cid !== id),
      updatedAt: now,
    }

    for (const rid of idsToRemove) {
      delete newNodes[rid]
    }

    const newDoc: MindMapDocument = {
      ...state.document,
      nodes: newNodes,
      meta: { ...state.document.meta, updatedAt: now },
    }

    set({
      document: newDoc,
      selectedNodeId:
        state.selectedNodeId && idsToRemove.has(state.selectedNodeId)
          ? null
          : state.selectedNodeId,
    })
    debouncedSave(newDoc)
  },

  toggleCollapse: (id) => {
    const state = get()
    const node = state.document.nodes[id]
    if (!node) return

    const now = Date.now()
    const newNodes = { ...state.document.nodes }
    newNodes[id] = { ...node, collapsed: !node.collapsed, updatedAt: now }

    const newDoc: MindMapDocument = {
      ...state.document,
      nodes: newNodes,
      meta: { ...state.document.meta, updatedAt: now },
    }

    set({ document: newDoc })
    debouncedSave(newDoc)
  },

  autoLayout: () => {
    const state = get()
    const positions = computeRadialLayout(state.document)
    const now = Date.now()
    const newNodes = { ...state.document.nodes }

    for (const [id, pos] of Object.entries(positions)) {
      if (newNodes[id]) {
        newNodes[id] = { ...newNodes[id], position: pos, updatedAt: now }
      }
    }

    const newDoc: MindMapDocument = {
      ...state.document,
      nodes: newNodes,
      meta: { ...state.document.meta, updatedAt: now },
    }

    set({ document: newDoc })
    debouncedSave(newDoc)
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFocusedNode: (id) => set({ focusedNodeId: id }),

  importDocument: (doc) => {
    set({ document: doc, selectedNodeId: null, focusedNodeId: null })
    saveToLocalStorage(doc)
  },

  exportDocument: () => get().document,

  newDocument: () => {
    const now = Date.now()
    const rootNode = createNode(null, 'New Mind Map')
    const doc: MindMapDocument = {
      version: '1.0',
      rootNodeId: rootNode.id,
      nodes: { [rootNode.id]: rootNode },
      meta: { title: 'New Mind Map', createdAt: now, updatedAt: now },
    }
    set({ document: doc, selectedNodeId: null, focusedNodeId: null })
    saveToLocalStorage(doc)
  },
}))
