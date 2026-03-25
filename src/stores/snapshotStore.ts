import { create } from 'zustand'
import type { SelfState, AttentionFocus } from './selfStore'
import type { ActiveIntention } from './goalStore'

// ==================== LifeSnapshot Types ====================

export interface RelationshipSummary {
  relationshipType: string
  trustLevel: string
  trustScore: number
  relationshipStrength: number
  interactionCount: number
  sharedProjectsCount: number
  topCarePriority: string
}

export interface PacingState {
  currentLayer: 'FAST' | 'MEDIUM' | 'SLOW'
  status: 'STABLE' | 'EVOLVING' | 'PENDING_SYNC'
  pendingChangesCount: number
  recentChangesCount: number
  lastSyncTime: string
  syncRecommendation: string
}

export interface RecentChange {
  id: string
  changeType: string
  layer: 'FAST' | 'MEDIUM' | 'SLOW'
  description: string
  timestamp: string
  impact: string
}

export interface LifeSnapshot {
  version: string
  generatedAt: string
  identitySummary: string
  currentState: SelfState
  attentionFocus: AttentionFocus
  activeIntentions: ActiveIntention[]
  relationshipSummary: RelationshipSummary
  recentChanges: RecentChange[]
  recentMemorySummaries: string[]
  nextLikelyActions: string[]
  coherenceScore: number
  pacingState: PacingState
  emoji: string
  displayName: string
}

// ==================== Snapshot Store ====================

interface SnapshotStore {
  // State
  snapshot: LifeSnapshot | null
  isLoading: boolean
  error: string | null
  lastFetchTime: string | null

  // Actions
  fetchSnapshot: () => Promise<void>
  setSnapshot: (snapshot: LifeSnapshot) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Computed
  getCoherencePercent: () => number
  getEnergyPercent: () => number
  getSnapshotSummary: () => string
  hasPendingSync: () => boolean
}

const API_BASE = '/api/life'

export const useSnapshotStore = create<SnapshotStore>((set, get) => ({
  snapshot: null,
  isLoading: false,
  error: null,
  lastFetchTime: null,

  fetchSnapshot: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/snapshot`)
      if (!response.ok) {
        throw new Error(`Failed to fetch snapshot: ${response.statusText}`)
      }
      const snapshot: LifeSnapshot = await response.json()
      set({
        snapshot,
        isLoading: false,
        lastFetchTime: new Date().toISOString(),
        error: null,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      })
    }
  },

  setSnapshot: (snapshot) => set({ snapshot, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  getCoherencePercent: () => {
    const { snapshot } = get()
    return snapshot ? Math.round(snapshot.coherenceScore * 100) : 0
  },

  getEnergyPercent: () => {
    const { snapshot } = get()
    if (!snapshot?.currentState) return 0
    return Math.round(snapshot.currentState.energyLevel * 100)
  },

  getSnapshotSummary: () => {
    const { snapshot } = get()
    if (!snapshot) return '快照未加载'
    const { emoji, displayName, pacingState } = snapshot
    const coherence = get().getCoherencePercent()
    const energy = get().getEnergyPercent()
    return `${emoji} ${displayName} | 一致性: ${coherence}% | 能量: ${energy}% | 节速: ${pacingState.currentLayer}`
  },

  hasPendingSync: () => {
    const { snapshot } = get()
    return snapshot?.pacingState?.status === 'PENDING_SYNC'
  },
}))
