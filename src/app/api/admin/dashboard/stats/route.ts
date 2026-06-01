import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      programs,
      teamMembers,
      galleryImages,
      applications,
      faqs,
      heroSlides,
      pendingApplications,
    ] = await Promise.all([
      db.program.count({ where: { active: true } }),
      db.teamMember.count({ where: { active: true } }),
      db.galleryImage.count({ where: { active: true } }),
      db.application.count(),
      db.fAQ.count({ where: { active: true } }),
      db.heroSlide.count({ where: { active: true } }),
      db.application.count({ where: { status: 'pending' } }),
    ])

    return NextResponse.json({
      programs,
      teamMembers,
      galleryImages,
      applications,
      faqs,
      heroSlides,
      pendingApplications,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
