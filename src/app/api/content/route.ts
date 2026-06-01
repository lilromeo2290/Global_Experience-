import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section')
  const where = section ? { section } : {}
  const content = await db.siteContent.findMany({
    where,
    orderBy: [{ section: 'asc' }, { key: 'asc' }],
  })
  return NextResponse.json(content)
}

export async function PUT(req: NextRequest) {
  const { id, value } = await req.json()
  const content = await db.siteContent.update({ where: { id }, data: { value } })
  return NextResponse.json(content)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const content = await db.siteContent.create({ data })
  return NextResponse.json(content)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await db.siteContent.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
