import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  it('renders Badge component', () => {
    render(<Badge data-testid="badge">Badge</Badge>)
    expect(screen.getByTestId('badge')).toBeInTheDocument()
  })

  it('applies default Badge classes', () => {
    const { container } = render(<Badge>Default</Badge>)
    expect(container.firstChild).toHaveClass('inline-flex')
    expect(container.firstChild).toHaveClass('items-center')
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary')

    rerender(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive')

    rerender(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success')).toHaveClass('bg-green-500')

    rerender(<Badge variant="warning">Warning</Badge>)
    expect(screen.getByText('Warning')).toHaveClass('bg-yellow-500')

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toHaveClass('text-foreground')
  })

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-badge">Custom</Badge>)
    expect(container.firstChild).toHaveClass('custom-badge')
  })

  it('renders with children correctly', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('handles different variants without crashing', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'] as const
    variants.forEach(variant => {
      const { container } = render(<Badge variant={variant}>Test</Badge>)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
