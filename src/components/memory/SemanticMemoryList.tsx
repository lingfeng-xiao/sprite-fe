import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles, Link2 } from 'lucide-react'
import { useSemanticMemories } from '@/hooks/api'

export const SemanticMemoryList = React.memo(function SemanticMemoryList() {
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
})
