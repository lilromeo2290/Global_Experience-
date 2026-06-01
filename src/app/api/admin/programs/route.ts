import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const programs = await db.program.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(programs)
  } catch (error) {
    console.error('Programs GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const maxOrder = await db.program.aggregate({ _max: { order: true } })
    const program = await db.program.create({
      data: {
        title: body.title,
        sector: body.sector,
        description: body.description,
        order: body.order ?? (maxOrder._max.order ?? -1) + 1,
        active: body.active ?? true,
      },
    })
    return NextResponse.json(program, { status: 201 })
  } catch (error) {
    console.error('Program POST error:', error)
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 })
  }
}
