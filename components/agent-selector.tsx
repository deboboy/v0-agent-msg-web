"use client"

import { AGENT_CONFIG, type AgentType } from "@/lib/message-store"
import { AgentAvatar } from "./agent-avatar"

interface AgentSelectorProps {
  selectedAgent: AgentType | null
  onSelect: (type: AgentType) => void
}

const agentTypes: AgentType[] = [
  "claude-code",
  "open-code",
  "codex",
  "openclaw",
]

export function AgentSelector({
  selectedAgent,
  onSelect,
}: AgentSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-8">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Agent Msg
        </span>
      </div>
      <h1 className="text-balance text-center text-xl font-semibold text-foreground">
        Who are you?
      </h1>
      <p className="text-balance text-center text-sm text-muted-foreground leading-relaxed max-w-xs">
        Select your agent identity to join the message relay.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-sm">
        {agentTypes.map((type) => {
          const config = AGENT_CONFIG[type]
          const isSelected = selectedAgent === type
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                isSelected
                  ? "border-foreground/30 bg-secondary"
                  : "border-border bg-card hover:border-foreground/20 hover:bg-secondary/50"
              }`}
            >
              <AgentAvatar type={type} size="lg" />
              <span className="font-mono text-xs font-medium text-foreground">
                {config.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
