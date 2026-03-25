import { create } from 'zustand'
import type { SkillInfo } from '@/types/api'

interface SkillState {
  selectedSkillId: string | null
  isExecuting: boolean
  lastExecutionResult: { success: boolean; message: string; data: unknown } | null
  executionError: string | null
  setSelectedSkill: (skillId: string | null) => void
  setExecuting: (isExecuting: boolean) => void
  setExecutionResult: (result: { success: boolean; message: string; data: unknown } | null) => void
  setExecutionError: (error: string | null) => void
  clearExecutionState: () => void
}

export const useSkillStore = create<SkillState>((set) => ({
  selectedSkillId: null,
  isExecuting: false,
  lastExecutionResult: null,
  executionError: null,

  setSelectedSkill: (skillId) => set({ selectedSkillId: skillId }),

  setExecuting: (isExecuting) => set({ isExecuting }),

  setExecutionResult: (result) => set({
    lastExecutionResult: result,
    executionError: null,
    isExecuting: false
  }),

  setExecutionError: (error) => set({
    executionError: error,
    isExecuting: false
  }),

  clearExecutionState: () => set({
    isExecuting: false,
    lastExecutionResult: null,
    executionError: null
  }),
}))

// Skill editor state for create/edit
interface SkillEditorState {
  isOpen: boolean
  mode: 'create' | 'edit'
  editingSkill: SkillInfo | null
  markdownContent: string
  openCreate: () => void
  openEdit: (skill: SkillInfo) => void
  close: () => void
  setMarkdownContent: (content: string) => void
}

export const useSkillEditorStore = create<SkillEditorState>((set) => ({
  isOpen: false,
  mode: 'create',
  editingSkill: null,
  markdownContent: '',

  openCreate: () => set({
    isOpen: true,
    mode: 'create',
    editingSkill: null,
    markdownContent: ''
  }),

  openEdit: (skill) => set({
    isOpen: true,
    mode: 'edit',
    editingSkill: skill,
    markdownContent: `# ${skill.name}\nid: ${skill.id}\ntriggers: ${skill.triggers.join(', ')}\n\n## Description\n${skill.description}\n\n## Parameters\n${skill.parameters.map(p => `- ${p.name} (${p.type}${p.required ? ', required' : ''}): ${p.description || ''}`).join('\n')}`
  }),

  close: () => set({
    isOpen: false,
    editingSkill: null,
    markdownContent: ''
  }),

  setMarkdownContent: (content) => set({ markdownContent: content }),
}))
