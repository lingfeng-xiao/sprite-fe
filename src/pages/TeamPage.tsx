import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import {
  getTeamSprites,
  getTeamSessions,
  createTeamSession,
  discoverSprites,
  getSessionTasks,
} from '@/api/spriteApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  RefreshCw,
  Loader2,
  UserPlus,
  Circle,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import type { SpriteInfo, CollaborationSession, Task, TaskStatus } from '@/types/api'

const TASK_COLUMNS = [
  { key: 'PENDING' as TaskStatus, label: '待处理', icon: Circle, color: 'text-muted-foreground' },
  { key: 'IN_PROGRESS' as TaskStatus, label: '进行中', icon: Clock, color: 'text-blue-500' },
  { key: 'COMPLETED' as TaskStatus, label: '已完成', icon: CheckCircle2, color: 'text-green-500' },
]

const SPRITE_STATE_COLORS = {
  AVAILABLE: 'success',
  BUSY: 'warning',
  UNREACHABLE: 'destructive',
  UNKNOWN: 'secondary',
} as const

const SESSION_STATUS_COLORS = {
  PENDING: 'secondary',
  ACTIVE: 'success',
  SUSPENDED: 'warning',
  COMPLETED: 'outline',
  FAILED: 'destructive',
} as const

function SpriteCard({
  sprite,
  onCollaborate,
}: {
  sprite: SpriteInfo
  onCollaborate?: (spriteId: string) => void
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Users className="h-5 w-5" />
          {sprite.name}
        </CardTitle>
        <Badge variant={SPRITE_STATE_COLORS[sprite.state] || 'secondary'}>
          {sprite.state}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ID</span>
            <span className="font-mono text-xs">{sprite.id.slice(0, 12)}...</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">版本</span>
            <span>{sprite.version}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">兼容性</span>
            <span>{(sprite.compatibilityScore * 100).toFixed(0)}%</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {sprite.capabilities.slice(0, 3).map((cap, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {cap.name}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>最后活跃</span>
            <span>{format(new Date(sprite.lastSeen), 'MM-dd HH:mm')}</span>
          </div>
          {sprite.state === 'AVAILABLE' && onCollaborate && (
            <Button
              size="sm"
              className="w-full"
              onClick={() => onCollaborate(sprite.id)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              发起协作
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SessionCard({
  session,
  onSelect,
}: {
  session: CollaborationSession
  onSelect?: (sessionId: string) => void
}) {
  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onSelect?.(session.id)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Users className="h-5 w-5" />
          会话
        </CardTitle>
        <Badge variant={SESSION_STATUS_COLORS[session.status] || 'secondary'}>
          {session.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID</span>
            <span className="font-mono text-xs">{session.id.slice(0, 16)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">参与方</span>
            <span>{session.participants.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">任务数</span>
            <span>{session.taskIds.length}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>创建时间</span>
            <span>{format(new Date(session.createdAt), 'MM-dd HH:mm')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TaskCard({ task }: { task: Task }) {
  const Icon = task.status === 'COMPLETED' ? CheckCircle2 : task.status === 'FAILED' ? AlertCircle : Circle

  return (
    <Card className="mb-2">
      <CardContent className="pt-4">
        <div className="flex items-start gap-2">
          <Icon className={`h-4 w-4 mt-0.5 ${task.status === 'COMPLETED' ? 'text-green-500' : task.status === 'FAILED' ? 'text-red-500' : 'text-muted-foreground'}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{task.type}</p>
            <p className="text-xs text-muted-foreground truncate">
              {task.payload && typeof task.payload === 'object'
                ? Object.values(task.payload).join(', ').slice(0, 50)
                : 'No payload'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {task.assignedTo || 'Unassigned'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function KanbanColumn({
  title,
  icon: Icon,
  color,
  tasks,
}: {
  title: string
  icon: typeof Circle
  color: string
  tasks: Task[]
}) {
  return (
    <div className="flex-1 min-w-[200px]">
      <div className={`flex items-center gap-2 mb-3 ${color}`}>
        <Icon className="h-4 w-4" />
        <h3 className="font-medium text-sm">{title}</h3>
        <Badge variant="outline" className="ml-auto text-xs">
          {tasks.length}
        </Badge>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">暂无任务</p>
        )}
      </div>
    </div>
  )
}

export default function TeamPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  const { data: sprites, isLoading: spritesLoading, refetch: refetchSprites } = useQuery({
    queryKey: ['team', 'sprites'],
    queryFn: getTeamSprites,
  })

  const { data: sessions, isLoading: sessionsLoading, refetch: refetchSessions } = useQuery({
    queryKey: ['team', 'sessions'],
    queryFn: getTeamSessions,
  })

  const { data: sessionTasks } = useQuery({
    queryKey: ['team', 'sessions', selectedSessionId, 'tasks'],
    queryFn: () => (selectedSessionId ? getSessionTasks(selectedSessionId) : Promise.resolve([])),
    enabled: !!selectedSessionId,
  })

  const discoverMutation = useMutation({
    mutationFn: discoverSprites,
    onSuccess: () => {
      refetchSprites()
      refetchSessions()
    },
  })

  const collaborateMutation = useMutation({
    mutationFn: (targetSpriteId: string) => createTeamSession(targetSpriteId),
    onSuccess: () => {
      refetchSessions()
    },
  })

  const handleDiscover = () => {
    discoverMutation.mutate()
  }

  const handleCollaborate = (spriteId: string) => {
    collaborateMutation.mutate(spriteId)
  }

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId)
  }

  const tasksByStatus: Record<TaskStatus, Task[]> = {
    PENDING: sessionTasks?.filter((t) => t.status === 'PENDING') || [],
    ASSIGNED: sessionTasks?.filter((t) => t.status === 'ASSIGNED') || [],
    IN_PROGRESS: sessionTasks?.filter((t) => t.status === 'IN_PROGRESS') || [],
    COMPLETED: sessionTasks?.filter((t) => t.status === 'COMPLETED') || [],
    FAILED: sessionTasks?.filter((t) => t.status === 'FAILED') || [],
    CANCELLED: sessionTasks?.filter((t) => t.status === 'CANCELLED') || [],
  }

  if (spritesLoading || sessionsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">团队协作</h1>
          <p className="text-sm text-muted-foreground">管理 Sprite 协作会话和任务分配</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDiscover}
            disabled={discoverMutation.isPending}
          >
            {discoverMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            发现Sprite
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{sprites?.length || 0}</p>
                <p className="text-xs text-muted-foreground">已发现Sprite</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Circle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {sprites?.filter((s) => s.state === 'AVAILABLE').length || 0}
                </p>
                <p className="text-xs text-muted-foreground">可用Sprite</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{sessions?.length || 0}</p>
                <p className="text-xs text-muted-foreground">活跃会话</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{sessionTasks?.length || 0}</p>
                <p className="text-xs text-muted-foreground">当前任务</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              团队成员
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sprites && sprites.length > 0 ? (
                sprites.map((sprite) => (
                  <SpriteCard
                    key={sprite.id}
                    sprite={sprite}
                    onCollaborate={handleCollaborate}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>暂未发现其他Sprite</p>
                  <p className="text-xs mt-1">点击"发现Sprite"开始搜索</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Collaboration Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              协作会话
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions && sessions.length > 0 ? (
                sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onSelect={handleSelectSession}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>暂无活跃会话</p>
                  <p className="text-xs mt-1">选择可用Sprite发起协作</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Task Distribution Board */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              任务看板
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSessionId ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {TASK_COLUMNS.map((column) => (
                  <KanbanColumn
                    key={column.key}
                    title={column.label}
                    icon={column.icon}
                    color={column.color}
                    tasks={tasksByStatus[column.key] || []}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>选择会话查看任务</p>
                <p className="text-xs mt-1">点击左侧会话来查看任务看板</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Session Details */}
      {selectedSessionId && sessionTasks && sessionTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">会话详情</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div>
                <span className="text-muted-foreground">会话ID</span>
                <p className="font-mono text-xs mt-1">{selectedSessionId}</p>
              </div>
              <div>
                <span className="text-muted-foreground">任务总数</span>
                <p className="font-medium mt-1">{sessionTasks.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">完成率</span>
                <p className="font-medium mt-1">
                  {sessionTasks.filter((t) => t.status === 'COMPLETED').length} / {sessionTasks.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
