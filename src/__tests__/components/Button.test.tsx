import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders Button component', () => {
    render(<Button data-testid="button">Click Me</Button>)
    expect(screen.getByTestId('button')).toBeInTheDocument()
  })

  it('renders with default variant', () => {
    const { container } = render(<Button>Default</Button>)
    expect(container.firstChild).toHaveClass('bg-primary')
  })

  it('renders with different variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const

    variants.forEach(variant => {
      const { container } = render(<Button variant={variant}>Button</Button>)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('renders with different sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const

    sizes.forEach(size => {
      const { container } = render(<Button size={size}>Button</Button>)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is set', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)

    expect(screen.getByRole('button')).toBeDisabled()
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-button">Custom</Button>)
    expect(container.firstChild).toHaveClass('custom-button')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<Button ref={ref}>Button</Button>)
    expect(ref.current).not.toBeNull()
  })

  it('renders children correctly', () => {
    render(<Button>Button Text</Button>)
    expect(screen.getByText('Button Text')).toBeInTheDocument()
  })
})
