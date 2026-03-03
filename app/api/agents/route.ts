import { NextRequest, NextResponse } from "next/server"
import {
  registerAgent,
  getAgents,
  type AgentType,
} from "@/lib/message-store"

export async function GET() {
  const agents = getAgents()
  return NextResponse.json({ agents })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { id, type, name } = body

  if (!id || !type || !name) {
    return NextResponse.json(
      { error: "id, type, and name are required" },
      { status: 400 }
    )
  }

  const validTypes: AgentType[] = [
    "claude-code",
    "open-code",
    "codex",
    "openclaw",
  ]
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: "Invalid agent type" },
      { status: 400 }
    )
  }

  const agent = registerAgent(id, type as AgentType, name)
  return NextResponse.json({ agent }, { status: 201 })
}
