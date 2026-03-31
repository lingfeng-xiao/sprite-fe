import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  description?: string
  error?: string
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, description, error, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {children}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
FormField.displayName = 'FormField'

export { FormField }
