import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, CheckCircle, Loader2, PauseCircle, PlayCircle, RotateCcw, Save } from 'lucide-react'
import {
  getModelConfig,
  pauseAutonomy,
  resetLifeState,
  resumeAutonomy,
  testModelConnection,
  updateModelConfig,
} from '@/api/spriteApi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSetPageInfo } from '@/contexts/PageContext'
import { useAutonomyStatus, useLifeSnapshot } from '@/hooks/useSpriteData'
import { QUERY_KEYS } from '@/lib/constants'
import type { ModelConfig } from '@/types/api'

export default function SettingsPage() {
  const setPageInfo = useSetPageInfo()
  const queryClient = useQueryClient()
  const { data: lifeSnapshot } = useLifeSnapshot()
  const { data: autonomyStatus } = useAutonomyStatus()
  const { data: modelConfig } = useQuery({
    queryKey: QUERY_KEYS.modelConfig,
    queryFn: getModelConfig,
  })

  const [form, setForm] = useState<ModelConfig>({
    provider: 'minimax',
    modelName: 'MiniMax-Text-01',
    apiKey: '',
    baseUrl: 'https://api.minimax.chat',
    temperature: 0.7,
    maxTokens: 4096,
  })
  const [testMessage, setTestMessage] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    setPageInfo({
      title: 'Settings',
      description: "Tune the being's model bridge, autonomy boundary, and recovery controls.",
    })
    return () => setPageInfo(null)
  }, [setPageInfo])

  useEffect(() => {
    if (modelConfig) {
      setForm(modelConfig)
    }
  }, [modelConfig])

  const { mutate: saveConfig, isPending: isSaving } = useMutation({
    mutationFn: updateModelConfig,
    onSuccess: (saved) => {
      setForm(saved)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.modelConfig })
    },
  })

  const { mutate: runModelTest, isPending: isTesting } = useMutation({
    mutationFn: testModelConnection,
    onSuccess: (result) => setTestMessage(result),
    onError: (error) => setTestMessage({ success: false, message: String(error) }),
  })

  const { mutate: setPaused, isPending: isUpdatingAutonomy } = useMutation({
    mutationFn: autonomyStatus?.paused ? resumeAutonomy : pauseAutonomy,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lifeAutonomy })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lifeSnapshot })
    },
  })

  const { mutate: resetLife, isPending: isResetting } = useMutation({
    mutationFn: resetLifeState,
    onSuccess: (snapshot) => {
      queryClient.setQueryData(QUERY_KEYS.lifeSnapshot, snapshot)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lifeJournal })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lifeAutonomy })
    },
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identity Anchor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Display name</span>
              <span className="font-medium">{lifeSnapshot?.displayName || 'Sprite'}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Identity summary</span>
              <span className="max-w-[70%] text-right text-sm">{lifeSnapshot?.identitySummary || '-'}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Autonomy mode</span>
              <Badge variant={autonomyStatus?.paused ? 'warning' : 'success'}>
                {autonomyStatus?.paused ? 'Paused' : autonomyStatus?.mode || 'Active'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Autonomy Boundary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border bg-background/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Awareness</div>
              <div className="mt-2 text-lg font-medium">{autonomyStatus?.awarenessLevel || 'REACTIVE'}</div>
            </div>
            <div className="rounded-2xl border bg-background/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Autonomy factor</div>
              <div className="mt-2 text-lg font-medium">
                {Math.round((autonomyStatus?.autonomyFactor || 0) * 100)}%
              </div>
            </div>
            <Button
              className="w-full"
              variant={autonomyStatus?.paused ? 'default' : 'outline'}
              onClick={() => setPaused()}
              disabled={isUpdatingAutonomy}
            >
              {isUpdatingAutonomy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : autonomyStatus?.paused ? (
                <PlayCircle className="mr-2 h-4 w-4" />
              ) : (
                <PauseCircle className="mr-2 h-4 w-4" />
              )}
              {autonomyStatus?.paused ? 'Resume autonomy' : 'Pause autonomy'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Bridge</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Provider</label>
            <select
              value={form.provider}
              onChange={(event) => setForm((current) => ({ ...current, provider: event.target.value }))}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-sm"
            >
              <option value="minimax">MiniMax</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Model name</label>
            <Input
              value={form.modelName}
              onChange={(event) => setForm((current) => ({ ...current, modelName: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">API key</label>
            <Input
              type="password"
              value={form.apiKey}
              onChange={(event) => setForm((current) => ({ ...current, apiKey: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Base URL</label>
            <Input
              value={form.baseUrl}
              onChange={(event) => setForm((current) => ({ ...current, baseUrl: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Temperature</label>
            <Input
              value={String(form.temperature)}
              onChange={(event) =>
                setForm((current) => ({ ...current, temperature: Number(event.target.value) || 0.7 }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Max tokens</label>
            <Input
              value={String(form.maxTokens)}
              onChange={(event) =>
                setForm((current) => ({ ...current, maxTokens: Number(event.target.value) || 4096 }))
              }
            />
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-2">
            <Button onClick={() => saveConfig(form)} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save bridge config
            </Button>
            <Button variant="outline" onClick={() => runModelTest()} disabled={isTesting}>
              {isTesting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : testMessage?.success ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <AlertTriangle className="mr-2 h-4 w-4" />
              )}
              Test connection
            </Button>
          </div>
          {testMessage && (
            <div
              className={`rounded-lg border p-4 text-sm lg:col-span-2 ${
                testMessage.success
                  ? 'border-green-500/30 bg-green-500/10 text-green-700'
                  : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-700'
              }`}
            >
              {testMessage.message}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recovery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Recovery clears the life loop state, journal, and active intentions, but keeps the runtime model configuration.
          </p>
          <Button
            variant="destructive"
            onClick={() => {
              if (window.confirm('Recover the life state? This clears journal and active state.')) {
                resetLife()
              }
            }}
            disabled={isResetting}
          >
            {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />}
            Reset life state
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
