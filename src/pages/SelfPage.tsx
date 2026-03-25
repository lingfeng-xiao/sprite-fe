import { useIdentityStore } from '@/stores/identityStore'
import { useSelfStore } from '@/stores/selfStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sparkles,
  Shield,
  AlertTriangle,
  Brain,
  Heart,
  Zap,
} from 'lucide-react'

function IdentitySection() {
  const { profile, anchor, constraints, getIdentityStatement } = useIdentityStore()

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            身份声明
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          身份声明
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Identity Core */}
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
            {profile.emoji}
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-bold">{profile.displayName}</h3>
            <p className="text-sm italic text-muted-foreground">{profile.vibe}</p>
            <p className="text-sm">{profile.essence}</p>
          </div>
        </div>

        {/* Identity Statement */}
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm font-medium">身份宣言</p>
          <p className="mt-1 text-sm">{getIdentityStatement()}</p>
        </div>

        {/* Continuity Chain */}
        {anchor && (
          <div className="space-y-2">
            <p className="text-sm font-medium">连续性链条</p>
            <div className="flex flex-wrap gap-1">
              {anchor.continuityChain.map((segment, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {segment}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              创建于: {new Date(anchor.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Constraints */}
        {constraints.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">身份约束</p>
            <div className="space-y-2">
              {constraints.map((c) => (
                <div
                  key={c.id}
                  className={`flex items-center justify-between rounded-lg p-2 ${
                    c.isHardLimit ? 'bg-destructive/10' : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {c.isHardLimit ? (
                      <Shield className="h-4 w-4 text-destructive" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">{c.description}</span>
                  </div>
                  <Badge variant={c.type === 'IMMUTABLE' ? 'destructive' : 'secondary'}>
                    {c.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SelfStateSection() {
  const { selfState, getEnergyPercent, getCoherencePercent } = useSelfStore()

  if (!selfState) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            自我状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          自我状态
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Energy & Coherence */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm">
                <Zap className="h-4 w-4" />
                能量
              </span>
              <span className="font-medium">{getEnergyPercent()}%</span>
            </div>
            <Progress
              value={getEnergyPercent()}
              className="h-3"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm">
                <Heart className="h-4 w-4" />
                一致性
              </span>
              <span className="font-medium">{getCoherencePercent()}%</span>
            </div>
            <Progress
              value={getCoherencePercent()}
              className="h-3"
            />
          </div>
        </div>

        {/* Emotional Baseline */}
        <div className="space-y-2">
          <p className="text-sm font-medium">情绪基准</p>
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full"
              style={{
                backgroundColor: `hsl(${(selfState.emotionalBaseline * 120).toFixed(0)}, 70%, 50%)`,
              }}
            />
            <span className="text-sm">
              {selfState.emotionalBaseline > 0.6
                ? '积极'
                : selfState.emotionalBaseline > 0.4
                  ? '中性'
                  : '消极'}
              ({selfState.emotionalBaseline.toFixed(2)})
            </span>
          </div>
        </div>

        {/* Attention Foci */}
        {selfState.attentionFoci.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">注意力焦点</p>
            <div className="flex flex-wrap gap-1">
              {selfState.attentionFoci.map((focus, i) => (
                <Badge key={i} variant="secondary">
                  {focus}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <p className="text-xs text-muted-foreground">
          最后更新: {new Date(selfState.lastUpdated).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  )
}

function BoundarySection() {
  const { boundaries } = useSelfStore()

  if (!boundaries) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            边界配置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          边界配置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {boundaries.rules.map((rule) => (
          <div
            key={rule.id}
            className={`flex items-center justify-between rounded-lg p-3 ${
              rule.isHardLimit ? 'bg-destructive/10' : 'bg-muted'
            }`}
          >
            <div className="flex items-center gap-2">
              {rule.isHardLimit ? (
                <Shield className="h-4 w-4 text-destructive" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">{rule.description}</p>
                <p className="text-xs text-muted-foreground">{rule.type}</p>
              </div>
            </div>
            <Badge variant={rule.isHardLimit ? 'destructive' : 'secondary'}>
              {rule.isHardLimit ? '硬限制' : '软限制'}
            </Badge>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          最后更新: {new Date(boundaries.lastUpdated).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  )
}

function AssessmentSection() {
  const { assessment } = useSelfStore()

  if (!assessment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            自我评估
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          自我评估
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Strengths */}
        {assessment.strengths.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">优势</p>
            <div className="flex flex-wrap gap-1">
              {assessment.strengths.map((s, i) => (
                <Badge key={i} variant="default" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Blind Spots */}
        {assessment.blindSpots.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">盲点</p>
            <div className="flex flex-wrap gap-1">
              {assessment.blindSpots.map((b, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {b}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Learning Style */}
        <div className="space-y-2">
          <p className="text-sm font-medium">学习风格</p>
          <Badge>{assessment.learningStyle}</Badge>
        </div>

        {/* Decision Patterns */}
        {assessment.decisionPatterns.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">决策模式</p>
            <div className="flex flex-wrap gap-1">
              {assessment.decisionPatterns.map((p, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function SelfPage() {
  const { profile } = useIdentityStore()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {profile?.emoji || '🧠'} 自我
        </h1>
        <p className="text-muted-foreground">
          探索 Sprite 的自我认知、身份叙事与行为边界
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <IdentitySection />
        <SelfStateSection />
        <BoundarySection />
        <AssessmentSection />
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        自我页面 - 展示 Sprite 的自我认知与边界配置
      </p>
    </div>
  )
}
