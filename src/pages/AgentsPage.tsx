import { useAgentWorkers } from '@/hooks/useSpriteData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCw, Activity, Brain, Zap, Eye, Server } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useCallback } from 'react'
import type { WorkerInfo, WorkerState, WorkerType } from '@/types/api'

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

function WorkerTypeBadge({ type }: { type: WorkerType }) {
  const config = WORKER_TYPE_CONFIG[type]
  const Icon = config.icon
  return (
    <div className={`flex items-center gap-1.5 ${config.color}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  )
}

function WorkerStateBadge({ state }: { state: WorkerState }) {
  const config = WORKER_STATE_CONFIG[state]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

function HeartbeatIndicator({ lastHeartbeat }: { lastHeartbeat: string }) {
  const distance = formatDistanceToNow(new Date(lastHeartbeat), { addSuffix: true })
  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Activity className="h-3.5 w-3.5" />
      <span>{distance}</span>
    </div>
  )
}

function WorkerCard({ worker }: { worker: WorkerInfo }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Server className="h-5 w-5" />
            <span className="truncate">{worker.workerId}</span>
          </CardTitle>
          <WorkerStateBadge state={worker.state} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <WorkerTypeBadge type={worker.type} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">最后心跳</span>
            <HeartbeatIndicator lastHeartbeat={worker.lastHeartbeat} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">注册时间</span>
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(worker.registeredAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function WorkerCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

function WorkerSummary({ workers }: { workers: WorkerInfo[] }) {
  const runningCount = workers.filter((w) => w.state === 'RUNNING').length
  const idleCount = workers.filter((w) => w.state === 'IDLE').length
  const failedCount = workers.filter((w) => w.state === 'FAILED').length

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Server className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{workers.length}</p>
              <p className="text-xs text-muted-foreground">总工作器</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Activity className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{runningCount}</p>
              <p className="text-xs text-muted-foreground">运行中</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Brain className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{idleCount}</p>
              <p className="text-xs text-muted-foreground">空闲</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Activity className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{failedCount}</p>
              <p className="text-xs text-muted-foreground">失败</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function WorkerList({ workers }: { workers: WorkerInfo[] }) {
  const perceptionWorkers = workers.filter((w) => w.type === 'PERCEPTION')
  const cognitionWorkers = workers.filter((w) => w.type === 'COGNITION')
  const actionWorkers = workers.filter((w) => w.type === 'ACTION')

  const renderWorkerGroup = (_type: WorkerType, label: string, icon: typeof Eye, workerList: WorkerInfo[]) => {
    if (workerList.length === 0) return null
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {(() => {
            const Icon = icon
            return <Icon className="h-5 w-5" />
          })()}
          <h3 className="text-lg font-semibold">{label}</h3>
          <Badge variant="outline">{workerList.length}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workerList.map((worker) => (
            <WorkerCard key={worker.workerId} worker={worker} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {renderWorkerGroup('PERCEPTION', '感知工作器', Eye, perceptionWorkers)}
      {renderWorkerGroup('COGNITION', '认知工作器', Brain, cognitionWorkers)}
      {renderWorkerGroup('ACTION', '行动工作器', Zap, actionWorkers)}
    </div>
  )
}

export default function AgentsPage() {
  const { data: workers, isLoading, refetch, isFetching } = useAgentWorkers()

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">代理监控</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <WorkerCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">代理监控</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      {workers && workers.length > 0 ? (
        <>
          <WorkerSummary workers={workers} />
          <WorkerList workers={workers} />
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Server className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">暂无工作器数据</p>
            <p className="mt-1 text-sm text-muted-foreground">当前没有活跃的工作器实例</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
