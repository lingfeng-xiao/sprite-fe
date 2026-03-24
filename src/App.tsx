import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { useSpriteState } from '@/hooks/useSpriteData'
import { useEffect } from 'react'

// Pages
import ChatPage from '@/pages/ChatPage'
import DashboardPage from '@/pages/DashboardPage'
import HealthPage from '@/pages/HealthPage'
import DevicesPage from '@/pages/DevicesPage'
import EmotionsPage from '@/pages/EmotionsPage'
import SettingsPage from '@/pages/SettingsPage'
import { useSpriteStore } from '@/stores/spriteStore'

function AppContent() {
  const { data, isLoading, setSpriteState } = useSpriteState()
  const { setSpriteState: setStoreState } = useSpriteStore()

  useEffect(() => {
    if (data) {
      setStoreState(data)
    }
  }, [data, setStoreState])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="emotions" element={<EmotionsPage />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="health" element={<HealthPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return <AppContent />
}
