import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const faq = await db.fAQ.findUnique({ where: { id } })
    if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(faq)
  } catch (error) {
    console.error('FAQ GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch FAQ' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const faq = await db.fAQ.update({
      where: { id },
      data: {
        ...(body.question !== undefined && { question: body.question }),
        ...(body.answer !== undefined && { answer: body.answer }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.active !== undefined && { active: body.active }),
      },
    })
    return NextResponse.json(faq)
  } catch (error) {
    console.error('FAQ PUT error:', error)
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await db.fAQ.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('FAQ DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 })
  }
}
