import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { SpriteState } from '@/types/api'

// ==================== Runtime API Hooks ====================

const RUNTIME_KEYS = {
  all: ['runtime'] as const,
  snapshot: () => [...RUNTIME_KEYS.all, 'snapshot'] as const,
}

/**
 * GET /api/sprite/state
 * Fetch current sprite state (running status, LLM availability, etc.)
 */
async function fetchRuntimeSnapshot(): Promise<SpriteState> {
  const response = await apiClient.get<SpriteState>('/api/sprite/state')
  return response.data
}

export function useRuntimeSnapshot(options?: { staleTime?: number; refetchInterval?: number }) {
  return useQuery({
    queryKey: RUNTIME_KEYS.snapshot(),
    queryFn: fetchRuntimeSnapshot,
    staleTime: options?.staleTime ?? 10000,
    refetchInterval: options?.refetchInterval ?? 30000,
  })
}

export function useRuntimeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fetchRuntimeSnapshot,
    onSuccess: (data) => {
      queryClient.setQueryData(RUNTIME_KEYS.snapshot(), data)
    },
  })
}
