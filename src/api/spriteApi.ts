import { apiClient } from './client'
import type {
  SpriteState,
  CognitionDashboardData,
  MemoryVisualizationData,
  EvolutionDashboardData,
  OwnerEmotionDashboardData,
  HealthDetails,
  DeviceInfo,
  CoordinationStatus,
  BackupListResult,
  BackupStatus,
  WorkerInfo,
  SpriteInfo,
  CollaborationSession,
  Task,
  CollaborationStatus,
  DiscoveryResult,
  TaskType,
  TaskStatus,
} from '@/types/api'

// Sprite State
export const getSpriteState = () =>
  apiClient.get<SpriteState>('/api/sprite/state').then((r) => r.data)

export const startSprite = () => apiClient.post('/api/sprite/start')

export const stopSprite = () => apiClient.post('/api/sprite/stop')

// Cognition
export const triggerCognitionCycle = () => apiClient.post('/api/sprite/cycle')

export const getCognitionDashboard = () =>
  apiClient.get<CognitionDashboardData>('/api/sprite/cognition/dashboard').then((r) => r.data)

// Memory
export const getMemoryVisualization = () =>
  apiClient.get<MemoryVisualizationData>('/api/sprite/memory/visualization').then((r) => r.data)

// Evolution
export const getEvolutionDashboard = () =>
  apiClient.get<EvolutionDashboardData>('/api/sprite/evolution/dashboard').then((r) => r.data)

// Emotions
export const getEmotionDashboard = () =>
  apiClient.get<OwnerEmotionDashboardData>('/api/sprite/emotions/dashboard').then((r) => r.data)

export const getWeeklyEmotionPattern = () =>
  apiClient.get<unknown>('/api/sprite/emotions/weekly').then((r) => r.data)

// Health
export const getHealthDetails = () =>
  apiClient.get<HealthDetails>('/api/sprite/health').then((r) => r.data)

export const getPerformanceAlerts = () =>
  apiClient.get<unknown[]>('/api/sprite/monitor/alerts').then((r) => r.data)

// Devices
export const getAllDevices = () =>
  apiClient.get<DeviceInfo[]>('/api/sprite/devices').then((r) => r.data)

export const getDeviceStatus = () =>
  apiClient.get<CoordinationStatus>('/api/sprite/devices/status').then((r) => r.data)

export const getLocalDevice = () =>
  apiClient.get<DeviceInfo>('/api/sprite/devices/local').then((r) => r.data)

export const registerDevice = (device: unknown) =>
  apiClient.post('/api/sprite/devices/register', device)

export const triggerDeviceSync = () =>
  apiClient.post('/api/sprite/devices/sync').then((r) => r.data)

// Backup
export const getBackupList = () =>
  apiClient.get<BackupListResult>('/api/sprite/backup/list').then((r) => r.data)

export const getBackupStatus = () =>
  apiClient.get<BackupStatus>('/api/sprite/backup/status').then((r) => r.data)

export const triggerBackup = () =>
  apiClient.post('/api/sprite/backup').then((r) => r.data)

export const restoreFromBackup = (timestamp: string) =>
  apiClient.post('/api/sprite/backup/restore', null, { params: { timestamp } })

// Agent Workers
export const getAgentWorkers = () =>
  apiClient.get<WorkerInfo[]>('/api/agent/workers').then((r) => r.data)

// ==================== Team Collaboration ====================

export const getTeamSprites = () =>
  apiClient.get<SpriteInfo[]>('/api/team/sprites').then((r) => r.data)

export const getTeamSessions = () =>
  apiClient.get<CollaborationSession[]>('/api/team/sessions').then((r) => r.data)

export const createTeamSession = (targetSpriteId: string) =>
  apiClient.post<CollaborationSession>('/api/team/sessions', { targetSpriteId }).then((r) => r.data)

export const getSessionDetails = (sessionId: string) =>
  apiClient.get<CollaborationSession>(`/api/team/sessions/${sessionId}`).then((r) => r.data)

export const discoverSprites = () =>
  apiClient.post<DiscoveryResult>('/api/team/sprites/discover').then((r) => r.data)

export const distributeTask = (
  sessionId: string,
  type: TaskType,
  payload: Record<string, unknown>,
  assignedTo: string
) =>
  apiClient.post<Task>(`/api/team/sessions/${sessionId}/tasks`, { type, payload, assignedTo }).then((r) => r.data)

export const getSessionTasks = (sessionId: string) =>
  apiClient.get<Task[]>(`/api/team/sessions/${sessionId}/tasks`).then((r) => r.data)

export const updateTaskStatus = (taskId: string, status: TaskStatus, result?: string) =>
  apiClient.put<Task>(`/api/team/tasks/${taskId}/status`, { status, result }).then((r) => r.data)

export const getCollaborationStatus = () =>
  apiClient.get<CollaborationStatus>('/api/team/status').then((r) => r.data)
