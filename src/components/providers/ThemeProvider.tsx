import { createContext, useContext, useEffect, useState } from 'react'
import { useUIStore } from '@/stores/uiStore'

type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined)

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: 'light' | 'dark') {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { state, setTheme } = useUIStore()
  const [mounted, setMounted] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const theme = state.theme
    let resolved: 'light' | 'dark'

    if (theme === 'system') {
      resolved = getSystemTheme()
    } else {
      resolved = theme
    }

    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [state.theme])

  // Listen for system theme changes
  useEffect(() => {
    if (state.theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const resolved = getSystemTheme()
      setResolvedTheme(resolved)
      applyTheme(resolved)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [state.theme])

  // Prevent flash of wrong theme
  if (!mounted) {
    return null
  }

  return (
    <ThemeProviderContext.Provider value={{ theme: state.theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
