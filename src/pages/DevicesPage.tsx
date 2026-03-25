import { useQuery, useMutation } from '@tanstack/react-query'
import { getAllDevices, getDeviceStatus, triggerDeviceSync } from '@/api/spriteApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Smartphone, Monitor, Tablet, RefreshCw, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

const deviceTypeIcons = {
  PC: Monitor,
  PHONE: Smartphone,
  TABLET: Tablet,
  OTHER: Smartphone,
}

function DeviceCard({ device }: { device: { deviceId: string; deviceName: string; deviceType: string; lastActive: string; state: string } }) {
  const Icon = deviceTypeIcons[device.deviceType as keyof typeof deviceTypeIcons] || Smartphone

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Icon className="h-5 w-5" />
          {device.deviceName}
        </CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">类型</span>
            <span>{device.deviceType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">最后活跃</span>
            <span>{format(new Date(device.lastActive), 'MM-dd HH:mm')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DevicesPage() {
  const { data: devices, isLoading: devicesLoading, refetch: refetchDevices } = useQuery({
    queryKey: ['sprite', 'devices'],
    queryFn: getAllDevices,
  })

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ['sprite', 'devices', 'status'],
    queryFn: getDeviceStatus,
  })

  const { mutate: sync, isPending: isSyncing } = useMutation({
    mutationFn: triggerDeviceSync,
  })

  const handleSync = () => {
    sync()
    refetchDevices()
  }

  if (devicesLoading || statusLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[150px]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">设备协调状态</CardTitle>
          <Button variant="outline" size="sm" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            同步
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-2xl font-bold">{status?.totalDevices || 0}</p>
              <p className="text-xs text-muted-foreground">总设备数</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">{status?.activeDevices || 0}</p>
              <p className="text-xs text-muted-foreground">活跃设备</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{status?.pendingMessages || 0}</p>
              <p className="text-xs text-muted-foreground">待处理消息</p>
            </div>
            <div>
              <p className="text-sm font-medium">
                {status?.lastSyncTime
                  ? format(new Date(status.lastSyncTime), 'MM-dd HH:mm:ss')
                  : '从未'}
              </p>
              <p className="text-xs text-muted-foreground">最后同步</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices?.map((device) => (
          <DeviceCard key={device.deviceId} device={device} />
        ))}
        {devices?.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            暂无设备
          </div>
        )}
      </div>
    </div>
  )
}
