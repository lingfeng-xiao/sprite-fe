import { apiClient } from './client'
import type { McpServerInfo, McpToolInfo, McpServerStatus, McpClientStatus, McpToolsResponse } from '@/types/api'

export interface McpServerStartRequest {
  transport?: 'http' | 'stdio'
  port?: number
}

export interface McpServerStartResponse {
  success?: boolean
  transport?: string
  port?: number
  error?: string
}

export interface McpConnectRequest {
  name: string
  url: string
}

export interface McpConnectResponse {
  success?: boolean
  connecting?: boolean
  name: string
  error?: string
}

export const getServerStatus = () =>
  apiClient.get<McpServerStatus>('/api/mcp/server/status').then((r) => r.data)

export const startServer = (transport: 'http' | 'stdio' = 'http', port: number = 8081) =>
  apiClient.post<McpServerStartResponse>('/api/mcp/server/start', null, {
    params: { transport, port }
  }).then((r) => r.data)

export const stopServer = () =>
  apiClient.post<{ success: boolean; error?: string }>('/api/mcp/server/stop').then((r) => r.data)

export const getClientStatus = () =>
  apiClient.get<McpClientStatus>('/api/mcp/client/status').then((r) => r.data)

export const getClientServers = () =>
  apiClient.get<{ servers: McpServerInfo[]; count: number }>('/api/mcp/client/servers').then((r) => r.data)

export const getClientTools = () =>
  apiClient.get<McpToolsResponse>('/api/mcp/client/tools').then((r) => r.data)

export const getServerTools = (serverName: string) =>
  apiClient.get<{ server: string; tools: McpToolInfo[]; count: number }>(
    `/api/mcp/client/tools/${serverName}`
  ).then((r) => r.data)

export const connectToServer = (name: string, url: string) =>
  apiClient.post<McpConnectResponse>('/api/mcp/client/connect', null, {
    params: { name, url }
  }).then((r) => r.data)

export const disconnectFromServer = (name: string) =>
  apiClient.post<{ success: boolean; name: string; error?: string }>(
    '/api/mcp/client/disconnect',
    null,
    { params: { name } }
  ).then((r) => r.data)

export const getMcpHealth = () =>
  apiClient.get<{ status: string; serverRunning: boolean; clientInitialized: boolean }>(
    '/api/mcp/health'
  ).then((r) => r.data)
