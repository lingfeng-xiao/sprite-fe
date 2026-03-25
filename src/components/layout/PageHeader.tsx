import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  iconClassName?: string
  action?: React.ReactNode
  size?: 'default' | 'lg'
  className?: string
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconClassName,
  action,
  size = 'default',
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10',
              iconClassName
            )}>
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <h1 className={cn(
            'font-bold tracking-tight',
            size === 'lg' ? 'text-3xl md:text-4xl' : 'text-2xl'
          )}>
            {title}
          </h1>
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      )}
    </div>
  )
}
