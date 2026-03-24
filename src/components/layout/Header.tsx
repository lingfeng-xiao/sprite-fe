import { useLocation } from 'react-router-dom'
import { useSpriteStore } from '@/stores/spriteStore'
import { Badge } from '@/components/ui/badge'

const pageTitles: Record<string, { title: string; description: string }> = {
  '/chat': { title: '聊天', description: '与 Sprite 对话' },
  '/dashboard': { title: '仪表盘', description: '认知、记忆、进化概览' },
  '/emotions': { title: '情绪分析', description: '主人情绪历史与模式' },
  '/devices': { title: '设备管理', description: '多设备状态与协调' },
  '/health': { title: '系统健康', description: '服务器与传感器状态' },
  '/settings': { title: '设置', description: '偏好配置与备份' },
}

export function Header() {
  const location = useLocation()
  const { spriteState } = useSpriteStore()

  const pageInfo = pageTitles[location.pathname] || { title: 'Sprite', description: '' }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <div>
        <h1 className="text-lg font-semibold">{pageInfo.title}</h1>
        <p className="text-xs text-muted-foreground">{pageInfo.description}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Badge */}
        <Badge
          variant={spriteState?.isRunning ? 'success' : 'secondary'}
        >
          {spriteState?.isRunning ? '运行中' : '已停止'}
        </Badge>

        {/* LLM Status */}
        <Badge
          variant={spriteState?.hasLlmSupport ? 'default' : 'warning'}
        >
          {spriteState?.hasLlmSupport ? 'LLM 已连接' : 'LLM 不可用'}
        </Badge>
      </div>
    </header>
  )
}
