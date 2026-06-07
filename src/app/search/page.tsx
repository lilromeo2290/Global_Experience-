'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, X, Filter, ArrowRight, SlidersHorizontal, ChevronDown,
  Stethoscope, BookOpen, Radio, Users, Trophy, Building2, Landmark,
  Scale, Wheat, TreePine, Heart, MapPin, Plane, Home, UtensilsCrossed,
  Briefcase, FileText, Camera, Mail, Info, Globe, Mountain, Palmtree,
  Sparkles, RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getVisitorProfile, detectInterestsFromText, addInterest } from '@/lib/personalization'
import {
  search,
  getPopularSearches,
  getPersonalizedSuggestions,
  categoryLabels,
  categoryColors,
  SearchCategory,
  SearchItem,
  SearchResult,
  SearchFilters,
  searchIndex,
} from '@/lib/search-index'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope, BookOpen, Radio, Users, Trophy, Building2, Landmark, Scale,
  Wheat, TreePine, Heart, MapPin, Plane, Home, UtensilsCrossed, Briefcase,
  FileText, Camera, Mail, Info, Globe, Mountain, Palmtree,
}

const categories: { value: SearchCategory | ''; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'program', label: 'Programs' },
  { value: 'destination', label: 'Destinations' },
  { value: 'service', label: 'Services' },
  { value: 'faq', label: 'FAQs' },
  { value: 'page', label: 'Pages' },
]

const destinations = [
  { value: '', label: 'All Destinations' },
  { value: 'cape-coast', label: 'Cape Coast' },
  { value: 'volta-ho', label: 'Volta – HO' },
  { value: 'takoradi', label: 'Takoradi' },
  { value: 'accra', label: 'Accra' },
]

const programTypes = [
  { value: '', label: 'All Program Types' },
  { value: 'medical', label: 'Medical' },
  { value: 'teaching', label: 'Teaching' },
  { value: 'journalism', label: 'Journalism' },
  { value: 'community', label: 'Community Outreach' },
  { value: 'sports', label: 'Sports' },
  { value: 'administration', label: 'Office Administration' },
  { value: 'finance', label: 'Banking & Finance' },
  { value: 'law', label: 'Law' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'tourism', label: 'Tourism' },
  { value: 'construction', label: 'School Building' },
  { value: 'water', label: 'Bore Holes / Water' },
]

