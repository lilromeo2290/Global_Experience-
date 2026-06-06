import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEmail, formatApplicationEmail } from '@/lib/email'

export async function GET() {
  const applications = await db.application.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(applications)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const application = await db.application.create({ data })

  // Send email notification
  await sendEmail({
    subject: `New Application from ${data.firstName} ${data.lastName} — ${data.program}`,
    html: formatApplicationEmail(data),
  })

  return NextResponse.json(application)
}

export async function PUT(req: NextRequest) {
  const { id, status } = await req.json()
  const application = await db.application.update({ where: { id }, data: { status } })
  return NextResponse.json(application)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await db.application.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
