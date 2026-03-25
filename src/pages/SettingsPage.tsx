import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getBackupStatus, getBackupList, triggerBackup, getModelConfig, updateModelConfig } from '@/api/spriteApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useSpriteState } from '@/hooks/useSpriteData'
import { Settings, Database, Clock, RefreshCw, Loader2, GitBranch, Cpu, Save } from 'lucide-react'
import { format } from 'date-fns'

function GeneralSettings() {
  const { data: spriteState } = useSpriteState()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Settings className="h-5 w-5" />
          基本设置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">名称</span>
          <span className="font-medium">
            {spriteState?.identity?.name || 'Sprite'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Emoji</span>
          <span className="text-2xl">
            {spriteState?.identity?.emoji || '🤖'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">平台</span>
          <Badge variant="outline">
            {spriteState?.platform || 'UNKNOWN'}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">创建时间</span>
          <span className="text-sm">
            {spriteState?.identity?.createdAt
              ? format(new Date(spriteState.identity.createdAt), 'yyyy-MM-dd')
              : '-'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function ModelSettings() {
  const { data: spriteState } = useSpriteState()
  const { data: modelConfig, refetch } = useQuery({
    queryKey: ['model', 'config'],
    queryFn: getModelConfig,
  })

  const { mutate: saveConfig, isPending: isSaving } = useMutation({
    mutationFn: updateModelConfig,
    onSuccess: () => {
      refetch()
    },
  })

  const [provider, setProvider] = useState(modelConfig?.provider || 'minimax')
  const [modelName, setModelName] = useState(modelConfig?.modelName || 'MiniMax-Text-01')
  const [apiKey, setApiKey] = useState(modelConfig?.apiKey || '')
  const [baseUrl, setBaseUrl] = useState(modelConfig?.baseUrl || '')
  const [temperature, setTemperature] = useState(String(modelConfig?.temperature || 0.7))
  const [maxTokens, setMaxTokens] = useState(String(modelConfig?.maxTokens || 4096))

  useEffect(() => {
    if (modelConfig) {
      setProvider(modelConfig.provider)
      setModelName(modelConfig.modelName)
      setApiKey(modelConfig.apiKey)
      setBaseUrl(modelConfig.baseUrl)
      setTemperature(String(modelConfig.temperature))
      setMaxTokens(String(modelConfig.maxTokens))
    }
  }, [modelConfig])

  const handleSave = () => {
    saveConfig({
      provider,
      modelName,
      apiKey,
      baseUrl,
      temperature: parseFloat(temperature) || 0.7,
      maxTokens: parseInt(maxTokens) || 4096,
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Cpu className="h-5 w-5" />
          模型配置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">模型提供商</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="minimax">MiniMax</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="azure">Azure OpenAI</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">模型名称</label>
          <Input
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder="e.g., MiniMax-Text-01"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">API Key</label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Base URL</label>
          <Input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.minimax.chat"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Temperature</label>
            <Input
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="0.7"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Tokens</label>
            <Input
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
              placeholder="4096"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Badge variant={spriteState?.hasLlmSupport ? 'success' : 'secondary'}>
              {spriteState?.hasLlmSupport ? '已连接' : '未连接'}
            </Badge>
          </div>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            保存配置
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function BackupSettings() {
  const { data: backupStatus, refetch } = useQuery({
    queryKey: ['sprite', 'backup', 'status'],
    queryFn: getBackupStatus,
  })

  const { data: backupList, isLoading: listLoading } = useQuery({
    queryKey: ['sprite', 'backup', 'list'],
    queryFn: getBackupList,
  })

  const { mutate: backup, isPending: isBackingUp } = useMutation({
    mutationFn: triggerBackup,
  })

  const handleBackup = () => {
    backup()
    refetch()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <GitBranch className="h-5 w-5" />
          GitHub 备份
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleBackup} disabled={isBackingUp}>
          {isBackingUp ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          立即备份
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">备份状态</span>
          <Badge variant={backupStatus?.backupEnabled ? 'success' : 'secondary'}>
            {backupStatus?.backupEnabled ? '已启用' : '未启用'}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">上次备份</span>
          <span className="text-sm">
            {backupStatus?.lastBackupTime
              ? format(new Date(backupStatus.lastBackupTime), 'yyyy-MM-dd HH:mm')
              : '从未'}
          </span>
        </div>

        {listLoading ? (
          <Skeleton className="h-20" />
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">最近的备份</p>
            {backupList?.backups.slice(0, 5).map((b, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span>{b.commitMessage || format(new Date(b.timestamp), 'MM-dd HH:mm')}</span>
                <span className="text-xs text-muted-foreground">
                  {(b.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MemorySettings() {
  const { data: spriteState } = useSpriteState()

  const ms = spriteState?.memoryStatus

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Database className="h-5 w-5" />
          记忆设置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">感官记忆</span>
          <span className="text-sm">{ms?.sensoryCount || 0} 条</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">工作记忆</span>
          <span className="text-sm">
            {ms?.workingMemoryUsed || 0} / {ms?.workingMemoryMax || 7}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">长期记忆</span>
          <span className="text-sm">{ms?.longTermCount || 0} 条</span>
        </div>
      </CardContent>
    </Card>
  )
}

function EvolutionSettings() {
  const { data: spriteState } = useSpriteState()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Clock className="h-5 w-5" />
          进化设置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">当前等级</span>
          <Badge variant="outline">Level {spriteState?.identity?.growthHistory?.totalGrowthCycles || 0}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">进化次数</span>
          <span className="text-sm">{spriteState?.identity?.evolutionCount || 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">进化率</span>
          <span className="text-sm">
            {((spriteState?.identity?.growthHistory?.growthRate || 0) * 100).toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <GeneralSettings />
        <ModelSettings />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <BackupSettings />
        <MemorySettings />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <EvolutionSettings />
      </div>
    </div>
  )
}
