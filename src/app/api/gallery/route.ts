import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const images = await db.galleryImage.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(images)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const image = await db.galleryImage.create({ data })
  return NextResponse.json(image)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await db.galleryImage.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
