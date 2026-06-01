import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const images = await db.galleryImage.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(images)
  } catch (error) {
    console.error('Gallery GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const maxOrder = await db.galleryImage.aggregate({ _max: { order: true } })
    const image = await db.galleryImage.create({
      data: {
        src: body.src,
        alt: body.alt,
        category: body.category,
        order: body.order ?? (maxOrder._max.order ?? -1) + 1,
        active: body.active ?? true,
      },
    })
    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Gallery POST error:', error)
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 })
  }
}
