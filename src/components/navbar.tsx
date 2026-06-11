'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu, Heart, Phone, ChevronDown, ChevronRight, Sun, Moon, Search, Command } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/theme-provider'
import DonationModal from '@/components/DonationModal'
import PredictiveSearch from '@/components/PredictiveSearch'

interface SubLink {
  label: string
  href: string
}

interface NavLink {
  label: string
  href: string
  key: string
  subLinks?: SubLink[]
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/', key: 'home' },
  {
    label: 'About Us',
    href: '/about',
    key: 'about',
    subLinks: [
      { label: 'Mission and Vision', href: '/about#mission-vision' },
      { label: 'Our Team', href: '/about#team' },
    ],
  },
  {
    label: 'Destinations',
    href: '/destinations',
    key: 'destinations',
    subLinks: [
      { label: 'Cape Coast', href: '/destinations#cape-coast' },
      { label: 'Volta \u2013 HO', href: '/destinations#volta-ho' },
      { label: 'Takoradi', href: '/destinations#takoradi' },
      { label: 'Accra', href: '/destinations#accra' },
    ],
  },
  { label: 'Pricing', href: '/pricing', key: 'pricing' },
  { label: 'Gallery', href: '/gallery', key: 'gallery' },
  { label: 'Donation', href: '/#donate', key: 'donation' },
  { label: 'Contact Us', href: '/contact', key: 'contact' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)
  const [donateOpen, setDonateOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = navLinks
        .filter(l => !l.subLinks)
        .map(l => l.href.replace('#', ''))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a[href^="#"]') || target.closest('button')) {
        return
      }
      const anyOpen = Object.values(dropdownRefs.current).some(
        ref => ref && ref.contains(e.target as Node)
      )
      if (!anyOpen) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    setMobileOpenDropdown(null)
    setOpenDropdown(null)

    if (href.startsWith('/')) {
      // Page routes are handled by Next.js Link navigation
      return
    }

