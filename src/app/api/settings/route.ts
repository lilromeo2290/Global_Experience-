import { NextRequest, NextResponse } from 'next/server'
import { db, isDatabaseAvailable } from '@/lib/db'

export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json([])
    }
    const settings = await db.siteSetting.findMany()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const { id, value } = await req.json()
    const setting = await db.siteSetting.update({ where: { id }, data: { value } })
    return NextResponse.json(setting)
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const data = await req.json()
    const setting = await db.siteSetting.create({ data })
    return NextResponse.json(setting)
  } catch (error) {
    console.error('Error creating setting:', error)
    return NextResponse.json({ error: 'Failed to create setting' }, { status: 500 })
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
    console.error('Error deleting setting:', error)
    return NextResponse.json({ error: 'Failed to delete setting' }, { status: 500 })
  }
}
