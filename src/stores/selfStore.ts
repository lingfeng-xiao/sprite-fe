import { create } from 'zustand'

// ==================== Self Core Types ====================

export interface SelfState {
  attentionFoci: string[]
  emotionalBaseline: number
  energyLevel: number
  coherenceScore: number
  lastUpdated: string
}

export interface SelfAssessment {
  strengths: string[]
  blindSpots: string[]
  learningStyle: 'VISUAL' | 'AUDITORY' | 'READING' | 'KINESTHETIC'
  decisionPatterns: string[]
  lastAssessment: string
}

export interface AttentionFocus {
  type: 'TASK' | 'CONVERSATION' | 'OBSERVATION' | 'REFLECTION' | 'LEARNING' | 'IDLE'
  description: string
  relatedEntityId: string
  intensity: number
  startedAt: string
  expectedDurationMs: number
}

export interface BoundaryProfile {
  rules: BoundaryRule[]
  lastUpdated: string
  lastModifiedBy: string
}

export interface BoundaryRule {
  id: string
  type: 'CAPABILITY' | 'ACTION' | 'SAFETY' | 'PRIVACY' | 'EMOTIONAL'
  description: string
  isHardLimit: boolean
  restrictiveness: number
}

// ==================== Self Store ====================

interface SelfStore {
  // State
  selfState: SelfState | null
  assessment: SelfAssessment | null
  currentFocus: AttentionFocus | null
  boundaries: BoundaryProfile | null
  isLoading: boolean
  error: string | null

  // Actions
  setSelfState: (state: SelfState) => void
  updateEnergy: (level: number) => void
  updateCoherence: (score: number) => void
  addFocus: (focus: string) => void
  setAssessment: (assessment: SelfAssessment) => void
  setCurrentFocus: (focus: AttentionFocus | null) => void
  setBoundaries: (boundaries: BoundaryProfile) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Computed
  getEnergyPercent: () => number
  getCoherencePercent: () => number
  isFocusTimedOut: () => boolean
  getSelfSummary: () => string
  isActionAllowed: (action: string, type: BoundaryRule['type']) => boolean
}

export const useSelfStore = create<SelfStore>((set, get) => ({
  selfState: null,
  assessment: null,
  currentFocus: null,
  boundaries: null,
  isLoading: false,
  error: null,

  setSelfState: (selfState) => set({ selfState, error: null }),

  updateEnergy: (level) => {
    const { selfState } = get()
    if (selfState) {
      set({
        selfState: {
          ...selfState,
          energyLevel: Math.max(0, Math.min(1, level)),
          lastUpdated: new Date().toISOString(),
        },
      })
    }
  },

  updateCoherence: (score) => {
    const { selfState } = get()
    if (selfState) {
      set({
        selfState: {
          ...selfState,
          coherenceScore: Math.max(0, Math.min(1, score)),
          lastUpdated: new Date().toISOString(),
        },
      })
    }
  },

  addFocus: (focus) => {
    const { selfState } = get()
    if (selfState) {
      set({
        selfState: {
          ...selfState,
          attentionFoci: [...selfState.attentionFoci, focus],
          lastUpdated: new Date().toISOString(),
        },
      })
    }
  },

  setAssessment: (assessment) => set({ assessment }),

  setCurrentFocus: (currentFocus) => set({ currentFocus }),

  setBoundaries: (boundaries) => set({ boundaries }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  getEnergyPercent: () => {
    const { selfState } = get()
    return selfState ? Math.round(selfState.energyLevel * 100) : 0
  },

  getCoherencePercent: () => {
    const { selfState } = get()
    return selfState ? Math.round(selfState.coherenceScore * 100) : 0
  },

  isFocusTimedOut: () => {
    const { currentFocus } = get()
    if (!currentFocus || currentFocus.expectedDurationMs <= 0) return false
    const elapsed = Date.now() - new Date(currentFocus.startedAt).getTime()
    return elapsed > currentFocus.expectedDurationMs * 1.5
  },

  getSelfSummary: () => {
    const { selfState, currentFocus } = get()
    if (!selfState) return '未初始化自我'
    const focusType = currentFocus?.type || 'IDLE'
    const focusDesc = currentFocus?.description || '无'
    return `状态: ${focusType} | 能量: ${get().getEnergyPercent()}% | 一致性: ${get().getCoherencePercent()}% | 焦点: ${focusDesc}`
  },

  isActionAllowed: (action, type) => {
    const { boundaries } = get()
    if (!boundaries) return true

    const rules = boundaries.rules.filter((r) => r.type === type)
    for (const rule of rules) {
      if (rule.isHardLimit && action.toLowerCase().includes('harm')) {
        return false
      }
    }
    return true
  },
}))
