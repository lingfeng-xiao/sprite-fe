import { apiClient } from './client'
import type { SkillInfo, SkillExecutionResult } from '@/types/api'

export interface SkillListResponse {
  skills: SkillInfo[]
  count: number
}

export interface SkillExecutionRequest {
  parameters?: Record<string, unknown>
}

export interface SkillCreateResponse {
  success: boolean
  skill: SkillInfo
}

export interface SkillDeleteResponse {
  success: boolean
  skillId: string
  message: string
}

export const getSkills = () =>
  apiClient.get<SkillListResponse>('/api/skill').then((r) => r.data)

export const getSkill = (skillId: string) =>
  apiClient.get<SkillInfo>(`/api/skill/${skillId}`).then((r) => r.data)

export const findSkillsByTrigger = (trigger: string) =>
  apiClient.get<{ trigger: string; matches: string[]; count: number }>(
    '/api/skill/find',
    { params: { trigger } }
  ).then((r) => r.data)

export const executeSkill = (skillId: string, parameters?: Record<string, unknown>) =>
  apiClient.post<SkillExecutionResult>(`/api/skill/${skillId}/execute`, parameters || {}).then((r) => r.data)

export const executeSkillByTrigger = (trigger: string, parameters?: Record<string, unknown>) =>
  apiClient.post<SkillExecutionResult & { matchedSkill: string }>(
    '/api/skill/execute',
    parameters || {},
    { params: { trigger } }
  ).then((r) => r.data)

export const createSkill = (skillId: string, markdown: string) =>
  apiClient.post<SkillCreateResponse>(
    '/api/skill',
    markdown,
    { params: { skillId } }
  ).then((r) => r.data)

export const deleteSkill = (skillId: string) =>
  apiClient.delete<SkillDeleteResponse>(`/api/skill/${skillId}`).then((r) => r.data)
