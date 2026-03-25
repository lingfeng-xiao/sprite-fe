import { useState } from 'react'
import { useMcpServerStatus, useMcpClientStatus, useMcpClientTools, useMcpActions } from '@/hooks/api/useMcp'
import { useMcpStore } from '@/stores/mcpStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Network, Server, Plug, Loader2, Power, PowerOff, Plus, Unplug } from 'lucide-react'
import type { McpServerInfo, McpToolInfo } from '@/types/api'

function ServerModeCard() {
  const { data: serverStatus, isLoading } = useMcpServerStatus()
  const { startServer, stopServer, isStarting, isStopping } = useMcpActions()
  const [port, setPort] = useState('8081')

  const handleStart = () => {
    startServer('http', parseInt(port) || 8081)
  }

  const handleStop = () => {
    stopServer()
  }

  if (isLoading) {
    return <Skeleton className="h-48" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Server className="h-5 w-5" />
          MCP Server Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge variant={serverStatus?.running ? 'success' : 'secondary'}>
            {serverStatus?.running ? 'Running' : 'Stopped'}
          </Badge>
        </div>

        {serverStatus?.running && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Port</span>
              <span className="text-sm">{serverStatus.port || 8081}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tools</span>
              <span className="text-sm">{serverStatus.toolCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sessions</span>
              <span className="text-sm">{serverStatus.sessionCount || 0}</span>
            </div>
          </>
        )}

        {!serverStatus?.running && (
          <div className="flex gap-2">
            <Input
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="Port"
              className="w-24"
            />
            <Button onClick={handleStart} disabled={isStarting}>
              {isStarting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Power className="h-4 w-4 mr-2" />
              Start
            </Button>
          </div>
        )}

        {serverStatus?.running && (
          <Button onClick={handleStop} variant="destructive" disabled={isStopping}>
            {isStopping && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <PowerOff className="h-4 w-4 mr-2" />
            Stop
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function ClientModeCard() {
  const { data: clientStatus, isLoading: clientLoading } = useMcpClientStatus()
  const { data: toolsData } = useMcpClientTools()
  const { connectServer, disconnectServer, isConnecting, isDisconnecting } = useMcpActions()
  const { connectForm, setConnectFormName, setConnectFormUrl, clearConnectForm } = useMcpStore()

  const [showConnectDialog, setShowConnectDialog] = useState(false)

  const handleConnect = async () => {
    try {
      await connectServer(connectForm.name, connectForm.url)
      clearConnectForm()
      setShowConnectDialog(false)
    } catch (err) {
      // Error handled by hook
    }
  }

  const handleDisconnect = async (name: string) => {
    if (window.confirm(`Disconnect from ${name}?`)) {
      await disconnectServer(name)
    }
  }

  const servers = clientStatus?.servers || []
  const tools = toolsData?.tools || []

  if (clientLoading) {
    return <Skeleton className="h-48" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Plug className="h-5 w-5" />
          MCP Client Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Connected Servers</span>
          <Badge variant={servers.length > 0 ? 'success' : 'secondary'}>
            {servers.length}
          </Badge>
        </div>

        <Button onClick={() => setShowConnectDialog(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Connect to Server
        </Button>

        {servers.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Servers</label>
            {servers.map((server: McpServerInfo) => (
              <div key={server.name} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="text-sm font-medium">{server.name}</p>
                  <p className="text-xs text-muted-foreground">{server.uri}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={server.connected ? 'success' : 'secondary'} className="text-xs">
                    {server.connected ? 'Connected' : 'Disconnected'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDisconnect(server.name)}
                    disabled={isDisconnecting}
                  >
                    <Unplug className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tools.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Available Tools ({tools.length})</label>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {tools.map((tool: McpToolInfo) => (
                <div key={tool.name} className="text-xs p-2 border rounded">
                  <p className="font-medium">{tool.name}</p>
                  <p className="text-muted-foreground line-clamp-1">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to MCP Server</DialogTitle>
            <DialogDescription>
              Enter the server details to connect
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Server Name</label>
              <Input
                value={connectForm.name}
                onChange={(e) => setConnectFormName(e.target.value)}
                placeholder="e.g., my-mcp-server"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Server URL</label>
              <Input
                value={connectForm.url}
                onChange={(e) => setConnectFormUrl(e.target.value)}
                placeholder="e.g., http://localhost:8081"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={isConnecting || !connectForm.name || !connectForm.url}
            >
              {isConnecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function ToolsCard() {
  const { data: toolsData, isLoading } = useMcpClientTools()

  if (isLoading) {
    return <Skeleton className="h-48" />
  }

  const tools = toolsData?.tools || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Network className="h-5 w-5" />
          Available Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tools.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No tools available. Connect to an MCP server to see tools.
          </p>
        ) : (
          <div className="space-y-2">
            {tools.map((tool: McpToolInfo) => (
              <div key={tool.name} className="p-3 border rounded hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{tool.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                  </div>
                </div>
                {tool.inputSchema && Object.keys(tool.inputSchema).length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Parameters: {Object.keys(tool.inputSchema).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function McpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Network className="h-7 w-7" />
          MCP Configuration
        </h1>
        <p className="text-muted-foreground">
          Configure MCP server and client connections
        </p>
      </div>

      <Tabs defaultValue="server" className="space-y-4">
        <TabsList>
          <TabsTrigger value="server">Server Mode</TabsTrigger>
          <TabsTrigger value="client">Client Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="server" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ServerModeCard />
          </div>
        </TabsContent>

        <TabsContent value="client" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ClientModeCard />
            <ToolsCard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
