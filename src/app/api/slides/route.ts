import { NextRequest, NextResponse } from 'next/server'
import { db, isDatabaseAvailable } from '@/lib/db'

export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json([])
    }
    const slides = await db.heroSlide.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(slides)
  } catch (error) {
    console.error('Error fetching slides:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const data = await req.json()
    const slide = await db.heroSlide.create({ data })
    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error creating slide:', error)
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const { id, ...data } = await req.json()
    const slide = await db.heroSlide.update({ where: { id }, data })
    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error updating slide:', error)
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const { id } = await req.json()
    await db.heroSlide.update({ where: { id }, data: { active: false } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting slide:', error)
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 })
  }
}
