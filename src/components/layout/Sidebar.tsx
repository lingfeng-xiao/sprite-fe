import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { useSpriteStore } from '@/stores/spriteStore'
import {
  MessageCircle,
  LayoutDashboard,
  Heart,
  Smartphone,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { to: '/chat', icon: MessageCircle, label: '聊天' },
  { to: '/dashboard', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/emotions', icon: Heart, label: '情绪' },
  { to: '/devices', icon: Smartphone, label: '设备' },
  { to: '/health', icon: Activity, label: '健康' },
  { to: '/settings', icon: Settings, label: '设置' },
]

export function Sidebar() {
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
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
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          )
        })}
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
