import { create } from 'zustand'

// ==================== Relationship Core Types ====================

export interface RelationshipProfile {
  relationshipId: string
  type: 'FAMILY' | 'FRIEND' | 'COLLEAGUE' | 'CLIENT' | 'PARTNER' | 'OTHER'
  strength: number
  description: string
  establishedAt: string
  lastInteractionAt: string
  interactionCount: number
}

export interface TrustState {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL'
  score: number
  establishedAt: string
  lastVerifiedAt: string
  verificationCount: number
  betrayalCount: number
}

export interface SharedProjectLink {
  projectId: string
  name: string
  description: string
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED' | 'SUSPENDED'
  engagement: number
  createdAt: string
  lastUpdatedAt: string
  completedAt: string | null
}

export interface CarePriority {
  careType: 'EMOTIONAL' | 'PHYSICAL' | 'PRODUCTIVITY' | 'SAFETY' | 'GROWTH'
  level: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW'
  score: number
  enabled: boolean
  lastCheckedAt: string
  lastTriggeredAt: string | null
}

// ==================== Relationship Store ====================

interface RelationshipStore {
  // State
  ownerId: string | null
  profile: RelationshipProfile | null
  trustState: TrustState | null
  sharedProjects: SharedProjectLink[]
  carePriorities: CarePriority[]
  isLoading: boolean
  error: string | null

  // Actions
  setOwnerId: (ownerId: string) => void
  setProfile: (profile: RelationshipProfile) => void
  setTrustState: (trustState: TrustState) => void
  addSharedProject: (project: SharedProjectLink) => void
  updateProjectEngagement: (projectId: string, engagement: number) => void
  setCarePriorities: (priorities: CarePriority[]) => void
  updateCarePriority: (careType: CarePriority['careType'], level: CarePriority['level']) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Computed
  getRelationshipSummary: () => string
  getTrustLevel: () => TrustState['level']
  getActiveProjects: () => SharedProjectLink[]
  getTopCarePriority: () => CarePriority | null
  isTrustAtLeast: (level: TrustState['level']) => boolean
}

export const useRelationshipStore = create<RelationshipStore>((set, get) => ({
  ownerId: null,
  profile: null,
  trustState: null,
  sharedProjects: [],
  carePriorities: [],
  isLoading: false,
  error: null,

  setOwnerId: (ownerId) => set({ ownerId }),

  setProfile: (profile) => set({ profile, error: null }),

  setTrustState: (trustState) => set({ trustState }),

  addSharedProject: (project) => {
    const { sharedProjects } = get()
    set({ sharedProjects: [...sharedProjects, project] })
  },

  updateProjectEngagement: (projectId, engagement) => {
    const { sharedProjects } = get()
    set({
      sharedProjects: sharedProjects.map((p) =>
        p.projectId === projectId
          ? { ...p, engagement: Math.max(0, Math.min(1, engagement)), lastUpdatedAt: new Date().toISOString() }
          : p
      ),
    })
  },

  setCarePriorities: (priorities) => set({ carePriorities: priorities }),

  updateCarePriority: (careType, level) => {
    const { carePriorities } = get()
    set({
      carePriorities: carePriorities.map((p) =>
        p.careType === careType ? { ...p, level } : p
      ),
    })
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  getRelationshipSummary: () => {
    const { profile, trustState } = get()
    if (!profile) return '未初始化关系'
    return `关系: ${profile.type} | 信任: ${trustState?.level || '未知'} | 项目: ${get().getActiveProjects().length}个活跃`
  },

  getTrustLevel: () => {
    return get().trustState?.level || 'MEDIUM'
  },

  getActiveProjects: () => {
    const { sharedProjects } = get()
    return sharedProjects.filter((p) => p.status === 'ACTIVE')
  },

  getTopCarePriority: () => {
    const { carePriorities } = get()
    return carePriorities
      .filter((p) => p.enabled)
      .sort((a, b) => b.score - a.score)[0] || null
  },

  isTrustAtLeast: (level) => {
    const { trustState } = get()
    if (!trustState) return false
    const levels: TrustState['level'][] = ['LOW', 'MEDIUM', 'HIGH', 'FULL']
    return levels.indexOf(trustState.level) >= levels.indexOf(level)
  },
}))
