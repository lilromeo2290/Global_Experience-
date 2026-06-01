import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const members = await db.teamMember.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(members)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const member = await db.teamMember.create({ data })
  return NextResponse.json(member)
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json()
  const member = await db.teamMember.update({ where: { id }, data })
  return NextResponse.json(member)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await db.teamMember.update({ where: { id }, data: { active: false } })
  return NextResponse.json({ success: true })
}
