import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { EvolutionDashboard, EvolutionProposal } from '@/stores/evolutionStore'

// ==================== Evolution API Hooks ====================

const EVOLUTION_KEYS = {
  all: ['evolution'] as const,
  dashboard: () => [...EVOLUTION_KEYS.all, 'dashboard'] as const,
  proposals: () => [...EVOLUTION_KEYS.all, 'proposals'] as const,
}

/**
 * GET /api/evolution/proposals
 * Fetch evolution proposals
 */
async function fetchEvolutionProposals(): Promise<EvolutionProposal[]> {
  const response = await apiClient.get<EvolutionProposal[]>('/api/evolution/proposals')
  return response.data
}

/**
 * GET /api/evolution/dashboard (implicit via dashboard data)
 * Fetch evolution dashboard data
 */
async function fetchEvolutionDashboard(): Promise<EvolutionDashboard> {
  // This would be a dedicated endpoint in Phase 6-11
  // For now, we derive from proposals
  const proposals = await fetchEvolutionProposals()
  // Return a derived dashboard structure
  return {
    timestamp: new Date().toISOString(),
    currentLevel: 1,
    totalEvolutions: proposals.filter(p => p.status === 'IMPLEMENTED').length,
    trend: {
      evolutionLevels: [],
      learningRates: [],
      insightCounts: [],
      principleCounts: [],
    },
    recentHistory: [],
    insightSummary: {
      totalInsights: 0,
      recentInsights: 0,
      averageConfidence: 0,
      mostCommonType: 'UNKNOWN',
    },
    behaviorSummary: {
      totalChanges: 0,
      successfulChanges: 0,
      successRate: 0,
      recentBehaviorPatterns: [],
    },
  }
}

export function useEvolutionDashboard(options?: { staleTime?: number; refetchInterval?: number }) {
  return useQuery({
    queryKey: EVOLUTION_KEYS.dashboard(),
    queryFn: fetchEvolutionDashboard,
    staleTime: options?.staleTime ?? 60000,
    refetchInterval: options?.refetchInterval ?? 120000,
  })
}

export function useEvolutionProposals(options?: { staleTime?: number; refetchInterval?: number }) {
  return useQuery({
    queryKey: EVOLUTION_KEYS.proposals(),
    queryFn: fetchEvolutionProposals,
    staleTime: options?.staleTime ?? 30000,
    refetchInterval: options?.refetchInterval ?? 60000,
  })
}

export function useEvolutionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fetchEvolutionProposals,
    onSuccess: (data) => {
      queryClient.setQueryData(EVOLUTION_KEYS.proposals(), data)
    },
  })
}
