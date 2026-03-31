import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { PageProvider } from '@/contexts/PageContext'

export function MainLayout() {
  return (
    <PageProvider>
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_24%),linear-gradient(180deg,_hsl(var(--background))_0%,_hsl(var(--background))_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_24%,transparent_76%,rgba(255,255,255,0.03)_100%)]" />
        <div className="relative flex min-h-screen flex-col lg:flex-row">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </PageProvider>
  )
}
