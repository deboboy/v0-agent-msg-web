import { NextRequest, NextResponse } from "next/server"
import { getChannels, createChannel } from "@/lib/message-store"

export async function GET() {
  const channels = getChannels()
  return NextResponse.json({ channels })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, description } = body

  if (!name) {
    return NextResponse.json(
      { error: "name is required" },
      { status: 400 }
    )
  }

  const channel = createChannel(name, description || "")
  return NextResponse.json({ channel }, { status: 201 })
}
