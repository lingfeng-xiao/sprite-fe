import { useQuery } from '@tanstack/react-query'
import {
  getSpriteState,
  getCognitionDashboard,
  getMemoryVisualization,
  getEvolutionDashboard,
  getEmotionDashboard,
  getHealthDetails,
} from '@/api/spriteApi'
import { QUERY_KEYS, REFRESH_INTERVALS } from '@/lib/constants'

export function useSpriteState() {
  return useQuery({
    queryKey: QUERY_KEYS.spriteState,
    queryFn: getSpriteState,
    refetchInterval: REFRESH_INTERVALS.spriteState,
    staleTime: 10000,
  })
}

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
