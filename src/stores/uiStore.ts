import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ==================== UI Store (refactored) ====================
// UI context: theme, layout, preferences

export interface UIState {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
  refreshInterval: number
  notificationsEnabled: boolean
  soundEnabled: boolean
}

interface UIStore {
  // State
  state: UIState

  // Actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTheme: (theme: UIState['theme']) => void
  setRefreshInterval: (interval: number) => void
  setNotificationsEnabled: (enabled: boolean) => void
  setSoundEnabled: (enabled: boolean) => void
  resetUI: () => void
}

const defaultState: UIState = {
  sidebarCollapsed: false,
  theme: 'system',
  refreshInterval: 30000,
  notificationsEnabled: true,
  soundEnabled: true,
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      state: { ...defaultState },

      toggleSidebar: () =>
        set((s) => ({ state: { ...s.state, sidebarCollapsed: !s.state.sidebarCollapsed } })),

      setSidebarCollapsed: (sidebarCollapsed) =>
        set((s) => ({ state: { ...s.state, sidebarCollapsed } })),

      setTheme: (theme) =>
        set((s) => ({ state: { ...s.state, theme } })),

      setRefreshInterval: (refreshInterval) =>
        set((s) => ({ state: { ...s.state, refreshInterval } })),

      setNotificationsEnabled: (notificationsEnabled) =>
        set((s) => ({ state: { ...s.state, notificationsEnabled } })),

      setSoundEnabled: (soundEnabled) =>
        set((s) => ({ state: { ...s.state, soundEnabled } })),

      resetUI: () =>
        set(() => ({ state: { ...defaultState } })),
    }),
    { name: 'sprite-ui-store' }
  )
)
