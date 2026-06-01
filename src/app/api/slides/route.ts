import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const slides = await db.sliderImage.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(slides)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const slide = await db.sliderImage.create({ data })
  return NextResponse.json(slide)
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json()
  const slide = await db.sliderImage.update({ where: { id }, data })
  return NextResponse.json(slide)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await db.sliderImage.update({ where: { id }, data: { active: false } })
  return NextResponse.json({ success: true })
}
