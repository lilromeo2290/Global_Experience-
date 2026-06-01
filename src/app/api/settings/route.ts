import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const settings = await db.siteSettings.findMany()
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const { id, value } = await req.json()
  const setting = await db.siteSettings.update({ where: { id }, data: { value } })
  return NextResponse.json(setting)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const setting = await db.siteSettings.create({ data })
  return NextResponse.json(setting)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await db.siteSettings.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
