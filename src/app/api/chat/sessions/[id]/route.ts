import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/chat/sessions/[id] - Get a specific session with messages
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await db.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error: any) {
    console.error('Get session error:', error.message)
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 })
  }
}

// PUT /api/chat/sessions/[id] - Update session status (e.g., connect agent, close session)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status, visitorName } = await req.json()

    const session = await db.chatSession.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(visitorName && { visitorName }),
        updatedAt: new Date(),
      },
    })

    // If connecting an agent, add a system message
    if (status === 'connected') {
      await db.chatMessage.create({
        data: {
          sessionId: id,
          sender: 'agent',
          content: 'A live agent has joined the chat. You are now speaking with a team member from Global Experience Placements.',
        },
      })
    }

    return NextResponse.json(session)
  } catch (error: any) {
    console.error('Update session error:', error.message)
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }
}
