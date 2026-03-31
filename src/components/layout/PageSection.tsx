import { cn } from '@/lib/utils'

export interface PageSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  cols?: '1' | '2' | '3' | '4' | 'auto'
  spacing?: 'compact' | 'default' | 'loose'
  noGrid?: boolean
  variant?: 'default' | 'stats'
  className?: string
}

const spacingMap = {
  compact: 'space-y-4',
  default: 'space-y-6',
  loose: 'space-y-8',
}

const gapMap = {
  compact: 'gap-4',
  default: 'gap-6',
  loose: 'gap-8',
}

const colsMap = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  'auto': 'grid-cols-[repeat(auto-fit,minmax(300px,1fr))]',
}

const statsColsMap = 'grid-cols-[repeat(auto-fit,minmax(180px,1fr))]'

export function PageSection({
  title,
  description,
  children,
  cols = 'auto',
  spacing = 'default',
  noGrid = false,
  variant = 'default',
  className,
}: PageSectionProps) {
  const gridClass = variant === 'stats' ? statsColsMap : colsMap[cols]

  const content = noGrid ? children : (
    <div className={cn(
      'grid w-full',
      gridClass,
      gapMap[spacing]
    )}>
      {children}
    </div>
  )

  return (
    <section className={cn(spacingMap[spacing], className)}>
      {title && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {content}
    </section>
  )
}
