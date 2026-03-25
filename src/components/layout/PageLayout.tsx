import { cn } from '@/lib/utils'
import { PageHeader, PageHeaderProps } from './PageHeader'
import { PageSection, PageSectionProps } from './PageSection'

interface PageLayoutProps {
  header?: PageHeaderProps
  section?: PageSectionProps
  children: React.ReactNode
  className?: string
}

export function PageLayout({ header, section, children, className }: PageLayoutProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {header && <PageHeader {...header} />}
      {section ? (
        <PageSection {...section}>
          {children}
        </PageSection>
      ) : (
        children
      )}
    </div>
  )
}

interface PageFooterProps {
  children: React.ReactNode
  className?: string
}

export function PageFooter({ children, className }: PageFooterProps) {
  return (
    <footer className={cn('text-center text-xs text-muted-foreground pt-8', className)}>
      {children}
    </footer>
  )
}
