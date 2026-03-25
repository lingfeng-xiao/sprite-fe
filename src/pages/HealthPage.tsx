import { useHealthDetails } from '@/hooks/useSpriteData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, Cpu, HardDrive, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

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
          <StatusIcon className={`h-12 w-12 ${config.color}`} />
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

function MemoryCard() {
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

function SensorHealthList() {
  const { data, isLoading } = useHealthDetails()

  if (isLoading) return <Skeleton className="h-[200px]" />

  const sensors = data?.sensorHealth || {}

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Activity className="h-5 w-5" />
          传感器健康
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(sensors).length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无传感器数据</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(sensors).map(([name, sensor]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-sm">{name}</span>
                <Badge variant={sensor.healthy ? 'success' : 'destructive'}>
                  {sensor.healthy ? '正常' : '异常'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <HealthStatusCard />
        <MemoryCard />
        <LlmStatusCard />
      </div>
      <SensorHealthList />
    </div>
  )
}
