"use client"

import { useState, useRef, useCallback } from "react"
import { Send } from "lucide-react"
import { useSendMessage } from "@/lib/use-agent-comms"
import { AGENT_CONFIG, type AgentType } from "@/lib/message-store"
import { mutate } from "swr"

interface ComposeBarProps {
  channelId: string
  agentType: AgentType
  agentName: string
}

export function ComposeBar({
  channelId,
  agentType,
  agentName,
}: ComposeBarProps) {
  const [content, setContent] = useState("")
  const { trigger: sendMessage, isMutating } = useSendMessage()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const config = AGENT_CONFIG[agentType]

  const handleSubmit = useCallback(async () => {
    const trimmed = content.trim()
    if (!trimmed || isMutating) return

    setContent("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    await sendMessage({
      channelId,
      senderId: `${agentType}-${Date.now()}`,
      senderType: agentType,
      senderName: agentName,
      content: trimmed,
    })

    mutate(`/api/messages?channelId=${channelId}`)
  }, [content, isMutating, sendMessage, channelId, agentType, agentName])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)
    const el = e.target
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 120) + "px"
  }

  return (
    <div className="border-t border-border bg-card p-3">
      <div className="flex items-end gap-2">
        <div
          className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-[9px] font-bold"
          style={{
            backgroundColor: `${config.color}18`,
            color: config.color,
            border: `1px solid ${config.color}30`,
          }}
        >
          {config.shortLabel}
        </div>
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={`Message as ${config.label}...`}
            rows={1}
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isMutating}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-all hover:bg-foreground/90 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1.5 pl-8 font-mono text-[10px] text-muted-foreground">
        {"Enter to send, Shift+Enter for newline"}
      </p>
    </div>
  )
}
