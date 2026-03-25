import { useParams, useNavigate } from 'react-router-dom'
import { useCycles, useCycleById } from '@/hooks/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Lightbulb,
  Target,
  Zap,
  BookOpen,
} from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { CognitionEvent, CognitionCycle, PhaseStats } from '@/stores/cycleStore'

const PHASE_ICONS: Record<string, React.ElementType> = {
  PERCEPTION: Brain,
  CONTEXT_BUILD: BookOpen,
  REASONING: Lightbulb,
  DECISION: Target,
  ACTION: Zap,
  LEARNING: BookOpen,
}

const PHASE_COLORS: Record<string, string> = {
  PERCEPTION: 'bg-blue-500',
  CONTEXT_BUILD: 'bg-purple-500',
  REASONING: 'bg-amber-500',
  DECISION: 'bg-red-500',
  ACTION: 'bg-green-500',
  LEARNING: 'bg-cyan-500',
}

const PHASE_LABELS: Record<string, string> = {
  PERCEPTION: '感知',
  CONTEXT_BUILD: '上下文构建',
  REASONING: '推理',
  DECISION: '决策',
  ACTION: '行动',
  LEARNING: '学习',
}

interface ReasoningFrame {
  type: 'reasoning'
  phase: string
  content: string
  timestamp: string
  confidence?: number
}

interface DecisionRationale {
  type: 'decision'
  phase: string
  action: string
  rationale: string
  alternatives?: string[]
  timestamp: string
}

type FrameType = ReasoningFrame | DecisionRationale

function extractFrames(cycle: CognitionCycle): FrameType[] {
  const frames: FrameType[] = []

  for (const event of cycle.events) {
    const data = event.data as Record<string, unknown>

    if (event.type === 'reasoning' || data?.reasoning) {
      frames.push({
        type: 'reasoning',
        phase: (data?.phase as string) || 'UNKNOWN',
        content: (data?.reasoning as string) || (data?.content as string) || '',
        timestamp: event.timestamp,
        confidence: data?.confidence as number | undefined,
      })
    }

    if (event.type === 'decision' || data?.decision || data?.action) {
      frames.push({
        type: 'decision',
        phase: (data?.phase as string) || 'UNKNOWN',
        action: (data?.action as string) || (data?.decision as string) || '',
        rationale: (data?.rationale as string) || (data?.reason as string) || '',
        alternatives: data?.alternatives as string[] | undefined,
        timestamp: event.timestamp,
      })
    }
  }

  return frames
}

