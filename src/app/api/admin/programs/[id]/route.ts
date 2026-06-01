import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const program = await db.program.findUnique({ where: { id } })
    if (!program) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(program)
  } catch (error) {
    console.error('Program GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch program' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const program = await db.program.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.sector !== undefined && { sector: body.sector }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.active !== undefined && { active: body.active }),
      },
    })
    return NextResponse.json(program)
  } catch (error) {
    console.error('Program PUT error:', error)
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await db.program.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Program DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 })
  }
}
