import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card', () => {
  it('renders Card component', () => {
    render(<Card data-testid="card">Card Content</Card>)
    expect(screen.getByTestId('card')).toBeInTheDocument()
  })

  it('applies default Card classes', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.firstChild).toHaveClass('rounded-lg')
    expect(container.firstChild).toHaveClass('border')
    expect(container.firstChild).toHaveClass('bg-card')
  })

  it('renders CardHeader', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>)
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toHaveClass('flex')
    expect(screen.getByTestId('header')).toHaveClass('flex-col')
  })

  it('renders CardTitle', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>)
    expect(screen.getByTestId('title')).toBeInTheDocument()
    expect(screen.getByTestId('title')).toHaveClass('text-2xl')
    expect(screen.getByTestId('title')).toHaveClass('font-semibold')
  })

  it('renders CardDescription', () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>)
    expect(screen.getByTestId('desc')).toBeInTheDocument()
    expect(screen.getByTestId('desc')).toHaveClass('text-sm')
    expect(screen.getByTestId('desc')).toHaveClass('text-muted-foreground')
  })

  it('renders CardContent', () => {
    render(<CardContent data-testid="content">Content</CardContent>)
    expect(screen.getByTestId('content')).toBeInTheDocument()
    expect(screen.getByTestId('content')).toHaveClass('p-6')
    expect(screen.getByTestId('content')).toHaveClass('pt-0')
  })

  it('renders CardFooter', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toHaveClass('flex')
    expect(screen.getByTestId('footer')).toHaveClass('items-center')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Card ref={ref}>Content</Card>)
    expect(ref.current).not.toBeNull()
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
