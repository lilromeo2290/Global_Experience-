import { NextRequest, NextResponse } from 'next/server'
import { db, isDatabaseAvailable } from '@/lib/db'

export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json([])
    }
    const members = await db.teamMember.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const data = await req.json()
    const member = await db.teamMember.create({ data })
    return NextResponse.json(member)
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const { id, ...data } = await req.json()
    const member = await db.teamMember.update({ where: { id }, data })
    return NextResponse.json(member)
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const { id } = await req.json()
    await db.teamMember.update({ where: { id }, data: { active: false } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}
