import { useEffect, useRef, useCallback, useState } from 'react'
import { ChatWebSocket, type WebSocketStatus } from '@/api/websocket'
import { useChatStore } from '@/stores/chatStore'
import type { ChatMessage } from '@/types/websocket'

const MAX_RETRIES = 3
const RETRY_DELAY = 2000

export function useChat() {
  const wsRef = useRef<ChatWebSocket | null>(null)
  const retryCountRef = useRef(0)
  const pendingMessageRef = useRef<string | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)
  const {
    messages,
    isTyping,
    connectionStatus,
    addMessage,
    setTyping,
    setConnectionStatus,
    clearMessages,
  } = useChatStore()

  const handleMessage = useCallback((message: ChatMessage) => {
    if (message.type === 'response' && message.content) {
      addMessage({
        id: crypto.randomUUID(),
        role: 'sprite',
        content: message.content,
        timestamp: new Date(),
        actions: message.actions || undefined,
      })
      setTyping(false)
      retryCountRef.current = 0 // Reset retry count on success
      setLastError(null)
    } else if (message.type === 'error' && message.content) {
      addMessage({
        id: crypto.randomUUID(),
        role: 'system',
        content: message.content.includes('API') || message.content.includes('key')
          ? '⚠️ LLM服务未配置或API密钥无效。请在设置中配置有效的MiniMax API密钥。'
          : `⚠️ ${message.content}`,
        timestamp: new Date(),
      })
      setTyping(false)
      setLastError(message.content)
    } else if (message.type === 'typing') {
      setTyping(true)
    } else if (message.type === 'connected') {
      retryCountRef.current = 0
      setLastError(null)
      // Send pending message if any
      if (pendingMessageRef.current && wsRef.current) {
        const msg = pendingMessageRef.current
        pendingMessageRef.current = null
        wsRef.current.send(msg)
        setTyping(true)
      }
    }
  }, [addMessage, setTyping])

  const connect = useCallback(() => {
    if (wsRef.current) return

    setConnectionStatus('connecting')
    retryCountRef.current = 0

    const ws = new ChatWebSocket({
      onMessage: handleMessage,
      onStatusChange: (status: WebSocketStatus) => {
        setConnectionStatus(status)
        if (status === 'error' && retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++
          setLastError(`连接失败，正在重试 (${retryCountRef.current}/${MAX_RETRIES})...`)
          setTimeout(() => {
            wsRef.current?.disconnect()
            wsRef.current = null
            connect()
          }, RETRY_DELAY * retryCountRef.current)
        } else if (status === 'disconnected' && retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++
          setTimeout(() => {
            wsRef.current?.disconnect()
            wsRef.current = null
            connect()
          }, RETRY_DELAY * retryCountRef.current)
        } else if (status === 'error' && retryCountRef.current >= MAX_RETRIES) {
          setLastError('无法连接到聊天服务，请检查后端服务是否运行')
          addMessage({
            id: crypto.randomUUID(),
            role: 'system',
            content: '⚠️ 无法连接到后端服务。请确保后端正在运行，然后刷新页面重试。',
            timestamp: new Date(),
          })
        }
      },
      onTyping: () => {
        setTyping(true)
      },
    })

    ws.connect()
    wsRef.current = ws
  }, [handleMessage, setConnectionStatus, setTyping, addMessage])

  const disconnect = useCallback(() => {
    retryCountRef.current = MAX_RETRIES // Prevent auto-reconnect
    if (wsRef.current) {
      wsRef.current.disconnect()
      wsRef.current = null
    }
  }, [])

  const sendMessage = useCallback((content: string) => {
    // Always add user message to UI immediately
    addMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    })

    if (wsRef.current && connectionStatus === 'connected') {
      wsRef.current.send(content)
      setTyping(true)
    } else {
      // Queue message for sending after connection
      pendingMessageRef.current = content
      addMessage({
        id: crypto.randomUUID(),
        role: 'system',
        content: '⚠️ 未连接到服务器，正在重连...',
        timestamp: new Date(),
      })
      connect()
    }
  }, [connectionStatus, addMessage, setTyping, connect])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    messages,
    isTyping,
    connectionStatus,
    lastError,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
  }
}
