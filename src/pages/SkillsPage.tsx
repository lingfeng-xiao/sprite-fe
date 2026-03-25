import { useState } from 'react'
import { useSkills, useSkillActions } from '@/hooks/api/useSkills'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Sparkles, Plus, Play, Trash2, Loader2, Zap, FileText } from 'lucide-react'
import type { SkillInfo, SkillParameter } from '@/types/api'

function SkillCard({ skill, onExecute, onDelete }: {
  skill: SkillInfo
  onExecute: (skill: SkillInfo) => void
  onDelete: (skillId: string) => void
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{skill.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              v{skill.version}
            </Badge>
            {skill.async && <Badge variant="secondary" className="text-xs">Async</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {skill.description}
        </p>

        {skill.triggers.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skill.triggers.slice(0, 3).map((trigger) => (
              <Badge key={trigger} variant="secondary" className="text-xs">
                {trigger}
              </Badge>
            ))}
            {skill.triggers.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{skill.triggers.length - 3}
              </Badge>
            )}
          </div>
        )}

        {skill.parameters.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {skill.parameters.length} parameter{skill.parameters.length !== 1 ? 's' : ''}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onExecute(skill)}
          >
            <Play className="h-4 w-4 mr-1" />
            Execute
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(skill.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AddSkillDialog({ open, onOpenChange }: {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [skillId, setSkillId] = useState('')
  const [markdown, setMarkdown] = useState('')
  const { create, isCreating, createError } = useSkillActions()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!skillId.trim() || !markdown.trim()) return

    try {
      await create(skillId.trim(), markdown)
      setSkillId('')
      setMarkdown('')
      onOpenChange(false)
    } catch (err) {
      // Error handled by hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Skill
          </DialogTitle>
          <DialogDescription>
            Create a new skill from markdown definition
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Skill ID</label>
            <Input
              value={skillId}
              onChange={(e) => setSkillId(e.target.value)}
              placeholder="e.g., my-custom-skill-v1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Markdown Definition</label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder={`# My Custom Skill
id: my-custom-skill-v1
triggers: ["do something", "custom action"]
description: Does something useful

## Parameters
- name: param1, type: string, required: true
  description: The parameter description

## Actions
1. First action
2. Second action`}
              className="w-full h-64 p-3 text-sm font-mono rounded-md border border-input bg-background"
              required
            />
          </div>

          {createError && (
            <p className="text-sm text-destructive">{String(createError)}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !skillId.trim() || !markdown.trim()}>
              {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Skill
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ExecuteSkillDialog({ skill, open, onOpenChange }: {
  skill: SkillInfo | null
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [parameters, setParameters] = useState<Record<string, string>>({})
  const [result, setResult] = useState<{ success: boolean; message: string; data: unknown } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { execute, isExecuting } = useSkillActions()

  const handleExecute = async () => {
    if (!skill) return
    setError(null)
    setResult(null)

    try {
      const params: Record<string, unknown> = {}
      skill.parameters.forEach((p) => {
        if (parameters[p.name]) {
          params[p.name] = parameters[p.name]
        }
      })

      const execResult = await execute(skill.id, params)
      setResult(execResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  if (!skill) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Execute Skill: {skill.name}
          </DialogTitle>
          <DialogDescription>
            {skill.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {skill.parameters.length > 0 ? (
            <div className="space-y-3">
              <label className="text-sm font-medium">Parameters</label>
              {skill.parameters.map((param: SkillParameter) => (
                <div key={param.name}>
                  <label className="text-xs text-muted-foreground block mb-1">
                    {param.name} {param.required && <span className="text-destructive">*</span>}
                  </label>
                  <Input
                    value={parameters[param.name] || ''}
                    onChange={(e) => setParameters({ ...parameters, [param.name]: e.target.value })}
                    placeholder={param.description || param.type}
                    required={param.required}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">This skill has no parameters</p>
          )}

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>
          )}

          {result && (
            <div className={`text-sm p-3 rounded ${result.success ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
              <p className="font-medium">{result.success ? 'Success' : 'Failed'}</p>
              <p className="text-muted-foreground">{result.message}</p>
              {result.data !== null && result.data !== undefined ? (
                <pre className="mt-2 text-xs overflow-x-auto bg-muted p-2 rounded">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              ) : null}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleExecute} disabled={isExecuting}>
            {isExecuting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Execute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function SkillsPage() {
  const { data: skillsResponse, isLoading } = useSkills()
  const { remove } = useSkillActions()

  const [executeSkill, setExecuteSkill] = useState<SkillInfo | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  const handleDelete = async (skillId: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await remove(skillId)
      } catch (err) {
        // Error handled by hook
      }
    }
  }

  const skills = skillsResponse?.skills || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-7 w-7" />
            Skills
          </h1>
          <p className="text-muted-foreground">
            Manage and execute skills for the sprite
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No skills registered</p>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onExecute={setExecuteSkill}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddSkillDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <ExecuteSkillDialog
        skill={executeSkill}
        open={executeSkill !== null}
        onOpenChange={(open) => !open && setExecuteSkill(null)}
      />
    </div>
  )
}
