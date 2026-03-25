import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { CycleMetrics } from '@/stores/cycleStore'

// ==================== Cycle API Hooks ====================

const CYCLE_KEYS = {
  all: ['cycles'] as const,
  list: () => [...CYCLE_KEYS.all, 'list'] as const,
  detail: (id: string) => [...CYCLE_KEYS.all, 'detail', id] as const,
}

/**
 * GET /api/cycles
 * Fetch all cycle metrics
 */
async function fetchCycles(): Promise<CycleMetrics> {
  const response = await apiClient.get<CycleMetrics>('/api/cycles')
  return response.data
}

/**
 * GET /api/cycles/{id}
 * Fetch a specific cycle by ID
 */
async function fetchCycleById(id: string): Promise<CycleMetrics> {
  const response = await apiClient.get<CycleMetrics>(`/api/cycles/${id}`)
  return response.data
}

export function useCycles(options?: { staleTime?: number; refetchInterval?: number }) {
  return useQuery({
    queryKey: CYCLE_KEYS.list(),
    queryFn: fetchCycles,
    staleTime: options?.staleTime ?? 5000,
    refetchInterval: options?.refetchInterval ?? 15000,
  })
}

export function useCycleById(id: string | undefined, options?: { staleTime?: number }) {
  return useQuery({
    queryKey: CYCLE_KEYS.detail(id ?? ''),
    queryFn: () => fetchCycleById(id!),
    enabled: !!id,
    staleTime: options?.staleTime ?? 5000,
  })
}

export function useCyclesMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fetchCycles,
    onSuccess: (data) => {
      queryClient.setQueryData(CYCLE_KEYS.list(), data)
    },
  })
}
