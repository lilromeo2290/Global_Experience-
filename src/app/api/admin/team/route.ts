import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const members = await db.teamMember.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(members)
  } catch (error) {
    console.error('Team GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const maxOrder = await db.teamMember.aggregate({ _max: { order: true } })
    const member = await db.teamMember.create({
      data: {
        name: body.name,
        title: body.title,
        category: body.category,
        bio: body.bio,
        expertise: body.expertise,
        photo: body.photo,
        order: body.order ?? (maxOrder._max.order ?? -1) + 1,
        active: body.active ?? true,
      },
    })
    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Team POST error:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}
