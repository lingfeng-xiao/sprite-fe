import { create } from 'zustand'

// ==================== Cycle Store Types ====================
// Cycle context: cognition cycles, phase stats (from Phase 6-11 APIs)

export interface PhaseStats {
  phase: string
  eventCount: number
  successCount: number
  successRate: number
  avgDurationMs: number
}

export interface CognitionEvent {
  type: string
  timestamp: string
  data: Record<string, unknown>
}

export interface CognitionCycle {
  startTime: string
  endTime: string
  events: CognitionEvent[]
  totalDurationMs: number
  isComplete: boolean
}

export interface CycleMetrics {
  timestamp: string
  totalEvents: number
  successCount: number
  successRate: number
  avgCycleDurationMs: number
  phaseStats: PhaseStats[]
  recentCycles: CognitionCycle[]
  totalHistorySize: number
}

interface CycleStore {
  // State
  metrics: CycleMetrics | null
  isLoading: boolean
  error: string | null
  lastFetchTime: string | null

  // Actions
  setMetrics: (metrics: CycleMetrics) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearCycles: () => void

  // Computed helpers
  getSuccessRate: () => number
  getActiveCyclesCount: () => number
}

export const useCycleStore = create<CycleStore>((set, get) => ({
  metrics: null,
  isLoading: false,
  error: null,
  lastFetchTime: null,

  setMetrics: (metrics) =>
    set({
      metrics,
      error: null,
      lastFetchTime: new Date().toISOString(),
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  clearCycles: () =>
    set({
      metrics: null,
      isLoading: false,
      error: null,
      lastFetchTime: null,
    }),

  getSuccessRate: () => {
    const { metrics } = get()
    return metrics ? Math.round(metrics.successRate * 100) : 0
  },

  getActiveCyclesCount: () => {
    const { metrics } = get()
    return metrics?.recentCycles.filter((c) => !c.isComplete).length ?? 0
  },
}))
