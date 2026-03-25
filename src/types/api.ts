// Sprite State Types - simplified based on actual API response
export interface SpriteState {
  identity: {
    beingId: string
    name: string
    essence: string
    emoji: string
    vibe: string
    createdAt: string
    continuityChain: string
    personality?: {
      openness: number
      conscientiousness: number
      extraversion: number
      agreeableness: number
      neuroticism: number
    }
    capabilities?: {
      skills: Record<string, string>
    }
    avatars?: Array<{
      deviceId: string
      displayName: string
      status: string
    }>
    metacognition?: {
      learningStyle: string
      decisionPatterns: string[]
      strengths: string[]
      weaknesses: string[]
    }
    growthHistory?: {
      totalGrowthCycles: number
      lastGrowthTime: string
      growthRate: number
    }
    evolutionLevel?: number
    evolutionCount?: number
  }
  platform: 'CLOUD' | 'PHONE' | 'PC'
  worldModel: {
    owner: {
      ownerId: string
      name: string
      preferences: Record<string, unknown>
      habits: string[]
    }
    context: {
      currentActivity: string
      location: string
      timeOfDay: string
      emotionalState: string
    }
  }
  memoryStatus: {
    sensoryCount: number
    workingMemoryUsed: number
    workingMemoryMax: number
    longTermCount: number
  }
  lastCycleTime: string
  isRunning: boolean
  hasLlmSupport: boolean
}

// Cognition Types
export interface CognitionDashboardData {
  timestamp: string
  totalEvents: number
  successCount: number
  successRate: number
  avgCycleDurationMs: number
  phaseStats: PhaseStats[]
  recentCycles: CognitionCycle[]
  totalHistorySize: number
}

export interface PhaseStats {
  phase: string
  eventCount: number
  successCount: number
  successRate: number
  avgDurationMs: number
}

export interface CognitionCycle {
  startTime: string
  endTime: string
  events: CognitionEvent[]
  totalDurationMs: number
  isComplete: boolean
}

export interface CognitionEvent {
  type: string
  timestamp: string
  data: Record<string, unknown>
}

// Memory Types
export interface MemoryVisualizationData {
  timestamp: string
  typeStats: MemoryTypeStats
  strengthDistribution: StrengthDistribution
  mostActiveMemories: MemoryActivity[]
  weakestMemories: MemoryActivity[]
  totalMemoryCount: number
  averageStrength: number
}

export interface MemoryTypeStats {
  episodicCount: number
  semanticCount: number
  proceduralCount: number
  perceptiveCount: number
  workingMemoryCount: number
}

export interface StrengthDistribution {
  veryLowCount: number
  lowCount: number
  mediumCount: number
  highCount: number
  veryHighCount: number
}

export interface MemoryActivity {
  memoryId: string
  memoryType: string
  lastAccessed: string
  accessCount: number
  strength: number
  preview: string
}

// Evolution Types
export interface EvolutionDashboardData {
  timestamp: string
  currentLevel: number
  totalEvolutions: number
  trend: EvolutionTrend
  recentHistory: EvolutionSnapshot[]
  insightSummary: InsightSummary
  behaviorSummary: BehaviorSummary
}

export interface EvolutionTrend {
  evolutionLevels: number[]
  learningRates: number[]
  insightCounts: number[]
  principleCounts: number[]
}

export interface EvolutionSnapshot {
  timestamp: string
  level: number
  changeType: string
  description: string
}

export interface InsightSummary {
  totalInsights: number
  recentInsights: number
  averageConfidence: number
  mostCommonType: string
}

export interface BehaviorSummary {
  totalChanges: number
  successfulChanges: number
  successRate: number
  recentBehaviorPatterns: string[]
}

// Emotion Types
export interface OwnerEmotionDashboardData {
  timestamp: string
  distribution: EmotionDistribution
  recentTrend: EmotionTrendPoint[]
  weeklyPatterns: WeeklyPattern[]
  averageSentiment: number
  sentimentVolatility: number
  currentEmotion: string
  optimalTimes: OptimalContactTime[]
}

export interface EmotionDistribution {
  positiveCount: number
  neutralCount: number
  negativeCount: number
  positivePercent: number
  neutralPercent: number
  negativePercent: number
}

export interface EmotionTrendPoint {
  timestamp: string
  sentiment: number
  emotion: string
}

export interface WeeklyPattern {
  dayOfWeek: number
  dayName: string
  averageSentiment: number
  interactionCount: number
  emotionalStability: number
}

