import { NextRequest, NextResponse } from 'next/server'
import { search, SearchFilters } from '@/lib/search-index'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') as SearchFilters['category'] || undefined
  const destination = searchParams.get('destination') || undefined
  const programType = searchParams.get('programType') || undefined
  const interestsParam = searchParams.get('interests') || ''
  const interests = interestsParam ? interestsParam.split(',').filter(Boolean) : undefined
  const limit = parseInt(searchParams.get('limit') || '20', 10)

  if (!query.trim()) {
    return NextResponse.json({
      results: [],
      query: '',
      total: 0,
    })
  }

  const filters: SearchFilters = {}
  if (category) filters.category = category
  if (destination) filters.destination = destination
  if (programType) filters.programType = programType
  if (interests) filters.interests = interests

  const results = search(query, filters, limit)

  return NextResponse.json({
    results: results.map(r => ({
      id: r.item.id,
      title: r.item.title,
      description: r.item.description,
      category: r.item.category,
      href: r.item.href,
      tags: r.item.tags,
      icon: r.item.icon,
      score: Math.round(r.score * 100) / 100,
      matchReason: r.matchReason,
    })),
    query,
    total: results.length,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
  })
}
