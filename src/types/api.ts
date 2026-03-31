// Sprite State Types - simplified based on actual API response
export interface SpriteState {
  identity: {
    beingId: string
    name: string
    displayName?: string
    essence: string
    emoji: string
    vibe: string
    createdAt: string
    continuityChain: string[]
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
    longTermStats?: {
      episodicCount: number
      semanticCount: number
      proceduralCount: number
      perceptiveCount: number
    }
  }
  lastCycleTime: string
  isRunning: boolean
  hasLlmSupport: boolean
}

export interface SpriteStateResponse {
  identity: {
    identity: {
      beingId: string
      displayName: string
      essence: string
      emoji: string
      vibe: string
      createdAt: string
      continuityChain: string[]
    }
    personality?: SpriteState['identity']['personality']
    capabilities?: SpriteState['identity']['capabilities']
    avatars?: SpriteState['identity']['avatars']
    metacognition?: SpriteState['identity']['metacognition']
    growthHistory?: SpriteState['identity']['growthHistory']
    evolutionLevel?: number
    evolutionCount?: number
  }
  platform: SpriteState['platform']
  worldModel: SpriteState['worldModel']
  memoryStatus: {
    sensoryStimuliCount: number
    workingMemoryItems: number
    longTermStats: {
      episodicCount: number
      semanticCount: number
      proceduralCount: number
      perceptiveCount: number
    }
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
  lastHeartbeat?: string
}

export interface WorkerListResponse {
  workers: WorkerInfo[]
  totalCount: number
  summary: Record<string, unknown>
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

export interface LifeCurrentState {
  attentionFoci: string[]
  emotionalBaseline: number
  energyLevel: number
  coherenceScore: number
  lastUpdated: string
  source: string
}

export interface LifeAttentionFocus {
  type: string
  description: string
  relatedEntityId: string
  intensity: number
  startedAt: string
  expectedDurationMs: number
}

export interface LifeActiveIntention {
  intentionId: string
  description: string
  relatedTrackId: string | null
  status: string
  urgency: string
  intensity: number
  createdAt: string
  activatedAt: string
  completedAt: string | null
  deadline: string | null
  failureReason: string | null
  dependsOn: string[]
}

export interface LifeRelationshipSummary {
  relationshipType: string
  trustLevel: string
  trustScore: number
  relationshipStrength: number
  interactionCount: number
  sharedProjectsCount: number
  topCarePriority: string
}

export interface LifeRecentChange {
  changeId: string
  type: string
  description: string
  previousState: string
  newState: string
  occurredAt: string
  trigger: string
  significance: string
}

export interface LifePacingState {
  currentLayer: string
  status: string
  pendingChangesCount: number
  recentChangesCount: number
  lastSyncTime: string
  syncRecommendation: string
}

export interface LifeSnapshot {
  version: string
  generatedAt: string
  identitySummary: string
  currentState: LifeCurrentState
  attentionFocus: LifeAttentionFocus
  activeIntentions: LifeActiveIntention[]
  relationshipSummary: LifeRelationshipSummary
  recentChanges: LifeRecentChange[]
  recentMemorySummaries: string[]
  nextLikelyActions: string[]
  coherenceScore: number
  pacingState: LifePacingState
  emoji: string
  displayName: string
}

export interface LifeCommandResult {
  commandId: string
  type: LifeCommandType
  summary: string
  detail: string
  success: boolean
}

export interface LifeSelfUpdate {
  energyChanged: boolean
  energyDelta: number
  focusChanged: boolean
  newFocus: string
  observation: string
}

export interface LifeRelationshipUpdate {
  interacted: boolean
  trustChanged: boolean
  trustDelta: number
  interactionType: string
}

export interface LifeGoalUpdate {
  intentionTriggered: boolean
  intentionId: string
  goalProgressed: boolean
  goalId: string
  progressDelta: number
}

export interface LifeMemoryUpdate {
  memoryCreated: boolean
  memoryType: string
  memoryId: string
}

export interface LifeGrowthUpdate {
  patternLearned: boolean
  patternType: string
  insight: string
  skillAcquired: boolean
  skillName: string
}

export interface LifeImpactReport {
  selfUpdate: LifeSelfUpdate
  relationshipUpdate: LifeRelationshipUpdate
  goalUpdate: LifeGoalUpdate
  memoryUpdate: LifeMemoryUpdate
  growthUpdate: LifeGrowthUpdate
}

export type LifeCommandType = 'ASK' | 'TASK' | 'RESEARCH' | 'ACTION' | 'LEARNING' | 'DECISION'

export interface LifeCommandRequest {
  type: LifeCommandType
  content: string
  context?: Record<string, unknown>
  source?: string
}

export interface LifeCommandResponse {
  commandResult: LifeCommandResult
  impactReport: LifeImpactReport
  lifeSnapshot: LifeSnapshot
}

export interface AutonomyStatus {
  mode: string
  paused: boolean
  allowInternal: boolean
  allowReadonly: boolean
  allowMutating: boolean
  autonomyFactor: number
  awarenessLevel: string
  totalDecisions: number
  autonomousDecisions: number
  recentActions: string[]
  updatedAt: string
}

export interface LifeJournalEntry {
  id: number
  entryType: string
  title: string
  detail: string
  createdAt: string
}
