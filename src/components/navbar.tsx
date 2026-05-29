'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu, Heart, Phone, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Programs', href: '#programs' },
  { label: 'Volunteer', href: '#volunteer' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Donate', href: '#donate' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = navLinks.map(l => l.href.replace('#', ''))
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

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-transparent'
      }`}
    >
      {/* Top bar */}
      <div className={`transition-all duration-300 overflow-hidden ${scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'}`}>
        <div className="bg-mahogany text-white text-xs">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-9">
            <div className="flex items-center gap-4">
              <a href="mailto:info@globalvolunteer.org" className="hover:text-copper-light transition-colors">info@globalvolunteer.org</a>
              <a href="tel:+233123456789" className="flex items-center gap-1 hover:text-copper-light transition-colors">
                <Phone className="w-3 h-3" /> +233 123 456 789
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a href="#donate" onClick={(e) => { e.preventDefault(); handleNavClick('#donate') }} className="flex items-center gap-1 hover:text-copper-light transition-colors">
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
              src="/images/logo.jpg"
              alt="Global Experience Placements Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-tight transition-colors ${scrolled ? 'text-mahogany' : 'text-white'}`}>
                Global Experience
              </span>
              <span className={`text-[10px] uppercase tracking-wider transition-colors ${scrolled ? 'text-dove' : 'text-white/70'}`}>
                Placements & Support
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeSection === link.href.replace('#', '')
                    ? scrolled
                      ? 'text-mahogany bg-mahogany/10'
                      : 'text-white bg-white/20'
                    : scrolled
                      ? 'text-dove hover:text-mahogany hover:bg-mahogany/5'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleNavClick('#contact')}
              className="hidden sm:flex bg-mahogany hover:bg-mahogany-dark text-white rounded-full px-5"
            >
              Apply Now
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className={scrolled ? 'text-mahogany' : 'text-white'}>
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/logo.jpg"
                        alt="Global Experience Placements Logo"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-bold text-mahogany">Global Experience</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto py-4">
                    {navLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                        className={`block px-6 py-3 text-base font-medium transition-colors ${
                          activeSection === link.href.replace('#', '')
                            ? 'text-mahogany bg-mahogany/10 border-r-4 border-mahogany'
                            : 'text-dove hover:text-mahogany hover:bg-mahogany/5'
                        }`}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                  <div className="p-4 border-t">
                    <Button
                      onClick={() => handleNavClick('#contact')}
                      className="w-full bg-mahogany hover:bg-mahogany-dark text-white rounded-full"
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
