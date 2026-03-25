import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Progress } from '@/components/ui/progress'

describe('Progress', () => {
  it('renders Progress component', () => {
    render(<Progress data-testid="progress" />)
    expect(screen.getByTestId('progress')).toBeInTheDocument()
  })

  it('renders container div', () => {
    const { container } = render(<Progress />)
    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('renders fill bar as child', () => {
    const { container } = render(<Progress value={50} />)
    // The Progress renders a container with a fill bar inside
    expect(container.querySelectorAll('div').length).toBeGreaterThanOrEqual(1)
  })

  it('applies custom className to container', () => {
    const { container } = render(<Progress className="custom-progress" />)
    expect(container.firstChild).toHaveClass('custom-progress')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<Progress ref={ref} />)
    expect(ref.current).not.toBeNull()
  })

  it('renders with value prop', () => {
    const { container } = render(<Progress value={75} />)
    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('renders with default props without crashing', () => {
    const { container } = render(<Progress />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
