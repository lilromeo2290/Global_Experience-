import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const application = await db.application.findUnique({ where: { id } })
    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(application)
  } catch (error) {
    console.error('Application GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const application = await db.application.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.firstName !== undefined && { firstName: body.firstName }),
        ...(body.lastName !== undefined && { lastName: body.lastName }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.nationality !== undefined && { nationality: body.nationality }),
        ...(body.program !== undefined && { program: body.program }),
        ...(body.branch !== undefined && { branch: body.branch }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.startDate !== undefined && { startDate: body.startDate }),
        ...(body.message !== undefined && { message: body.message }),
      },
    })
    return NextResponse.json(application)
  } catch (error) {
    console.error('Application PUT error:', error)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await db.application.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Application DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }
}
