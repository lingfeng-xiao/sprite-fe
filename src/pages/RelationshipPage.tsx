import { useRelationshipStore } from '@/stores/relationshipStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Heart,
  Shield,
  Users,
  Star,
  AlertCircle,
} from 'lucide-react'

function TrustSection() {
  const { trustState, isTrustAtLeast } = useRelationshipStore()

  if (!trustState) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            信任状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    )
  }

  const trustColor =
    trustState.level === 'FULL'
      ? 'text-green-500'
      : trustState.level === 'HIGH'
        ? 'text-blue-500'
        : trustState.level === 'MEDIUM'
          ? 'text-yellow-500'
          : 'text-red-500'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          信任状态
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trust Level */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">信任等级</p>
            <Badge className={`mt-1 ${trustColor}`} variant="outline">
              {trustState.level}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{Math.round(trustState.score * 100)}%</p>
            <p className="text-xs text-muted-foreground">信任分数</p>
          </div>
        </div>

        {/* Trust Score Bar */}
        <div className="space-y-2">
          <Progress value={trustState.score * 100} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>低</span>
            <span>中</span>
            <span>高</span>
            <span>完全</span>
          </div>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{trustState.verificationCount}</p>
            <p className="text-xs text-muted-foreground">验证次数</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{trustState.betrayalCount}</p>
            <p className="text-xs text-muted-foreground">破裂次数</p>
          </div>
        </div>

        {/* Trust Milestones */}
        <div className="space-y-2">
          <p className="text-sm font-medium">信任里程碑</p>
          <div className="flex items-center gap-2 text-sm">
            {isTrustAtLeast('LOW') && (
              <Badge variant="outline" className="text-xs">
                初步接触
              </Badge>
            )}
            {isTrustAtLeast('MEDIUM') && (
              <Badge variant="outline" className="text-xs">
                建立基础
              </Badge>
            )}
            {isTrustAtLeast('HIGH') && (
              <Badge variant="outline" className="text-xs">
                深度信任
              </Badge>
            )}
            {isTrustAtLeast('FULL') && (
              <Badge variant="default" className="text-xs">
                完全信任
              </Badge>
            )}
          </div>
        </div>

        {/* Last Verified */}
        <p className="text-xs text-muted-foreground">
          最后验证: {new Date(trustState.lastVerifiedAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  )
}

function RelationshipProfileSection() {
  const { profile } = useRelationshipStore()

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            关系配置
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
          <Heart className="h-5 w-5 text-primary" />
          关系配置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Relationship Type */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">关系类型</p>
            <Badge className="mt-1">{profile.type}</Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">关系 ID</p>
            <p className="font-mono text-sm">{profile.relationshipId}</p>
          </div>
        </div>

        {/* Relationship Strength */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">关系强度</span>
            <span className="font-medium">{(profile.strength * 100).toFixed(0)}%</span>
          </div>
          <Progress value={profile.strength * 100} className="h-3" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">描述</p>
          <p className="text-sm">{profile.description}</p>
        </div>

        {/* Interaction Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{profile.interactionCount}</p>
            <p className="text-xs text-muted-foreground">总交互次数</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              {profile.lastInteractionAt
                ? new Date(profile.lastInteractionAt).toLocaleDateString()
                : '无'}
            </p>
            <p className="text-xs text-muted-foreground">最后交互</p>
          </div>
        </div>

        {/* Established */}
        <p className="text-xs text-muted-foreground">
          关系建立于: {new Date(profile.establishedAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}

function SharedProjectsSection() {
  const { getActiveProjects } = useRelationshipStore()
  const activeProjects = getActiveProjects()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          共同项目
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">暂无共同项目</p>
          </div>
        ) : (
          activeProjects.map((project) => (
            <div
              key={project.projectId}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex-1">
                <p className="font-medium">{project.name}</p>
                <p className="text-xs text-muted-foreground">{project.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {project.status}
                  </Badge>
                  <Progress value={project.engagement * 100} className="h-1.5 w-20" />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function CarePrioritiesSection() {
  const { carePriorities, getTopCarePriority } = useRelationshipStore()
  const topPriority = getTopCarePriority()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          关怀优先级
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topPriority && (
          <div className="rounded-lg bg-primary/10 p-3">
            <p className="text-sm font-medium">最高优先级</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge
                variant={topPriority.level === 'CRITICAL' ? 'destructive' : 'secondary'}
              >
                {topPriority.level}
              </Badge>
              <span className="text-sm">{topPriority.careType}</span>
            </div>
          </div>
        )}

        {carePriorities.map((priority) => (
          <div
            key={priority.careType}
            className={`flex items-center justify-between rounded-lg p-3 ${
              !priority.enabled ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              {priority.level === 'CRITICAL' ? (
                <AlertCircle className="h-4 w-4 text-destructive" />
              ) : (
                <Star className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">{priority.careType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {priority.level}
              </Badge>
              {!priority.enabled && (
                <Badge variant="secondary" className="text-xs">
                  已禁用
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function RelationshipPage() {
  const { profile } = useRelationshipStore()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {profile?.type === 'FAMILY' ? '👨‍👩‍👧' : profile?.type === 'FRIEND' ? '🤝' : '💝'} 关系
        </h1>
        <p className="text-muted-foreground">
          探索 Sprite 与主人之间的信任、关怀与共同成长
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <TrustSection />
        <RelationshipProfileSection />
        <SharedProjectsSection />
        <CarePrioritiesSection />
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        关系页面 - 展示 Sprite 与主人的关系状态与互动历史
      </p>
    </div>
  )
}
