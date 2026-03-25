import { create } from 'zustand'
import type { SpriteState } from '@/types/api'

// ==================== Runtime Store Types ====================
// Runtime context: sprite state, identity, snapshot (from Phase 6-11 APIs)

export interface RuntimeState {
  spriteState: SpriteState | null
  isLoading: boolean
  error: string | null
  lastFetchTime: string | null
}

interface RuntimeStore {
  // State
  state: RuntimeState

  // Actions
  setSpriteState: (state: SpriteState) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearRuntime: () => void

  // Computed helpers
  isRunning: () => boolean
  getSpriteName: () => string
  getSpriteEmoji: () => string
}

export const useRuntimeStore = create<RuntimeStore>((set, get) => ({
  state: {
    spriteState: null,
    isLoading: false,
    error: null,
    lastFetchTime: null,
  },

  setSpriteState: (spriteState) =>
    set((s) => ({
      state: { ...s.state, spriteState, error: null, lastFetchTime: new Date().toISOString() },
    })),

  setLoading: (isLoading) =>
    set((s) => ({ state: { ...s.state, isLoading } })),

  setError: (error) =>
    set((s) => ({ state: { ...s.state, error, isLoading: false } })),

  clearRuntime: () =>
    set(() => ({
      state: {
        spriteState: null,
        isLoading: false,
        error: null,
        lastFetchTime: null,
      },
    })),

  isRunning: () => get().state.spriteState?.isRunning ?? false,

  getSpriteName: () => get().state.spriteState?.identity.name ?? 'Unknown',

  getSpriteEmoji: () => get().state.spriteState?.identity.emoji ?? '?',
}))
