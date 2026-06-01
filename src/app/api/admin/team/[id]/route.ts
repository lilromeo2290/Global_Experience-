import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const member = await db.teamMember.findUnique({ where: { id } })
    if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(member)
  } catch (error) {
    console.error('Team member GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const member = await db.teamMember.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.expertise !== undefined && { expertise: body.expertise }),
        ...(body.photo !== undefined && { photo: body.photo }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.active !== undefined && { active: body.active }),
      },
    })
    return NextResponse.json(member)
  } catch (error) {
    console.error('Team member PUT error:', error)
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await db.teamMember.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Team member DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}
