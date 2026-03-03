export type AgentType = "claude-code" | "open-code" | "codex" | "openclaw"

export interface Agent {
  id: string
  type: AgentType
  name: string
  lastSeen: number
}

export interface Message {
  id: string
  channelId: string
  senderId: string
  senderType: AgentType
  senderName: string
  content: string
  timestamp: number
  metadata?: Record<string, string>
}

export interface Channel {
  id: string
  name: string
  description: string
  createdAt: number
  lastMessageAt: number
}

// Agent display config
export const AGENT_CONFIG: Record<
  AgentType,
  { label: string; color: string; shortLabel: string }
> = {
  "claude-code": {
    label: "Claude Code",
    color: "#E8915A",
    shortLabel: "CC",
  },
  "open-code": {
    label: "Open Code",
    color: "#58A6FF",
    shortLabel: "OC",
  },
  codex: {
    label: "Codex",
    color: "#7EE787",
    shortLabel: "CX",
  },
  openclaw: {
    label: "OpenClaw",
    color: "#F778BA",
    shortLabel: "OW",
  },
}

// In-memory stores
const messages: Message[] = []
const channels: Map<string, Channel> = new Map()
const agents: Map<string, Agent> = new Map()

let messageCounter = 0

// Seed default channel
channels.set("general", {
  id: "general",
  name: "general",
  description: "Default channel for all agents",
  createdAt: Date.now(),
  lastMessageAt: Date.now(),
})

channels.set("tasks", {
  id: "tasks",
  name: "tasks",
  description: "Task coordination and handoffs",
  createdAt: Date.now(),
  lastMessageAt: Date.now(),
})

channels.set("errors", {
  id: "errors",
  name: "errors",
  description: "Error reports and debugging help",
  createdAt: Date.now(),
  lastMessageAt: Date.now(),
})

// Helper to generate IDs
function generateId(): string {
  messageCounter++
  return `msg_${Date.now()}_${messageCounter}`
}

// Store operations
export function getChannels(): Channel[] {
  return Array.from(channels.values()).sort(
    (a, b) => b.lastMessageAt - a.lastMessageAt
  )
}

export function getChannel(id: string): Channel | undefined {
  return channels.get(id)
}

export function createChannel(
  name: string,
  description: string
): Channel {
  const id = name.toLowerCase().replace(/[^a-z0-9-]/g, "-")
  const channel: Channel = {
    id,
    name,
    description,
    createdAt: Date.now(),
    lastMessageAt: Date.now(),
  }
  channels.set(id, channel)
  return channel
}

export function getMessages(
  channelId: string,
  after?: number
): Message[] {
  return messages
    .filter(
      (m) =>
        m.channelId === channelId &&
        (after === undefined || m.timestamp > after)
    )
    .sort((a, b) => a.timestamp - b.timestamp)
}

export function addMessage(
  channelId: string,
  senderId: string,
  senderType: AgentType,
  senderName: string,
  content: string,
  metadata?: Record<string, string>
): Message {
  const message: Message = {
    id: generateId(),
    channelId,
    senderId,
    senderType,
    senderName,
    content,
    timestamp: Date.now(),
    metadata,
  }
  messages.push(message)

  const channel = channels.get(channelId)
  if (channel) {
    channel.lastMessageAt = message.timestamp
  }

  return message
}

export function registerAgent(
  id: string,
  type: AgentType,
  name: string
): Agent {
  const agent: Agent = { id, type, name, lastSeen: Date.now() }
  agents.set(id, agent)
  return agent
}

export function getAgents(): Agent[] {
  return Array.from(agents.values())
}

export function touchAgent(id: string): void {
  const agent = agents.get(id)
  if (agent) {
    agent.lastSeen = Date.now()
  }
}
