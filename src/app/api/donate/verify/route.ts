import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, formatDonationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY

    if (!secretKey) {
      return NextResponse.json({ error: 'Paystack secret key not configured' }, { status: 500 })
    }

    // Verify the transaction with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!data.status) {
      return NextResponse.json({ error: 'Transaction verification failed', details: data }, { status: 400 })
    }

    // Check if transaction was successful
    if (data.data.status === 'success') {
      const donationData = {
        name: data.data.metadata?.name || '',
        email: data.data.customer.email,
        phone: data.data.metadata?.phone || '',
        amount: data.data.amount / 100, // Paystack returns amount in kobo/cents
        currency: data.data.currency,
        reference: data.data.reference,
      }

      // Send email notification
      await sendEmail({
        subject: `New Donation Received — ${donationData.currency} ${donationData.amount} from ${donationData.name || donationData.email}`,
        html: formatDonationEmail(donationData),
      })

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          reference: data.data.reference,
          amount: donationData.amount,
          currency: data.data.currency,
          email: data.data.customer.email,
          name: donationData.name,
          phone: donationData.phone,
          paid_at: data.data.paid_at,
        },
      })
    } else {
      return NextResponse.json({
        success: false,
        message: `Transaction status: ${data.data.status}`,
        data: data.data,
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Paystack verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
