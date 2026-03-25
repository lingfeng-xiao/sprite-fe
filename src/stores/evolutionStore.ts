import { create } from 'zustand'

// ==================== Evolution Store Types ====================
// Evolution context: growth, learning, behavior changes (from Phase 6-11 APIs)

export interface EvolutionTrend {
  evolutionLevels: number[]
  learningRates: number[]
  insightCounts: number[]
  principleCounts: number[]
}

export interface EvolutionSnapshot {
  timestamp: string
  level: number
  changeType: string
  description: string
}

export interface InsightSummary {
  totalInsights: number
  recentInsights: number
  averageConfidence: number
  mostCommonType: string
}

export interface BehaviorSummary {
  totalChanges: number
  successfulChanges: number
  successRate: number
  recentBehaviorPatterns: string[]
}

export interface EvolutionDashboard {
  timestamp: string
  currentLevel: number
  totalEvolutions: number
  trend: EvolutionTrend
  recentHistory: EvolutionSnapshot[]
  insightSummary: InsightSummary
  behaviorSummary: BehaviorSummary
}

export interface EvolutionProposal {
  id: string
  type: 'PRINCIPLE' | 'BEHAVIOR' | 'CAPABILITY' | 'KNOWLEDGE'
  title: string
  description: string
  rationale: string
  expectedImpact: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED'
  createdAt: string
  reviewedAt: string | null
}

interface EvolutionStore {
  // State
  dashboard: EvolutionDashboard | null
  proposals: EvolutionProposal[]
  isLoading: boolean
  error: string | null
  lastFetchTime: string | null

  // Actions
  setDashboard: (dashboard: EvolutionDashboard) => void
  setProposals: (proposals: EvolutionProposal[]) => void
  addProposal: (proposal: EvolutionProposal) => void
  updateProposalStatus: (id: string, status: EvolutionProposal['status']) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearEvolution: () => void

  // Computed helpers
  getCurrentLevel: () => number
  getEvolutionSuccessRate: () => number
  getPendingProposalsCount: () => number
  getEvolutionSummary: () => string
}

export const useEvolutionStore = create<EvolutionStore>((set, get) => ({
  dashboard: null,
  proposals: [],
  isLoading: false,
  error: null,
  lastFetchTime: null,

  setDashboard: (dashboard) =>
    set({ dashboard, error: null, lastFetchTime: new Date().toISOString() }),

  setProposals: (proposals) => set({ proposals }),

  addProposal: (proposal) =>
    set((s) => ({ proposals: [...s.proposals, proposal] })),

  updateProposalStatus: (id, status) =>
    set((s) => ({
      proposals: s.proposals.map((p) =>
        p.id === id ? { ...p, status, reviewedAt: new Date().toISOString() } : p
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  clearEvolution: () =>
    set({
      dashboard: null,
      proposals: [],
      isLoading: false,
      error: null,
      lastFetchTime: null,
    }),

  getCurrentLevel: () => get().dashboard?.currentLevel ?? 0,

  getEvolutionSuccessRate: () => {
    const { dashboard } = get()
    if (!dashboard?.behaviorSummary) return 0
    return Math.round(dashboard.behaviorSummary.successRate * 100)
  },

  getPendingProposalsCount: () => {
    const { proposals } = get()
    return proposals.filter((p) => p.status === 'PENDING').length
  },

  getEvolutionSummary: () => {
    const { dashboard, proposals } = get()
    if (!dashboard) return 'Evolution not loaded'
    const pending = proposals.filter((p) => p.status === 'PENDING').length
    return `Level: ${dashboard.currentLevel} | Evolutions: ${dashboard.totalEvolutions} | Success: ${get().getEvolutionSuccessRate()}% | Pending: ${pending}`
  },
}))
