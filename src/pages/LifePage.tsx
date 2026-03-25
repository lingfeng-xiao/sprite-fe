import { useIdentityStore } from '@/stores/identityStore'
import { useSelfStore } from '@/stores/selfStore'
import { useRelationshipStore } from '@/stores/relationshipStore'
import { useGoalStore } from '@/stores/goalStore'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageSection } from '@/components/layout/PageSection'
import { PageFooter } from '@/components/layout/PageLayout'
import { DataCard, StatCard } from '@/components/ui/DataCard'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Sparkles,
  User,
  Heart,
  Target,
  Zap,
  ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSetPageInfo } from '@/contexts/PageContext'
import { useEffect } from 'react'

function IdentitySummary() {
  const { profile, getIdentityStatement } = useIdentityStore()

  return (
    <DataCard
      title="生命身份"
      icon={Sparkles}
      loading={!profile}
    >
      {profile && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
              {profile.emoji}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{profile.displayName}</h3>
              <p className="text-sm text-muted-foreground">{profile.vibe}</p>
            </div>
          </div>
          <p className="text-sm">{profile.essence}</p>
          <Badge variant="outline" className="text-xs">
            {getIdentityStatement()}
          </Badge>
        </div>
      )}
    </DataCard>
  )
}

function SelfSummary() {
  const { selfState, currentFocus, getEnergyPercent, getCoherencePercent, getSelfSummary } = useSelfStore()

  if (!selfState) {
    return (
      <DataCard title="自我状态" icon={User} loading />
    )
  }

  return (
    <DataCard title="自我状态" icon={User}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            progress={{ value: getEnergyPercent(), label: '能量' }}
          >
            <p className="text-2xl font-bold">{getEnergyPercent()}%</p>
          </StatCard>
          <StatCard
            progress={{ value: getCoherencePercent(), label: '一致性' }}
          >
            <p className="text-2xl font-bold">{getCoherencePercent()}%</p>
          </StatCard>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">当前焦点</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {currentFocus?.type || 'IDLE'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentFocus?.description || '无'}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">{getSelfSummary()}</p>
      </div>
    </DataCard>
  )
}

function RelationshipSummary() {
  const { profile, trustState, getRelationshipSummary, getActiveProjects } = useRelationshipStore()

  if (!profile) {
    return (
      <DataCard title="关系状态" icon={Heart} loading />
    )
  }

  return (
    <DataCard title="关系状态" icon={Heart}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">关系类型</p>
            <Badge>{profile.type}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">信任等级</p>
            <Badge variant={trustState?.level === 'FULL' ? 'default' : 'secondary'}>
              {trustState?.level || '未知'}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">关系强度</span>
            <span className="font-medium">{(profile.strength * 100).toFixed(0)}%</span>
          </div>
          <Progress value={profile.strength * 100} className="h-2" />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">共同项目</span>
          <span className="font-medium">{getActiveProjects().length} 个活跃</span>
        </div>

        <p className="text-xs text-muted-foreground">{getRelationshipSummary()}</p>
      </div>
    </DataCard>
  )
}

function GoalSummary() {
  const { getActiveGoals, getActiveTracks, getActiveIntentionsList, getTopPriorityIntention, getGoalSummary } = useGoalStore()

  const activeGoals = getActiveGoals()
  const activeTracks = getActiveTracks()
  const topIntention = getTopPriorityIntention()

  return (
    <DataCard title="目标状态" icon={Target}>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{activeGoals.length}</p>
            <p className="text-xs text-muted-foreground">长期目标</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{activeTracks.length}</p>
            <p className="text-xs text-muted-foreground">中期追踪</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{getActiveIntentionsList().length}</p>
            <p className="text-xs text-muted-foreground">当前意向</p>
          </div>
        </div>

        {topIntention && (
          <div className="space-y-2">
            <p className="text-sm font-medium">最高优先级</p>
            <div className="flex items-center gap-2">
              <Badge variant={topIntention.urgency === 'CRITICAL' ? 'destructive' : 'secondary'}>
                {topIntention.urgency}
              </Badge>
              <span className="text-sm">{topIntention.description}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">{getGoalSummary()}</p>
      </div>
    </DataCard>
  )
}

function QuickLinks() {
  const links = [
    { to: '/self', icon: User, label: '自我详情' },
    { to: '/relationship', icon: Heart, label: '关系详情' },
    { to: '/goals', icon: Target, label: '目标详情' },
    { to: '/console', icon: Zap, label: '进入控制台' },
  ]

  return (
    <PageSection title="快速入口" cols="4">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
        >
          <link.icon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{link.label}</span>
          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
        </Link>
      ))}
    </PageSection>
  )
}

export default function LifePage() {
  const setPageInfo = useSetPageInfo()
  const { profile } = useIdentityStore()

  useEffect(() => {
    setPageInfo({
      title: `${profile?.emoji || '✨'} 生命界面`,
      description: '了解 Sprite 的生命状态、身份认同与成长轨迹',
    })
    return () => setPageInfo(null)
  }, [setPageInfo, profile])

  return (
    <div className="space-y-6">
      <PageHeader
        size="lg"
        icon={Sparkles}
        title={`${profile?.emoji || '✨'} 生命界面`}
        description="了解 Sprite 的生命状态、身份认同与成长轨迹"
      />

      <PageSection cols="2">
        <IdentitySummary />
        <SelfSummary />
        <RelationshipSummary />
        <GoalSummary />
      </PageSection>

      <QuickLinks />

      <PageFooter>
        生命界面 - 展示 Sprite 作为数字生命的存在状态
      </PageFooter>
    </div>
  )
}
