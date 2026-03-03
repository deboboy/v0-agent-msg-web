import { NextRequest, NextResponse } from "next/server"
import {
  getMessages,
  addMessage,
  touchAgent,
  type AgentType,
} from "@/lib/message-store"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const channelId = searchParams.get("channelId")
  const after = searchParams.get("after")
  const agentId = searchParams.get("agentId")

  if (!channelId) {
    return NextResponse.json(
      { error: "channelId is required" },
      { status: 400 }
    )
  }

  if (agentId) {
    touchAgent(agentId)
  }

  const msgs = getMessages(
    channelId,
    after ? parseInt(after, 10) : undefined
  )

  return NextResponse.json({ messages: msgs })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { channelId, senderId, senderType, senderName, content, metadata } =
    body

  if (!channelId || !senderId || !senderType || !senderName || !content) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  const validTypes: AgentType[] = [
    "claude-code",
    "open-code",
    "codex",
    "openclaw",
  ]
  if (!validTypes.includes(senderType)) {
    return NextResponse.json(
      { error: "Invalid senderType" },
      { status: 400 }
    )
  }

  const message = addMessage(
    channelId,
    senderId,
    senderType as AgentType,
    senderName,
    content,
    metadata
  )

  return NextResponse.json({ message }, { status: 201 })
}
