'use client'

import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Services', href: '#services' },
  { label: 'Our Team', href: '#team' },
  { label: 'Volunteers', href: '#volunteer' },
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
]

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
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
    <footer className="bg-gradient-to-br from-[#2D1B1B] via-[#3A2222] to-[#2D1B1B] text-white/90">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.jpg"
                alt="Global Experience Placements Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-lg text-white">Global Experience</h3>
                <p className="text-[10px] uppercase tracking-wider text-copper">Aligning Skills with Corporate Goals</p>
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
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-mahogany flex items-center justify-center transition-colors"
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
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                    className="text-sm text-white/60 hover:text-copper transition-colors"
                  >
                    {link.label}
                  </a>
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
                    className="text-sm text-white/60 hover:text-copper transition-colors"
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
                <MapPin className="w-4 h-4 mt-0.5 text-copper flex-shrink-0" />
                <span className="text-sm text-white/60">123 Volunteer Lane, Accra, Ghana, West Africa</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-copper flex-shrink-0" />
                <a href="tel:+233123456789" className="text-sm text-white/60 hover:text-copper transition-colors">+233 123 456 789</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-copper flex-shrink-0" />
                <a href="mailto:info@globalvolunteer.org" className="text-sm text-white/60 hover:text-copper transition-colors">info@globalvolunteer.org</a>
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
                <Button size="sm" className="bg-mahogany hover:bg-mahogany-dark text-white rounded-full px-4">
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
          <div className="flex gap-4 text-xs text-white/40">
            <a href="#" className="hover:text-copper transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-copper transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-copper transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
