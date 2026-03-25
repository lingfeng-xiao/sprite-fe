import { useState } from 'react'
import { useCycles } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Brain, Clock, CheckCircle, XCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import type { CognitionCycle } from '@/stores/cycleStore'

const PHASE_COLORS: Record<string, string> = {
  PERCEPTION: 'bg-blue-500',
  CONTEXT_BUILD: 'bg-purple-500',
  REASONING: 'bg-amber-500',
  DECISION: 'bg-red-500',
  ACTION: 'bg-green-500',
  LEARNING: 'bg-cyan-500',
}

function CycleRow({ cycle }: { cycle: CognitionCycle }) {
  const navigate = useNavigate()

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => navigate(`/cycles/${cycle.startTime}`)}
    >
      <TableCell className="font-mono text-xs">
        {format(new Date(cycle.startTime), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })}
      </TableCell>
      <TableCell className="font-mono text-xs">
        {cycle.endTime
          ? format(new Date(cycle.endTime), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })
          : '-'}
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
  )
}

function CycleListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

function CycleMetricsCards({ data }: { data: NonNullable<ReturnType<typeof useCycles>['data']> }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总事件数</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.totalEvents}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">成功率</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{(data.successRate * 100).toFixed(1)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">平均周期</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.avgCycleDurationMs.toFixed(0)}ms</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">历史大小</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{data.totalHistorySize}</p>
        </CardContent>
      </Card>
    </div>
  )
}

function PhaseStatsChart({ phaseStats }: { phaseStats: NonNullable<ReturnType<typeof useCycles>['data']>['phaseStats'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">阶段统计</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {phaseStats.map((stat) => (
            <div key={stat.phase} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${PHASE_COLORS[stat.phase] || 'bg-gray-500'}`}
                  />
                  <span className="font-medium">{stat.phase.replace('_', ' ')}</span>
                </div>
                <span className="text-muted-foreground">
                  {stat.eventCount} 事件 / {stat.successRate.toFixed(1)}% 成功
                </span>
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>平均: {stat.avgDurationMs.toFixed(0)}ms</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function CyclesPage() {
  const { data, isLoading, error } = useCycles()
  const [selectedCycle, setSelectedCycle] = useState<CognitionCycle | null>(null)

  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)

  const recentCycles = data?.recentCycles || []
  const totalPages = Math.ceil(recentCycles.length / ITEMS_PER_PAGE)
  const paginatedCycles = recentCycles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <XCircle className="mx-auto h-12 w-12" />
              <p className="mt-4 font-medium">加载失败</p>
              <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">周期追踪</h1>
        <p className="text-muted-foreground">查看认知周期执行详情和历史记录</p>
      </div>

      {/* Metrics Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : data ? (
        <CycleMetricsCards data={data} />
      ) : null}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cycle List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">最近周期</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <CycleListSkeleton />
              ) : recentCycles.length === 0 ? (
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
                        <TableHead>结束时间</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">持续时间</TableHead>
                        <TableHead className="text-right">事件数</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCycles.map((cycle, index) => (
                        <CycleRow key={`${cycle.startTime}-${index}`} cycle={cycle} />
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
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
        </div>

        {/* Phase Stats */}
        <div>
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : data ? (
            <PhaseStatsChart phaseStats={data.phaseStats} />
          ) : null}
        </div>
      </div>

      {/* Cycle Detail Dialog */}
      <Dialog open={!!selectedCycle} onOpenChange={() => setSelectedCycle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>周期详情</DialogTitle>
            <DialogDescription>
              {selectedCycle && format(new Date(selectedCycle.startTime), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })}
            </DialogDescription>
          </DialogHeader>
          {selectedCycle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">状态</p>
                  <Badge variant={selectedCycle.isComplete ? 'success' : 'secondary'}>
                    {selectedCycle.isComplete ? '完成' : '进行中'}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">持续时间</p>
                  <p className="font-mono">{selectedCycle.totalDurationMs.toFixed(0)}ms</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">事件列表</p>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {selectedCycle.events.map((event, index) => (
                    <div key={index} className="rounded border p-2 text-xs">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{event.type}</Badge>
                        <span className="text-muted-foreground">
                          {format(new Date(event.timestamp), 'HH:mm:ss.SSS', { locale: zhCN })}
                        </span>
                      </div>
                      {event.data && Object.keys(event.data).length > 0 && (
                        <pre className="mt-1 text-muted-foreground">
                          {JSON.stringify(event.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
