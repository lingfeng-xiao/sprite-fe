import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LifePage from '@/pages/LifePage'
import { useIdentityStore } from '@/stores/identityStore'
import { useSelfStore } from '@/stores/selfStore'
import { useRelationshipStore } from '@/stores/relationshipStore'
import { useGoalStore } from '@/stores/goalStore'

// Mock the stores
vi.mock('@/stores/identityStore')
vi.mock('@/stores/selfStore')
vi.mock('@/stores/relationshipStore')
vi.mock('@/stores/goalStore')

describe('LifePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock implementations
    vi.mocked(useIdentityStore).mockReturnValue({
      profile: null,
      getIdentityStatement: () => '测试身份',
    } as any)
    vi.mocked(useSelfStore).mockReturnValue({
      selfState: null,
      currentFocus: null,
      getEnergyPercent: () => 0,
      getCoherencePercent: () => 0,
      getSelfSummary: () => '未初始化自我',
    } as any)
    vi.mocked(useRelationshipStore).mockReturnValue({
      profile: null,
      trustState: null,
      getRelationshipSummary: () => '未初始化关系',
      getActiveProjects: () => [],
    } as any)
    vi.mocked(useGoalStore).mockReturnValue({
      getActiveGoals: () => [],
      getActiveTracks: () => [],
      getActiveIntentionsList: () => [],
      getTopPriorityIntention: () => null,
      getGoalSummary: () => '暂无目标数据',
    } as any)
  })

  it('renders page title', () => {
    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders page description', () => {
    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )
    expect(screen.getByText(/了解 Sprite 的生命状态/)).toBeInTheDocument()
  })

  it('renders loading skeleton when identity profile is null', () => {
    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )
    // Should show skeleton for identity section
    expect(document.querySelector('.animate-pulse')).toBeTruthy()
  })

  it('renders IdentitySummary card with skeleton when profile is null', () => {
    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )
    expect(screen.getByText('生命身份')).toBeInTheDocument()
    expect(document.querySelector('.animate-pulse')).toBeTruthy()
  })

  it('renders IdentitySummary card with profile data when available', () => {
    vi.mocked(useIdentityStore).mockReturnValue({
      profile: {
        emoji: '🤖',
        displayName: '测试Sprite',
        vibe: '聪明且好奇',
        essence: '一个热爱学习的AI助手',
        constraints: [],
        narrative: [],
      },
      getIdentityStatement: () => '我是测试身份',
    } as any)

    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )

    expect(screen.getByText('🤖')).toBeInTheDocument()
    expect(screen.getByText('测试Sprite')).toBeInTheDocument()
    expect(screen.getByText('聪明且好奇')).toBeInTheDocument()
    expect(screen.getByText('我是测试身份')).toBeInTheDocument()
  })

  it('renders SelfSummary card with skeleton when selfState is null', () => {
    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )
    expect(screen.getByText('自我状态')).toBeInTheDocument()
  })

  it('renders SelfSummary card with self data when available', () => {
    vi.mocked(useSelfStore).mockReturnValue({
      selfState: {
        attentionFoci: ['TASK'],
        emotionalBaseline: 0.8,
        energyLevel: 0.75,
        coherenceScore: 0.85,
        lastUpdated: new Date().toISOString(),
      },
      currentFocus: {
        type: 'TASK' as const,
        description: '编写测试',
        relatedEntityId: 'test-123',
        intensity: 0.9,
        startedAt: new Date().toISOString(),
        expectedDurationMs: 3600000,
      },
      getEnergyPercent: () => 75,
      getCoherencePercent: () => 85,
      getSelfSummary: () => '状态: TASK | 能量: 75% | 一致性: 85%',
    } as any)

    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )

    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('TASK')).toBeInTheDocument()
    expect(screen.getByText('编写测试')).toBeInTheDocument()
  })

  it('renders RelationshipSummary card with skeleton when profile is null', () => {
    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )
    expect(screen.getByText('关系状态')).toBeInTheDocument()
  })

  it('renders RelationshipSummary card with relationship data when available', () => {
    vi.mocked(useRelationshipStore).mockReturnValue({
      profile: {
        relationshipId: 'rel-1',
        type: 'FRIEND' as const,
        strength: 0.8,
        description: '好朋友',
        establishedAt: new Date().toISOString(),
        lastInteractionAt: new Date().toISOString(),
        interactionCount: 50,
      },
      trustState: {
        level: 'HIGH' as const,
        score: 0.85,
        establishedAt: new Date().toISOString(),
        lastVerifiedAt: new Date().toISOString(),
        verificationCount: 10,
        betrayalCount: 0,
      },
      getRelationshipSummary: () => '关系: FRIEND | 信任: HIGH',
      getActiveProjects: () => [
        {
          projectId: 'proj-1',
          name: '项目A',
          description: '测试项目',
          status: 'ACTIVE' as const,
          engagement: 0.7,
          createdAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
          completedAt: null,
        },
      ],
    } as any)

    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )

    expect(screen.getByText('FRIEND')).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('1 个活跃')).toBeInTheDocument()
  })

  it('renders GoalSummary card with empty data', () => {
    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )

    expect(screen.getByText('目标状态')).toBeInTheDocument()
    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
  })

  it('renders GoalSummary card with goal data when available', () => {
    vi.mocked(useGoalStore).mockReturnValue({
      getActiveGoals: () => [
        {
          goalId: 'goal-1',
          title: '学习AI',
          description: '深入学习人工智能',
          category: 'LEARNING' as const,
          status: 'ACTIVE' as const,
          progress: 0.6,
          createdAt: new Date().toISOString(),
          expectedCompletionAt: new Date().toISOString(),
          completedAt: null,
          milestones: [],
          abandonmentReason: null,
        },
      ],
      getActiveTracks: () => [
        {
          trackId: 'track-1',
          title: '课程学习',
          description: '完成在线课程',
          relatedGoalId: 'goal-1',
          status: 'ON_TRACK' as const,
          targetProgress: 0.5,
          actualProgress: 0.4,
          startedAt: new Date().toISOString(),
          deadline: new Date().toISOString(),
          lastCheckedAt: new Date().toISOString(),
          relatedActionIds: [],
          blocker: null,
        },
      ],
      getActiveIntentionsList: () => [
        {
          intentionId: 'int-1',
          description: '完成第一章',
          relatedTrackId: 'track-1',
          status: 'ACTIVE' as const,
          urgency: 'HIGH' as const,
          intensity: 0.8,
          createdAt: new Date().toISOString(),
          activatedAt: new Date().toISOString(),
          completedAt: null,
          deadline: new Date().toISOString(),
          failureReason: null,
        },
      ],
      getTopPriorityIntention: () => ({
        intentionId: 'int-1',
        description: '完成第一章',
        relatedTrackId: 'track-1',
        status: 'ACTIVE' as const,
        urgency: 'HIGH' as const,
        intensity: 0.8,
        createdAt: new Date().toISOString(),
        activatedAt: new Date().toISOString(),
        completedAt: null,
        deadline: new Date().toISOString(),
        failureReason: null,
      }),
      getGoalSummary: () => '长期目标: 1个活跃 | 中期追踪: 1个进行中',
    } as any)

    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )

    expect(screen.getAllByText('1').length).toBe(3)
    expect(screen.getByText('HIGH')).toBeInTheDocument()
    expect(screen.getByText('完成第一章')).toBeInTheDocument()
  })

  it('renders QuickLinks card', () => {
    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )

    expect(screen.getByText('快速入口')).toBeInTheDocument()
    expect(screen.getByText('自我详情')).toBeInTheDocument()
    expect(screen.getByText('关系详情')).toBeInTheDocument()
    expect(screen.getByText('目标详情')).toBeInTheDocument()
    expect(screen.getByText('进入控制台')).toBeInTheDocument()
  })

  it('renders page footer', () => {
    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )

    expect(screen.getByText('生命界面 - 展示 Sprite 作为数字生命的存在状态')).toBeInTheDocument()
  })

  it('renders correct emoji in header when profile exists', () => {
    vi.mocked(useIdentityStore).mockReturnValue({
      profile: {
        emoji: '🌟',
        displayName: '雪梨',
        vibe: '活泼开朗',
        essence: '热爱生活',
        constraints: [],
        narrative: [],
      },
      getIdentityStatement: () => '我是雪梨',
    } as any)

    render(
      <MemoryRouter>
        <LifePage />
      </MemoryRouter>
    )

    expect(screen.getAllByText(/🌟/).length).toBe(2)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
