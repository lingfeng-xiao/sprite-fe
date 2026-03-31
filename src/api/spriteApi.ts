import { apiClient } from './client'
import type {
  LifeCommandRequest,
  LifeCommandResponse,
  LifeJournalEntry,
  LifeSnapshot,
  AutonomyStatus,
  ModelConfig,
  SpriteState,
  SpriteStateResponse,
  CognitionDashboardData,
  MemoryVisualizationData,
  EvolutionDashboardData,
  OwnerEmotionDashboardData,
  HealthDetails,
  DeviceInfo,
  CoordinationStatus,
  BackupListResult,
  BackupStatus,
  WorkerListResponse,
  SpriteInfo,
  CollaborationSession,
  Task,
  CollaborationStatus,
  DiscoveryResult,
  TaskType,
  TaskStatus,
} from '@/types/api'

// ==================== Life Main Chain ====================

export const getLifeSnapshot = () =>
  apiClient.get<LifeSnapshot>('/api/life/snapshot').then((r) => r.data)

export const sendLifeCommand = (request: LifeCommandRequest) =>
  apiClient.post<LifeCommandResponse>('/api/life/commands', request).then((r) => r.data)

export const getAutonomyStatus = () =>
  apiClient.get<AutonomyStatus>('/api/life/autonomy/status').then((r) => r.data)

export const pauseAutonomy = () =>
  apiClient.post<AutonomyStatus>('/api/life/autonomy/pause').then((r) => r.data)

export const resumeAutonomy = () =>
  apiClient.post<AutonomyStatus>('/api/life/autonomy/resume').then((r) => r.data)

export const getLifeJournal = (limit = 20) =>
  apiClient.get<LifeJournalEntry[]>('/api/life/journal', { params: { limit } }).then((r) => r.data)

export const resetLifeState = () =>
  apiClient.post<LifeSnapshot>('/api/life/reset').then((r) => r.data)

// ==================== Legacy Sprite Runtime ====================

function normalizeSpriteState(response: SpriteStateResponse): SpriteState {
  const identity = response.identity.identity
  const memoryStatus = response.memoryStatus
  const longTermStats = memoryStatus.longTermStats

  return {
    ...response,
    identity: {
      ...response.identity,
      beingId: identity.beingId,
      name: identity.displayName,
      displayName: identity.displayName,
      essence: identity.essence,
      emoji: identity.emoji,
      vibe: identity.vibe,
      createdAt: identity.createdAt,
      continuityChain: identity.continuityChain,
    },
    memoryStatus: {
      sensoryCount: memoryStatus.sensoryStimuliCount,
      workingMemoryUsed: memoryStatus.workingMemoryItems,
      workingMemoryMax: 7,
      longTermCount:
        longTermStats.episodicCount +
        longTermStats.semanticCount +
        longTermStats.proceduralCount +
        longTermStats.perceptiveCount,
      longTermStats,
    },
  }
}

// Legacy sprite state, retained for frozen dashboard compatibility.
export const getSpriteState = () =>
  apiClient.get<SpriteStateResponse>('/api/sprite/state').then((r) => normalizeSpriteState(r.data))

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
  apiClient.get<WorkerListResponse>('/api/agent/workers').then((r) => r.data.workers)

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

// ==================== Model Config ====================

export const getModelConfig = () =>
  apiClient.get<ModelConfig>('/api/model/config').then((r) => r.data)

export const updateModelConfig = (config: ModelConfig) =>
  apiClient.put<ModelConfig>('/api/model/config', config).then((r) => r.data)

export const testModelConnection = () =>
  apiClient.post<{ success: boolean; message: string }>('/api/model/test').then((r) => r.data)

export const getLifeModelConfig = getModelConfig
export const updateLifeModelConfig = updateModelConfig
