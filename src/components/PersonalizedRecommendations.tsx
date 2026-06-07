'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Stethoscope, GraduationCap, Briefcase, MapPin, Plane, Microscope, Building2, Sparkles, X } from 'lucide-react'
import { getVisitorProfile, getPersonalizedRecommendations, type PersonalizedRecommendation } from '@/lib/personalization'

const iconMap: Record<string, any> = {
  volunteer: Heart,
  medical: Stethoscope,
  teaching: GraduationCap,
  internship: Briefcase,
  donate: Heart,
  adventure: Plane,
  research: Microscope,
  business: Building2,
  destination: MapPin,
}

const colorMap: Record<string, string> = {
  volunteer: 'bg-cornell/10 text-cornell border-cornell/20',
  medical: 'bg-blue-50 text-blue-600 border-blue-200',
  teaching: 'bg-amber-50 text-amber-600 border-amber-200',
  internship: 'bg-purple-50 text-purple-600 border-purple-200',
  donate: 'bg-vogue/10 text-vogue border-vogue/20',
  adventure: 'bg-green-50 text-green-600 border-green-200',
  research: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  business: 'bg-slate-50 text-slate-600 border-slate-200',
  destination: 'bg-teal-50 text-teal-600 border-teal-200',
}

export default function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([])
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const profile = getVisitorProfile()
    // Only show for returning visitors or those with interests
    if (profile.visitCount > 1 || profile.interests.length > 0) {
      const recs = getPersonalizedRecommendations(profile)
      if (recs.length > 0) {
        setRecommendations(recs)
        // Show after a brief delay for smooth UX
        const timer = setTimeout(() => setVisible(true), 1500)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  if (!visible || dismissed || recommendations.length === 0) return null

  return (
    <section className="py-12 bg-gradient-to-r from-vogue/5 via-cream to-vogue/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-vogue rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cornell rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-bold text-charcoal dark:text-white">Recommended for You</h2>
              <span className="text-xs bg-vogue/10 text-vogue px-2 py-0.5 rounded-full font-medium">Personalized</span>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-charcoal/40 hover:text-charcoal dark:text-white/40 dark:hover:text-white transition-colors"
              aria-label="Dismiss recommendations"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Recommendation Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.map((rec, i) => {
              const Icon = iconMap[rec.icon] || Heart
              const colors = colorMap[rec.icon] || 'bg-vogue/10 text-vogue border-vogue/20'

              return (
                <motion.a
                  key={i}
                  href={rec.href}
                  onClick={(e) => {
                    e.preventDefault()
                    const el = document.querySelector(rec.href)
                    if (el) {
                      const offset = 80
                      const top = el.getBoundingClientRect().top + window.scrollY - offset
                      window.scrollTo({ top, behavior: 'smooth' })
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`group bg-white dark:bg-[#122A1B] rounded-xl p-5 border ${colors.split(' ').find(c => c.includes('border-')) || 'border-border'} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className={`w-10 h-10 rounded-lg ${colors} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-charcoal dark:text-white mb-1.5 group-hover:text-cornell dark:group-hover:text-cornell-light transition-colors">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-charcoal/60 dark:text-white/60 leading-relaxed mb-3">
                    {rec.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-vogue group-hover:text-vogue-light transition-colors">
                    {rec.cta}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
