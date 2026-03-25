import { useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import { useSpriteState } from '@/hooks/useSpriteData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/EmptyState'
import { useSetPageInfo } from '@/contexts/PageContext'
import { Send, RefreshCw, Trash2, Loader2, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const statusConfig = {
  connecting: { color: 'bg-yellow-500', label: '连接中' },
  connected: { color: 'bg-green-500', label: '已连接' },
  disconnected: { color: 'bg-gray-500', label: '未连接' },
  error: { color: 'bg-red-500', label: '错误' },
} as const

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-lg px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce bg-muted-foreground" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 animate-bounce bg-muted-foreground" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 animate-bounce bg-muted-foreground" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const setPageInfo = useSetPageInfo()
  const { messages, isTyping, connectionStatus, connect, sendMessage, clearMessages } = useChat()
  const { data: spriteState } = useSpriteState()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPageInfo({
      title: '聊天',
      description: '与 Sprite 对话',
    })
    return () => setPageInfo(null)
  }, [setPageInfo])

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

  const status = statusConfig[connectionStatus]

  return (
    <div className="flex h-full flex-col">
      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{spriteState?.identity?.emoji || '🤖'}</span>
              <span className="text-lg font-semibold">{spriteState?.identity?.name || 'Sprite'}</span>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${status.color}`} />
              {status.label}
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
            <EmptyState
              icon={MessageCircle}
              title="开始与 Sprite 对话吧"
              description="输入消息开始聊天"
            />
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

          {isTyping && <TypingIndicator />}
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
