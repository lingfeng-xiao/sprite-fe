import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Database } from 'lucide-react'
import { useEpisodicMemories } from '@/hooks/api'

export const EpisodicMemoryList = React.memo(function EpisodicMemoryList() {
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
})
