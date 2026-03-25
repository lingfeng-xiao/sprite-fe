import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type { MemoryStats, WorkingMemory, EpisodicMemory, SemanticMemory } from '@/stores/memoryStore'

// ==================== Memory API Hooks ====================

const MEMORY_KEYS = {
  all: ['memories'] as const,
  stats: () => [...MEMORY_KEYS.all, 'stats'] as const,
  working: () => [...MEMORY_KEYS.all, 'working'] as const,
  episodic: () => [...MEMORY_KEYS.all, 'episodic'] as const,
  semantic: () => [...MEMORY_KEYS.all, 'semantic'] as const,
}

/**
 * GET /api/memories/stats
 * Fetch memory statistics
 */
async function fetchMemoryStats(): Promise<MemoryStats> {
  const response = await apiClient.get<MemoryStats>('/api/memories/stats')
  return response.data
}

/**
 * GET /api/memories/working
 * Fetch working memory data
 */
async function fetchWorkingMemory(): Promise<WorkingMemory> {
  const response = await apiClient.get<WorkingMemory>('/api/memories/working')
  return response.data
}

/**
 * GET /api/memories/episodic
 * Fetch episodic memories
 */
async function fetchEpisodicMemories(): Promise<EpisodicMemory[]> {
  const response = await apiClient.get<EpisodicMemory[]>('/api/memories/episodic')
  return response.data
}

/**
 * GET /api/memories/semantic
 * Fetch semantic memories
 */
async function fetchSemanticMemories(): Promise<SemanticMemory[]> {
  const response = await apiClient.get<SemanticMemory[]>('/api/memories/semantic')
  return response.data
}

export function useMemoryStats(options?: { staleTime?: number; refetchInterval?: number }) {
  return useQuery({
    queryKey: MEMORY_KEYS.stats(),
    queryFn: fetchMemoryStats,
    staleTime: options?.staleTime ?? 30000,
    refetchInterval: options?.refetchInterval ?? 60000,
  })
}

export function useWorkingMemory(options?: { staleTime?: number; refetchInterval?: number }) {
  return useQuery({
    queryKey: MEMORY_KEYS.working(),
    queryFn: fetchWorkingMemory,
    staleTime: options?.staleTime ?? 10000,
    refetchInterval: options?.refetchInterval ?? 30000,
  })
}

export function useEpisodicMemories(options?: { staleTime?: number; refetchInterval?: number }) {
  return useQuery({
    queryKey: MEMORY_KEYS.episodic(),
    queryFn: fetchEpisodicMemories,
    staleTime: options?.staleTime ?? 60000,
    refetchInterval: options?.refetchInterval ?? 120000,
  })
}

export function useSemanticMemories(options?: { staleTime?: number; refetchInterval?: number }) {
  return useQuery({
    queryKey: MEMORY_KEYS.semantic(),
    queryFn: fetchSemanticMemories,
    staleTime: options?.staleTime ?? 60000,
    refetchInterval: options?.refetchInterval ?? 120000,
  })
}

export function useMemoriesMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fetchMemoryStats,
    onSuccess: (data) => {
      queryClient.setQueryData(MEMORY_KEYS.stats(), data)
    },
  })
}
