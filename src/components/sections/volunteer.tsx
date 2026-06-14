'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Shield, Home, Heart, Users, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'

const opportunities = [
  { title: 'Medical Placement in Teaching Hospitals', sector: 'Healthcare' },
  { title: 'Teaching', sector: 'Education' },
  { title: 'Journalism', sector: 'Media' },
  { title: 'Community Outreach', sector: 'Development' },
  { title: 'Sports', sector: 'Sports' },
  { title: 'Office Administration', sector: 'Business' },
  { title: 'Banking and Finance', sector: 'Finance' },
  { title: 'Law Placements', sector: 'Law' },
  { title: 'Agriculture Placement', sector: 'Agriculture' },
  { title: 'Tourism and Ecotourism', sector: 'Tourism' },
  { title: 'Community Projects — Building of Schools', sector: 'Development' },
  { title: 'Bore Holes — Drinkable Water', sector: 'Infrastructure' },
  { title: 'Gap Year', sector: 'Gap Year' },
]

const benefits = [
  'Gain invaluable international work experience',
  'Develop cross-cultural communication skills',
  'Build a global professional network',
  'Enhance your CV with unique experiences',
  'Make lasting positive community impact',
  'Experience personal growth and self-discovery',
  'Receive professional mentorship and support',
  'Earn recognition certificates and references',
]

const safetyFeatures = [
  { icon: Shield, title: '24/7 Emergency Support', desc: 'Our team is available around the clock for any emergency situation.' },
  { icon: Home, title: 'Vetted Accommodation', desc: 'All housing is personally inspected and meets our safety standards.' },
  { icon: Users, title: 'Local Coordinator', desc: 'Dedicated on-ground coordinator to assist you throughout your stay.' },
  { icon: CheckCircle2, title: 'Travel Insurance', desc: 'Comprehensive travel and medical insurance included in all programs.' },
]

export default function VolunteerSection() {
  const [highlightedOpp, setHighlightedOpp] = useState<string | null>(null)

  // Listen for the destination-apply custom event
  useEffect(() => {
    const handleDestinationApply = (e: Event) => {
      const customEvent = e as CustomEvent<{ program: string }>
      const program = customEvent.detail.program
      // Find the matching opportunity and highlight it
      const match = opportunities.find(o => o.title === program)
      if (match) {
        // Highlight the card briefly
        setHighlightedOpp(match.title)
        // Remove highlight after 2 seconds
        setTimeout(() => {
          setHighlightedOpp(null)
        }, 2500)
      }
    }
    window.addEventListener('destination-apply', handleDestinationApply)
    return () => window.removeEventListener('destination-apply', handleDestinationApply)
  }, [])

  const handleOppClick = (opp: { title: string }) => {
    // Navigate to the apply page with the selected program
    const params = new URLSearchParams({ program: opp.title })
    window.location.href = `/apply?${params.toString()}`
  }

  return (
    <section id="volunteer" className="py-20 bg-white dark:bg-[#0A1F12]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Volunteer With Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-cornell mt-2 mb-4">
            Your Journey to Making a Difference Starts Here
          </h2>
          <p className="text-charcoal max-w-2xl mx-auto leading-relaxed">
            Volunteering abroad is more than giving back — it is about growing as a person, gaining new
            perspectives, and building bridges between cultures. Join our community of change-makers.
          </p>
        </motion.div>

        {/* Opportunities Grid */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-cornell mb-6">Current Opportunities</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map((opp, i) => (
              <motion.div
                key={opp.title}
                id={`opp-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                onClick={() => handleOppClick(opp)}
                className={`bg-cream dark:bg-[#122A1B] rounded-xl p-5 border transition-all group cursor-pointer ${
                  highlightedOpp === opp.title
                    ? 'border-cornell shadow-lg ring-2 ring-cornell/30 scale-[1.02]'
                    : 'border-border dark:border-white/10 hover:border-vogue/30 hover:shadow-md'
                }`}
              >
                <span className="text-xs bg-cornell/10 text-cornell font-medium px-2 py-0.5 rounded-full">{opp.sector}</span>
                <h4 className="font-semibold text-cornell mt-2 group-hover:text-vogue transition-colors">{opp.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits & Safety */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-cream rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-cornell mb-4">Benefits of Volunteering</h3>
            <div className="grid gap-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-vogue mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-charcoal dark:text-white/80">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Safety */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-cream rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-cornell mb-4">Your Safety Matters</h3>
            <p className="text-sm text-charcoal mb-5 leading-relaxed">
              We take your safety seriously. Our comprehensive safety protocols and support systems
              ensure you can focus on making impact while we handle the rest.
            </p>
            <div className="grid gap-4">
              {safetyFeatures.map((feat) => (
                <div key={feat.title} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-border">
                  <div className="w-10 h-10 bg-cornell/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feat.icon className="w-5 h-5 text-cornell" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-cornell text-sm">{feat.title}</h4>
                    <p className="text-xs text-charcoal dark:text-white/80">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Cultural Immersion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 relative rounded-2xl overflow-hidden"
        >
          <img
            src="/images/volunteer-group.jpg"
            alt="Volunteers experiencing cultural immersion"
            className="w-full h-72 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cornell/90 via-cornell/60 to-transparent" />
          <div className="absolute inset-0 flex items-center p-8 md:p-12">
            <div className="max-w-lg text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Cultural Immersion Experiences</h3>
              <p className="text-white/80 mb-5 leading-relaxed">
                Beyond your placement, immerse yourself in rich local cultures through traditional ceremonies,
                local cuisine workshops, language lessons, community celebrations, and weekend excursions to
                breathtaking landmarks. Our programs are designed to create deep, authentic connections.
              </p>
              <Button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-cornell hover:bg-white/90 rounded-full"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
