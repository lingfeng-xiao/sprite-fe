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
  User,
  Users,
  Target,
  Brain,
  Zap,
  Cpu,
  Database,
} from 'lucide-react'

// ==================== Navigation Structure ====================

interface NavItem {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

// Life Surface - 生命界面
const lifeSurfaceItems: NavItem[] = [
  { to: '/life', icon: Sparkles, label: '生命' },
  { to: '/self', icon: User, label: '自我' },
  { to: '/relationship', icon: Heart, label: '关系' },
  { to: '/goals', icon: Target, label: '目标' },
  { to: '/memory', icon: Database, label: '记忆' },
  { to: '/evolution', icon: Brain, label: '进化' },
]

// Command Surface - 命令界面
const commandSurfaceItems: NavItem[] = [
  { to: '/console', icon: Zap, label: '控制台' },
  { to: '/chat', icon: MessageCircle, label: '聊天' },
]

// System Surface - 系统界面
const systemSurfaceItems: NavItem[] = [
  { to: '/devices', icon: Smartphone, label: '设备' },
  { to: '/runtime', icon: Cpu, label: '运行时' },
  { to: '/agents', icon: Brain, label: 'Agent' },
  { to: '/settings', icon: Settings, label: '设置' },
]

// Legacy redirects
const legacyItems: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: '旧仪表盘' },
  { to: '/emotions', icon: Heart, label: '旧情绪' },
  { to: '/health', icon: Activity, label: '旧健康' },
  { to: '/team', icon: Users, label: '旧团队' },
]

const navSections: NavSection[] = [
  { title: 'Life Surface', items: lifeSurfaceItems },
  { title: 'Command Surface', items: commandSurfaceItems },
  { title: 'System Surface', items: systemSurfaceItems },
]

export function Sidebar() {
  const location = useLocation()
  const { state: { sidebarCollapsed }, toggleSidebar } = useUIStore()
  const { spriteState } = useSpriteStore()

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/life') {
      return location.pathname === '/life' || location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

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
      <nav className="flex-1 space-y-4 overflow-y-auto p-2">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!sidebarCollapsed && (
              <p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const active = isActive(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              )
            })}
          </div>
        ))}

        {/* Legacy Items - shown only when expanded */}
        {!sidebarCollapsed && (
          <div className="space-y-1 pt-4">
            <p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground opacity-50">
              Legacy
            </p>
            {legacyItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors opacity-50',
                  isActive(item.to)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
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
