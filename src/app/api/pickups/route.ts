import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEmail, formatPickupRequestEmail } from '@/lib/email'

export async function GET() {
  const pickups = await db.pickupRequest.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(pickups)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const pickup = await db.pickupRequest.create({ data })

  // Send email notification
  await sendEmail({
    subject: `New Airport Pickup Request from ${data.fullName}`,
    html: formatPickupRequestEmail(data),
  })

  return NextResponse.json(pickup)
}

export async function PUT(req: NextRequest) {
  const { id, status } = await req.json()
  const pickup = await db.pickupRequest.update({ where: { id }, data: { status } })
  return NextResponse.json(pickup)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await db.pickupRequest.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
