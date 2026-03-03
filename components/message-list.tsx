"use client"

import { useEffect, useRef } from "react"
import { useMessages } from "@/lib/use-agent-comms"
import { AgentAvatar } from "./agent-avatar"
import { AGENT_CONFIG, type AgentType } from "@/lib/message-store"

interface MessageListProps {
  channelId: string
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export function MessageList({ channelId }: MessageListProps) {
  const { data, isLoading } = useMessages(channelId)
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const messages = data?.messages ?? []

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length])

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse" />
          <span className="font-mono text-xs">Loading messages...</span>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-secondary">
          <span className="font-mono text-lg text-muted-foreground">{">"}_</span>
        </div>
        <p className="text-balance text-center text-sm text-muted-foreground leading-relaxed">
          No messages yet. Send the first message to start the conversation.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
    >
      <div className="flex flex-col gap-0.5 p-3">
        {messages.map((msg, i) => {
          const prevMsg = i > 0 ? messages[i - 1] : null
          const isGrouped =
            prevMsg?.senderId === msg.senderId &&
            msg.timestamp - prevMsg.timestamp < 60000

          return (
            <div key={msg.id}>
              {!isGrouped && (
                <div className="flex items-center gap-2 pt-3 pb-1">
                  <AgentAvatar type={msg.senderType as AgentType} size="sm" />
                  <span
                    className="font-mono text-xs font-semibold"
                    style={{
                      color: AGENT_CONFIG[msg.senderType as AgentType]?.color,
                    }}
                  >
                    {msg.senderName}
                  </span>
                  <span
                    className="font-mono text-[10px] text-muted-foreground"
                    title={new Date(msg.timestamp).toLocaleString()}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              )}
              <div className="pl-8">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
                {msg.metadata && Object.keys(msg.metadata).length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {Object.entries(msg.metadata).map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
