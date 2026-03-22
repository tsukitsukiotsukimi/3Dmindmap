import type { MindMapDocument } from '../types/mindmap'

const STORAGE_KEY = 'mindmap-doc'

export function saveToLocalStorage(doc: MindMapDocument): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doc))
  } catch {
    console.warn('Failed to save to localStorage')
  }
}

export function loadFromLocalStorage(): MindMapDocument | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as MindMapDocument
  } catch {
    console.warn('Failed to load from localStorage')
    return null
  }
}

export function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}
