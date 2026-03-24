// Sprite State Types
export interface SpriteState {
  identity: SelfModel
  platform: 'CLOUD' | 'PHONE' | 'PC'
  worldModel: WorldModel
  memoryStatus: MemoryStatus
  lastCycleTime: string
  isRunning: boolean
  hasLlmSupport: boolean
}

export interface SelfModel {
  identity: IdentityCore
  personality: Personality
  capabilities: Capabilities
  avatars: Avatar[]
  metacognition: Metacognition
  growthHistory: GrowthHistory
  evolutionLevel: number
  evolutionCount: number
}

export interface IdentityCore {
  beingId: string
  name: string
  essence: string
  emoji: string
  vibe: string
  createdAt: string
  continuityChain: string
}

export interface Personality {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export interface Capabilities {
  skills: Record<string, SkillLevel>
}

export type SkillLevel = 'MASTER' | 'ADVANCED' | 'BASIC' | 'NONE'

export interface Avatar {
  deviceId: string
  displayName: string
  status: string
}

export interface Metacognition {
  learningStyle: string
  decisionPatterns: string[]
  strengths: string[]
  weaknesses: string[]
}

export interface GrowthHistory {
  totalGrowthCycles: number
  lastGrowthTime: string
  growthRate: number
}

export interface WorldModel {
  owner: Owner
  context: Context
}

export interface Owner {
  ownerId: string
  name: string
  preferences: Record<string, unknown>
  habits: string[]
}

export interface Context {
  currentActivity: string
  location: string
  timeOfDay: string
  emotionalState: string
}

export interface MemoryStatus {
  sensoryCount: number
  workingMemoryUsed: number
  workingMemoryMax: number
  longTermCount: number
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
  phase: CognitionPhase
  eventCount: number
  successCount: number
  successRate: number
  avgDurationMs: number
}

export type CognitionPhase =
  | 'PERCEPTION'
  | 'CONTEXT_BUILD'
  | 'REASONING'
  | 'DECISION'
  | 'ACTION'
  | 'LEARNING'

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
