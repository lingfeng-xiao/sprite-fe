import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { apiClient } from '@/api/client'
import type { EpisodicMemory, SemanticMemory } from '@/stores/memoryStore'

export interface SemanticSearchResult {
  memoryId: string
  memoryType: string
  content: string
  similarity: number
}

interface MemorySearchProps {
  onResults: (results: SemanticSearchResult[]) => void
}

export function MemorySearch({ onResults }: MemorySearchProps) {
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
