import { useEffect, useCallback } from 'react'
import { useWebSocketContext, type WebSocketStatus } from '@/contexts/WebSocketContext'
import type { SpriteWebSocketMessage } from '@/types/websocket'

// ==================== Sprite WebSocket Hook ====================

interface UseSpriteWebSocketOptions {
  onMessage?: (message: SpriteWebSocketMessage) => void
  onStatusChange?: (status: WebSocketStatus) => void
  autoConnect?: boolean
}

interface UseSpriteWebSocketReturn {
  status: WebSocketStatus
  lastMessage: SpriteWebSocketMessage | null
  sendMessage: (type: string, data: unknown) => void
  connect: () => void
  disconnect: () => void
}

/**
 * SingleSpriteWebSocket hook
 * Provides a unified WebSocket connection for sprite communication
 * that can be shared across multiple components/pages
 */
export function useSpriteWebSocket(options: UseSpriteWebSocketOptions = {}): UseSpriteWebSocketReturn {
  const { onMessage, onStatusChange } = options
  const { status, lastMessage, send, connect, disconnect } = useWebSocketContext()

  // Notify status changes
  useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  // Notify message arrivals
  useEffect(() => {
    if (lastMessage) {
      onMessage?.(lastMessage)
    }
  }, [lastMessage, onMessage])

  const sendMessage = useCallback(
    (type: string, data: unknown) => {
      send({ type, data })
    },
    [send]
  )

  return {
    status,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
  }
}

// ==================== Chat WebSocket Hook ====================

interface UseChatWebSocketOptions {
  onTyping?: () => void
  onMessage?: (content: string, actions?: string[]) => void
  onStatusChange?: (status: WebSocketStatus) => void
  autoConnect?: boolean
}

interface UseChatWebSocketReturn {
  status: WebSocketStatus
  sendMessage: (content: string) => void
  sendPing: () => void
  connect: () => void
  disconnect: () => void
}

export function useChatWebSocket(options: UseChatWebSocketOptions = {}): UseChatWebSocketReturn {
  const { onTyping, onMessage, onStatusChange } = options
  const { status, lastMessage, send, connect, disconnect } = useWebSocketContext()

  // Notify status changes
  useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  // Handle incoming chat messages
  useEffect(() => {
    if (!lastMessage) return

    const message = lastMessage as { type: string; content?: string; actions?: string[] }

    if (message.type === 'typing') {
      onTyping?.()
    } else if (message.type === 'response' && message.content) {
      onMessage?.(message.content, message.actions)
    }
  }, [lastMessage, onTyping, onMessage])

  const sendMessage = useCallback(
    (content: string) => {
      send({ type: 'chat', data: { content } })
    },
    [send]
  )

  const sendPing = useCallback(() => {
    send({ type: 'ping', data: null })
  }, [send])

  return {
    status,
    sendMessage,
    sendPing,
    connect,
    disconnect,
  }
}
