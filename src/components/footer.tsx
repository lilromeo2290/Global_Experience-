'use client'

import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Mission and Vision', href: '#mission-vision' },
  { label: 'Our Team', href: '#team' },
  { label: 'Our Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact Us', href: '#contact' },
]

const programs = [
  'Medical Placement in Teaching Hospitals',
  'Teaching',
  'Journalism',
  'Community Outreach',
  'Sports',
  'Office Administration',
  'Banking and Finance',
  'Law Placements',
  'Agriculture Placement',
  'Tourism and Ecotourism',
  'Community Projects — Building of Schools',
  'Bore Holes — Drinkable Water',
  'Gap Year',
]

const socials = [
  { icon: Facebook, href: 'https://web.facebook.com/profile.php?id=61590352813546', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export default function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href)
    if (el) {
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-gradient-to-br from-vogue-dark via-vogue to-vogue-dark text-white/90">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Global Experience Placements Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-lg text-white">Global Experience</h3>
                <p className="text-[10px] uppercase tracking-wider text-vogue-light">Aligning Skills with Corporate Goals</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Empowering communities through global volunteerism and professional placements. We connect passionate individuals with transformative opportunities across the world.
            </p>
            <div className="flex gap-3 pt-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-cornell-light flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('/') ? (
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-vogue transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                      className="text-sm text-white/60 hover:text-vogue transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Placement Programs */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Placement Programs</h4>
            <ul className="space-y-2">
              {programs.map((prog) => (
                <li key={prog}>
                  <a
                    href="/placements"
                    className="text-sm text-white/60 hover:text-vogue transition-colors"
                  >
                    {prog}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-vogue flex-shrink-0" />
                <span className="text-sm text-white/60">PMB Ho, Volta Region, Ghana, West Africa</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-vogue flex-shrink-0" />
                <a href="tel:+233544129556" className="text-sm text-white/60 hover:text-vogue transition-colors">+233 544 129 556</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-vogue flex-shrink-0" />
                <a href="mailto:info@globalexperiencegh.org" className="text-sm text-white/60 hover:text-vogue transition-colors">info@globalexperiencegh.org</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-vogue flex-shrink-0" />
                <a href="mailto:globalexperiencegh@gmail.com" className="text-sm text-white/60 hover:text-vogue transition-colors">globalexperiencegh@gmail.com</a>
              </li>
            </ul>

            {/* Newsletter mini */}
            <div className="mt-6">
              <p className="text-sm text-white/60 mb-2">Stay updated</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm rounded-full"
                />
                <Button size="sm" className="bg-cornell hover:bg-cornell-dark text-white rounded-full px-4">
                  Join
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Global Experience Placements. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Designed and Powered by <a href="https://clipe233eng.net/" target="_blank" rel="noopener noreferrer" className="hover:text-vogue transition-colors">Clipe233 Engineers</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
