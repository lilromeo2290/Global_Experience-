import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const faqs = await db.fAQ.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(faqs)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const faq = await db.fAQ.create({ data })
  return NextResponse.json(faq)
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json()
  const faq = await db.fAQ.update({ where: { id }, data })
  return NextResponse.json(faq)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await db.fAQ.update({ where: { id }, data: { active: false } })
  return NextResponse.json({ success: true })
}
