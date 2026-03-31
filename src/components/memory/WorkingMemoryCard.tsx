import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock } from 'lucide-react'
import { useWorkingMemory } from '@/hooks/api'

export function WorkingMemoryCard() {
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
