import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Activity, Compass, Loader2, Send } from 'lucide-react'
import { sendLifeCommand } from '@/api/spriteApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSetPageInfo } from '@/contexts/PageContext'
import { useLifeJournal, useLifeSnapshot } from '@/hooks/useSpriteData'
import { QUERY_KEYS } from '@/lib/constants'
import type { LifeCommandType } from '@/types/api'
import { PageLayout } from '@/components/layout/PageLayout'
import { StatCard } from '@/components/ui/StatCard'

const commandTypes: LifeCommandType[] = ['ASK', 'TASK', 'RESEARCH', 'ACTION', 'LEARNING', 'DECISION']

export default function ChatPage() {
  const setPageInfo = useSetPageInfo()
  const queryClient = useQueryClient()
  const { data: lifeSnapshot } = useLifeSnapshot()
  const { data: journal } = useLifeJournal(24)
  const [commandType, setCommandType] = useState<LifeCommandType>('ASK')
  const [input, setInput] = useState('')
  const [latestReply, setLatestReply] = useState<string | null>(null)

  useEffect(() => {
    setPageInfo({
      title: 'Command',
      description: 'One surface for questions, tasks, research, and decisions.',
    })
    return () => setPageInfo(null)
  }, [setPageInfo])

  const { mutate: runCommand, isPending } = useMutation({
    mutationFn: sendLifeCommand,
    onSuccess: (response) => {
      setLatestReply(response.commandResult.detail)
      setInput('')
      queryClient.setQueryData(QUERY_KEYS.lifeSnapshot, response.lifeSnapshot)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lifeJournal })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lifeAutonomy })
    },
  })

  const submitCommand = (event: React.FormEvent) => {
    event.preventDefault()
    if (!input.trim()) return
    runCommand({
      type: commandType,
      content: input.trim(),
      source: 'chat-page',
    })
  }

  return (
    <PageLayout
      header={{
        title: 'Command',
        description: 'One surface for questions, tasks, research, and decisions.',
      }}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Main Chat Card */}
        <Card className="flex min-h-[70vh] flex-col overflow-hidden border-primary/10 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-2xl tracking-tight sm:text-3xl">
                  {lifeSnapshot?.emoji || 'AI'} {lifeSnapshot?.displayName || 'Sprite'}
                </CardTitle>
                <div className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  This is where you ask, assign, decide, and collaborate with the being in one flow.
                </div>
              </div>
              <Badge variant="outline">{lifeSnapshot?.attentionFocus.type?.toLowerCase() || 'idle'}</Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-4 overflow-y-auto">
            {(journal || []).map((entry) => (
              <div key={entry.id} className="rounded-xl border bg-background/70 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{entry.title}</div>
                  <Badge variant="outline">{entry.entryType.toLowerCase()}</Badge>
                </div>
                <div className="mt-2 text-sm leading-6 text-muted-foreground">{entry.detail}</div>
              </div>
            ))}

            {latestReply && (
              <div className="rounded-xl border bg-primary/5 p-4 text-sm leading-6">
                {latestReply}
              </div>
            )}
          </CardContent>

          <div className="border-t bg-background/60 p-4 backdrop-blur">
            <form onSubmit={submitCommand} className="space-y-3">
              <select
                value={commandType}
                onChange={(event) => setCommandType(event.target.value as LifeCommandType)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-sm"
              >
                {commandTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Tell Sprite what matters right now..."
                />
                <Button type="submit" disabled={isPending || !input.trim()}>
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Pulse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <StatCard
                label="Attention"
                value={lifeSnapshot?.attentionFocus.description || 'Idle'}
                icon={Compass}
                size="md"
              />
              <StatCard
                label="Coherence"
                value={`${Math.round((lifeSnapshot?.coherenceScore || 0) * 100)}%`}
                icon={Activity}
                size="md"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Intentions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(lifeSnapshot?.activeIntentions || []).slice(0, 5).map((intention) => (
                <div key={intention.intentionId} className="rounded-xl border bg-background/70 p-4">
                  <div className="font-medium leading-6">{intention.description}</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {intention.status.toLowerCase()} / {intention.urgency.toLowerCase()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