    // Hash-only anchors scroll on the current page
    const el = document.querySelector(href)
    if (el) {
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
    setOpenDropdown(key)
  }

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }

  const isDropdownActive = (link: NavLink) => {
    return openDropdown === link.key
  }

  const handleSubLinkClick = (link: NavLink, sub: SubLink) => {
    setOpenDropdown(null)
    setMobileOpen(false)
    setMobileOpenDropdown(null)

    if (link.key === 'destinations') {
      // Destination sublinks navigate to Apply page with branch pre-selected
      const slugMap: Record<string, string> = {
        'cape-coast': 'Cape Coast',
        'volta-ho': 'Ho',
        'takoradi': 'Takoradi',
        'accra': 'Accra',
      }
      const slug = sub.href.includes('#') ? sub.href.split('#').pop()! : sub.href.replace('#', '')
      const branch = slugMap[slug] || slug
      window.location.href = `/apply?branch=${encodeURIComponent(branch)}`
      return
    }
    // About sublinks (and other page-route sublinks) navigate normally via Next.js Link
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#0A1F12]/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-transparent'
      }`}
    >
      {/* Top bar */}
      <div className={`transition-all duration-300 overflow-hidden ${scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'}`}>
        <div className="bg-cornell text-white text-xs">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-9">
            <div className="flex items-center gap-4">
              <a href="mailto:info@globalexperiencegh.org" className="hover:text-vogue-light transition-colors">info@globalexperiencegh.org</a>
              <a href="mailto:globalexperiencegh@gmail.com" className="hover:text-vogue-light transition-colors">globalexperiencegh@gmail.com</a>
              <a href="tel:+233544129556" className="flex items-center gap-1 hover:text-vogue-light transition-colors">
                <Phone className="w-3 h-3" /> +233 544 129 556
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a href="#" onClick={(e) => { e.preventDefault(); setDonateOpen(true) }} className="flex items-center gap-1 hover:text-vogue-light transition-colors">
                <Heart className="w-3 h-3" /> Donate Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Global Experience Placements Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-tight transition-colors ${scrolled ? 'text-cornell dark:text-white' : 'text-white'}`}>
                Global Experience
              </span>
              <span className={`text-[10px] uppercase tracking-wider transition-colors ${scrolled ? 'text-charcoal dark:text-white/70' : 'text-white/70'}`}>
                Aligning Skills with Corporate Goals
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.subLinks) {
                return (
                  <div
                    key={link.key}
                    ref={el => { dropdownRefs.current[link.key] = el }}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(link.key)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={link.href}
                      onClick={() => { handleNavClick(link.href) }}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                        isDropdownActive(link)
                          ? scrolled
                            ? 'text-cornell dark:text-white bg-cornell/10 dark:bg-white/20'
                            : 'text-white bg-white/20'
                          : scrolled
                            ? 'text-charcoal dark:text-white/80 hover:text-cornell dark:hover:text-white hover:bg-cornell/5 dark:hover:bg-white/10'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownActive(link) ? 'rotate-180' : ''}`} />
                    </Link>

                    {/* Dropdown */}
                    {isDropdownActive(link) && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#122A1B] rounded-xl shadow-xl border border-border overflow-hidden z-50"
                      >
                        <div className="py-2">
                          {link.subLinks.map((sub) => {
                            const isExternalPage = sub.href.startsWith('/')
                            if (isExternalPage) {
                              return (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  onClick={() => setOpenDropdown(null)}
                                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal dark:text-white/80 hover:text-cornell dark:hover:text-white hover:bg-cornell/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                  <ChevronRight className="w-3.5 h-3.5 text-vogue" />
                                  {sub.label}
                                </Link>
                              )
                            }
                            return (
                              <a
                                key={sub.label}
                                href={sub.href}
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleSubLinkClick(link, sub)
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal dark:text-white/80 hover:text-cornell dark:hover:text-white hover:bg-cornell/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                              >
                                <ChevronRight className="w-3.5 h-3.5 text-vogue" />
                                {sub.label}
                              </a>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeSection === link.href.replace('#', '')
                      ? scrolled
                        ? 'text-cornell dark:text-white bg-cornell/10 dark:bg-white/20'
                        : 'text-white bg-white/20'
                      : scrolled
                        ? 'text-charcoal dark:text-white/80 hover:text-cornell dark:hover:text-white hover:bg-cornell/5 dark:hover:bg-white/10'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`hidden sm:flex items-center gap-2 h-9 px-3 rounded-full border transition-all duration-200 cursor-pointer ${
                scrolled
                  ? 'border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 hover:border-cornell/30 dark:hover:border-cornell/40'
                  : 'border-white/20 bg-white/10 hover:bg-white/20'
              }`}
              aria-label="Search"
            >
              <Search className={`w-4 h-4 ${scrolled ? 'text-charcoal/50 dark:text-white/50' : 'text-white/70'}`} />
              <span className={`text-xs ${scrolled ? 'text-charcoal/40 dark:text-white/40' : 'text-white/50'}`}>Search...</span>
              <kbd className={`hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono rounded border ${
                scrolled
                  ? 'bg-white border-gray-200 text-charcoal/30 dark:bg-white/10 dark:border-white/10 dark:text-white/30'
                  : 'bg-white/10 border-white/20 text-white/40'
              }`}>
                <Command className="w-2 h-2" />K
              </kbd>
            </button>

            <button
              onClick={toggleTheme}
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className={`w-5 h-5 ${scrolled ? 'text-white' : 'text-white'}`} />
              ) : (
                <Moon className={`w-5 h-5 ${scrolled ? 'text-cornell' : 'text-white'}`} />
              )}
            </button>

            <div className="hidden sm:flex items-center">
              <Link href="/apply">
                <Button
                  className="bg-cornell hover:bg-cornell-dark text-white rounded-full px-5"
                >
                  Apply Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className={`${scrolled ? 'text-cornell dark:text-white' : 'text-white'}`}>
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white dark:bg-[#0A1F12] p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/logo.png"
                        alt="Global Experience Placements Logo"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-bold text-cornell">Global Experience</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto py-4">
                    {/* Mobile Search Button */}
                    <div className="px-4 mb-3">
                      <button
                        onClick={() => { setMobileOpen(false); setSearchOpen(true) }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border dark:border-white/20 bg-gray-50 dark:bg-white/5 text-charcoal/50 dark:text-white/50 text-sm hover:border-cornell/30 dark:hover:border-cornell/40 transition-colors"
                      >
                        <Search className="w-4 h-4" />
                        Search programs, destinations...
                      </button>
                    </div>

                    {navLinks.map((link) => {
                      if (link.subLinks) {
                        const isOpen = mobileOpenDropdown === link.key
                        return (
                          <div key={link.key}>
                            <button
                              onClick={() => setMobileOpenDropdown(isOpen ? null : link.key)}
                              className={`w-full flex items-center justify-between px-6 py-3 text-base font-medium transition-colors ${
                                activeSection === link.href.replace('#', '')
                                  ? 'text-cornell bg-cornell/10'
                                  : 'text-charcoal hover:text-cornell hover:bg-cornell/5'
                              }`}
                            >
                              <span>{link.label}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="bg-cream/60"
                              >
                                {link.subLinks.map((sub) => {
                                  const isExternalPage = sub.href.startsWith('/')
                                  if (isExternalPage) {
                                    return (
                                      <Link
                                        key={sub.label}
                                        href={sub.href}
                                        onClick={() => {
                                          setMobileOpen(false)
                                          setMobileOpenDropdown(null)
                                        }}
                                        className="flex items-center gap-2 pl-10 pr-6 py-2.5 text-sm text-charcoal hover:text-cornell hover:bg-cornell/5 transition-colors"
                                      >
                                        <ChevronRight className="w-3.5 h-3.5 text-vogue" />
                                        {sub.label}
                                      </Link>
                                    )
                                  }
                                  return (
                                    <a
                                      key={sub.label}
                                      href={sub.href}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleSubLinkClick(link, sub)
                                      }}
                                      className="flex items-center gap-2 pl-10 pr-6 py-2.5 text-sm text-charcoal hover:text-cornell hover:bg-cornell/5 transition-colors"
                                    >
                                      <ChevronRight className="w-3.5 h-3.5 text-vogue" />
                                      {sub.label}
                                    </a>
                                  )
                                })}
                              </motion.div>
                            )}
                          </div>
                        )
                      }

                      return (
                        <Link
                          key={link.key}
                          href={link.href}
                          onClick={() => handleNavClick(link.href)}
                          className={`block px-6 py-3 text-base font-medium transition-colors ${
                            activeSection === link.href.replace('#', '')
                              ? 'text-cornell bg-cornell/10 border-r-4 border-cornell'
                              : 'text-charcoal hover:text-cornell hover:bg-cornell/5'
                          }`}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                  <div className="p-4 border-t">
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-center gap-2 py-2.5 mb-3 rounded-full border border-border dark:border-white/20 text-sm font-medium text-charcoal dark:text-white/80 hover:bg-cornell/5 dark:hover:bg-white/10 transition-colors"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <Link href="/apply" className="block">
                      <Button
                        className="w-full bg-cornell hover:bg-cornell-dark text-white rounded-full"
                      >
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal open={donateOpen} onClose={() => setDonateOpen(false)} />

      {/* Predictive Search */}
      <PredictiveSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </motion.nav>
  )
}
