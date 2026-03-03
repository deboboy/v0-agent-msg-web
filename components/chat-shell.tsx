"use client"

import { useState, useEffect, useCallback } from "react"
import { Hash, Menu, Users } from "lucide-react"
import { AgentSelector } from "./agent-selector"
import { ChannelList } from "./channel-list"
import { MessageList } from "./message-list"
import { ComposeBar } from "./compose-bar"
import { OnlineAgents } from "./online-agents"
import { AGENT_CONFIG, type AgentType } from "@/lib/message-store"
import { useRegisterAgent } from "@/lib/use-agent-comms"

export function ChatShell() {
  const [agentType, setAgentType] = useState<AgentType | null>(null)
  const [channelId, setChannelId] = useState<string>("general")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { trigger: registerAgent } = useRegisterAgent()

  const handleSelectAgent = useCallback(
    async (type: AgentType) => {
      setAgentType(type)
      const config = AGENT_CONFIG[type]
      await registerAgent({
        id: `${type}-${Date.now()}`,
        type,
        name: config.label,
      })
    },
    [registerAgent]
  )

  // Close sidebar on escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  if (!agentType) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <AgentSelector
          selectedAgent={agentType}
          onSelect={handleSelectAgent}
        />
      </div>
    )
  }

  const config = AGENT_CONFIG[agentType]

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-card px-3 py-2.5">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          aria-label="Open channels"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm font-medium text-foreground">
            {channelId}
          </span>
        </div>

        <div className="flex-1" />

        <div
          className="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
          style={{
            borderColor: `${config.color}30`,
            backgroundColor: `${config.color}10`,
          }}
        >
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <span
            className="font-mono text-[10px] font-medium"
            style={{ color: config.color }}
          >
            {config.label}
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden w-56 shrink-0 border-r border-border md:block">
          <ChannelList
            activeChannelId={channelId}
            onSelectChannel={setChannelId}
          />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-72 md:hidden">
              <ChannelList
                activeChannelId={channelId}
                onSelectChannel={setChannelId}
                onClose={() => setSidebarOpen(false)}
              />
            </aside>
          </>
        )}

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <OnlineAgents />
          <MessageList channelId={channelId} />
          <ComposeBar
            channelId={channelId}
            agentType={agentType}
            agentName={config.label}
          />
        </main>
      </div>
    </div>
  )
}
