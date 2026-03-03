import useSWR from "swr"
import useSWRMutation from "swr/mutation"
import type { Message, Channel, Agent, AgentType } from "./message-store"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useChannels() {
  return useSWR<{ channels: Channel[] }>("/api/channels", fetcher, {
    refreshInterval: 3000,
  })
}

export function useMessages(channelId: string | null) {
  return useSWR<{ messages: Message[] }>(
    channelId ? `/api/messages?channelId=${channelId}` : null,
    fetcher,
    { refreshInterval: 1000 }
  )
}

export function useAgents() {
  return useSWR<{ agents: Agent[] }>("/api/agents", fetcher, {
    refreshInterval: 5000,
  })
}

async function sendMessageFn(
  url: string,
  {
    arg,
  }: {
    arg: {
      channelId: string
      senderId: string
      senderType: AgentType
      senderName: string
      content: string
      metadata?: Record<string, string>
    }
  }
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })
  return res.json()
}

export function useSendMessage() {
  return useSWRMutation("/api/messages", sendMessageFn)
}

async function createChannelFn(
  url: string,
  { arg }: { arg: { name: string; description: string } }
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })
  return res.json()
}

export function useCreateChannel() {
  return useSWRMutation("/api/channels", createChannelFn)
}

async function registerAgentFn(
  url: string,
  { arg }: { arg: { id: string; type: AgentType; name: string } }
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })
  return res.json()
}

export function useRegisterAgent() {
  return useSWRMutation("/api/agents", registerAgentFn)
}
