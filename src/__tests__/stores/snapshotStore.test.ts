import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useSnapshotStore } from '@/stores/snapshotStore'

// Mock fetch globally for store tests
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('snapshotStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useSnapshotStore.setState({
      snapshot: null,
      isLoading: false,
      error: null,
      lastFetchTime: null,
    })
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ==================== Initial State Tests ====================

  describe('initial state', () => {
    it('should have null snapshot initially', () => {
      const { snapshot } = useSnapshotStore.getState()
      expect(snapshot).toBeNull()
    })

    it('should have isLoading false initially', () => {
      const { isLoading } = useSnapshotStore.getState()
      expect(isLoading).toBe(false)
    })

    it('should have null error initially', () => {
      const { error } = useSnapshotStore.getState()
      expect(error).toBeNull()
    })

    it('should have null lastFetchTime initially', () => {
      const { lastFetchTime } = useSnapshotStore.getState()
      expect(lastFetchTime).toBeNull()
    })
  })

  // ==================== fetchSnapshot Tests ====================

  describe('fetchSnapshot', () => {
    const mockSnapshot = {
      version: '1.0',
      generatedAt: '2024-01-01T00:00:00Z',
      identitySummary: '我是雪梨',
      emoji: '🌟',
      displayName: '雪梨',
      currentState: {
        energyLevel: 0.85,
        coherenceScore: 0.9,
        emotionalBaseline: 0.7,
      },
      attentionFocus: {
        type: 'IDLE',
        description: '空闲',
        intensity: 0.5,
      },
      activeIntentions: [],
      relationshipSummary: {
        relationshipType: 'FRIEND',
        trustLevel: 'HIGH',
        trustScore: 0.75,
        relationshipStrength: 0.8,
        interactionCount: 5,
        sharedProjectsCount: 2,
        topCarePriority: 'EMOTIONAL',
      },
      recentChanges: [],
      recentMemorySummaries: [],
      nextLikelyActions: [],
      coherenceScore: 0.9,
      pacingState: {
        currentLayer: 'MEDIUM',
        status: 'STABLE',
        pendingChangesCount: 0,
        recentChangesCount: 3,
        lastSyncTime: '2024-01-01T00:00:00Z',
        syncRecommendation: '保持节奏',
      },
    }

    it('should set loading state while fetching', async () => {
      mockFetch.mockImplementation(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSnapshot),
      }))

      const fetchPromise = useSnapshotStore.getState().fetchSnapshot()

      // Loading should be true during fetch
      expect(useSnapshotStore.getState().isLoading).toBe(true)

      await fetchPromise
    })

    it('should set snapshot on successful fetch', async () => {
      mockFetch.mockImplementation(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSnapshot),
      }))

      await useSnapshotStore.getState().fetchSnapshot()

      const { snapshot } = useSnapshotStore.getState()
      expect(snapshot).not.toBeNull()
      expect(snapshot?.displayName).toBe('雪梨')
      expect(snapshot?.emoji).toBe('🌟')
    })

    it('should set lastFetchTime on successful fetch', async () => {
      mockFetch.mockImplementation(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSnapshot),
      }))

      await useSnapshotStore.getState().fetchSnapshot()

      const { lastFetchTime } = useSnapshotStore.getState()
      expect(lastFetchTime).not.toBeNull()
    })

    it('should clear error on successful fetch', async () => {
      useSnapshotStore.setState({ error: 'Previous error' })

      mockFetch.mockImplementation(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSnapshot),
      }))

      await useSnapshotStore.getState().fetchSnapshot()

      const { error } = useSnapshotStore.getState()
      expect(error).toBeNull()
    })

    // Note: Error handling tests are difficult with MSW intercepting fetch
    // The MSW server in setup.ts handles /api/life/snapshot requests
    // For error testing, one would need to use server.use() to override MSW handlers
  })

  // ==================== setSnapshot Tests ====================

  describe('setSnapshot', () => {
    it('should set snapshot and clear error', () => {
      const snapshot = {
        version: '1.0',
        generatedAt: '2024-01-01T00:00:00Z',
        identitySummary: '测试',
        emoji: '✨',
        displayName: '测试',
        currentState: {
          energyLevel: 0.5,
          coherenceScore: 0.5,
          emotionalBaseline: 0.5,
        },
        attentionFocus: {
          type: 'IDLE',
          description: '测试',
          intensity: 0.5,
        },
        activeIntentions: [],
        relationshipSummary: {
          relationshipType: 'FRIEND',
          trustLevel: 'MEDIUM',
          trustScore: 0.5,
          relationshipStrength: 0.5,
          interactionCount: 0,
          sharedProjectsCount: 0,
          topCarePriority: 'EMOTIONAL',
        },
        recentChanges: [],
        recentMemorySummaries: [],
        nextLikelyActions: [],
        coherenceScore: 0.5,
        pacingState: {
          currentLayer: 'MEDIUM',
          status: 'STABLE',
          pendingChangesCount: 0,
          recentChangesCount: 0,
          lastSyncTime: '2024-01-01T00:00:00Z',
          syncRecommendation: '',
        },
      }

      useSnapshotStore.setState({ error: 'Previous error' })
      useSnapshotStore.getState().setSnapshot(snapshot)

      const { snapshot: storedSnapshot, error } = useSnapshotStore.getState()
      expect(storedSnapshot).toEqual(snapshot)
      expect(error).toBeNull()
    })
  })

  // ==================== Computed Tests ====================

  describe('getCoherencePercent', () => {
    it('should return 0 when snapshot is null', () => {
      const percent = useSnapshotStore.getState().getCoherencePercent()
      expect(percent).toBe(0)
    })

    it('should return rounded percentage', () => {
      useSnapshotStore.setState({
        snapshot: {
          coherenceScore: 0.856,
        } as any,
      })

      const percent = useSnapshotStore.getState().getCoherencePercent()
      expect(percent).toBe(86)
    })
  })

  describe('getEnergyPercent', () => {
    it('should return 0 when snapshot is null', () => {
      const percent = useSnapshotStore.getState().getEnergyPercent()
      expect(percent).toBe(0)
    })

    it('should return 0 when currentState is missing', () => {
      useSnapshotStore.setState({
        snapshot: {} as any,
      })

      const percent = useSnapshotStore.getState().getEnergyPercent()
      expect(percent).toBe(0)
    })

    it('should return rounded percentage', () => {
      useSnapshotStore.setState({
        snapshot: {
          currentState: {
            energyLevel: 0.879,
          },
        } as any,
      })

      const percent = useSnapshotStore.getState().getEnergyPercent()
      expect(percent).toBe(88)
    })
  })

  describe('getSnapshotSummary', () => {
    it('should return "快照未加载" when snapshot is null', () => {
      const summary = useSnapshotStore.getState().getSnapshotSummary()
      expect(summary).toBe('快照未加载')
    })

    it('should return formatted summary', () => {
      useSnapshotStore.setState({
        snapshot: {
          emoji: '🌟',
          displayName: '雪梨',
          coherenceScore: 0.85,
          currentState: {
            energyLevel: 0.7,
          },
          pacingState: {
            currentLayer: 'MEDIUM',
          },
        } as any,
      })

      const summary = useSnapshotStore.getState().getSnapshotSummary()
      expect(summary).toContain('🌟')
      expect(summary).toContain('雪梨')
      expect(summary).toContain('85')
      expect(summary).toContain('70')
      expect(summary).toContain('MEDIUM')
    })
  })

  describe('hasPendingSync', () => {
    it('should return false when snapshot is null', () => {
      const hasPending = useSnapshotStore.getState().hasPendingSync()
      expect(hasPending).toBe(false)
    })

    it('should return false when pacingState status is not PENDING_SYNC', () => {
      useSnapshotStore.setState({
        snapshot: {
          pacingState: {
            status: 'STABLE',
          },
        } as any,
      })

      const hasPending = useSnapshotStore.getState().hasPendingSync()
      expect(hasPending).toBe(false)
    })

    it('should return true when pacingState status is PENDING_SYNC', () => {
      useSnapshotStore.setState({
        snapshot: {
          pacingState: {
            status: 'PENDING_SYNC',
          },
        } as any,
      })

      const hasPending = useSnapshotStore.getState().hasPendingSync()
      expect(hasPending).toBe(true)
    })
  })
})
