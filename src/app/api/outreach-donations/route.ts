import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEmail, formatOutreachDonationEmail } from '@/lib/email'

export async function GET() {
  const donations = await db.outreachDonation.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(donations)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const donation = await db.outreachDonation.create({ data })

  // Send email notification
  await sendEmail({
    subject: `New Outreach Donation Offer — ${data.programArea}`,
    html: formatOutreachDonationEmail(data),
  })

  return NextResponse.json(donation)
}

export async function PUT(req: NextRequest) {
  const { id, status } = await req.json()
  const donation = await db.outreachDonation.update({ where: { id }, data: { status } })
  return NextResponse.json(donation)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await db.outreachDonation.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