export interface OptimalContactTime {
  hourOfDay: number
  timeSlot: string
  score: number
  reason: string
}

// Health Types
export interface HealthDetails {
  status: HealthStatus
  memoryUsagePercent: number
  memoryAlertThreshold: number
  cooldownMinutesRemaining: number
  llmAvailable: boolean
  llmDegraded: boolean
  llmConsecutiveFailures: number
  checkedAt: string
  sensorHealth: Record<string, SensorHealth>
}

export type HealthStatus = 'HEALTHY' | 'WARNING' | 'ALERT' | 'UNKNOWN'

export interface SensorHealth {
  sensorName: string
  healthy: boolean
  firstFailure: string | null
  lastResponse: string
  failureDurationMs: number
}

// Device Types
export interface DeviceInfo {
  deviceId: string
  deviceName: string
  deviceType: DeviceType
  ipAddress: string
  lastActive: string
  state: DeviceState
}

export type DeviceType = 'PC' | 'PHONE' | 'TABLET' | 'OTHER'
export type DeviceState = 'ONLINE' | 'OFFLINE' | 'SYNCING'

export interface CoordinationStatus {
  totalDevices: number
  activeDevices: number
  lastSyncTime: string
  pendingMessages: number
}

// Backup Types
export interface BackupListResult {
  backups: Backup[]
  totalCount: number
}

export interface Backup {
  timestamp: string
  type: string
  size: number
  commitMessage: string
}

export interface BackupStatus {
  backupEnabled: boolean
  lastBackupTime: string | null
}

// Agent Worker Types
export interface WorkerInfo {
  workerId: string
  type: WorkerType
  state: WorkerState
  registeredAt: string
  lastHeartbeat: string
}

export type WorkerType = 'PERCEPTION' | 'COGNITION' | 'ACTION'
export type WorkerState = 'RUNNING' | 'IDLE' | 'FAILED' | 'STOPPED'

// ==================== Team Collaboration Types ====================

export type CollaborationSpriteState = 'AVAILABLE' | 'BUSY' | 'UNREACHABLE' | 'UNKNOWN'

export interface SpriteCapability {
  name: string
  level: string
  confidence: number
}

export interface SpriteInfo {
  id: string
  name: string
  capabilities: SpriteCapability[]
  version: string
  endpoint: string
  lastSeen: string
  state: CollaborationSpriteState
  compatibilityScore: number
}

export type SessionStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'FAILED'

export interface CollaborationSession {
  id: string
  participants: string[]
  status: SessionStatus
  sharedContext: Record<string, unknown>
  createdAt: string
  lastActivity: string
  taskIds: string[]
}

export type TaskType = 'GENERAL' | 'ANALYSIS' | 'COORDINATION' | 'EXECUTION' | 'MONITORING'

export type TaskStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface Task {
  id: string
  type: TaskType
  payload: Record<string, unknown>
  assignedTo: string
  status: TaskStatus
  createdAt: string
  completedAt: string | null
  result: string | null
}

export interface CollaborationStatus {
  localSpriteId: string
  discoveredSpritesCount: number
  activeSessionsCount: number
  pendingTasksCount: number
  timestamp: string
}

export interface DiscoveryResult {
  sprites: SpriteInfo[]
  status: CollaborationStatus
}

// ==================== Skill Types ====================

export interface SkillParameter {
  name: string
  type: string
  required: boolean
  description?: string
  defaultValue?: string
}

export interface SkillInfo {
  id: string
  name: string
  description: string
  version: string
  triggers: string[]
  parameters: SkillParameter[]
  async: boolean
}

export interface SkillExecutionResult {
  success: boolean
  message: string
  data: unknown
  durationMs: number
  error?: string
}

// ==================== MCP Types ====================

export interface McpServerStatus {
  running: boolean
  toolCount?: number
  sessionCount?: number
  port?: number
  transport?: string
}

export interface McpServerInfo {
  name: string
  uri: string
  connected: boolean
  toolCount: number
}

export interface McpToolInfo {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

export interface McpClientStatus {
  connectedServers: number
  servers: McpServerInfo[]
}

export interface McpToolsResponse {
  tools: McpToolInfo[]
  count: number
  serverCount: number
}

// ==================== Model Config Types ====================

export interface ModelConfig {
  provider: string
  modelName: string
  apiKey: string
  baseUrl: string
  temperature: number
  maxTokens: number
}
