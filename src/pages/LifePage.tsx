import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Brain, Compass, Loader2, Send, Sparkles } from 'lucide-react'
import { useSetPageInfo } from '@/contexts/PageContext'
import { useAutonomyStatus, useLifeJournal, useLifeSnapshot } from '@/hooks/useSpriteData'
import { QUERY_KEYS } from '@/lib/constants'
import { sendLifeCommand } from '@/api/spriteApi'
import type { LifeCommandType } from '@/types/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const commandTypes: LifeCommandType[] = ['ASK', 'TASK', 'RESEARCH', 'ACTION', 'LEARNING', 'DECISION']

export default function LifePage() {
  const setPageInfo = useSetPageInfo()
  const queryClient = useQueryClient()
  const { data: lifeSnapshot } = useLifeSnapshot()
  const { data: autonomyStatus } = useAutonomyStatus()
  const { data: journal } = useLifeJournal(8)
  const [commandType, setCommandType] = useState<LifeCommandType>('ASK')
  const [command, setCommand] = useState('')
  const [latestReply, setLatestReply] = useState<string | null>(null)

  useEffect(() => {
    setPageInfo({
      title: 'Life',
      description: 'A daily pulse view of the digital being, its memory, and its next move.',
    })
    return () => setPageInfo(null)
  }, [setPageInfo])

  const { mutate: runCommand, isPending } = useMutation({
    mutationFn: sendLifeCommand,
    onSuccess: (response) => {
      setLatestReply(response.commandResult.detail)
      setCommand('')
      queryClient.setQueryData(QUERY_KEYS.lifeSnapshot, response.lifeSnapshot)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lifeJournal })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lifeAutonomy })
    },
  })

  const submitCommand = (event: React.FormEvent) => {
    event.preventDefault()
    if (!command.trim()) return
    runCommand({
      type: commandType,
      content: command.trim(),
      source: 'life-home',
    })
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                <span>Home pulse</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                <span>Live snapshot</span>
              </div>
              <CardTitle className="flex items-center gap-3 text-3xl tracking-tight sm:text-4xl">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                  {lifeSnapshot?.emoji || 'AI'}
                </span>
                {lifeSnapshot?.displayName || 'Sprite'}
              </CardTitle>
              <CardDescription className="max-w-3xl text-sm leading-6">
                {lifeSnapshot?.identitySummary || 'Loading the living loop...'}
              </CardDescription>
            </div>
            <Badge variant={autonomyStatus?.paused ? 'warning' : 'success'} className="self-start">
              {autonomyStatus?.paused ? 'Autonomy paused' : 'Autonomy active'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-background/70 p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Coherence</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">
              {Math.round((lifeSnapshot?.coherenceScore || 0) * 100)}%
            </div>
          </div>
          <div className="rounded-2xl border bg-background/70 p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Energy</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">
              {Math.round((lifeSnapshot?.currentState.energyLevel || 0) * 100)}%
            </div>
          </div>
          <div className="rounded-2xl border bg-background/70 p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Attention</div>
            <div className="mt-2 text-lg font-semibold leading-6">
              {lifeSnapshot?.attentionFocus.description || 'Idle'}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Compass className="h-5 w-5" />
                Active Intentions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lifeSnapshot?.activeIntentions.length ? (
                lifeSnapshot.activeIntentions.slice(0, 4).map((intention) => (
                  <div key={intention.intentionId} className="rounded-2xl border bg-background/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium leading-6">{intention.description}</div>
                      <Badge variant="outline">{intention.urgency.toLowerCase()}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Status: {intention.status.toLowerCase()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                  No active intention yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="h-5 w-5" />
                Recent Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lifeSnapshot?.recentChanges.length ? (
                lifeSnapshot.recentChanges.map((change) => (
                  <div key={change.changeId} className="rounded-2xl border bg-background/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium leading-6">{change.description}</div>
                      <Badge variant="outline">{change.type.toLowerCase()}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{change.newState}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                  No recent change recorded yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Memory Traces</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lifeSnapshot?.recentMemorySummaries.length ? (
                lifeSnapshot.recentMemorySummaries.map((summary) => (
                  <div key={summary} className="rounded-2xl border bg-background/70 p-4 text-sm leading-6">
                    {summary}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                  No memory summary yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Likely Next Moves</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(lifeSnapshot?.nextLikelyActions || []).map((action) => (
                <div key={action} className="rounded-2xl border bg-background/70 p-4 text-sm leading-6">
                  {action}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5" />
                Speak to Sprite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    value={command}
                    onChange={(event) => setCommand(event.target.value)}
                    placeholder="Ask, assign, research, decide, or let Sprite learn with you..."
                  />
                  <Button type="submit" disabled={isPending || !command.trim()}>
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </form>

              {latestReply && (
                <div className="rounded-2xl border bg-muted/40 p-4 text-sm leading-6">
                  {latestReply}
                </div>
              )}

              {!!journal?.length && (
                <div className="rounded-2xl border bg-background/70 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Latest journal</div>
                  <div className="mt-2 text-sm font-medium">{journal[0].title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{journal[0].detail}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
