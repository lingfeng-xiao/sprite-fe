import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Brain } from 'lucide-react'
import { useMemoryStats } from '@/hooks/api'

export const MemoryStatsCard = React.memo(function MemoryStatsCard() {
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
})
