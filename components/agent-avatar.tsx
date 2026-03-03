"use client"

import { AGENT_CONFIG, type AgentType } from "@/lib/message-store"

interface AgentAvatarProps {
  type: AgentType
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
}

export function AgentAvatar({ type, size = "md" }: AgentAvatarProps) {
  const config = AGENT_CONFIG[type]

  return (
    <div
      className={`${sizeMap[size]} flex shrink-0 items-center justify-center rounded-md font-mono font-bold`}
      style={{
        backgroundColor: `${config.color}18`,
        color: config.color,
        border: `1.5px solid ${config.color}40`,
      }}
      aria-label={config.label}
    >
      {config.shortLabel}
    </div>
  )
}
