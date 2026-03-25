import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Sparkles, Settings, Cpu, Bot, Smartphone, Zap, MessageCircle, User, Heart, Target, Database, Brain, LayoutDashboard, Heart as HeartIcon, Activity, Users } from 'lucide-react'
import { useState } from 'react'

export interface NavItem {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: string | number
}

export interface NavSection {
  id: string
  title: string
  items: NavItem[]
}

export const navigationConfig: NavSection[] = [
  {
    id: 'life',
    title: '生命',
    items: [
      { to: '/life', icon: Sparkles, label: '概览' },
      { to: '/self', icon: User, label: '自我' },
      { to: '/relationship', icon: Heart, label: '关系' },
      { to: '/goals', icon: Target, label: '目标' },
      { to: '/memory', icon: Database, label: '记忆' },
      { to: '/evolution', icon: Brain, label: '进化' },
    ],
  },
  {
    id: 'command',
    title: '命令',
    items: [
      { to: '/console', icon: Zap, label: '控制台' },
      { to: '/chat', icon: MessageCircle, label: '聊天' },
    ],
  },
  {
    id: 'system',
    title: '系统',
    items: [
      { to: '/devices', icon: Smartphone, label: '设备' },
      { to: '/runtime', icon: Cpu, label: '运行时' },
      { to: '/agents', icon: Bot, label: 'Agent' },
      { to: '/settings', icon: Settings, label: '设置' },
    ],
  },
]

export const legacyConfig: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/emotions', icon: HeartIcon, label: '情绪' },
  { to: '/health', icon: Activity, label: '健康' },
  { to: '/team', icon: Users, label: '团队' },
]

function NavSectionGroup({
  section,
  collapsed,
  currentPath,
}: {
  section: NavSection
  collapsed: boolean
  currentPath: string
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  const isActive = (path: string) => {
    if (path === '/life') return currentPath === '/life' || currentPath === '/'
    return currentPath.startsWith(path)
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors',
          collapsed ? 'justify-center' : '',
          'text-muted-foreground hover:text-foreground'
        )}
      >
        {!collapsed && <span>{section.title}</span>}
        {!collapsed && isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : !collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : null}
      </button>

      {(isExpanded || collapsed) && (
        <div className="space-y-0.5">
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
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  collapsed ? 'justify-center px-2' : ''
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="ml-3">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-xs bg-primary/20 px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface NavigationProps {
  collapsed: boolean
}

export function Navigation({ collapsed }: NavigationProps) {
  const location = useLocation()

  return (
    <>
      {navigationConfig.map((section) => (
        <NavSectionGroup
          key={section.id}
          section={section}
          collapsed={collapsed}
          currentPath={location.pathname}
        />
      ))}

      {!collapsed && (
        <div className="space-y-1 pt-4">
          <p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground opacity-50">
            旧版
          </p>
          {legacyConfig.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors opacity-50',
                'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
