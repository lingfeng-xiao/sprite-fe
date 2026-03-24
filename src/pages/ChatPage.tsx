import { useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import { useSpriteState } from '@/hooks/useSpriteData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, RefreshCw, Trash2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function ChatPage() {
  const { messages, isTyping, connectionStatus, connect, sendMessage, clearMessages } = useChat()
  const { data: spriteState } = useSpriteState()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      connect()
    }
  }, [connectionStatus, connect])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    const content = inputRef.current?.value.trim()
    if (content) {
      sendMessage(content)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const statusColor = {
    connecting: 'bg-yellow-500',
    connected: 'bg-green-500',
    disconnected: 'bg-gray-500',
    error: 'bg-red-500',
  }[connectionStatus]

  return (
    <div className="flex h-full flex-col">
      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-4">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{spriteState?.identity?.emoji || '🤖'}</span>
              <span>{spriteState?.identity?.name || 'Sprite'}</span>
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${statusColor}`} />
              {connectionStatus === 'connected' ? '已连接' : '未连接'}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={connect} title="重连">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={clearMessages} title="清空">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>开始与 Sprite 对话吧</p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`mt-1 text-xs ${msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {format(msg.timestamp, 'HH:mm', { locale: zhCN })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce bg-muted-foreground" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="输入消息..."
              disabled={connectionStatus !== 'connected'}
              className="flex-1"
            />
            <Button type="submit" disabled={connectionStatus !== 'connected'}>
              {connectionStatus === 'connecting' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
