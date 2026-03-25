import { create } from 'zustand'

// ==================== Identity Core Types ====================

export interface IdentityProfile {
  displayName: string
  essence: string
  emoji: string
  vibe: string
}

export interface IdentityAnchor {
  beingId: string
  createdAt: string
  continuityChain: string[]
}

export interface IdentityConstraint {
  id: string
  type: 'IMMUTABLE' | 'PROTECTED' | 'FLEXIBLE'
  description: string
  isHardLimit: boolean
  restrictiveness: number
}

export interface IdentityNarrative {
  segments: NarrativeSegment[]
}

export interface NarrativeSegment {
  timestamp: string
  narrative: string
  trigger: string
  context: string
}

// ==================== Identity Store ====================

interface IdentityStore {
  // State
  profile: IdentityProfile | null
  anchor: IdentityAnchor | null
  constraints: IdentityConstraint[]
  narrative: IdentityNarrative | null
  isLoading: boolean
  error: string | null

  // Actions
  setProfile: (profile: IdentityProfile) => void
  setAnchor: (anchor: IdentityAnchor) => void
  setConstraints: (constraints: IdentityConstraint[]) => void
  setNarrative: (narrative: IdentityNarrative) => void
  appendNarrative: (segment: NarrativeSegment) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Computed
  getIdentityStatement: () => string
  getImmutableConstraints: () => IdentityConstraint[]
}

export const useIdentityStore = create<IdentityStore>((set, get) => ({
  profile: null,
  anchor: null,
  constraints: [],
  narrative: null,
  isLoading: false,
  error: null,

  setProfile: (profile) => set({ profile, error: null }),

  setAnchor: (anchor) => set({ anchor, error: null }),

  setConstraints: (constraints) => set({ constraints }),

  setNarrative: (narrative) => set({ narrative }),

  appendNarrative: (segment) => {
    const { narrative } = get()
    if (narrative) {
      set({
        narrative: {
          ...narrative,
          segments: [...narrative.segments, segment],
        },
      })
    } else {
      set({
        narrative: {
          segments: [segment],
        },
      })
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  getIdentityStatement: () => {
    const { profile } = get()
    if (!profile) return '未初始化身份'
    return `${profile.emoji} ${profile.displayName} - ${profile.essence}`
  },

  getImmutableConstraints: () => {
    const { constraints } = get()
    return constraints.filter((c) => c.type === 'IMMUTABLE')
  },
}))
