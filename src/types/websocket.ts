export interface ChatMessage {
  type: 'response' | 'error' | 'typing' | 'connected' | 'pong'
  content: string | null
  actions: string[] | null
}

export interface ChatRequest {
  type: 'chat' | 'ping'
  content: string
}

export interface SpriteWebSocketMessage {
  type: string
  data: unknown
}
