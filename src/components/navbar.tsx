'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu, Heart, Phone, ChevronDown, ChevronRight, X, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/theme-provider'

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
  { label: 'Home', href: '#home', key: 'home' },
  {
    label: 'About Us',
    href: '#about',
    key: 'about',
    subLinks: [
      { label: 'Mission and Vision', href: '#mission-vision' },
      { label: 'Our Team', href: '#team' },
    ],
  },
  {
    label: 'Destinations',
    href: '#destinations',
    key: 'destinations',
    subLinks: [
      { label: 'Ghana', href: '#destinations' },
    ],
  },
  {
    label: 'Services',
    href: '#services',
    key: 'services',
    subLinks: [
      { label: 'Airport Pickups', href: '#airport-pickups' },
      { label: 'Local Orientations', href: '#local-orientations' },
      { label: 'Placement Organisation', href: '/placements' },
      { label: 'Accommodation', href: '#accommodation' },
      { label: 'Feeding', href: '#feeding' },
    ],
  },
  { label: 'Gallery', href: '#gallery', key: 'gallery' },
  { label: 'Contact Us', href: '#contact', key: 'contact' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)
  const [applyOpen, setApplyOpen] = useState(false)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const applyRef = useRef<HTMLDivElement | null>(null)
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const anyOpen = Object.values(dropdownRefs.current).some(
        ref => ref && ref.contains(e.target as Node)
      )
      if (!anyOpen) {
        setOpenDropdown(null)
      }
      // Close apply dropdown when clicking outside
      if (applyRef.current && !applyRef.current.contains(e.target as Node)) {
        setApplyOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    setOpenDropdown(null)
    setMobileOpenDropdown(null)

    if (href.startsWith('/')) {
      return
    }

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
              <a href="tel:+233244207278" className="flex items-center gap-1 hover:text-vogue-light transition-colors">
                <Phone className="w-3 h-3" /> +233 244 207 278
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a href="#donate" onClick={(e) => { e.preventDefault(); handleNavClick('#donate') }} className="flex items-center gap-1 hover:text-vogue-light transition-colors">
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
          <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('#home') }} className="flex items-center gap-2">
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
          </a>

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
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                        activeSection === link.href.replace('#', '') || isDropdownActive(link)
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
                    </a>

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
                            return isExternalPage ? (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal dark:text-white/80 hover:text-cornell dark:hover:text-white hover:bg-cornell/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                              >
                                <ChevronRight className="w-3.5 h-3.5 text-vogue" />
                                {sub.label}
                              </Link>
                            ) : (
                              <a
                                key={sub.label}
                                href={sub.href}
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleNavClick(sub.href)
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

              // Regular menu item
              return (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
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
                </a>
              )
            })}
          </div>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle - Desktop */}
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

            {/* Apply Now - Desktop */}
            <div className="hidden sm:flex items-center">
              <Button
                onClick={() => { setApplyOpen(false); handleNavClick('#volunteer') }}
                className="bg-cornell hover:bg-cornell-dark text-white rounded-full px-5"
              >
                Apply Now
              </Button>
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
                                  return isExternalPage ? (
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
                                  ) : (
                                    <a
                                      key={sub.label}
                                      href={sub.href}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleNavClick(sub.href)
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
                        <a
                          key={link.key}
                          href={link.href}
                          onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                          className={`block px-6 py-3 text-base font-medium transition-colors ${
                            activeSection === link.href.replace('#', '')
                              ? 'text-cornell bg-cornell/10 border-r-4 border-cornell'
                              : 'text-charcoal hover:text-cornell hover:bg-cornell/5'
                          }`}
                        >
                          {link.label}
                        </a>
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
                    <Button
                      onClick={() => { setMobileOpen(false); setMobileOpenDropdown(null); handleNavClick('#volunteer') }}
                      className="w-full bg-cornell hover:bg-cornell-dark text-white rounded-full"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
