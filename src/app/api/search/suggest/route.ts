import { NextRequest, NextResponse } from 'next/server'
import { getSuggestions, getPopularSearches, getPersonalizedSuggestions } from '@/lib/search-index'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const query = searchParams.get('q') || ''
  const mode = searchParams.get('mode') || 'suggest' // 'suggest' | 'popular' | 'personalized'
  const interestsParam = searchParams.get('interests') || ''
  const interests = interestsParam ? interestsParam.split(',').filter(Boolean) : []

  if (mode === 'popular') {
    return NextResponse.json({
      suggestions: getPopularSearches(),
      mode: 'popular',
    })
  }

  if (mode === 'personalized') {
    const results = getPersonalizedSuggestions(interests)
    return NextResponse.json({
      suggestions: results.map(r => ({
        id: r.item.id,
        title: r.item.title,
        description: r.item.description.substring(0, 100) + '...',
        category: r.item.category,
        href: r.item.href,
        icon: r.item.icon,
        tags: r.item.tags.slice(0, 3),
        score: r.score,
      })),
      mode: 'personalized',
    })
  }

  // Default: type-ahead suggestions
  if (!query.trim() || query.length < 2) {
    return NextResponse.json({
      suggestions: [],
      query,
      mode: 'suggest',
    })
  }

  const results = getSuggestions(query)

  return NextResponse.json({
    suggestions: results.map(r => ({
      id: r.item.id,
      title: r.item.title,
      description: r.item.description.substring(0, 120) + (r.item.description.length > 120 ? '...' : ''),
      category: r.item.category,
      href: r.item.href,
      icon: r.item.icon,
      tags: r.item.tags.slice(0, 3),
      score: Math.round(r.score * 100) / 100,
    })),
    query,
    mode: 'suggest',
  })
}
