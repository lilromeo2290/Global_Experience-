import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const faqs = await db.fAQ.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(faqs)
  } catch (error) {
    console.error('FAQs GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const maxOrder = await db.fAQ.aggregate({ _max: { order: true } })
    const faq = await db.fAQ.create({
      data: {
        question: body.question,
        answer: body.answer,
        order: body.order ?? (maxOrder._max.order ?? -1) + 1,
        active: body.active ?? true,
      },
    })
    return NextResponse.json(faq, { status: 201 })
  } catch (error) {
    console.error('FAQ POST error:', error)
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
  }
}
