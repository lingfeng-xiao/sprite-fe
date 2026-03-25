import { useState } from 'react'
import { useCognitionDashboard, useMemoryVisualization, useEvolutionDashboard, useEmotionDashboard, useSpriteState, useHealthDetails, useAgentWorkers } from '@/hooks/useSpriteData'
import { useCycles, useMemoryStats, useWorkingMemory } from '@/hooks/api'
import { getAllDevices, getDeviceStatus } from '@/api/spriteApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Database, TrendingUp, Heart, Clock, Activity, Cpu, HardDrive, AlertCircle, CheckCircle, XCircle, Smartphone, Monitor, Tablet, Zap, Eye, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { WorkerType, WorkerState } from '@/types/api'

const PHASE_COLORS: Record<string, string> = {
  PERCEPTION: '#3b82f6',
  CONTEXT_BUILD: '#8b5cf6',
  REASONING: '#f59e0b',
  DECISION: '#ef4444',
  ACTION: '#22c55e',
  LEARNING: '#06b6d4',
}

// ==================== Overview Tab Widgets ====================

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

function CognitionWidget() {
  const { data, isLoading } = useCognitionDashboard()

  if (isLoading) return <Skeleton className="h-[200px]" />

  const phaseData = data?.phaseStats.map((p) => ({
    name: p.phase.replace('_', '\n'),
    count: p.eventCount,
    fill: PHASE_COLORS[p.phase] || '#6b7280',
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

// ==================== System Tab Widgets ====================

function HealthStatusCard() {
  const { data, isLoading } = useHealthDetails()

  if (isLoading) return <Skeleton className="h-[120px]" />

  const statusConfig = {
    HEALTHY: { color: 'text-green-500', label: '健康', icon: CheckCircle },
    WARNING: { color: 'text-yellow-500', label: '警告', icon: AlertCircle },
    ALERT: { color: 'text-red-500', label: '告警', icon: XCircle },
    UNKNOWN: { color: 'text-gray-500', label: '未知', icon: AlertCircle },
  }

  const config = statusConfig[data?.status || 'UNKNOWN']
  const StatusIcon = config.icon

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">系统状态</CardTitle>
        <Badge
          variant={
            data?.status === 'HEALTHY'
              ? 'success'
              : data?.status === 'WARNING'
              ? 'warning'
              : 'destructive'
          }
        >
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <StatusIcon className={`h-10 w-10 ${config.color}`} />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              LLM: {data?.llmAvailable ? '可用' : '不可用'}
              {data?.llmDegraded && ' (降级)'}
            </p>
            <p className="text-sm text-muted-foreground">
              冷却: {data?.cooldownMinutesRemaining || 0} 分钟
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MemoryUsageCard() {
  const { data, isLoading } = useHealthDetails()

  if (isLoading) return <Skeleton className="h-[120px]" />

  const usagePercent = data?.memoryUsagePercent || 0
  const threshold = data?.memoryAlertThreshold || 80

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <HardDrive className="h-5 w-5" />
          内存使用
        </CardTitle>
        <Badge variant={usagePercent > threshold ? 'destructive' : 'secondary'}>
          {usagePercent.toFixed(1)}%
        </Badge>
      </CardHeader>
      <CardContent>
        <Progress
          value={usagePercent}
          className={usagePercent > threshold ? '[&>div]:bg-destructive' : ''}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          告警阈值: {threshold}%
        </p>
      </CardContent>
    </Card>
  )
}

function LlmStatusCard() {
  const { data, isLoading } = useHealthDetails()

  if (isLoading) return <Skeleton className="h-[120px]" />

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Cpu className="h-5 w-5" />
          LLM 状态
        </CardTitle>
        <Badge variant={data?.llmAvailable ? 'success' : 'destructive'}>
          {data?.llmAvailable ? '可用' : '不可用'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">连续失败次数</span>
            <span className={(data?.llmConsecutiveFailures ?? 0) > 0 ? 'text-red-500' : ''}>
              {data?.llmConsecutiveFailures ?? 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">降级模式</span>
            <span>{data?.llmDegraded ? '是' : '否'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const deviceTypeIcons: Record<string, typeof Smartphone> = {
  PC: Monitor,
  PHONE: Smartphone,
  TABLET: Tablet,
  OTHER: Smartphone,
}

function DevicesStatusWidget() {
  const { data: devices, isLoading } = useQuery({
    queryKey: ['sprite', 'devices'],
    queryFn: getAllDevices,
  })
  const { data: status } = useQuery({
    queryKey: ['sprite', 'devices', 'status'],
    queryFn: getDeviceStatus,
  })

  if (isLoading) return <Skeleton className="h-[120px]" />

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Smartphone className="h-5 w-5" />
          设备状态
        </CardTitle>
        <Badge variant={devices && devices.length > 0 ? 'success' : 'secondary'}>
          {status?.activeDevices || 0} / {status?.totalDevices || 0} 活跃
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {devices?.slice(0, 3).map((device) => {
            const Icon = deviceTypeIcons[device.deviceType] || Smartphone
            return (
              <div key={device.deviceId} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {device.deviceName}
                </span>
                <Badge
                  variant={
                    device.state === 'ONLINE'
                      ? 'success'
                      : device.state === 'SYNCING'
                      ? 'warning'
                      : 'secondary'
                  }
                >
                  {device.state}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

const WORKER_TYPE_CONFIG: Record<WorkerType, { icon: typeof Brain; label: string; color: string }> = {
  PERCEPTION: { icon: Eye, label: '感知', color: 'text-blue-500' },
  COGNITION: { icon: Brain, label: '认知', color: 'text-purple-500' },
  ACTION: { icon: Zap, label: '行动', color: 'text-green-500' },
}

const WORKER_STATE_CONFIG: Record<WorkerState, { variant: 'success' | 'warning' | 'destructive' | 'secondary'; label: string }> = {
  RUNNING: { variant: 'success', label: '运行中' },
  IDLE: { variant: 'warning', label: '空闲' },
  FAILED: { variant: 'destructive', label: '失败' },
  STOPPED: { variant: 'secondary', label: '已停止' },
}

function AgentsStatusWidget() {
  const { data: workers, isLoading } = useAgentWorkers()

  if (isLoading) return <Skeleton className="h-[120px]" />

  const runningCount = workers?.filter((w) => w.state === 'RUNNING').length || 0
  const idleCount = workers?.filter((w) => w.state === 'IDLE').length || 0
  const failedCount = workers?.filter((w) => w.state === 'FAILED').length || 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Bot className="h-5 w-5" />
          Agent 状态
        </CardTitle>
        <Badge variant={failedCount > 0 ? 'destructive' : 'success'}>
          {runningCount} 运行中
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-green-500">{runningCount}</p>
            <p className="text-xs text-muted-foreground">运行</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-500">{idleCount}</p>
            <p className="text-xs text-muted-foreground">空闲</p>
          </div>
          <div>
            <p className="text-lg font-bold text-red-500">{failedCount}</p>
            <p className="text-xs text-muted-foreground">失败</p>
          </div>
        </div>
        {workers && workers.length > 0 && (
          <div className="mt-3 space-y-1">
            {workers.slice(0, 2).map((worker) => {
              const typeConfig = WORKER_TYPE_CONFIG[worker.type]
              const stateConfig = WORKER_STATE_CONFIG[worker.state]
              return (
                <div key={worker.workerId} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <typeConfig.icon className={`h-3 w-3 ${typeConfig.color}`} />
                    {worker.workerId}
                  </span>
                  <Badge variant={stateConfig.variant} className="text-xs">
                    {stateConfig.label}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ==================== Runtime Tab Components ====================

function CycleHistoryTable() {
  const { data, isLoading } = useCycles()
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)

  const recentCycles = data?.recentCycles || []
  const totalPages = Math.ceil(recentCycles.length / ITEMS_PER_PAGE)
  const paginatedCycles = recentCycles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (isLoading) {
    return <Skeleton className="h-64" />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Activity className="h-5 w-5" />
          最近认知周期
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{data?.totalEvents || 0} 事件</Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => setCurrentPage(1)}
          >
            刷新
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentCycles.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <Brain className="mx-auto h-12 w-12 opacity-50" />
            <p className="mt-4">暂无周期数据</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>开始时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">持续时间</TableHead>
                  <TableHead className="text-right">事件数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCycles.map((cycle, index) => (
                  <TableRow key={`${cycle.startTime}-${index}`}>
                    <TableCell className="font-mono text-xs">
                      {format(new Date(cycle.startTime), 'MM-dd HH:mm:ss', { locale: zhCN })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={cycle.isComplete ? 'success' : 'secondary'}>
                        {cycle.isComplete ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <RefreshCw className="mr-1 h-3 w-3" />
                        )}
                        {cycle.isComplete ? '完成' : '进行中'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono text-sm">{cycle.totalDurationMs.toFixed(0)}ms</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm">{cycle.events.length}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  第 {currentPage} / {totalPages} 页
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// ==================== Memory Tab Components ====================

function MemoryBrowserWidget() {
  const { data: stats, isLoading } = useMemoryStats()

  if (isLoading) {
    return <Skeleton className="h-48" />
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Database className="h-5 w-5" />
          记忆统计
        </CardTitle>
        <Badge variant="outline">{stats?.totalMemoryCount || 0} 条</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats && (
          <>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{stats.typeStats.episodicCount}</p>
                <p className="text-xs text-muted-foreground">情景</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.typeStats.semanticCount}</p>
                <p className="text-xs text-muted-foreground">语义</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.typeStats.proceduralCount}</p>
                <p className="text-xs text-muted-foreground">程序</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.typeStats.perceptiveCount}</p>
                <p className="text-xs text-muted-foreground">感知</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">平均强度</span>
                <span>{(stats.averageStrength * 100).toFixed(0)}%</span>
              </div>
              <Progress value={stats.averageStrength * 100} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function WorkingMemoryWidget() {
  const { data: working, isLoading } = useWorkingMemory()

  if (isLoading) {
    return <Skeleton className="h-32" />
  }

  const percent = working && working.max > 0 ? Math.round((working.used / working.max) * 100) : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Clock className="h-5 w-5" />
          工作记忆
        </CardTitle>
        <Badge variant={percent > 80 ? 'destructive' : 'secondary'}>
          {working?.used || 0} / {working?.max || 7}
        </Badge>
      </CardHeader>
      <CardContent>
        <Progress value={percent} className="h-2" />
        <div className="mt-3 flex flex-wrap gap-2">
          {working?.items && working.items.length > 0 ? (
            working.items.map((item, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">无</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== Main Dashboard ====================

import { useQuery } from '@tanstack/react-query'
import { Bot } from 'lucide-react'

export default function DashboardPage() {
  const { isLoading } = useSpriteState()
  const [activeTab, setActiveTab] = useState('overview')

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">数据大盘</h1>
          <p className="text-muted-foreground">系统状态总览</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="system">系统</TabsTrigger>
          <TabsTrigger value="runtime">运行时</TabsTrigger>
          <TabsTrigger value="memory">记忆</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <QuickStats />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <CognitionWidget />
            <MemoryWidget />
            <EvolutionWidget />
            <EmotionWidget />
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <HealthStatusCard />
            <MemoryUsageCard />
            <LlmStatusCard />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <DevicesStatusWidget />
            <AgentsStatusWidget />
          </div>
        </TabsContent>

        <TabsContent value="runtime" className="space-y-6">
          <CognitionWidget />
          <CycleHistoryTable />
        </TabsContent>

        <TabsContent value="memory" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <MemoryBrowserWidget />
            <WorkingMemoryWidget />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Database className="h-5 w-5" />
                完整记忆浏览
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-4">
                查看完整记忆详情请访问{' '}
                <a href="/memory" className="text-primary hover:underline">
                  记忆页面
                </a>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-center text-xs text-muted-foreground">
        最后更新: {format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
      </p>
    </div>
  )
}
