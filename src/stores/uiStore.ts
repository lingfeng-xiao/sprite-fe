import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
  refreshInterval: number
  toggleSidebar: () => void
  setTheme: (theme: UIStore['theme']) => void
  setRefreshInterval: (interval: number) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'system',
      refreshInterval: 30000,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),
    }),
    { name: 'sprite-ui-store' }
  )
)
