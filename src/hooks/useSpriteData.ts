import { useQuery } from '@tanstack/react-query'
import {
  getAutonomyStatus,
  getCognitionDashboard,
  getMemoryVisualization,
  getEvolutionDashboard,
  getEmotionDashboard,
  getHealthDetails,
  getAgentWorkers,
  getLifeJournal,
  getLifeSnapshot,
  getLifeModelConfig,
  getSpriteState,
  getTeamSprites,
  getTeamSessions,
  getCollaborationStatus,
  discoverSprites,
} from '@/api/spriteApi'
import { QUERY_KEYS, REFRESH_INTERVALS } from '@/lib/constants'

// ==================== Life Main Chain ====================

export function useSpriteState() {
  return useQuery({
    queryKey: QUERY_KEYS.spriteState,
    queryFn: getSpriteState,
    refetchInterval: REFRESH_INTERVALS.spriteState,
    staleTime: 10000,
    retry: 1,
    throwOnError: false,
  })
}

export function useLifeSnapshot() {
  return useQuery({
    queryKey: QUERY_KEYS.lifeSnapshot,
    queryFn: getLifeSnapshot,
    refetchInterval: REFRESH_INTERVALS.lifeSnapshot,
    staleTime: 5000,
  })
}

export function useLifeJournal(limit = 20) {
  return useQuery({
    queryKey: [...QUERY_KEYS.lifeJournal, limit],
    queryFn: () => getLifeJournal(limit),
    refetchInterval: REFRESH_INTERVALS.lifeJournal,
    staleTime: 5000,
  })
}

export function useAutonomyStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.lifeAutonomy,
    queryFn: getAutonomyStatus,
    refetchInterval: REFRESH_INTERVALS.lifeAutonomy,
    staleTime: 5000,
  })
}

export function useModelConfig() {
  return useQuery({
    queryKey: QUERY_KEYS.modelConfig,
    queryFn: getLifeModelConfig,
    staleTime: 30000,
  })
}

// ==================== Legacy Sprite / Team / Ops ====================

export function useCognitionDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.cognition,
    queryFn: getCognitionDashboard,
    refetchInterval: REFRESH_INTERVALS.cognition,
    staleTime: 5000,
  })
}

export function useMemoryVisualization() {
  return useQuery({
    queryKey: QUERY_KEYS.memoryVisualization,
    queryFn: getMemoryVisualization,
    refetchInterval: REFRESH_INTERVALS.memory,
    staleTime: 30000,
  })
}

export function useEvolutionDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.evolutionDashboard,
    queryFn: getEvolutionDashboard,
    refetchInterval: REFRESH_INTERVALS.evolution,
    staleTime: 60000,
  })
}

export function useEmotionDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.emotionDashboard,
    queryFn: getEmotionDashboard,
    refetchInterval: REFRESH_INTERVALS.emotions,
    staleTime: 30000,
  })
}

export function useHealthDetails() {
  return useQuery({
    queryKey: QUERY_KEYS.health,
    queryFn: getHealthDetails,
    refetchInterval: REFRESH_INTERVALS.health,
    staleTime: 30000,
  })
}

export function useAgentWorkers() {
  return useQuery({
    queryKey: QUERY_KEYS.agentWorkers,
    queryFn: getAgentWorkers,
    refetchInterval: REFRESH_INTERVALS.agentWorkers,
    staleTime: 10000,
  })
}

// ==================== Team Collaboration Hooks ====================

export function useTeamSprites() {
  return useQuery({
    queryKey: QUERY_KEYS.teamSprites,
    queryFn: getTeamSprites,
    refetchInterval: REFRESH_INTERVALS.teamSprites,
    staleTime: 15000,
  })
}

export function useTeamSessions() {
  return useQuery({
    queryKey: QUERY_KEYS.teamSessions,
    queryFn: getTeamSessions,
    refetchInterval: REFRESH_INTERVALS.teamSessions,
    staleTime: 10000,
  })
}

export function useCollaborationStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.collaborationStatus,
    queryFn: getCollaborationStatus,
    refetchInterval: REFRESH_INTERVALS.collaborationStatus,
    staleTime: 15000,
  })
}

export function useDiscoverSprites() {
  return useQuery({
    queryKey: ['team', 'discover'],
    queryFn: discoverSprites,
    enabled: false,
  })
}
