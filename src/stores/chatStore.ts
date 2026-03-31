import { create } from 'zustand'

export interface ChatMessageItem {
  id: string
  role: 'user' | 'sprite' | 'system'
  content: string
  timestamp: Date
  actions?: string[]
}

interface ChatStore {
  messages: ChatMessageItem[]
  isTyping: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  addMessage: (message: ChatMessageItem) => void
  setTyping: (typing: boolean) => void
  setConnectionStatus: (status: ChatStore['connectionStatus']) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isTyping: false,
  connectionStatus: 'disconnected',
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (typing) => set({ isTyping: typing }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  clearMessages: () => set({ messages: [] }),
}))
