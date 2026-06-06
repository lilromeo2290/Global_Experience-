import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEmail, formatContactMessageEmail } from '@/lib/email'

export async function GET() {
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const message = await db.contactMessage.create({ data })

  // Send email notification
  await sendEmail({
    subject: `New Contact Message from ${data.firstName} ${data.lastName}`,
    html: formatContactMessageEmail(data),
  })

  return NextResponse.json(message)
}

export async function PUT(req: NextRequest) {
  const { id, status } = await req.json()
  const message = await db.contactMessage.update({ where: { id }, data: { status } })
  return NextResponse.json(message)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await db.contactMessage.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
