import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { useEvolutionProposals } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Brain,
  Lightbulb,
  Target,
  BookOpen,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react'
import { format } from 'date-fns'

// Status configuration
const STATUS_CONFIG = {
  DRAFT: { label: '草稿', variant: 'secondary' as const, icon: FileText },
  AUTO_CHECK: { label: '自动检查', variant: 'outline' as const, icon: Clock },
  HUMAN_REVIEW: { label: '人工审核', variant: 'warning' as const, icon: Clock },
  APPROVED: { label: '已批准', variant: 'success' as const, icon: CheckCircle },
  REJECTED: { label: '已拒绝', variant: 'destructive' as const, icon: XCircle },
  RELEASED: { label: '已发布', variant: 'default' as const, icon: CheckCircle },
}

type ProposalStatus = keyof typeof STATUS_CONFIG

// Type icons
const TYPE_ICONS = {
  PRINCIPLE: Brain,
  BEHAVIOR: Target,
  CAPABILITY: Lightbulb,
  KNOWLEDGE: BookOpen,
}

// Mock evaluation result (in real app, this comes from API)
interface EvaluationResult {
  score: number
  impact: 'HIGH' | 'MEDIUM' | 'LOW'
  risks: string[]
  benefits: string[]
  confidence: number
  autoCheckPassed: boolean
  humanReviewRequired: boolean
}

const mockEvaluation: EvaluationResult = {
  score: 85,
  impact: 'HIGH',
  risks: [
    '可能影响现有行为模式',
    '需要较长的适应期',
  ],
  benefits: [
    '提升用户体验',
    '增强系统稳定性',
    '改善响应时间',
  ],
  confidence: 0.87,
  autoCheckPassed: true,
  humanReviewRequired: true,
}

function ProposalStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as ProposalStatus] || STATUS_CONFIG.DRAFT
  const Icon = config.icon
  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

function ProposalDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-64" />
      <Skeleton className="h-48" />
    </div>
  )
}

export default function EvolutionProposalPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: proposals, isLoading: proposalsLoading } = useEvolutionProposals()

  // Find the specific proposal from the list
  const proposal = proposals?.find((p) => p.id === id)

  // Fetch full proposal details (in real app, this would be a separate endpoint)
  const { data: fullProposal, isLoading: detailLoading } = useQuery({
    queryKey: ['evolution', 'proposal', id],
    queryFn: async () => {
      // In real app: const response = await apiClient.get<EvolutionProposal>(`/api/evolution/proposals/${id}`)
      // For now, return mock data
      return proposal || {
        id,
        type: 'BEHAVIOR' as const,
        title: '优化对话理解能力',
        description: '通过引入新的上下文理解机制，提升对话系统的理解准确率。',
        rationale: '当前对话系统在复杂语境下的理解准确率有待提升，需要引入更先进的上下文建模技术。',
        expectedImpact: '预期将对话理解准确率提升15-20%，减少误识别率。',
        status: 'HUMAN_REVIEW' as const,
        createdAt: new Date().toISOString(),
        reviewedAt: null,
      }
    },
    enabled: !!id,
  })

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (proposalId: string) => {
      const response = await apiClient.post(`/api/evolution/proposals/${proposalId}/approve`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evolution', 'proposals'] })
      navigate('/evolution')
    },
  })

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async (proposalId: string) => {
      const response = await apiClient.post(`/api/evolution/proposals/${proposalId}/reject`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evolution', 'proposals'] })
      navigate('/evolution')
    },
  })

  const handleApprove = () => {
    if (id) {
      approveMutation.mutate(id)
    }
  }

  const handleReject = () => {
    if (id) {
      rejectMutation.mutate(id)
    }
  }

  const isLoading = proposalsLoading || detailLoading
  const evaluation = mockEvaluation // In real app, this comes from fullProposal.evaluation

  if (isLoading) {
    return <ProposalDetailSkeleton />
  }

  if (!fullProposal) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/evolution')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回列表
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">提案不存在</h3>
            <p className="text-muted-foreground">无法找到指定的进化提案</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const TypeIconComponent = TYPE_ICONS[fullProposal.type] || FileText

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/evolution')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        返回列表
      </Button>

      {/* Proposal Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{fullProposal.type}</Badge>
                <ProposalStatusBadge status={fullProposal.status} />
              </div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TypeIconComponent className="h-6 w-6" />
                {fullProposal.title}
              </CardTitle>
              <CardDescription>
                创建于 {format(new Date(fullProposal.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                {fullProposal.reviewedAt && (
                  <> | 审核于 {format(new Date(fullProposal.reviewedAt), 'yyyy-MM-dd HH:mm:ss')}</>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Change Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              变更内容
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">描述</h4>
              <p>{fullProposal.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">变更原因</h4>
              <p>{fullProposal.rationale}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">预期影响</h4>
              <p>{fullProposal.expectedImpact}</p>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5" />
              评估结果
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Score */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>综合评分</span>
                <span className="font-medium">{evaluation.score}/100</span>
              </div>
              <Progress value={evaluation.score} />
            </div>

            {/* Impact */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">影响等级</span>
              <Badge
                variant={
                  evaluation.impact === 'HIGH'
                    ? 'destructive'
                    : evaluation.impact === 'MEDIUM'
                      ? 'warning'
                      : 'secondary'
                }
              >
                {evaluation.impact === 'HIGH'
                  ? '高'
                  : evaluation.impact === 'MEDIUM'
                    ? '中'
                    : '低'}
              </Badge>
            </div>

            {/* Confidence */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>置信度</span>
                <span className="font-medium">{(evaluation.confidence * 100).toFixed(0)}%</span>
              </div>
              <Progress value={evaluation.confidence * 100} />
            </div>

            {/* Auto Check Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">自动检查</span>
              <div className="flex items-center gap-1">
                {evaluation.autoCheckPassed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">{evaluation.autoCheckPassed ? '通过' : '未通过'}</span>
              </div>
            </div>

            {/* Human Review Required */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">需要人工审核</span>
              <span className="text-sm">{evaluation.humanReviewRequired ? '是' : '否'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits and Risks */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              预期收益
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Risks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              潜在风险
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-2">
                  <X className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons - only show for HUMAN_REVIEW status */}
      {fullProposal.status === 'HUMAN_REVIEW' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="destructive"
                size="lg"
                onClick={handleReject}
                disabled={rejectMutation.isPending}
              >
                <XCircle className="h-5 w-5 mr-2" />
                {rejectMutation.isPending ? '处理中...' : '拒绝'}
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handleApprove}
                disabled={approveMutation.isPending}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {approveMutation.isPending ? '处理中...' : '批准'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
