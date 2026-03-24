import { useEmotionDashboard } from '@/hooks/useSpriteData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart, TrendingUp, Calendar, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { format } from 'date-fns'

function EmotionTrendCard() {
  const { data, isLoading } = useEmotionDashboard()

  if (isLoading) return <Skeleton className="h-[300px]" />

  const trendData = data?.recentTrend.map((t) => ({
    time: format(new Date(t.timestamp), 'HH:mm'),
    sentiment: t.sentiment,
    emotion: t.emotion,
  })) || []

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <TrendingUp className="h-5 w-5" />
          情绪趋势
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis domain={[-1, 1]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ fill: '#8884d8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function WeeklyPatternCard() {
  const { data, isLoading } = useEmotionDashboard()

  if (isLoading) return <Skeleton className="h-[200px]" />

  const patternData = data?.weeklyPatterns.map((p) => ({
    day: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][p.dayOfWeek],
    sentiment: p.averageSentiment,
    interactions: p.interactionCount,
  })) || []

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Calendar className="h-5 w-5" />
          周内模式
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={patternData}>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis domain={[-1, 1]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="sentiment" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function OptimalTimesCard() {
  const { data, isLoading } = useEmotionDashboard()

  if (isLoading) return <Skeleton className="h-[200px]" />

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Clock className="h-5 w-5" />
          最佳联系时间
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data?.optimalTimes && data.optimalTimes.length > 0 ? (
          <div className="space-y-3">
            {data.optimalTimes.map((t, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.timeSlot}</span>
                <Badge variant="secondary">{(t.score * 100).toFixed(0)}%</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">暂无数据</p>
        )}
      </CardContent>
    </Card>
  )
}

function EmotionDistributionCard() {
  const { data, isLoading } = useEmotionDashboard()

  if (isLoading) return <Skeleton className="h-[200px]" />

  const dist = data?.distribution

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Heart className="h-5 w-5" />
          情绪分布
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dist && (
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-green-500">积极</span>
                <span>{dist.positivePercent.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${dist.positivePercent}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-500">中性</span>
                <span>{dist.neutralPercent.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gray-500 transition-all"
                  style={{ width: `${dist.neutralPercent}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-red-500">消极</span>
                <span>{dist.negativePercent.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-red-500 transition-all"
                  style={{ width: `${dist.negativePercent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function EmotionsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <EmotionTrendCard />
        <WeeklyPatternCard />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <EmotionDistributionCard />
        <OptimalTimesCard />
      </div>
    </div>
  )
}
