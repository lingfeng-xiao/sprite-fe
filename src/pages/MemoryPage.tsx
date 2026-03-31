import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  useEpisodicMemories,
  useSemanticMemories,
  useWorkingMemory,
} from '@/hooks/api'
import { Brain, Clock, Database, Sparkles } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import {
  MemoryStatsCard,
  WorkingMemoryCard,
  EpisodicMemoryList,
  SemanticMemoryList,
  MemorySearch,
  SearchResults,
  MemoryLinkGraph,
  type SemanticSearchResult,
} from '@/components/memory'

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