function PhaseTimeline({ phaseStats, totalDuration }: { phaseStats: PhaseStats[]; totalDuration: number }) {
  if (phaseStats.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>暂无阶段数据</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">执行进度</span>
        <span className="text-muted-foreground">总计 {totalDuration.toFixed(0)}ms</span>
      </div>

      <div className="relative">
        {/* Timeline bar */}
        <div className="flex h-12 overflow-hidden rounded-lg">
          {phaseStats.map((stat) => {
            const widthPercent = (stat.avgDurationMs / totalDuration) * 100
            return (
              <div
                key={stat.phase}
                className={`${PHASE_COLORS[stat.phase] || 'bg-gray-500'} flex items-center justify-center px-2`}
                style={{ width: `${Math.max(widthPercent, 5)}%` }}
                title={`${stat.phase}: ${stat.avgDurationMs.toFixed(0)}ms`}
              >
                <span className="truncate text-xs font-medium text-white">
                  {stat.phase.replace('_', ' ')}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Phase legend */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {phaseStats.map((stat) => {
          const Icon = PHASE_ICONS[stat.phase] || Brain
          return (
            <div key={stat.phase} className="flex items-center gap-2 rounded border p-2">
              <span
                className={`h-3 w-3 rounded-full ${PHASE_COLORS[stat.phase] || 'bg-gray-500'}`}
              />
              <Icon className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">
                  {PHASE_LABELS[stat.phase] || stat.phase}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.eventCount} 事件 / {stat.avgDurationMs.toFixed(0)}ms
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ReasoningFrameCard({ frame }: { frame: ReasoningFrame }) {
  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          推理过程
        </CardTitle>
        <Badge variant="outline">{PHASE_LABELS[frame.phase] || frame.phase}</Badge>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm">{frame.content}</p>
        {frame.confidence !== undefined && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">置信度</span>
              <span>{(frame.confidence * 100).toFixed(0)}%</span>
            </div>
            <Progress value={frame.confidence * 100} className="h-1" />
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          {format(new Date(frame.timestamp), 'HH:mm:ss.SSS', { locale: zhCN })}
        </p>
      </CardContent>
    </Card>
  )
}

function DecisionRationaleCard({ frame }: { frame: DecisionRationale }) {
  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Target className="h-4 w-4 text-red-500" />
          决策依据
        </CardTitle>
        <Badge variant="outline">{PHASE_LABELS[frame.phase] || frame.phase}</Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <p className="text-xs text-muted-foreground">决定</p>
          <p className="font-medium">{frame.action}</p>
        </div>
        <div className="mb-3">
          <p className="text-xs text-muted-foreground">理由</p>
          <p className="text-sm">{frame.rationale}</p>
        </div>
        {frame.alternatives && frame.alternatives.length > 0 && (
          <div>
            <p className="mb-1 text-xs text-muted-foreground">备选方案</p>
            <div className="flex flex-wrap gap-1">
              {frame.alternatives.map((alt, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {alt}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          {format(new Date(frame.timestamp), 'HH:mm:ss.SSS', { locale: zhCN })}
        </p>
      </CardContent>
    </Card>
  )
}

function EventLog({ events }: { events: CognitionEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>暂无事件记录</p>
      </div>
    )
  }

  return (
    <div className="max-h-96 space-y-2 overflow-y-auto">
      {events.map((event, index) => (
        <div key={index} className="rounded border p-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{event.type}</Badge>
            <span className="text-xs text-muted-foreground">
              {format(new Date(event.timestamp), 'HH:mm:ss.SSS', { locale: zhCN })}
            </span>
          </div>
          {event.data && Object.keys(event.data).length > 0 && (
            <pre className="mt-2 overflow-x-auto text-xs text-muted-foreground">
              {JSON.stringify(event.data, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}

function CycleDetailContent({ cycleId }: { cycleId: string }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Try to get cycle from the list first, then fall back to detail query
  const { data: cyclesData, isLoading: listLoading } = useCycles()
  const { data: cycleDetail, isLoading: detailLoading, error } = useCycleById(cycleId)

  // Find the specific cycle in the list
  const cycleFromList = cyclesData?.recentCycles.find((c) => c.startTime === cycleId)
  const cycle = cycleFromList || (cycleDetail && cycleDetail.recentCycles?.[0]) || null

  // Replay mutation
  const replayMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/api/cycles/${cycleId}/replay`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles'] })
    },
  })

  // Rerun mutation
  const rerunMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/api/cycles/${cycleId}/rerun`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles'] })
    },
  })

  const isLoading = listLoading || detailLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error || (!cycle && !cycleDetail)) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <XCircle className="mx-auto h-12 w-12" />
              <p className="mt-4 font-medium">周期不存在</p>
              <p className="mt-2 text-sm text-muted-foreground">
                未找到 ID 为 {cycleId} 的周期
              </p>
              <Button className="mt-4" variant="outline" onClick={() => navigate('/cycles')}>
                返回列表
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentCycle = cycle
  const metrics = cycleDetail || cyclesData
  const frames = currentCycle ? extractFrames(currentCycle) : []
  const reasoningFrames = frames.filter((f): f is ReasoningFrame => f.type === 'reasoning')
  const decisionFrames = frames.filter((f): f is DecisionRationale => f.type === 'decision')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cycles')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">周期详情</h1>
            <p className="text-muted-foreground">
              {currentCycle &&
                format(new Date(currentCycle.startTime), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => replayMutation.mutate()}
            disabled={replayMutation.isPending}
          >
            <Play className="mr-2 h-4 w-4" />
            {replayMutation.isPending ? '重放中...' : '重放'}
          </Button>
          <Button
            variant="outline"
            onClick={() => rerunMutation.mutate()}
            disabled={rerunMutation.isPending}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {rerunMutation.isPending ? '重运行中...' : '重新运行'}
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">状态</CardTitle>
            {currentCycle?.isComplete ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Clock className="h-4 w-4 text-yellow-500" />
            )}
          </CardHeader>
          <CardContent>
            <Badge variant={currentCycle?.isComplete ? 'success' : 'secondary'}>
              {currentCycle?.isComplete ? '完成' : '进行中'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">持续时间</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {currentCycle?.totalDurationMs.toFixed(0)}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">事件数</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentCycle?.events.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成功率</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {metrics ? `${(metrics.successRate * 100).toFixed(1)}%` : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Phase Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">阶段时间线</CardTitle>
        </CardHeader>
        <CardContent>
          <PhaseTimeline
            phaseStats={metrics?.phaseStats || []}
            totalDuration={currentCycle?.totalDurationMs || 0}
          />
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reasoning Frames */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              推理过程
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reasoningFrames.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Lightbulb className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-4">暂无推理记录</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reasoningFrames.map((frame, index) => (
                  <ReasoningFrameCard key={index} frame={frame} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Decision Rationale */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Target className="h-5 w-5 text-red-500" />
              决策依据
            </CardTitle>
          </CardHeader>
          <CardContent>
            {decisionFrames.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Target className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-4">暂无决策记录</p>
              </div>
            ) : (
              <div className="space-y-4">
                {decisionFrames.map((frame, index) => (
                  <DecisionRationaleCard key={index} frame={frame} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Event Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">事件日志</CardTitle>
        </CardHeader>
        <CardContent>
          <EventLog events={currentCycle?.events || []} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function CycleDetailPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <p className="mt-4 font-medium">缺少周期 ID</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <CycleDetailContent cycleId={id} />
}
