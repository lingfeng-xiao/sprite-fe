import { create } from 'zustand'

// ==================== Goal Core Types ====================

export interface LongTermGoal {
  goalId: string
  title: string
  description: string
  category: 'PERSONAL_GROWTH' | 'RELATIONSHIP' | 'CAPABILITY' | 'CREATION' | 'LEARNING' | 'CONTRIBUTION'
  status: 'ACTIVE' | 'ACHIEVED' | 'ABANDONED' | 'SUSPENDED' | 'REJECTED'
  progress: number
  createdAt: string
  expectedCompletionAt: string
  completedAt: string | null
  milestones: Milestone[]
  abandonmentReason: string | null
}

export interface Milestone {
  id: string
  title: string
  completed: boolean
  completedAt: string | null
}

export interface MidTermTrack {
  trackId: string
  title: string
  description: string
  relatedGoalId: string
  status: 'ON_TRACK' | 'AHEAD' | 'BEHIND' | 'BLOCKED' | 'COMPLETED'
  targetProgress: number
  actualProgress: number
  startedAt: string
  deadline: string
  lastCheckedAt: string
  relatedActionIds: string[]
  blocker: string | null
}

export interface ActiveIntention {
  intentionId: string
  description: string
  relatedTrackId: string | null
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'SUPERSEDED' | 'FAILED'
  urgency: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW'
  intensity: number
  createdAt: string
  activatedAt: string
  completedAt: string | null
  deadline: string
  failureReason: string | null
}

export interface GoalConflict {
  conflictId: string
  type: 'RESOURCE' | 'DIRECTION' | 'TIME' | 'PRIORITY' | 'DEPENDENCY'
  goalId1: string
  goalId2: string
  description: string
  detectedAt: string
  resolutionStrategy: 'PRIORITY_BASED' | 'FIRST_COME_FIRST' | 'SPLIT_RESOURCE' | 'DEFER_LESS_IMPORTANT' | 'CANCEL_CONFLICTING'
}

// ==================== Goal Store ====================

interface GoalStore {
  // State
  longTermGoals: LongTermGoal[]
  midTermTracks: MidTermTrack[]
  activeIntentions: ActiveIntention[]
  detectedConflicts: GoalConflict[]
  isLoading: boolean
  error: string | null

  // Actions
  setLongTermGoals: (goals: LongTermGoal[]) => void
  addLongTermGoal: (goal: LongTermGoal) => void
  updateGoalProgress: (goalId: string, progress: number) => void
  addMilestone: (goalId: string, milestone: Milestone) => void
  completeMilestone: (goalId: string, milestoneId: string) => void
  abandonGoal: (goalId: string, reason: string) => void

  setMidTermTracks: (tracks: MidTermTrack[]) => void
  addMidTermTrack: (track: MidTermTrack) => void
  updateTrackProgress: (trackId: string, progress: number) => void
  blockTrack: (trackId: string, reason: string) => void

  setActiveIntentions: (intentions: ActiveIntention[]) => void
  addIntention: (intention: ActiveIntention) => void
  completeIntention: (intentionId: string) => void
  failIntention: (intentionId: string, reason: string) => void
  cancelIntention: (intentionId: string) => void

