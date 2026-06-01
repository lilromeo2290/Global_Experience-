import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const slides = await db.heroSlide.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(slides)
  } catch (error) {
    console.error('Hero slides GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const maxOrder = await db.heroSlide.aggregate({ _max: { order: true } })
    const slide = await db.heroSlide.create({
      data: {
        src: body.src,
        alt: body.alt,
        order: body.order ?? (maxOrder._max.order ?? -1) + 1,
        active: body.active ?? true,
      },
    })
    return NextResponse.json(slide, { status: 201 })
  } catch (error) {
    console.error('Hero slide POST error:', error)
    return NextResponse.json({ error: 'Failed to create hero slide' }, { status: 500 })
  }
}
