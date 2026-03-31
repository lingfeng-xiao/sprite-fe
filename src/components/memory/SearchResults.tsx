import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import type { SemanticSearchResult } from './MemorySearch'

interface SearchResultsProps {
  results: SemanticSearchResult[]
}

export function SearchResults({ results }: SearchResultsProps) {
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
