import { useCognitionDashboard, useMemoryVisualization, useEvolutionDashboard, useEmotionDashboard, useSpriteState } from '@/hooks/useSpriteData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Brain, Database, TrendingUp, Heart, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { format } from 'date-fns'

const PHASE_COLORS = {
  PERCEPTION: '#3b82f6',
  CONTEXT_BUILD: '#8b5cf6',
  REASONING: '#f59e0b',
  DECISION: '#ef4444',
  ACTION: '#22c55e',
  LEARNING: '#06b6d4',
}

function CognitionWidget() {
  const { data, isLoading } = useCognitionDashboard()

  if (isLoading) return <Skeleton className="h-[200px]" />

  const phaseData = data?.phaseStats.map((p) => ({
    name: p.phase.replace('_', '\n'),
    count: p.eventCount,
    fill: PHASE_COLORS[p.phase as keyof typeof PHASE_COLORS] || '#6b7280',
  })) || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Brain className="h-5 w-5" />
          认知状态
        </CardTitle>
        <Badge variant="outline">{data?.totalEvents || 0} 事件</Badge>
      </CardHeader>
      <CardContent>
        {data && (
          <>
            <div className="mb-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{data.successRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">成功率</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{data.avgCycleDurationMs.toFixed(0)}ms</p>
                <p className="text-xs text-muted-foreground">平均周期</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{data.totalHistorySize}</p>
                <p className="text-xs text-muted-foreground">历史大小</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={phaseData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function MemoryWidget() {
  const { data, isLoading } = useMemoryVisualization()

  if (isLoading) return <Skeleton className="h-[200px]" />

  const typeData = data ? [
    { name: '情景', value: data.typeStats.episodicCount, color: '#3b82f6' },
    { name: '语义', value: data.typeStats.semanticCount, color: '#8b5cf6' },
    { name: '程序', value: data.typeStats.proceduralCount, color: '#22c55e' },
    { name: '感知', value: data.typeStats.perceptiveCount, color: '#f59e0b' },
  ] : []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Database className="h-5 w-5" />
          记忆状态
        </CardTitle>
        <Badge variant="outline">{data?.totalMemoryCount || 0} 条</Badge>
      </CardHeader>
      <CardContent>
        {data && (
          <>
            <div className="mb-4 flex items-center justify-center">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={typeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {typeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="mb-1 text-xs text-muted-foreground">平均强度</p>
              <Progress value={data.averageStrength * 100} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function EvolutionWidget() {
  const { data, isLoading } = useEvolutionDashboard()

  if (isLoading) return <Skeleton className="h-[200px]" />

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <TrendingUp className="h-5 w-5" />
          进化状态
        </CardTitle>
        <Badge variant="outline">Level {data?.currentLevel || 0}</Badge>
      </CardHeader>
      <CardContent>
        {data && (
          <>
            <div className="mb-4">
              <div className="flex justify-between text-sm">
                <span>进化进度</span>
                <span>{data.currentLevel} / 100</span>
              </div>
              <Progress value={data.currentLevel} className="mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{data.totalEvolutions}</p>
                <p className="text-xs text-muted-foreground">总进化次数</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{data.insightSummary.totalInsights}</p>
                <p className="text-xs text-muted-foreground">总洞察数</p>
              </div>
            </div>
            {data.behaviorSummary.recentBehaviorPatterns.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-muted-foreground">最近行为模式</p>
                <div className="flex flex-wrap gap-1">
                  {data.behaviorSummary.recentBehaviorPatterns.slice(0, 3).map((pattern, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function EmotionWidget() {
  const { data, isLoading } = useEmotionDashboard()

  if (isLoading) return <Skeleton className="h-[200px]" />

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Heart className="h-5 w-5" />
          主人情绪
        </CardTitle>
        <Badge variant="outline">{data?.currentEmotion || '未知'}</Badge>
      </CardHeader>
      <CardContent>
        {data && (
          <>
            <div className="mb-4 text-center">
              <p className="text-3xl font-bold">
                {data.averageSentiment.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">平均情绪值</p>
            </div>
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-lg font-bold text-green-500">{data.distribution.positivePercent.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">积极</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-500">{data.distribution.neutralPercent.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">中性</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-500">{data.distribution.negativePercent.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">消极</p>
              </div>
            </div>
            {data.optimalTimes.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-muted-foreground">最佳联系时间</p>
                <div className="flex gap-1">
                  {data.optimalTimes.slice(0, 3).map((t, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {t.timeSlot}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function QuickStats() {
  const { data: spriteState } = useSpriteState()

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">
                {spriteState?.isRunning ? '运行中' : '已停止'}
              </p>
              <p className="text-xs text-muted-foreground">系统状态</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Brain className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">
                {spriteState?.hasLlmSupport ? '已连接' : '离线'}
              </p>
              <p className="text-xs text-muted-foreground">LLM 状态</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Database className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">
                {spriteState?.memoryStatus.longTermCount || 0}
              </p>
              <p className="text-xs text-muted-foreground">长期记忆</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">
                {spriteState?.identity?.name || 'Sprite'}
              </p>
              <p className="text-xs text-muted-foreground">当前身份</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  const { data: spriteState, isLoading } = useSpriteState()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <QuickStats />

      {/* Widgets Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <CognitionWidget />
        <MemoryWidget />
        <EvolutionWidget />
        <EmotionWidget />
      </div>

      {/* Last Update */}
      <p className="text-center text-xs text-muted-foreground">
        最后更新: {format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
      </p>
    </div>
  )
}
