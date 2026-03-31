import { ChevronLeft, ChevronRight, Sparkles, Waves } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { useLifeSnapshot } from '@/hooks/useSpriteData'
import { Navigation } from './Navigation'

export function Sidebar() {
  const {
    state: { sidebarCollapsed },
    toggleSidebar,
  } = useUIStore()
  const { data: lifeSnapshot } = useLifeSnapshot()
  const focusText = lifeSnapshot?.attentionFocus?.description || 'No active focus'
  const coherenceText = `${Math.round((lifeSnapshot?.coherenceScore || 0) * 100)}% coherent`

  return (
    <aside
      className={cn(
        'flex w-full flex-col border-b bg-card/90 backdrop-blur-xl transition-all duration-300 lg:border-b-0 lg:border-r',
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
      )}
    >
      <div className="border-b px-4 py-4">
        <div className={cn('flex items-start gap-3', sidebarCollapsed && 'lg:justify-center')}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-lg font-semibold leading-none">
                {lifeSnapshot?.displayName || 'Sprite'}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Waves className="h-3.5 w-3.5" />
                <span>Living loop, always on.</span>
              </div>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <div className="mt-4 space-y-2 rounded-2xl border bg-background/70 p-3">
            <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Pulse
            </div>
            <div className="text-sm font-medium leading-5">{focusText}</div>
            <div className="text-xs text-muted-foreground">{coherenceText}</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <Navigation collapsed={sidebarCollapsed} />
      </nav>

      <button
        onClick={toggleSidebar}
        className="flex h-11 items-center justify-center border-t text-muted-foreground transition-colors hover:text-foreground"
      >
        {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </aside>
  )
}
