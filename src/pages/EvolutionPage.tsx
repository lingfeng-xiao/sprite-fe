import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEvolutionProposals } from '@/hooks/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { EvolutionProposal } from '@/stores/evolutionStore'
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  RefreshCw,
  ChevronRight,
  RotateCcw,
  GraduationCap,
} from 'lucide-react'
import { format } from 'date-fns'

// Status configuration for proposal list
const STATUS_CONFIG = {
  DRAFT: { label: '草稿', variant: 'secondary' as const, icon: FileText },
  AUTO_CHECK: { label: '自动检查', variant: 'outline' as const, icon: Clock },
  HUMAN_REVIEW: { label: '人工审核', variant: 'warning' as const, icon: GraduationCap },
  APPROVED: { label: '已批准', variant: 'success' as const, icon: CheckCircle },
  REJECTED: { label: '已拒绝', variant: 'destructive' as const, icon: XCircle },
  RELEASED: { label: '已发布', variant: 'default' as const, icon: CheckCircle },
}

type ProposalStatus = keyof typeof STATUS_CONFIG

// Mock release data (in real app, this would come from API)
interface Release {
  id: string
  version: string
  releasedAt: string
  status: 'ACTIVE' | 'ROLLED_BACK' | 'GRAYSCALE'
  grayscaleProgress: number
  proposalId: string
  rollbackFrom?: string
}

const mockReleases: Release[] = [
  {
    id: 'rel-1',
    version: 'v2.1.0',
    releasedAt: '2026-03-20T10:00:00Z',
    status: 'GRAYSCALE',
    grayscaleProgress: 35,
    proposalId: 'prop-1',
  },
  {
    id: 'rel-2',
    version: 'v2.0.0',
    releasedAt: '2026-03-15T08:00:00Z',
    status: 'ACTIVE',
    grayscaleProgress: 100,
    proposalId: 'prop-2',
  },
  {
    id: 'rel-3',
    version: 'v1.9.0',
    releasedAt: '2026-03-10T14:00:00Z',
    status: 'ROLLED_BACK',
    grayscaleProgress: 0,
    proposalId: 'prop-3',
    rollbackFrom: 'v2.0.0',
  },
]

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

function ProposalCard({ proposal }: { proposal: EvolutionProposal }) {
  return (
    <Link to={`/evolution/${proposal.id}`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {proposal.type}
                </Badge>
                <ProposalStatusBadge status={proposal.status} />
              </div>
              <h4 className="font-medium">{proposal.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {proposal.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(proposal.createdAt), 'yyyy-MM-dd HH:mm')}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function ReleaseCard({ release }: { release: Release }) {
  const handleRollback = () => {
    // In real app, this would call POST /api/evolution/releases/{id}/rollback
    console.log('Rollback release:', release.id)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{release.version}</span>
              <Badge
                variant={
                  release.status === 'ACTIVE'
                    ? 'success'
                    : release.status === 'GRAYSCALE'
                      ? 'warning'
                      : 'secondary'
                }
              >
                {release.status === 'ACTIVE'
                  ? '活跃'
                  : release.status === 'GRAYSCALE'
                    ? '灰度中'
                    : '已回滚'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              发布于 {format(new Date(release.releasedAt), 'yyyy-MM-dd HH:mm')}
            </p>
            {release.rollbackFrom && (
              <p className="text-xs text-muted-foreground">
                从 {release.rollbackFrom} 回滚
              </p>
            )}
          </div>
          {release.status !== 'ROLLED_BACK' && (
            <Button variant="outline" size="sm" onClick={handleRollback}>
              <RotateCcw className="h-4 w-4 mr-1" />
              回滚
            </Button>
          )}
        </div>
        {release.status === 'GRAYSCALE' && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>灰度进度</span>
              <span>{release.grayscaleProgress}%</span>
            </div>
            <Progress value={release.grayscaleProgress} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ProposalList() {
  const { data: proposals, isLoading } = useEvolutionProposals()

  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'ALL'>('ALL')

  const statusOptions: Array<{ value: ProposalStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: '全部' },
    { value: 'DRAFT', label: '草稿' },
    { value: 'AUTO_CHECK', label: '自动检查' },
    { value: 'HUMAN_REVIEW', label: '人工审核' },
    { value: 'APPROVED', label: '已批准' },
    { value: 'REJECTED', label: '已拒绝' },
    { value: 'RELEASED', label: '已发布' },
  ]

  const filteredProposals =
    statusFilter === 'ALL'
      ? proposals
      : proposals?.filter((p) => {
          // Map API status to filter status
          const statusMap: Record<string, ProposalStatus> = {
            PENDING: 'HUMAN_REVIEW',
            APPROVED: 'APPROVED',
            REJECTED: 'REJECTED',
            IMPLEMENTED: 'RELEASED',
          }
          return statusMap[p.status] === statusFilter
        })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={statusFilter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Proposal List */}
      <div className="space-y-3">
        {filteredProposals && filteredProposals.length > 0 ? (
          filteredProposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              暂无提案
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function ReleaseList() {
  return (
    <div className="space-y-3">
      {mockReleases.map((release) => (
        <ReleaseCard key={release.id} release={release} />
      ))}
    </div>
  )
}

export default function EvolutionPage() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'releases'>('proposals')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">进化审批</h1>
          <p className="text-muted-foreground">管理和审批进化提案</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          刷新
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('proposals')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'proposals'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          提案列表
        </button>
        <button
          onClick={() => setActiveTab('releases')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'releases'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          发布管理
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'proposals' ? <ProposalList /> : <ReleaseList />}
    </div>
  )
}
