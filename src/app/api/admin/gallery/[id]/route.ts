import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const image = await db.galleryImage.findUnique({ where: { id } })
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(image)
  } catch (error) {
    console.error('Gallery image GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery image' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const image = await db.galleryImage.update({
      where: { id },
      data: {
        ...(body.src !== undefined && { src: body.src }),
        ...(body.alt !== undefined && { alt: body.alt }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.active !== undefined && { active: body.active }),
      },
    })
    return NextResponse.json(image)
  } catch (error) {
    console.error('Gallery image PUT error:', error)
    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await db.galleryImage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery image DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 })
  }
}
