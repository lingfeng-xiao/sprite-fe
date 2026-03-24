import { WS_BASE_URL } from '@/lib/constants'
import type { ChatMessage, ChatRequest, SpriteWebSocketMessage } from '@/types/websocket'

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface ChatWebSocketOptions {
  onMessage: (message: ChatMessage) => void
  onStatusChange: (status: WebSocketStatus) => void
  onTyping: () => void
}

export class ChatWebSocket {
  private ws: WebSocket | null = null
  private options: ChatWebSocketOptions
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor(options: ChatWebSocketOptions) {
    this.options = options
  }

  connect(): void {
    this.options.onStatusChange('connecting')

    this.ws = new WebSocket(`${WS_BASE_URL}/ws/chat`)

    this.ws.onopen = () => {
      this.options.onStatusChange('connected')
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      try {
        const message: ChatMessage = JSON.parse(event.data)

        if (message.type === 'typing') {
          this.options.onTyping()
        } else {
          this.options.onMessage(message)
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e)
      }
    }

    this.ws.onerror = () => {
      this.options.onStatusChange('error')
    }

    this.ws.onclose = () => {
      this.options.onStatusChange('disconnected')
      this.attemptReconnect()
    }
  }

  send(content: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const request: ChatRequest = { type: 'chat', content }
      this.ws.send(JSON.stringify(request))
    }
  }

  ping(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping' }))
    }
  }

  disconnect(): void {
    this.maxReconnectAttempts = 0
    this.ws?.close()
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts)
    }
  }
}

export interface SpriteWebSocketOptions {
  onMessage: (message: SpriteWebSocketMessage) => void
  onStatusChange: (status: WebSocketStatus) => void
}

export class SpriteWebSocket {
  private ws: WebSocket | null = null
  private options: SpriteWebSocketOptions
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor(options: SpriteWebSocketOptions) {
    this.options = options
  }

  connect(): void {
    this.options.onStatusChange('connecting')

    this.ws = new WebSocket(`${WS_BASE_URL}/ws/sprite`)

    this.ws.onopen = () => {
      this.options.onStatusChange('connected')
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      try {
        const message: SpriteWebSocketMessage = JSON.parse(event.data)
        this.options.onMessage(message)
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e)
      }
    }

    this.ws.onerror = () => {
      this.options.onStatusChange('error')
    }

    this.ws.onclose = () => {
      this.options.onStatusChange('disconnected')
      this.attemptReconnect()
    }
  }

  disconnect(): void {
    this.maxReconnectAttempts = 0
    this.ws?.close()
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts)
    }
  }
}
