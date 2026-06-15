import { NextRequest, NextResponse } from 'next/server'
import { db, isDatabaseAvailable } from '@/lib/db'
import { sendEmail, formatPickupRequestEmail } from '@/lib/email'

export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json([])
    }
    const pickups = await db.pickupRequest.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(pickups)
  } catch (error) {
    console.error('Error fetching pickups:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const data = await req.json()
    const pickup = await db.pickupRequest.create({ data })

    // Send email notification (don't block on email failure)
    try {
      await sendEmail({
        subject: `New Airport Pickup Request from ${data.fullName}`,
        html: formatPickupRequestEmail(data),
      })
    } catch (emailError) {
      console.error('Failed to send pickup email:', emailError)
    }

    return NextResponse.json(pickup)
  } catch (error) {
    console.error('Error creating pickup request:', error)
    return NextResponse.json({ error: 'Failed to create pickup request' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const { id, status } = await req.json()
    const pickup = await db.pickupRequest.update({ where: { id }, data: { status } })
    return NextResponse.json(pickup)
  } catch (error) {
    console.error('Error updating pickup request:', error)
    return NextResponse.json({ error: 'Failed to update pickup request' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }
    const { id } = await req.json()
    await db.pickupRequest.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pickup request:', error)
    return NextResponse.json({ error: 'Failed to delete pickup request' }, { status: 500 })
  }
}
