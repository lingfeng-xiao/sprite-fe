import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { GitBranch } from 'lucide-react'
import { useSemanticMemories, useEpisodicMemories } from '@/hooks/api'

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

export function MemoryLinkGraph() {
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
