import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { useSpriteState } from '@/hooks/useSpriteData'
import { useEffect } from 'react'

// Pages
import ChatPage from '@/pages/ChatPage'
import SettingsPage from '@/pages/SettingsPage'
import { useSpriteStore } from '@/stores/spriteStore'

// Life Surface Pages
import LifePage from '@/pages/LifePage'
import SelfPage from '@/pages/SelfPage'
import RelationshipPage from '@/pages/RelationshipPage'
import GoalsPage from '@/pages/GoalsPage'
import MemoryPage from '@/pages/MemoryPage'

// Evolution Pages
import EvolutionPage from '@/pages/EvolutionPage'
import EvolutionProposalPage from '@/pages/EvolutionProposalPage'

// Runtime Surface Pages - Cycles
import CyclesPage from '@/pages/CyclesPage'
import CycleDetailPage from '@/pages/CycleDetailPage'

// Dashboard Page
import DashboardPage from '@/pages/DashboardPage'

// Configuration Pages
import SkillsPage from '@/pages/SkillsPage'
import McpPage from '@/pages/McpPage'

function AppContent() {
  const { data } = useSpriteState()
  const { setSpriteState: setStoreState } = useSpriteStore()

  useEffect(() => {
    if (data) {
      setStoreState(data)
    }
  }, [data, setStoreState])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Default page - Dashboard */}
        <Route index element={<DashboardPage />} />

        {/* Life Surface */}
        <Route path="life" element={<LifePage />} />
        <Route path="self" element={<SelfPage />} />
        <Route path="relationship" element={<RelationshipPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="memory" element={<MemoryPage />} />

        {/* Command Surface */}
        <Route path="console" element={<ChatPage />} />
        <Route path="chat" element={<ChatPage />} />

        {/* System Surface - Configuration */}
        <Route path="skills" element={<SkillsPage />} />
        <Route path="mcp" element={<McpPage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Cycles Surface */}
        <Route path="cycles" element={<CyclesPage />} />
        <Route path="cycles/:id" element={<CycleDetailPage />} />

        {/* Evolution Surface */}
        <Route path="evolution" element={<EvolutionPage />} />
        <Route path="evolution/:id" element={<EvolutionProposalPage />} />

        {/* Legacy Routes - Redirect deprecated pages to dashboard */}
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="health" element={<Navigate to="/" replace />} />
        <Route path="devices" element={<Navigate to="/" replace />} />
        <Route path="agents" element={<Navigate to="/" replace />} />
        <Route path="runtime" element={<Navigate to="/" replace />} />
        <Route path="emotions" element={<Navigate to="/" replace />} />
        <Route path="team" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return <AppContent />
}
