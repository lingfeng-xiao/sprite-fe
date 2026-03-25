import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { WS_BASE_URL } from '@/lib/constants'
import type { SpriteWebSocketMessage } from '@/types/websocket'

// ==================== WebSocket Context ====================

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

interface WebSocketContextValue {
  status: WebSocketStatus
  lastMessage: SpriteWebSocketMessage | null
  send: (message: SpriteWebSocketMessage) => void
  connect: () => void
  disconnect: () => void
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null)

interface WebSocketProviderProps {
  children: React.ReactNode
  path?: string
  autoConnect?: boolean
}

export function WebSocketProvider({
  children,
  path = '/ws/sprite',
  autoConnect = true,
}: WebSocketProviderProps) {
  const wsRef = useRef<WebSocket | null>(null)
  const [status, setStatus] = useState<WebSocketStatus>('disconnected')
  const [lastMessage, setLastMessage] = useState<SpriteWebSocketMessage | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setStatus('connecting')
    const ws = new WebSocket(`${WS_BASE_URL}${path}`)

    ws.onopen = () => {
      setStatus('connected')
      reconnectAttemptsRef.current = 0
    }

    ws.onmessage = (event) => {
      try {
        const message: SpriteWebSocketMessage = JSON.parse(event.data)
        setLastMessage(message)
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e)
      }
    }

    ws.onerror = () => {
      setStatus('error')
    }

    ws.onclose = () => {
      setStatus('disconnected')
      // Attempt reconnect
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++
        const delay = 1000 * reconnectAttemptsRef.current
        setTimeout(connect, delay)
      }
    }

    wsRef.current = ws
  }, [path])

  const disconnect = useCallback(() => {
    reconnectAttemptsRef.current = maxReconnectAttempts // Prevent auto-reconnect
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setStatus('disconnected')
  }, [])

  const send = useCallback((message: SpriteWebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  useEffect(() => {
    if (autoConnect) {
      connect()
    }
    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  return (
    <WebSocketContext.Provider value={{ status, lastMessage, send, connect, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider')
  }
  return context
}
