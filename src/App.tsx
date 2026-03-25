import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { useSpriteState } from '@/hooks/useSpriteData'
import { useEffect } from 'react'

// Pages
import ChatPage from '@/pages/ChatPage'
import HealthPage from '@/pages/HealthPage'
import DevicesPage from '@/pages/DevicesPage'
import EmotionsPage from '@/pages/EmotionsPage'
import SettingsPage from '@/pages/SettingsPage'
import AgentsPage from '@/pages/AgentsPage'
import TeamPage from '@/pages/TeamPage'
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
        {/* Default redirect to Life */}
        <Route index element={<Navigate to="/life" replace />} />

        {/* Life Surface */}
        <Route path="life" element={<LifePage />} />
        <Route path="self" element={<SelfPage />} />
        <Route path="relationship" element={<RelationshipPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="memory" element={<MemoryPage />} />

        {/* Command Surface */}
        <Route path="console" element={<ChatPage />} />
        <Route path="chat" element={<ChatPage />} />

        {/* System Surface */}
        <Route path="devices" element={<DevicesPage />} />
        <Route path="runtime" element={<HealthPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Cycles Surface */}
        <Route path="cycles" element={<CyclesPage />} />
        <Route path="cycles/:id" element={<CycleDetailPage />} />

        {/* Evolution Surface */}
        <Route path="evolution" element={<EvolutionPage />} />
        <Route path="evolution/:id" element={<EvolutionProposalPage />} />

        {/* Legacy Routes - Redirect to new surfaces */}
        <Route path="dashboard" element={<Navigate to="/life" replace />} />
        <Route path="emotions" element={<Navigate to="/self" replace />} />
        <Route path="team" element={<Navigate to="/relationship" replace />} />
        <Route path="health" element={<Navigate to="/runtime" replace />} />

        {/* Keep old routes for backwards compatibility */}
        <Route path="health-legacy" element={<HealthPage />} />
        <Route path="team-legacy" element={<TeamPage />} />
        <Route path="emotions-legacy" element={<EmotionsPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return <AppContent />
}
