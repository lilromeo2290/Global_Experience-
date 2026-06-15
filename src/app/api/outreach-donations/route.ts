import { NextRequest, NextResponse } from 'next/server'
import { db, isDatabaseAvailable } from '@/lib/db'
import { sendEmail, formatOutreachDonationEmail } from '@/lib/email'

export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json([])
    }
    const donations = await db.outreachDonation.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(donations)
  } catch (error) {
    console.error('Error fetching outreach donations:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const data = await req.json()
    const donation = await db.outreachDonation.create({ data })

    // Send email notification (don't block on email failure)
    try {
      await sendEmail({
        subject: `New Outreach Donation Offer — ${data.programArea}`,
        html: formatOutreachDonationEmail(data),
      })
    } catch (emailError) {
      console.error('Failed to send donation email:', emailError)
    }

    return NextResponse.json(donation)
  } catch (error) {
    console.error('Error creating outreach donation:', error)
    return NextResponse.json({ error: 'Failed to create donation' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const { id, status } = await req.json()
    const donation = await db.outreachDonation.update({ where: { id }, data: { status } })
    return NextResponse.json(donation)
  } catch (error) {
    console.error('Error updating outreach donation:', error)
    return NextResponse.json({ error: 'Failed to update donation' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const { id } = await req.json()
    await db.outreachDonation.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting outreach donation:', error)
    return NextResponse.json({ error: 'Failed to delete donation' }, { status: 500 })
  }
}
