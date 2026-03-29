import { Badge } from '@/components/ui/badge'
import { usePageInfo } from '@/contexts/PageContext'
import { useAutonomyStatus, useLifeSnapshot } from '@/hooks/useSpriteData'

export function Header() {
  const { data: lifeSnapshot } = useLifeSnapshot()
  const { data: autonomyStatus } = useAutonomyStatus()
  const { pageInfo } = usePageInfo()

  const title = pageInfo?.title || lifeSnapshot?.displayName || 'Sprite'
  const description = pageInfo?.description || lifeSnapshot?.identitySummary
  const coherence = Math.round((lifeSnapshot?.coherenceScore || 0) * 100)
  const energy = Math.round((lifeSnapshot?.currentState?.energyLevel || 0) * 100)

  return (
    <header className="flex flex-col gap-4 border-b bg-card/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>Digital being</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
          <span>Life surface</span>
        </div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={autonomyStatus?.paused ? 'warning' : 'success'}>
          {autonomyStatus?.paused ? 'Autonomy paused' : 'Autonomy active'}
        </Badge>
        <Badge variant="outline">
          Focus: {lifeSnapshot?.attentionFocus?.type?.toLowerCase() || 'idle'}
        </Badge>
        <Badge variant="outline">Coherence: {coherence}%</Badge>
        <Badge variant="outline">Energy: {energy}%</Badge>
      </div>
    </header>
  )
}
