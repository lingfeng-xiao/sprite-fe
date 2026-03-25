import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { useSpriteStore } from '@/stores/spriteStore'
import { Navigation } from './Navigation'

export function Sidebar() {
  const { state: { sidebarCollapsed }, toggleSidebar } = useUIStore()
  const { spriteState } = useSpriteStore()

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-card transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Sparkles className="h-6 w-6 text-primary" />
        {!sidebarCollapsed && (
          <span className="ml-2 text-lg font-semibold">
            {spriteState?.identity?.name || 'Sprite'}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <Navigation collapsed={sidebarCollapsed} />
      </nav>

      {/* Collapse Button */}
      <button
        onClick={toggleSidebar}
        className="flex h-10 items-center justify-center border-t text-muted-foreground hover:text-foreground"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>
    </aside>
  )
}
