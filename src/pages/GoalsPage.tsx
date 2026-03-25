import { useGoalStore } from '@/stores/goalStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Target,
  Layers,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

function LongTermGoalsSection() {
  const { getActiveGoals, longTermGoals } = useGoalStore()
  const activeGoals = getActiveGoals()

  const categoryIcons: Record<string, string> = {
    PERSONAL_GROWTH: '🌱',
    RELATIONSHIP: '💝',
    CAPABILITY: '⚡',
    CREATION: '🎨',
    LEARNING: '📚',
    CONTRIBUTION: '🤝',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          长期目标
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Target className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">暂无活跃的长期目标</p>
          </div>
        ) : (
          activeGoals.map((goal) => (
            <div key={goal.goalId} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{categoryIcons[goal.category] || '🎯'}</span>
                  <div>
                    <p className="font-medium">{goal.title}</p>
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {goal.category.replace('_', ' ')}
                </Badge>
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">进度</span>
                  <span className="font-medium">{(goal.progress * 100).toFixed(0)}%</span>
                </div>
                <Progress value={goal.progress * 100} className="h-2" />
              </div>

              {/* Milestones */}
              {goal.milestones.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium">里程碑</p>
                  <div className="space-y-1">
                    {goal.milestones.map((ms) => (
                      <div key={ms.id} className="flex items-center gap-2 text-sm">
                        {ms.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={ms.completed ? 'text-muted-foreground' : ''}>
                          {ms.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deadline */}
              {goal.expectedCompletionAt && (
                <p className="text-xs text-muted-foreground">
                  预期完成: {new Date(goal.expectedCompletionAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}

        {/* Show archived goals */}
        {longTermGoals.filter((g) => g.status !== 'ACTIVE').length > 0 && (
          <div className="pt-4">
            <p className="text-xs text-muted-foreground">
              已完成/已放弃: {longTermGoals.filter((g) => g.status !== 'ACTIVE').length} 个
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MidTermTracksSection() {
  const { getActiveTracks } = useGoalStore()
  const activeTracks = getActiveTracks()

  const statusColors: Record<string, string> = {
    ON_TRACK: 'text-green-500',
    AHEAD: 'text-blue-500',
    BEHIND: 'text-yellow-500',
    BLOCKED: 'text-red-500',
    COMPLETED: 'text-gray-500',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          中期追踪
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Layers className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">暂无活跃的中期追踪</p>
          </div>
        ) : (
          activeTracks.map((track) => (
            <div key={track.trackId} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{track.title}</p>
                  <p className="text-xs text-muted-foreground">{track.description}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${statusColors[track.status]}`}
                >
                  {track.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Progress Gap */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">实际进度</span>
                  <span className="font-medium">
                    {(track.actualProgress * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={track.actualProgress * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>目标: {(track.targetProgress * 100).toFixed(0)}%</span>
                  <span className={track.actualProgress < track.targetProgress ? 'text-red-500' : ''}>
                    差距: {((track.targetProgress - track.actualProgress) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Blocker */}
              {track.blocker && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-destructive">阻塞: {track.blocker}</span>
                </div>
              )}

              {/* Deadline */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>截止: {new Date(track.deadline).toLocaleDateString()}</span>
                {new Date(track.deadline) < new Date() && track.status !== 'COMPLETED' && (
                  <Badge variant="destructive" className="text-xs">
                    已超时
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function ActiveIntentionsSection() {
  const { getActiveIntentionsList, getTopPriorityIntention } = useGoalStore()
  const intentions = getActiveIntentionsList()
  const topIntention = getTopPriorityIntention()

  const urgencyColors: Record<string, string> = {
    CRITICAL: 'bg-red-500',
    HIGH: 'bg-orange-500',
    NORMAL: 'bg-blue-500',
    LOW: 'bg-gray-500',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          当前意向
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topIntention && (
          <div className="rounded-lg bg-primary/10 p-4">
            <p className="text-sm font-medium">最高优先级</p>
            <div className="mt-2 flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${urgencyColors[topIntention.urgency]}`} />
              <span className="font-medium">{topIntention.description}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {topIntention.urgency}
              </Badge>
              <span>强度: {(topIntention.intensity * 100).toFixed(0)}%</span>
              {topIntention.deadline && (
                <span>截止: {new Date(topIntention.deadline).toLocaleString()}</span>
              )}
            </div>
          </div>
        )}

        {intentions.filter((i) => i.intentionId !== topIntention?.intentionId).length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">其他活跃意向</p>
            {intentions
              .filter((i) => i.intentionId !== topIntention?.intentionId)
              .map((intention) => (
                <div
                  key={intention.intentionId}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${urgencyColors[intention.urgency]}`} />
                    <span className="text-sm">{intention.description}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {intention.urgency}
                  </Badge>
                </div>
              ))}
          </div>
        )}

        {intentions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Zap className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">暂无活跃意向</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function GoalOverviewSection() {
  const { getActiveGoals, getActiveTracks, getActiveIntentionsList, hasConflicts, getGoalSummary } =
    useGoalStore()

  const activeGoals = getActiveGoals()
  const activeTracks = getActiveTracks()
  const intentions = getActiveIntentionsList()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          目标概览
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">{activeGoals.length}</p>
            <p className="text-xs text-muted-foreground">长期目标</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{activeTracks.length}</p>
            <p className="text-xs text-muted-foreground">中期追踪</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{intentions.length}</p>
            <p className="text-xs text-muted-foreground">当前意向</p>
          </div>
        </div>

        {/* Conflicts Warning */}
        {hasConflicts() && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">检测到目标冲突</p>
              <p className="text-xs text-muted-foreground">
                有 {useGoalStore.getState().detectedConflicts.length} 个冲突需要解决
              </p>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm">{getGoalSummary()}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🎯 目标</h1>
        <p className="text-muted-foreground">
          探索 Sprite 的长期愿景、中期追踪与当前意向
        </p>
      </div>

      {/* Overview */}
      <GoalOverviewSection />

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <LongTermGoalsSection />
        <MidTermTracksSection />
      </div>

      {/* Intentions Full Width */}
      <ActiveIntentionsSection />

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        目标页面 - 展示 Sprite 的目标体系与行动导向
      </p>
    </div>
  )
}
