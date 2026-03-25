import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS, REFRESH_INTERVALS } from '@/lib/constants'
import * as skillApi from '@/api/skillApi'

export function useSkills() {
  return useQuery({
    queryKey: QUERY_KEYS.skills,
    queryFn: skillApi.getSkills,
    refetchInterval: REFRESH_INTERVALS.skills,
    staleTime: 10000,
  })
}

export function useSkill(skillId: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.skill, skillId],
    queryFn: () => skillApi.getSkill(skillId),
    enabled: !!skillId,
  })
}

export function useFindSkillsByTrigger(trigger: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.skill, 'find', trigger],
    queryFn: () => skillApi.findSkillsByTrigger(trigger),
    enabled: !!trigger,
  })
}

export function useExecuteSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ skillId, parameters }: { skillId: string; parameters?: Record<string, unknown> }) =>
      skillApi.executeSkill(skillId, parameters),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.skills })
    },
  })
}

export function useCreateSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ skillId, markdown }: { skillId: string; markdown: string }) =>
      skillApi.createSkill(skillId, markdown),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.skills })
    },
  })
}

export function useDeleteSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (skillId: string) => skillApi.deleteSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.skills })
    },
  })
}

export function useSkillActions() {
  const executeMutation = useExecuteSkill()
  const createMutation = useCreateSkill()
  const deleteMutation = useDeleteSkill()

  const execute = (skillId: string, parameters?: Record<string, unknown>) =>
    executeMutation.mutateAsync({ skillId, parameters })

  const create = (skillId: string, markdown: string) =>
    createMutation.mutateAsync({ skillId, markdown })

  const remove = (skillId: string) =>
    deleteMutation.mutateAsync(skillId)

  return {
    execute,
    create,
    remove,
    isExecuting: executeMutation.isPending,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    executeError: executeMutation.error,
    createError: createMutation.error,
    deleteError: deleteMutation.error,
  }
}
