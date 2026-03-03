"use client"

import { useState } from "react"
import { Hash, Plus, X } from "lucide-react"
import { useChannels, useCreateChannel } from "@/lib/use-agent-comms"
import type { Channel } from "@/lib/message-store"

interface ChannelListProps {
  activeChannelId: string | null
  onSelectChannel: (id: string) => void
  onClose?: () => void
}

export function ChannelList({
  activeChannelId,
  onSelectChannel,
  onClose,
}: ChannelListProps) {
  const { data } = useChannels()
  const { trigger: createChannel } = useCreateChannel()
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState("")

  const channels: Channel[] = data?.channels ?? []

  async function handleCreate() {
    if (!newName.trim()) return
    await createChannel({ name: newName.trim(), description: "" })
    setNewName("")
    setShowCreate(false)
  }

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Channels
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Create channel"
          >
            <Plus className="h-4 w-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="border-b border-border p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleCreate()
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="channel-name"
              className="flex-1 rounded-md border border-input bg-background px-2.5 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-md bg-foreground px-3 py-1.5 font-mono text-xs text-background transition-colors hover:bg-foreground/90"
            >
              Add
            </button>
          </form>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-2" aria-label="Channel list">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => {
              onSelectChannel(channel.id)
              onClose?.()
            }}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${
              activeChannelId === channel.id
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            <Hash className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate font-mono text-sm">{channel.name}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