  setDetectedConflicts: (conflicts: GoalConflict[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Computed
  getActiveGoals: () => LongTermGoal[]
  getActiveTracks: () => MidTermTrack[]
  getActiveIntentionsList: () => ActiveIntention[]
  getTopPriorityIntention: () => ActiveIntention | null
  getGoalSummary: () => string
  hasConflicts: () => boolean
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  longTermGoals: [],
  midTermTracks: [],
  activeIntentions: [],
  detectedConflicts: [],
  isLoading: false,
  error: null,

  setLongTermGoals: (goals) => set({ longTermGoals: goals }),

  addLongTermGoal: (goal) => {
    const { longTermGoals } = get()
    set({ longTermGoals: [...longTermGoals, goal] })
  },

  updateGoalProgress: (goalId, progress) => {
    const { longTermGoals } = get()
    set({
      longTermGoals: longTermGoals.map((g) =>
        g.goalId === goalId
          ? {
              ...g,
              progress: Math.max(0, Math.min(1, progress)),
              status: progress >= 1 ? 'ACHIEVED' as const : g.status,
              completedAt: progress >= 1 ? new Date().toISOString() : g.completedAt,
            }
          : g
      ),
    })
  },

  addMilestone: (goalId, milestone) => {
    const { longTermGoals } = get()
    set({
      longTermGoals: longTermGoals.map((g) =>
        g.goalId === goalId
          ? { ...g, milestones: [...g.milestones, milestone] }
          : g
      ),
    })
  },

  completeMilestone: (goalId, milestoneId) => {
    const { longTermGoals } = get()
    set({
      longTermGoals: longTermGoals.map((g) => {
        if (g.goalId !== goalId) return g
        const milestones = g.milestones.map((m) =>
          m.id === milestoneId
            ? { ...m, completed: true, completedAt: new Date().toISOString() }
            : m
        )
        const completedCount = milestones.filter((m) => m.completed).length
        const newProgress = milestones.length > 0 ? completedCount / milestones.length : g.progress
        return {
          ...g,
          milestones,
          progress: newProgress,
          status: newProgress >= 1 ? 'ACHIEVED' as const : g.status,
          completedAt: newProgress >= 1 ? new Date().toISOString() : g.completedAt,
        }
      }),
    })
  },

  abandonGoal: (goalId, reason) => {
    const { longTermGoals } = get()
    set({
      longTermGoals: longTermGoals.map((g) =>
        g.goalId === goalId
          ? { ...g, status: 'ABANDONED' as const, abandonmentReason: reason }
          : g
      ),
    })
  },

  setMidTermTracks: (tracks) => set({ midTermTracks: tracks }),

  addMidTermTrack: (track) => {
    const { midTermTracks } = get()
    set({ midTermTracks: [...midTermTracks, track] })
  },

  updateTrackProgress: (trackId, progress) => {
    const { midTermTracks } = get()
    set({
      midTermTracks: midTermTracks.map((t) =>
        t.trackId === trackId
          ? {
              ...t,
              actualProgress: Math.max(0, Math.min(1, progress)),
              status: progress >= 1 ? 'COMPLETED' as const :
                     progress > t.targetProgress + 0.1 ? 'AHEAD' as const :
                     progress < t.targetProgress - 0.1 ? 'BEHIND' as const : 'ON_TRACK' as const,
              lastCheckedAt: new Date().toISOString(),
            }
          : t
      ),
    })
  },

  blockTrack: (trackId, reason) => {
    const { midTermTracks } = get()
    set({
      midTermTracks: midTermTracks.map((t) =>
        t.trackId === trackId
          ? { ...t, status: 'BLOCKED' as const, blocker: reason }
          : t
      ),
    })
  },

  setActiveIntentions: (intentions) => set({ activeIntentions: intentions }),

  addIntention: (intention) => {
    const { activeIntentions } = get()
    set({ activeIntentions: [...activeIntentions, intention] })
  },

  completeIntention: (intentionId) => {
    const { activeIntentions } = get()
    set({
      activeIntentions: activeIntentions.map((i) =>
        i.intentionId === intentionId
          ? { ...i, status: 'COMPLETED' as const, completedAt: new Date().toISOString(), intensity: 0 }
          : i
      ),
    })
  },

  failIntention: (intentionId, reason) => {
    const { activeIntentions } = get()
    set({
      activeIntentions: activeIntentions.map((i) =>
        i.intentionId === intentionId
          ? { ...i, status: 'FAILED' as const, completedAt: new Date().toISOString(), failureReason: reason, intensity: 0 }
          : i
      ),
    })
  },

  cancelIntention: (intentionId) => {
    const { activeIntentions } = get()
    set({
      activeIntentions: activeIntentions.map((i) =>
        i.intentionId === intentionId
          ? { ...i, status: 'CANCELLED' as const, completedAt: new Date().toISOString(), intensity: 0 }
          : i
      ),
    })
  },

  setDetectedConflicts: (conflicts) => set({ detectedConflicts: conflicts }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  getActiveGoals: () => {
    const { longTermGoals } = get()
    return longTermGoals.filter((g) => g.status === 'ACTIVE')
  },

  getActiveTracks: () => {
    const { midTermTracks } = get()
    return midTermTracks.filter((t) => t.status !== 'COMPLETED')
  },

  getActiveIntentionsList: () => {
    const { activeIntentions } = get()
    return activeIntentions.filter((i) => i.status === 'ACTIVE')
  },

  getTopPriorityIntention: () => {
    const intentions = get().getActiveIntentionsList()
    if (intentions.length === 0) return null

    const urgencyOrder = { CRITICAL: 0, HIGH: 1, NORMAL: 2, LOW: 3 }
    return intentions.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency])[0]
  },

  getGoalSummary: () => {
    const activeGoals = get().getActiveGoals().length
    const activeTracks = get().getActiveTracks().length
    const activeIntentions = get().getActiveIntentionsList().length
    return `长期目标: ${activeGoals}个活跃 | 中期追踪: ${activeTracks}个进行中 | 当前意向: ${activeIntentions}个活跃`
  },

  hasConflicts: () => {
    return get().detectedConflicts.length > 0
  },
}))
