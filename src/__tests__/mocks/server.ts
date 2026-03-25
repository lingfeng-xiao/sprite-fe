import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer(
  // Life Snapshot API
  http.get('/api/life/snapshot', () => HttpResponse.json({
    version: '1.0',
    generatedAt: new Date().toISOString(),
    identitySummary: '我是雪梨，一个聪明的数字生命',
    emoji: '🌟',
    displayName: '雪梨',
    currentState: {
      energyLevel: 0.85,
      coherenceScore: 0.9,
      emotionalBaseline: 0.7
    },
    attentionFocus: {
      type: 'IDLE',
      description: '空闲状态',
      intensity: 0.5
    },
    activeIntentions: [
      {
        intentionId: 'intent-1',
        description: '测试意向',
        status: 'ACTIVE',
        urgency: 'HIGH',
        intensity: 1.0
      }
    ],
    relationshipSummary: {
      relationshipType: 'FRIEND',
      trustLevel: 'HIGH',
      trustScore: 0.75,
      relationshipStrength: 0.8,
      interactionCount: 5,
      sharedProjectsCount: 2,
      topCarePriority: 'EMOTIONAL'
    },
    recentChanges: [],
    recentMemorySummaries: [],
    nextLikelyActions: ['继续学习', '保持联系'],
    coherenceScore: 0.9,
    pacingState: {
      currentLayer: 'MEDIUM',
      status: 'STABLE',
      pendingChangesCount: 0,
      recentChangesCount: 3,
      lastSyncTime: new Date().toISOString(),
      syncRecommendation: '保持当前节奏'
    }
  })),

  // Fallback for unhandled requests
  http.all('*', () => HttpResponse.json({ error: 'Not found' }, { status: 404 }))
)
