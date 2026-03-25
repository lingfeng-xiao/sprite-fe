import { create } from 'zustand'

interface McpState {
  activeTab: 'server' | 'client'
  connectForm: {
    name: string
    url: string
  }
  setActiveTab: (tab: 'server' | 'client') => void
  setConnectFormName: (name: string) => void
  setConnectFormUrl: (url: string) => void
  clearConnectForm: () => void
}

export const useMcpStore = create<McpState>((set) => ({
  activeTab: 'server',
  connectForm: {
    name: '',
    url: '',
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setConnectFormName: (name) => set((state) => ({
    connectForm: { ...state.connectForm, name }
  })),

  setConnectFormUrl: (url) => set((state) => ({
    connectForm: { ...state.connectForm, url }
  })),

  clearConnectForm: () => set({
    connectForm: { name: '', url: '' }
  }),
}))
