import { useSpriteStore } from '@/stores/spriteStore'
import { Badge } from '@/components/ui/badge'
import { usePageInfo } from '@/contexts/PageContext'

export function Header() {
  const { spriteState } = useSpriteStore()
  const { pageInfo } = usePageInfo()

  const title = pageInfo?.title || 'Sprite'
  const description = pageInfo?.description

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
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
