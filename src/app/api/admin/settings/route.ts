import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const settings = await db.siteSetting.findMany()
    const settingsMap: Record<string, string> = {}
    settings.forEach((s) => {
      settingsMap[s.key] = s.value
    })
    return NextResponse.json(settingsMap)
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    const updates = Object.entries(body).map(([key, value]) =>
      db.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )

    await Promise.all(updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
