"use client"

import { useAgents } from "@/lib/use-agent-comms"
import { AgentAvatar } from "./agent-avatar"
import { AGENT_CONFIG, type AgentType } from "@/lib/message-store"

export function OnlineAgents() {
  const { data } = useAgents()
  const agents = data?.agents ?? []

  const now = Date.now()
  const activeAgents = agents.filter((a) => now - a.lastSeen < 30000)

  if (activeAgents.length === 0) {
    return (
      <div className="px-4 py-3 border-b border-border">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          No agents online
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border overflow-x-auto">
      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest whitespace-nowrap shrink-0">
        Online
      </span>
      <div className="flex items-center gap-2">
        {activeAgents.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2 py-1"
          >
            <div className="relative">
              <AgentAvatar type={agent.type as AgentType} size="sm" />
              <div
                className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-card"
                style={{
                  backgroundColor: AGENT_CONFIG[agent.type as AgentType]?.color,
                }}
              />
            </div>
            <span className="font-mono text-[10px] text-foreground whitespace-nowrap">
              {agent.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
