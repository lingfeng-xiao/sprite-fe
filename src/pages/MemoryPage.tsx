import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  useMemoryStats,
  useWorkingMemory,
  useEpisodicMemories,
  useSemanticMemories,
} from '@/hooks/api'
import { apiClient } from '@/api/client'
import type { EpisodicMemory, SemanticMemory } from '@/stores/memoryStore'
import {
  Brain,
  Search,
  Sparkles,
  Clock,
  Database,
  Link2,
  GitBranch,
} from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'

// ==================== Types ====================

interface SemanticSearchResult {
  memoryId: string
  memoryType: string
  content: string
  similarity: number
}

// ==================== Memory Stats Card ====================

function MemoryStatsCard() {
  const { data: stats, isLoading } = useMemoryStats()

  if (isLoading || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Memory Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Memory Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{stats.totalMemoryCount}</p>
            <p className="text-xs text-muted-foreground">Total Memories</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{(stats.averageStrength * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Average Strength</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Memory Distribution</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Episodic</span>
              <span>{stats.typeStats.episodicCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Semantic</span>
              <span>{stats.typeStats.semanticCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Procedural</span>
              <span>{stats.typeStats.proceduralCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Perceptive</span>
              <span>{stats.typeStats.perceptiveCount}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Strength Distribution</p>
          <div className="flex gap-1">
            {[
              { label: 'Very Low', count: stats.strengthDistribution.veryLowCount, color: 'bg-red-200' },
              { label: 'Low', count: stats.strengthDistribution.lowCount, color: 'bg-orange-200' },
              { label: 'Medium', count: stats.strengthDistribution.mediumCount, color: 'bg-yellow-200' },
              { label: 'High', count: stats.strengthDistribution.highCount, color: 'bg-lime-200' },
              { label: 'Very High', count: stats.strengthDistribution.veryHighCount, color: 'bg-green-200' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-1 flex-col items-center"
                title={`${item.label}: ${item.count}`}
              >
                <div className={`h-8 w-full rounded ${item.color}`} />
                <span className="mt-1 text-xs text-muted-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== Working Memory Card ====================

function WorkingMemoryCard() {
  const { data: working, isLoading } = useWorkingMemory()

  if (isLoading || !working) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Working Memory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20" />
        </CardContent>
      </Card>
    )
  }

  const percent = working.max > 0 ? Math.round((working.used / working.max) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Working Memory
        </CardTitle>
        <CardDescription>Short-term active memory content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Usage</span>
            <span className="font-medium">
              {working.used} / {working.max}
            </span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Current Items</p>
          <div className="flex flex-wrap gap-2">
            {working.items.length > 0 ? (
              working.items.map((item, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">None</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== Episodic Memory List ====================

function EpisodicMemoryList() {
  const { data: memories, isLoading } = useEpisodicMemories()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Episodic Memory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20" />
          <Skeleton className="mt-2 h-20" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Episodic Memory
        </CardTitle>
        <CardDescription>Experience and event records</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {memories && memories.length > 0 ? (
          memories.map((memory) => (
            <div
              key={memory.id}
              className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="flex-1 text-sm">{memory.content}</p>
                <Badge
                  variant="outline"
                  className="text-xs"
                  title={`Strength: ${(memory.strength * 100).toFixed(0)}%`}
                >
                  {(memory.strength * 100).toFixed(0)}%
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date(memory.timestamp).toLocaleString()}</span>
                {memory.emotions && memory.emotions.length > 0 && (
                  <div className="flex gap-1">
                    {memory.emotions.map((e) => (
                      <Badge key={e} variant="secondary" className="text-xs">
                        {e}
                      </Badge>
                    ))}
                  </div>
                )}
                {memory.entities && memory.entities.length > 0 && (
                  <div className="flex gap-1">
                    {memory.entities.slice(0, 3).map((entity) => (
                      <Badge key={entity} variant="outline" className="text-xs">
                        {entity}
                      </Badge>
                    ))}
                    {memory.entities.length > 3 && (
                      <span className="text-xs">+{memory.entities.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No episodic memories yet</p>
        )}
      </CardContent>
    </Card>
  )
}

// ==================== Semantic Memory List ====================

function SemanticMemoryList() {
  const { data: memories, isLoading } = useSemanticMemories()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Semantic Memory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20" />
          <Skeleton className="mt-2 h-20" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Semantic Memory
        </CardTitle>
        <CardDescription>Concept and knowledge network</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {memories && memories.length > 0 ? (
          memories.map((memory) => (
            <div
              key={memory.id}
              className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium">{memory.concept}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{memory.description}</p>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs"
                  title={`Confidence: ${(memory.confidence * 100).toFixed(0)}%`}
                >
                  {(memory.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
              {memory.connections && memory.connections.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                  <Link2 className="h-3 w-3" />
                  {memory.connections.slice(0, 5).map((conn) => (
                    <Badge key={conn} variant="secondary" className="text-xs">
                      {conn}
                    </Badge>
                  ))}
                  {memory.connections.length > 5 && (
                    <span>+{memory.connections.length - 5}</span>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No semantic memories yet</p>
        )}
      </CardContent>
    </Card>
  )
}

// ==================== Memory Search ====================

function MemorySearch({ onResults }: { onResults: (results: SemanticSearchResult[]) => void }) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchMode, setSearchMode] = useState<'keyword' | 'semantic'>('keyword')

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      if (searchMode === 'semantic') {
        const response = await apiClient.post<SemanticSearchResult[]>('/api/memories/semantic-search', {
          query,
          limit: 20,
        })
        onResults(response.data)
      } else {
        const [episodic, semantic] = await Promise.all([
          apiClient.get<EpisodicMemory[]>('/api/memories/episodic'),
          apiClient.get<SemanticMemory[]>('/api/memories/semantic'),
        ])

        const results: SemanticSearchResult[] = []

        episodic.data
          .filter((m) => m.content.toLowerCase().includes(query.toLowerCase()))
          .forEach((m) => {
            results.push({
              memoryId: m.id,
              memoryType: 'episodic',
              content: m.content,
              similarity: 1.0,
            })
          })

        semantic.data
          .filter(
            (m) =>
              m.concept.toLowerCase().includes(query.toLowerCase()) ||
              m.description.toLowerCase().includes(query.toLowerCase())
          )
          .forEach((m) => {
            results.push({
              memoryId: m.id,
              memoryType: 'semantic',
              content: `${m.concept}: ${m.description}`,
              similarity: 1.0,
            })
          })

        onResults(results)
      }
    } catch (error) {
      console.error('Search failed:', error)
      onResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Memory Search
        </CardTitle>
        <CardDescription>Keyword or semantic search</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Enter search keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={searchMode === 'keyword' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchMode('keyword')}
          >
            Keyword
          </Button>
          <Button
            variant={searchMode === 'semantic' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchMode('semantic')}
          >
            Semantic
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== Search Results ====================

function SearchResults({ results }: { results: SemanticSearchResult[] }) {
  if (results.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Search Results
        </CardTitle>
        <CardDescription>Found {results.length} related memories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {results.map((result, idx) => (
          <div
            key={`${result.memoryId}-${idx}`}
            className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="flex-1 text-sm">{result.content}</p>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className="text-xs">
                  {result.memoryType === 'episodic' ? 'Episodic' : 'Semantic'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Similarity: {(result.similarity * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ==================== Memory Link Graph ====================

interface MemoryNode {
  id: string
  label: string
  type: 'episodic' | 'semantic' | 'concept'
  x?: number
  y?: number
}

interface MemoryEdge {
  source: string
  target: string
  label?: string
}

function MemoryLinkGraph() {
  const { data: semantic } = useSemanticMemories()
  const { data: episodic } = useEpisodicMemories()

  const { nodes, edges } = useMemo(() => {
    const nodes: MemoryNode[] = []
    const edges: MemoryEdge[] = []
    const nodeIds = new Set<string>()

    semantic?.forEach((m) => {
      if (!nodeIds.has(m.id)) {
        nodes.push({
          id: m.id,
          label: m.concept,
          type: 'semantic',
        })
        nodeIds.add(m.id)
      }

      m.connections?.forEach((conn) => {
        edges.push({
          source: m.id,
          target: conn,
          label: 'relates_to',
        })

        if (!nodeIds.has(conn)) {
          nodes.push({
            id: conn,
            label: conn,
            type: 'concept',
          })
          nodeIds.add(conn)
        }
      })
    })

    episodic?.slice(0, 10).forEach((m) => {
      if (!nodeIds.has(m.id)) {
        nodes.push({
          id: m.id,
          label: m.content.substring(0, 30) + (m.content.length > 30 ? '...' : ''),
          type: 'episodic',
        })
        nodeIds.add(m.id)
      }
    })

    return { nodes, edges }
  }, [semantic, episodic])

  if (!semantic && !episodic) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Memory Link Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          Memory Link Graph
        </CardTitle>
        <CardDescription>Relationships between memories</CardDescription>
      </CardHeader>
      <CardContent>
        {nodes.length > 0 ? (
          <div className="relative h-64 overflow-hidden rounded-lg border bg-muted/20">
            <div className="absolute inset-0 p-4">
              <div className="absolute left-2 top-2 flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span>Episodic</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span>Semantic</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-gray-400" />
                  <span>Concept</span>
                </div>
              </div>

              <div className="flex h-full flex-wrap content-start gap-2">
                {nodes.slice(0, 20).map((node) => {
                  const colors = {
                    episodic: 'bg-blue-500',
                    semantic: 'bg-green-500',
                    concept: 'bg-gray-400',
                  }
                  return (
                    <div
                      key={node.id}
                      className={`rounded-full ${colors[node.type]} px-2 py-1 text-xs text-white`}
                      title={node.label}
                      style={{
                        maxWidth: '120px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {node.label}
                    </div>
                  )
                })}
                {nodes.length > 20 && (
                  <div className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                    +{nodes.length - 20} more
                  </div>
                )}
              </div>

              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {edges.length} connections
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No link data yet</p>
        )}
      </CardContent>
    </Card>
  )
}

// ==================== Main Memory Page ====================

export default function MemoryPage() {
  const [searchResults, setSearchResults] = useState<SemanticSearchResult[]>([])

  const { data: episodic } = useEpisodicMemories()
  const { data: semantic } = useSemanticMemories()
  const { data: working } = useWorkingMemory()

  return (
    <PageLayout
      header={{
        title: 'Memory Browser',
        icon: Brain,
        description: "Explore Sprite's memory system: episodic, semantic, and working memory",
      }}
    >
      {/* Memory Stats */}
      <MemoryStatsCard />

      {/* Tab Navigation */}
      <Tabs defaultValue="working" className="space-y-4">
        <TabsList>
          <TabsTrigger value="working">
            <Clock className="mr-2 h-4 w-4" />
            Working ({working?.used || 0})
          </TabsTrigger>
          <TabsTrigger value="episodic">
            <Database className="mr-2 h-4 w-4" />
            Episodic ({episodic?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="semantic">
            <Sparkles className="mr-2 h-4 w-4" />
            Semantic ({semantic?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="working">
          <WorkingMemoryCard />
        </TabsContent>

        <TabsContent value="episodic">
          <Card>
            <CardContent className="pt-6">
              <EpisodicMemoryList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semantic">
          <Card>
            <CardContent className="pt-6">
              <SemanticMemoryList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Memory Search */}
      <MemorySearch onResults={setSearchResults} />

      {/* Search Results */}
      <SearchResults results={searchResults} />

      {/* Memory Link Graph */}
      <MemoryLinkGraph />
    </PageLayout>
  )
}