function renderIcon(iconName?: string, className?: string) {
  if (!iconName) return <Search className={className || "w-4 h-4"} />
  const Icon = iconMap[iconName]
  return Icon ? <Icon className={className || "w-4 h-4"} /> : <Search className={className || "w-4 h-4"} />
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-cornell/20 text-cornell dark:bg-cornell/30 dark:text-white rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [totalResults, setTotalResults] = useState(0)
  const [personalized, setPersonalized] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Load initial data
  useEffect(() => {
    const profile = getVisitorProfile()
    const persResults = getPersonalizedSuggestions(profile.interests)
    setPersonalized(persResults)

    try {
      const stored = localStorage.getItem('ge_recent_searches')
      if (stored) setRecentSearches(JSON.parse(stored))
    } catch {}

    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const performSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([])
      setTotalResults(0)
      return
    }

    setIsLoading(true)
    const profile = getVisitorProfile()
    const searchFilters = { ...filters, interests: profile.interests }
    const searchResults = search(q, searchFilters, 50)

    setResults(searchResults)
    setTotalResults(searchResults.length)
    setIsLoading(false)

    // Save to recent searches
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5)
    setRecentSearches(updated)
    try {
      localStorage.setItem('ge_recent_searches', JSON.stringify(updated))
    } catch {}

    // Track interests
    const detected = detectInterestsFromText(q)
    detected.forEach(i => addInterest(i))
  }, [filters, recentSearches])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => performSearch(value), 200)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters }
    if (value) {
      newFilters[key] = value as any
    } else {
      delete newFilters[key]
    }
    setFilters(newFilters)
    if (query.trim()) {
      const profile = getVisitorProfile()
      const searchFilters = { ...newFilters, interests: profile.interests }
      const searchResults = search(query, searchFilters, 50)
      setResults(searchResults)
      setTotalResults(searchResults.length)
    }
  }

  const clearFilters = () => {
    setFilters({})
    if (query.trim()) performSearch(query)
  }

  const handleSelect = (item: SearchItem) => {
    if (item.href.startsWith('#')) {
      // Navigate to homepage section
      window.location.href = '/' + item.href
    } else {
      window.location.href = item.href
    }
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="min-h-screen bg-cream dark:bg-[#0A1F12]">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-cornell to-cornell-dark text-white">
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <Search className="w-8 h-8 inline-block mr-3 -mt-1" />
              Search
            </h1>
            <p className="text-white/70 mb-8">
              Find programs, destinations, services, and answers across Global Experience
            </p>

            {/* Search Input */}
            <div className="relative">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                <Search className="w-5 h-5 text-white/50 ml-5 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="What are you looking for?"
                  className="flex-1 bg-transparent text-white placeholder:text-white/40 py-4 px-4 text-lg outline-none"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => { setQuery(''); setResults([]); setTotalResults(0) }}
                    className="p-2 mr-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Advanced Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-vogue rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                    {Object.keys(filters).length}
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear filters
                </button>
              )}
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-white/50 uppercase tracking-wider mb-1 block">Category</label>
                      <select
                        value={filters.category || ''}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/40"
                      >
                        {categories.map(c => (
                          <option key={c.value} value={c.value} className="bg-[#122A1B] text-white">
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 uppercase tracking-wider mb-1 block">Destination</label>
                      <select
                        value={filters.destination || ''}
                        onChange={(e) => handleFilterChange('destination', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/40"
                      >
                        {destinations.map(d => (
                          <option key={d.value} value={d.value} className="bg-[#122A1B] text-white">
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 uppercase tracking-wider mb-1 block">Program Type</label>
                      <select
                        value={filters.programType || ''}
                        onChange={(e) => handleFilterChange('programType', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/40"
                      >
                        {programTypes.map(p => (
                          <option key={p.value} value={p.value} className="bg-[#122A1B] text-white">
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Results Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Results Header */}
        {query && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-charcoal/60 dark:text-white/50">
              {isLoading ? 'Searching...' : (
                <>
                  <span className="font-semibold text-cornell">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
                  {hasActiveFilters && (
                    <span className="ml-2 text-vogue">
                      (filtered by {Object.keys(filters).map(k => k).join(', ')})
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
        )}

        {/* Search Results */}
        {query && results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, i) => (
              <motion.div
                key={result.item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                onClick={() => handleSelect(result.item)}
                className="group bg-white dark:bg-[#122A1B] rounded-xl border border-border hover:border-cornell/30 dark:hover:border-cornell/40 hover:shadow-lg transition-all duration-300 cursor-pointer p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cornell/10 dark:bg-cornell/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    {renderIcon(result.item.icon, 'w-6 h-6 text-cornell')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-cornell dark:text-white truncate">
                        {highlightMatch(result.item.title, query)}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${categoryColors[result.item.category]}`}>
                        {categoryLabels[result.item.category]}
                      </span>
                      {result.score > 0.7 && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-vogue/10 text-vogue rounded-full font-medium flex-shrink-0 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Best match
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-charcoal/60 dark:text-white/50 line-clamp-2 mb-2">
                      {result.item.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {result.item.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-charcoal/50 dark:text-white/40 rounded-full">
                          {tag}
                        </span>
                      ))}
                      <ArrowRight className="w-3.5 h-3.5 text-cornell/50 dark:text-white/30 ml-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {query && !isLoading && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-12 h-12 text-charcoal/20 dark:text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-charcoal dark:text-white mb-2">No results found</h3>
            <p className="text-sm text-charcoal/50 dark:text-white/40 mb-6 max-w-md mx-auto">
              We couldn&apos;t find anything matching &quot;{query}&quot;. Try adjusting your search terms or clearing filters.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="rounded-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Clear Filters
              </Button>
              <Button
                onClick={() => { setQuery(''); setResults([]); setTotalResults(0) }}
                className="bg-cornell hover:bg-cornell-dark text-white rounded-full"
              >
                New Search
              </Button>
            </div>
          </motion.div>
        )}

        {/* Default State: No query yet */}
        {!query && (
          <div>
            {/* Personalized For You */}
            {personalized.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-cornell dark:text-white mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-vogue" /> Suggested for You
                </h2>
                <p className="text-sm text-charcoal/50 dark:text-white/40 mb-4">
                  Based on your browsing interests
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {personalized.map((result, i) => (
                    <motion.div
                      key={result.item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleSelect(result.item)}
                      className="group bg-white dark:bg-[#122A1B] rounded-xl border border-border hover:border-vogue/30 dark:hover:border-vogue/40 hover:shadow-md transition-all cursor-pointer p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-vogue/10 dark:bg-vogue/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          {renderIcon(result.item.icon, 'w-5 h-5 text-vogue')}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-cornell dark:text-white truncate">
                            {result.item.title}
                          </h3>
                          <p className="text-xs text-charcoal/50 dark:text-white/40 line-clamp-2 mt-1">
                            {result.item.description}
                          </p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium mt-2 inline-block ${categoryColors[result.item.category]}`}>
                            {categoryLabels[result.item.category]}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-cornell dark:text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" /> Popular Searches
              </h2>
              <div className="flex flex-wrap gap-3">
                {getPopularSearches().map(term => (
                  <button
                    key={term}
                    onClick={() => { setQuery(term); performSearch(term) }}
                    className="px-4 py-2 bg-white dark:bg-[#122A1B] border border-border rounded-full text-sm text-charcoal dark:text-white/80 hover:border-cornell hover:text-cornell dark:hover:border-cornell dark:hover:text-white transition-all hover:shadow-md"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Browse by Category */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-cornell dark:text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" /> Browse by Category
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.filter(c => c.value).map(cat => {
                  const count = searchIndex.filter(i => i.category === cat.value).length
                  return (
                    <button
                      key={cat.value}
                      onClick={() => { setFilters({ category: cat.value as SearchCategory }); setShowFilters(true) }}
                      className="group bg-white dark:bg-[#122A1B] border border-border rounded-xl p-5 text-left hover:border-cornell/30 dark:hover:border-cornell/40 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-cornell dark:text-white">{cat.label}</h3>
                        <span className="text-xs text-charcoal/40 dark:text-white/30 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                          {count} items
                        </span>
                      </div>
                      <p className="text-xs text-charcoal/50 dark:text-white/40 mt-1">
                        Search {cat.label.toLowerCase()} across Global Experience
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-cornell dark:text-white mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5" /> Recent Searches
                </h2>
                <div className="space-y-2">
                  {recentSearches.map(term => (
                    <button
                      key={term}
                      onClick={() => { setQuery(term); performSearch(term) }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 bg-white dark:bg-[#122A1B] border border-border rounded-xl hover:border-cornell/30 dark:hover:border-cornell/40 transition-all"
                    >
                      <Search className="w-4 h-4 text-charcoal/30 dark:text-white/30" />
                      <span className="text-sm text-charcoal dark:text-white/80">{term}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-charcoal/20 dark:text-white/20 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream dark:bg-[#0A1F12] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cornell border-t-transparent rounded-full" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
