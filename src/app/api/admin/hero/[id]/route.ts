import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const slide = await db.heroSlide.findUnique({ where: { id } })
    if (!slide) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(slide)
  } catch (error) {
    console.error('Hero slide GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch hero slide' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const slide = await db.heroSlide.update({
      where: { id },
      data: {
        ...(body.src !== undefined && { src: body.src }),
        ...(body.alt !== undefined && { alt: body.alt }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.active !== undefined && { active: body.active }),
      },
    })
    return NextResponse.json(slide)
  } catch (error) {
    console.error('Hero slide PUT error:', error)
    return NextResponse.json({ error: 'Failed to update hero slide' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await db.heroSlide.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Hero slide DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 })
  }
}
