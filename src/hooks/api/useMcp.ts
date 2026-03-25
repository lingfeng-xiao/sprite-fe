import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS, REFRESH_INTERVALS } from '@/lib/constants'
import * as mcpApi from '@/api/mcpApi'

export function useMcpServerStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.mcpServerStatus,
    queryFn: mcpApi.getServerStatus,
    refetchInterval: REFRESH_INTERVALS.mcpServerStatus,
    staleTime: 5000,
  })
}

export function useMcpClientStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.mcpClientStatus,
    queryFn: mcpApi.getClientStatus,
    refetchInterval: REFRESH_INTERVALS.mcpClientStatus,
    staleTime: 5000,
  })
}

export function useMcpClientTools() {
  return useQuery({
    queryKey: QUERY_KEYS.mcpClientTools,
    queryFn: mcpApi.getClientTools,
    refetchInterval: REFRESH_INTERVALS.mcpClientTools,
    staleTime: 10000,
  })
}

export function useMcpServerTools(serverName: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.mcpClientTools, serverName],
    queryFn: () => mcpApi.getServerTools(serverName),
    enabled: !!serverName,
  })
}

export function useStartMcpServer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ transport, port }: { transport?: 'http' | 'stdio'; port?: number } = {}) =>
      mcpApi.startServer(transport, port),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mcpServerStatus })
    },
  })
}

export function useStopMcpServer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => mcpApi.stopServer(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mcpServerStatus })
    },
  })
}

export function useConnectMcpServer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, url }: { name: string; url: string }) =>
      mcpApi.connectToServer(name, url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mcpClientStatus })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mcpClientTools })
    },
  })
}

export function useDisconnectMcpServer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => mcpApi.disconnectFromServer(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mcpClientStatus })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mcpClientTools })
    },
  })
}

export function useMcpActions() {
  const startServer = useStartMcpServer()
  const stopServer = useStopMcpServer()
  const connectServer = useConnectMcpServer()
  const disconnectServer = useDisconnectMcpServer()

  return {
    startServer: (transport?: 'http' | 'stdio', port?: number) =>
      startServer.mutateAsync({ transport, port }),
    stopServer: () => stopServer.mutateAsync(),
    connectServer: (name: string, url: string) =>
      connectServer.mutateAsync({ name, url }),
    disconnectServer: (name: string) => disconnectServer.mutateAsync(name),
    isStarting: startServer.isPending,
    isStopping: stopServer.isPending,
    isConnecting: connectServer.isPending,
    isDisconnecting: disconnectServer.isPending,
  }
}
