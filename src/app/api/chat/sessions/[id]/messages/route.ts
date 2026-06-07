import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/chat/sessions/[id]/messages - Get messages for a session
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const messages = await db.chatMessage.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: 'asc' },
    })

    // Mark visitor messages as read (admin is viewing)
    await db.chatMessage.updateMany({
      where: { sessionId: id, sender: 'visitor', read: false },
      data: { read: true },
    })

    return NextResponse.json(messages)
  } catch (error: any) {
    console.error('Get messages error:', error.message)
    return NextResponse.json({ error: 'Failed to get messages' }, { status: 500 })
  }
}

// POST /api/chat/sessions/[id]/messages - Send a message (agent)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { content, sender } = await req.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const message = await db.chatMessage.create({
      data: {
        sessionId: id,
        sender: sender || 'agent',
        content,
      },
    })

    // Update session timestamp
    await db.chatSession.update({
      where: { id },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(message)
  } catch (error: any) {
    console.error('Send message error:', error.message)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
