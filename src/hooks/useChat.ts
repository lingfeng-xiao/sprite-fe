import { useEffect, useRef, useCallback } from 'react'
import { ChatWebSocket, type WebSocketStatus } from '@/api/websocket'
import { useChatStore } from '@/stores/chatStore'
import type { ChatMessage } from '@/types/websocket'

export function useChat() {
  const wsRef = useRef<ChatWebSocket | null>(null)
  const {
    messages,
    isTyping,
    connectionStatus,
    addMessage,
    setTyping,
    setConnectionStatus,
    clearMessages,
  } = useChatStore()

  const connect = useCallback(() => {
    if (wsRef.current) return

    const ws = new ChatWebSocket({
      onMessage: (message: ChatMessage) => {
        if (message.type === 'response' && message.content) {
          addMessage({
            id: crypto.randomUUID(),
            role: 'sprite',
            content: message.content,
            timestamp: new Date(),
            actions: message.actions || undefined,
          })
          setTyping(false)
        }
      },
      onStatusChange: (status: WebSocketStatus) => {
        setConnectionStatus(status)
      },
      onTyping: () => {
        setTyping(true)
      },
    })

    ws.connect()
    wsRef.current = ws
  }, [addMessage, setTyping, setConnectionStatus])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect()
      wsRef.current = null
    }
  }, [])

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current) {
      addMessage({
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
      })
      wsRef.current.send(content)
      setTyping(true)
    }
  }, [addMessage, setTyping])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    messages,
    isTyping,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
  }
}
