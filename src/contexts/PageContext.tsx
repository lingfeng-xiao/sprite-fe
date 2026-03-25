import { createContext, useContext, useState, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface PageInfo {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
}

interface PageContextValue {
  pageInfo: PageInfo | null
  setPageInfo: (info: PageInfo | null) => void
}

const PageContext = createContext<PageContextValue | null>(null)

export function PageProvider({ children }: { children: ReactNode }) {
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
  return (
    <PageContext.Provider value={{ pageInfo, setPageInfo }}>
      {children}
    </PageContext.Provider>
  )
}

export function usePageInfo() {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePageInfo must be used within PageProvider')
  }
  return context
}

export function useSetPageInfo() {
  const { setPageInfo } = usePageInfo()
  return setPageInfo
}
