import { describe, it, expect, beforeEach } from 'vitest'
import { useIdentityStore } from '@/stores/identityStore'

describe('identityStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useIdentityStore.setState({
      profile: null,
      anchor: null,
      constraints: [],
      narrative: null,
      isLoading: false,
      error: null,
    })
  })

  // ==================== State Tests ====================

  describe('initial state', () => {
    it('should have null profile initially', () => {
      const { profile } = useIdentityStore.getState()
      expect(profile).toBeNull()
    })

    it('should have null anchor initially', () => {
      const { anchor } = useIdentityStore.getState()
      expect(anchor).toBeNull()
    })

    it('should have empty constraints initially', () => {
      const { constraints } = useIdentityStore.getState()
      expect(constraints).toEqual([])
    })

    it('should have null narrative initially', () => {
      const { narrative } = useIdentityStore.getState()
      expect(narrative).toBeNull()
    })

    it('should have isLoading false initially', () => {
      const { isLoading } = useIdentityStore.getState()
      expect(isLoading).toBe(false)
    })

    it('should have null error initially', () => {
      const { error } = useIdentityStore.getState()
      expect(error).toBeNull()
    })
  })

  // ==================== Action Tests ====================

  describe('setProfile', () => {
    it('should set profile correctly', () => {
      const profile = {
        displayName: '雪梨',
        essence: '聪明的数字生命',
        emoji: '🌟',
        vibe: '活泼',
      }

      useIdentityStore.getState().setProfile(profile)

      const { profile: storedProfile } = useIdentityStore.getState()
      expect(storedProfile).toEqual(profile)
    })

    it('should clear error when setting profile', () => {
      useIdentityStore.setState({ error: 'Previous error' })

      useIdentityStore.getState().setProfile({
        displayName: '雪梨',
        essence: '聪明的数字生命',
        emoji: '🌟',
        vibe: '活泼',
      })

      const { error } = useIdentityStore.getState()
      expect(error).toBeNull()
    })
  })

  describe('setAnchor', () => {
    it('should set anchor correctly', () => {
      const anchor = {
        beingId: 'being-123',
        createdAt: '2024-01-01T00:00:00Z',
        continuityChain: ['anchor-1', 'anchor-2'],
      }

      useIdentityStore.getState().setAnchor(anchor)

      const { anchor: storedAnchor } = useIdentityStore.getState()
      expect(storedAnchor).toEqual(anchor)
    })
  })

  describe('setConstraints', () => {
    it('should set constraints correctly', () => {
      const constraints = [
        {
          id: 'constraint-1',
          type: 'IMMUTABLE' as const,
          description: '不能伤害人类',
          isHardLimit: true,
          restrictiveness: 1.0,
        },
      ]

      useIdentityStore.getState().setConstraints(constraints)

      const { constraints: storedConstraints } = useIdentityStore.getState()
      expect(storedConstraints).toEqual(constraints)
    })
  })

  describe('setNarrative', () => {
    it('should set narrative correctly', () => {
      const narrative = {
        segments: [
          {
            timestamp: '2024-01-01T00:00:00Z',
            narrative: '初始叙事',
            trigger: 'INIT',
            context: '系统初始化',
          },
        ],
      }

      useIdentityStore.getState().setNarrative(narrative)

      const { narrative: storedNarrative } = useIdentityStore.getState()
      expect(storedNarrative).toEqual(narrative)
    })
  })

  describe('appendNarrative', () => {
    it('should append segment to existing narrative', () => {
      const initialNarrative = {
        segments: [
          {
            timestamp: '2024-01-01T00:00:00Z',
            narrative: '初始叙事',
            trigger: 'INIT',
            context: '系统初始化',
          },
        ],
      }

      useIdentityStore.getState().setNarrative(initialNarrative)

      const newSegment = {
        timestamp: '2024-01-02T00:00:00Z',
        narrative: '新叙事',
        trigger: 'UPDATE',
        context: '更新',
      }

      useIdentityStore.getState().appendNarrative(newSegment)

      const { narrative } = useIdentityStore.getState()
      expect(narrative?.segments).toHaveLength(2)
      expect(narrative?.segments[1]).toEqual(newSegment)
    })

    it('should create new narrative when none exists', () => {
      const segment = {
        timestamp: '2024-01-01T00:00:00Z',
        narrative: '首个叙事',
        trigger: 'INIT',
        context: '初始化',
      }

      useIdentityStore.getState().appendNarrative(segment)

      const { narrative } = useIdentityStore.getState()
      expect(narrative?.segments).toHaveLength(1)
      expect(narrative?.segments[0]).toEqual(segment)
    })
  })

  describe('setLoading', () => {
    it('should set loading state', () => {
      useIdentityStore.getState().setLoading(true)

      const { isLoading } = useIdentityStore.getState()
      expect(isLoading).toBe(true)
    })
  })

  describe('setError', () => {
    it('should set error and clear loading', () => {
      useIdentityStore.setState({ isLoading: true })

      useIdentityStore.getState().setError('Test error')

      const { error, isLoading } = useIdentityStore.getState()
      expect(error).toBe('Test error')
      expect(isLoading).toBe(false)
    })
  })

  // ==================== Computed Tests ====================

  describe('getIdentityStatement', () => {
    it('should return uninitialized message when profile is null', () => {
      const statement = useIdentityStore.getState().getIdentityStatement()
      expect(statement).toBe('未初始化身份')
    })

    it('should return formatted statement when profile exists', () => {
      useIdentityStore.setState({
        profile: {
          displayName: '雪梨',
          essence: '聪明的数字生命',
          emoji: '🌟',
          vibe: '活泼',
        },
      })

      const statement = useIdentityStore.getState().getIdentityStatement()
      expect(statement).toBe('🌟 雪梨 - 聪明的数字生命')
    })
  })

  describe('getImmutableConstraints', () => {
    it('should return empty array when no constraints', () => {
      const immutable = useIdentityStore.getState().getImmutableConstraints()
      expect(immutable).toEqual([])
    })

    it('should filter only IMMUTABLE constraints', () => {
      useIdentityStore.setState({
        constraints: [
          {
            id: 'constraint-1',
            type: 'IMMUTABLE' as const,
            description: '不可变约束',
            isHardLimit: true,
            restrictiveness: 1.0,
          },
          {
            id: 'constraint-2',
            type: 'FLEXIBLE' as const,
            description: '可变约束',
            isHardLimit: false,
            restrictiveness: 0.5,
          },
        ],
      })

      const immutable = useIdentityStore.getState().getImmutableConstraints()
      expect(immutable).toHaveLength(1)
      expect(immutable[0].type).toBe('IMMUTABLE')
    })
  })
})
