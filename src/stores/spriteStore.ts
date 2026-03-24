import { create } from 'zustand'
import type { SpriteState } from '@/types/api'

interface SpriteStore {
  spriteState: SpriteState | null
  isLoading: boolean
  error: string | null
  setSpriteState: (state: SpriteState) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useSpriteStore = create<SpriteStore>((set) => ({
  spriteState: null,
  isLoading: false,
  error: null,
  setSpriteState: (state) => set({ spriteState: state, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
}))
