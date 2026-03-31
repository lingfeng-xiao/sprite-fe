import type { ComponentType } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Database, HeartPulse, MessageCircle, Settings } from 'lucide-react'

export interface NavItem {
  to: string
  icon: ComponentType<{ className?: string }>
  label: string
}

const navigationConfig: NavItem[] = [
  { to: '/', icon: HeartPulse, label: 'Life' },
  { to: '/chat', icon: MessageCircle, label: 'Command' },
  { to: '/memory', icon: Database, label: 'Memory' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

interface NavigationProps {
  collapsed: boolean
}

export function Navigation({ collapsed }: NavigationProps) {
  const location = useLocation()

  return (
    <div className="space-y-1">
      {navigationConfig.map((item) => {
        const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              collapsed ? 'justify-center px-2' : ''
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </Link>
        )
      })}
    </div>
  )
}
