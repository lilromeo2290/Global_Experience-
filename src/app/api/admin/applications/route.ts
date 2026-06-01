import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '0')

    const where = status ? { status } : {}

    const applications = await db.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(limit > 0 ? { take: limit } : {}),
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Applications GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}
