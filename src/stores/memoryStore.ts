import { create } from 'zustand'

// ==================== Memory Store Types ====================
// Memory context: working, episodic, semantic memory (from Phase 6-11 APIs)

export interface MemoryTypeStats {
  episodicCount: number
  semanticCount: number
  proceduralCount: number
  perceptiveCount: number
  workingMemoryCount: number
}

export interface StrengthDistribution {
  veryLowCount: number
  lowCount: number
  mediumCount: number
  highCount: number
  veryHighCount: number
}

export interface MemoryActivity {
  memoryId: string
  memoryType: string
  lastAccessed: string
  accessCount: number
  strength: number
  preview: string
}

export interface MemoryStats {
  timestamp: string
  typeStats: MemoryTypeStats
  strengthDistribution: StrengthDistribution
  totalMemoryCount: number
  averageStrength: number
}

export interface WorkingMemory {
  used: number
  max: number
  items: string[]
}

export interface EpisodicMemory {
  id: string
  content: string
  timestamp: string
  strength: number
  emotions: string[]
  entities: string[]
}

export interface SemanticMemory {
  id: string
  concept: string
  description: string
  timestamp: string
  connections: string[]
  confidence: number
}

interface MemoryStore {
  // State
  stats: MemoryStats | null
  workingMemory: WorkingMemory | null
  episodicMemories: EpisodicMemory[]
  semanticMemories: SemanticMemory[]
  isLoading: boolean
  error: string | null
  lastFetchTime: string | null

  // Actions
  setStats: (stats: MemoryStats) => void
  setWorkingMemory: (working: WorkingMemory) => void
  setEpisodicMemories: (memories: EpisodicMemory[]) => void
  setSemanticMemories: (memories: SemanticMemory[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearMemory: () => void

  // Computed helpers
  getWorkingMemoryPercent: () => number
  getTotalMemoryCount: () => number
  getMemorySummary: () => string
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  stats: null,
  workingMemory: null,
  episodicMemories: [],
  semanticMemories: [],
  isLoading: false,
  error: null,
  lastFetchTime: null,

  setStats: (stats) =>
    set({ stats, error: null, lastFetchTime: new Date().toISOString() }),

  setWorkingMemory: (workingMemory) => set({ workingMemory }),

  setEpisodicMemories: (episodicMemories) => set({ episodicMemories }),

  setSemanticMemories: (semanticMemories) => set({ semanticMemories }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  clearMemory: () =>
    set({
      stats: null,
      workingMemory: null,
      episodicMemories: [],
      semanticMemories: [],
      isLoading: false,
      error: null,
      lastFetchTime: null,
    }),

  getWorkingMemoryPercent: () => {
    const { workingMemory } = get()
    if (!workingMemory || workingMemory.max === 0) return 0
    return Math.round((workingMemory.used / workingMemory.max) * 100)
  },

  getTotalMemoryCount: () => {
    const { stats } = get()
    return stats?.totalMemoryCount ?? 0
  },

  getMemorySummary: () => {
    const { stats } = get()
    if (!stats) return 'Memory not loaded'
    const wmPercent = get().getWorkingMemoryPercent()
    return `Total: ${stats.totalMemoryCount} | Working: ${wmPercent}% | Avg Strength: ${Math.round(stats.averageStrength * 100)}%`
  },
}))
