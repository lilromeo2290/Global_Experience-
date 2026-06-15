import { NextRequest, NextResponse } from 'next/server'
import { db, isDatabaseAvailable } from '@/lib/db'

// SiteContent model doesn't exist in the Prisma schema
// This route uses SiteSetting as a key-value store for content instead

export async function GET(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json([])
    }
    const section = req.nextUrl.searchParams.get('section')
    const where = section ? { key: { startsWith: `content_${section}_` } } : { key: { startsWith: 'content_' } }
    const content = await db.siteSetting.findMany({
      where,
      orderBy: [{ key: 'asc' }],
    })
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const { id, value } = await req.json()
    const content = await db.siteSetting.update({ where: { id }, data: { value } })
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const data = await req.json()
    const content = await db.siteSetting.create({ data })
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const { id } = await req.json()
    await db.siteSetting.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}
