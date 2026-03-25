export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080'

export const QUERY_KEYS = {
  sprite: ['sprite'] as const,
  spriteState: ['sprite', 'state'] as const,
  cognition: ['sprite', 'cognition'] as const,
  memory: ['sprite', 'memory'] as const,
  memoryVisualization: ['sprite', 'memory', 'visualization'] as const,
  evolution: ['sprite', 'evolution'] as const,
  evolutionDashboard: ['sprite', 'evolution', 'dashboard'] as const,
  emotions: ['sprite', 'emotions'] as const,
  emotionDashboard: ['sprite', 'emotions', 'dashboard'] as const,
  health: ['sprite', 'health'] as const,
  devices: ['sprite', 'devices'] as const,
  backup: ['sprite', 'backup'] as const,
  agentWorkers: ['agent', 'workers'] as const,
  teamSprites: ['team', 'sprites'] as const,
  teamSessions: ['team', 'sessions'] as const,
  collaborationStatus: ['team', 'status'] as const,
} as const

export const REFRESH_INTERVALS = {
  spriteState: 30000,
  cognition: 15000,
  memory: 60000,
  evolution: 120000,
  emotions: 60000,
  health: 60000,
  devices: 30000,
  agentWorkers: 15000,
  teamSprites: 30000,
  teamSessions: 15000,
  collaborationStatus: 30000,
} as const
