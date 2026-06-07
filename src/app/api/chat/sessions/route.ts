import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/chat/sessions - Get all chat sessions (admin)
export async function GET() {
  try {
    const sessions = await db.chatSession.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: { messages: { where: { read: false, sender: 'visitor' } } },
        },
      },
    })

    return NextResponse.json(sessions)
  } catch (error: any) {
    console.error('Get sessions error:', error.message)
    return NextResponse.json({ error: 'Failed to get sessions' }, { status: 500 })
  }
}

// POST /api/chat/sessions - Create a new chat session (visitor)
export async function POST(req: NextRequest) {
  try {
    const { visitorName, visitorEmail } = await req.json()

    const session = await db.chatSession.create({
      data: {
        visitorName: visitorName || 'Visitor',
        visitorEmail: visitorEmail || null,
        status: 'active',
      },
    })

    // Save welcome message
    await db.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: 'bot',
        content: 'Hello! Welcome to Global Experience Placements. I\'m your virtual assistant. How can I help you today?',
      },
    })

    return NextResponse.json(session)
  } catch (error: any) {
    console.error('Create session error:', error.message)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
