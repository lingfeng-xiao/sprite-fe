import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import ChatPage from '@/pages/ChatPage'
import LifePage from '@/pages/LifePage'
import MemoryPage from '@/pages/MemoryPage'
import SettingsPage from '@/pages/SettingsPage'

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LifePage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="memory" element={<MemoryPage />} />
        <Route path="settings" element={<SettingsPage />} />

        <Route path="console" element={<Navigate to="/chat" replace />} />
        <Route path="skills" element={<Navigate to="/settings" replace />} />
        <Route path="mcp" element={<Navigate to="/settings" replace />} />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="health" element={<Navigate to="/" replace />} />
        <Route path="devices" element={<Navigate to="/" replace />} />
        <Route path="agents" element={<Navigate to="/" replace />} />
        <Route path="runtime" element={<Navigate to="/" replace />} />
        <Route path="emotions" element={<Navigate to="/" replace />} />
        <Route path="team" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
