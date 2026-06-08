'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  ArrowRight,
  Stethoscope,
  BookOpen,
  Radio,
  Users,
  Trophy,
  Building2,
  Landmark,
  Scale,
  Wheat,
  TreePine,
  Heart,
  MapPin,
  Plane,
  Home,
  UtensilsCrossed,
  Briefcase,
  FileText,
  Camera,
  Mail,
  Info,
  Globe,
  Mountain,
  Palmtree,
  Clock,
  TrendingUp,
  Sparkles,
  Command,
} from 'lucide-react'
import { getVisitorProfile, detectInterestsFromText, addInterest, addSearchQuery } from '@/lib/personalization'
import {
  searchIndex,
  search,
  getSuggestions,
  getPopularSearches,
  getPersonalizedSuggestions,
  categoryLabels,
  categoryColors,
  SearchItem,
  SearchResult,
  SearchCategory,
} from '@/lib/search-index'

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope, BookOpen, Radio, Users, Trophy, Building2, Landmark, Scale,
  Wheat, TreePine, Heart, MapPin, Plane, Home, UtensilsCrossed, Briefcase,
  FileText, Camera, Mail, Info, Globe, Mountain, Palmtree,
}

interface PredictiveSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PredictiveSearch({ open, onOpenChange }: PredictiveSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [popularSearches] = useState<string[]>(getPopularSearches)
  const [personalized, setPersonalized] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [mode, setMode] = useState<'idle' | 'typing' | 'results'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Load recent searches and personalized suggestions on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Load recent searches from localStorage
    try {
      const stored = localStorage.getItem('ge_recent_searches')
      if (stored) setRecentSearches(JSON.parse(stored))
    } catch {}

    // Load personalized suggestions
    const profile = getVisitorProfile()
    const persResults = getPersonalizedSuggestions(profile.interests)
    setPersonalized(persResults)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
      setSelectedIndex(-1)
      setMode('idle')
    }
  }, [open])

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  // Debounced search
  const performSearch = useCallback((q: string) => {
    if (!q.trim() || q.length < 2) {
      setResults([])
      setMode('idle')
      return
    }

    const profile = getVisitorProfile()
    const results = search(q, { interests: profile.interests }, 12)
    setResults(results)
    setMode('results')

    // Track interests from search query
    const detected = detectInterestsFromText(q)
    if (detected.length > 0) {
      detected.forEach((i: string) => addInterest(i))
    }
    // Track search query in profile
    addSearchQuery(q)
  }, [])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setSelectedIndex(-1)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!value.trim()) {
      setResults([])
      setMode('idle')
      return
    }

    setMode('typing')
    debounceRef.current = setTimeout(() => performSearch(value), 150)
  }

  const saveRecentSearch = (q: string) => {
    if (!q.trim()) return
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5)
    setRecentSearches(updated)
    try {
      localStorage.setItem('ge_recent_searches', JSON.stringify(updated))
    } catch {}
  }

  const handleSelect = (item: SearchItem) => {
    saveRecentSearch(query || item.title)
    onOpenChange(false)

    // Navigate
    if (item.href.startsWith('#')) {
      const el = document.querySelector(item.href)
      if (el) {
        const offset = 80
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    } else {
      window.location.href = item.href
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = results.length || popularSearches.length || personalized.length

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, totalItems - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      if (mode === 'results' && results[selectedIndex]) {
        handleSelect(results[selectedIndex].item)
      } else if (mode === 'idle') {
        if (selectedIndex < popularSearches.length) {
          setQuery(popularSearches[selectedIndex])
          performSearch(popularSearches[selectedIndex])
        }
      }
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-search-item]')
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  const renderIcon = (iconName?: string, className?: string) => {
    if (!iconName) return <Search className={className || "w-4 h-4"} />
    const Icon = iconMap[iconName]
    return Icon ? <Icon className={className || "w-4 h-4"} /> : <Search className={className || "w-4 h-4"} />
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={() => onOpenChange(false)}
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[90vw] max-w-2xl z-[101]"
          >
            <div className="bg-white dark:bg-[#122A1B] rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <Search className="w-5 h-5 text-vogue flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search programs, destinations, services, FAQs..."
                  className="flex-1 bg-transparent text-charcoal dark:text-white text-base outline-none placeholder:text-charcoal/40 dark:placeholder:text-white/40"
                />
                {query && (
                  <button
                    onClick={() => { setQuery(''); setResults([]); setMode('idle'); inputRef.current?.focus() }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4 text-charcoal/50 dark:text-white/50" />
                  </button>
                )}
                <div className="flex items-center gap-1 ml-2">
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 dark:bg-white/10 text-charcoal/50 dark:text-white/50 rounded border border-border">
                    <Command className="w-2.5 h-2.5" />K
                  </kbd>
                </div>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
                {mode === 'results' && results.length > 0 && (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-charcoal/50 dark:text-white/40 uppercase tracking-wider flex items-center gap-2">
                      <Search className="w-3 h-3" />
                      {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                    </div>
                    {results.map((result, i) => (
                      <button
                        key={result.item.id}
                        data-search-item
                        onClick={() => handleSelect(result.item)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                          i === selectedIndex
                            ? 'bg-cornell/10 dark:bg-cornell/20'
                            : 'hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="mt-0.5 w-8 h-8 rounded-lg bg-cornell/10 dark:bg-cornell/20 flex items-center justify-center flex-shrink-0">
                          {renderIcon(result.item.icon, 'w-4 h-4 text-cornell')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-charcoal dark:text-white truncate">
                              {highlightMatch(result.item.title, query)}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${categoryColors[result.item.category]}`}>
                              {categoryLabels[result.item.category]}
                            </span>
                          </div>
                          <p className="text-xs text-charcoal/60 dark:text-white/50 line-clamp-1 mt-0.5">
                            {result.item.description}
                          </p>
                          {result.item.tags.length > 0 && (
                            <div className="flex items-center gap-1 mt-1 flex-wrap">
                              {result.item.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 text-charcoal/50 dark:text-white/40 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-charcoal/30 dark:text-white/30 mt-2 flex-shrink-0" />
                      </button>
                    ))}

                    {/* Advanced Search Link */}
                    <div className="px-4 py-3 border-t border-border mt-2">
                      <a
                        href={`/search?q=${encodeURIComponent(query)}`}
                        className="flex items-center gap-2 text-sm text-vogue hover:text-cornell transition-colors font-medium"
                      >
                        <Search className="w-3.5 h-3.5" />
                        Advanced search for &quot;{query}&quot;
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {mode === 'results' && results.length === 0 && (
                  <div className="py-12 text-center">
                    <Search className="w-8 h-8 text-charcoal/20 dark:text-white/20 mx-auto mb-3" />
                    <p className="text-sm text-charcoal/60 dark:text-white/50 mb-1">No results found for &quot;{query}&quot;</p>
                    <p className="text-xs text-charcoal/40 dark:text-white/30">Try searching for programs, destinations, or services</p>
                    <a
                      href={`/search?q=${encodeURIComponent(query)}`}
                      className="inline-flex items-center gap-1 mt-3 text-sm text-vogue hover:text-cornell transition-colors font-medium"
                    >
                      Try advanced search <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {mode === 'typing' && (
                  <div className="py-8 text-center">
                    <div className="inline-flex items-center gap-2 text-charcoal/40 dark:text-white/30">
                      <div className="w-1.5 h-1.5 bg-vogue rounded-full animate-pulse" />
                      <span className="text-sm">Searching...</span>
                    </div>
                  </div>
                )}

                {mode === 'idle' && (
                  <div className="py-2">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-2 text-xs font-semibold text-charcoal/50 dark:text-white/40 uppercase tracking-wider flex items-center gap-2">
                          <Clock className="w-3 h-3" /> Recent
                        </div>
                        {recentSearches.map((term, i) => (
                          <button
                            key={term}
                            data-search-item
                            onClick={() => { setQuery(term); performSearch(term) }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              i === selectedIndex
                                ? 'bg-cornell/10 dark:bg-cornell/20'
                                : 'hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5 text-charcoal/30 dark:text-white/30" />
                            <span className="text-sm text-charcoal dark:text-white/80">{term}</span>
                            <ArrowRight className="w-3 h-3 text-charcoal/20 dark:text-white/20 ml-auto" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Personalized Suggestions */}
                    {personalized.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-2 text-xs font-semibold text-charcoal/50 dark:text-white/40 uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="w-3 h-3" /> Suggested for You
                        </div>
                        {personalized.map((result, i) => (
                          <button
                            key={result.item.id}
                            data-search-item
                            onClick={() => handleSelect(result.item)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              (i + (recentSearches.length)) === selectedIndex
                                ? 'bg-cornell/10 dark:bg-cornell/20'
                                : 'hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                          >
                            <div className="w-7 h-7 rounded-md bg-vogue/10 dark:bg-vogue/20 flex items-center justify-center flex-shrink-0">
                              {renderIcon(result.item.icon, 'w-3.5 h-3.5 text-vogue')}
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm text-charcoal dark:text-white/80 truncate block">{result.item.title}</span>
                            </div>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ml-auto flex-shrink-0 ${categoryColors[result.item.category]}`}>
                              {categoryLabels[result.item.category]}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Popular Searches */}
                    <div className="mb-2">
                      <div className="px-4 py-2 text-xs font-semibold text-charcoal/50 dark:text-white/40 uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" /> Popular
                      </div>
                      <div className="px-4 pb-2 flex flex-wrap gap-2">
                        {popularSearches.map((term, i) => (
                          <button
                            key={term}
                            onClick={() => { setQuery(term); performSearch(term) }}
                            className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-white/10 text-charcoal/70 dark:text-white/60 rounded-full hover:bg-cornell/10 hover:text-cornell dark:hover:bg-cornell/20 dark:hover:text-white transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="border-t border-border">
                      <div className="px-4 py-2 text-xs font-semibold text-charcoal/50 dark:text-white/40 uppercase tracking-wider">
                        Quick Links
                      </div>
                      <div className="grid grid-cols-2 gap-1 px-3 pb-3">
                        {[
                          { label: 'All Programs', href: '#programs', icon: Briefcase },
                          { label: 'Destinations', href: '#destinations', icon: MapPin },
                          { label: 'Apply Now', href: '#volunteer', icon: FileText },
                          { label: 'Donate', href: '#donate', icon: Heart },
                        ].map(link => (
                          <a
                            key={link.label}
                            href={link.href}
                            onClick={(e) => {
                              e.preventDefault()
                              onOpenChange(false)
                              if (link.href.startsWith('#')) {
                                const el = document.querySelector(link.href)
                                if (el) {
                                  const top = el.getBoundingClientRect().top + window.scrollY - 80
                                  window.scrollTo({ top, behavior: 'smooth' })
                                }
                              }
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-charcoal/70 dark:text-white/60 hover:bg-cornell/10 hover:text-cornell dark:hover:bg-cornell/20 dark:hover:text-white transition-colors"
                          >
                            <link.icon className="w-3.5 h-3.5" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border bg-gray-50 dark:bg-[#0A1F12] flex items-center justify-between text-[10px] text-charcoal/40 dark:text-white/30">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-white/10 rounded text-[9px]">↑↓</kbd> Navigate</span>
                  <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-white/10 rounded text-[9px]">↵</kbd> Select</span>
                  <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-white/10 rounded text-[9px]">esc</kbd> Close</span>
                </div>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-vogue" />
                  Personalized search
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Highlight matching text in search results
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
