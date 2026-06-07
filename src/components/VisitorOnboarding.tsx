'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Sparkles } from 'lucide-react'
import { getVisitorProfile, setVisitorName, addInterest, saveVisitorProfile } from '@/lib/personalization'

const INTEREST_OPTIONS = [
  { id: 'volunteer', label: 'Volunteering', emoji: '🤝' },
  { id: 'medical', label: 'Medical Placements', emoji: '🏥' },
  { id: 'teaching', label: 'Teaching', emoji: '📚' },
  { id: 'internship', label: 'Internships', emoji: '💼' },
  { id: 'adventure', label: 'Adventure & Travel', emoji: '🪂' },
  { id: 'donate', label: 'Supporting / Donating', emoji: '❤️' },
  { id: 'research', label: 'Research', emoji: '🔬' },
  { id: 'business', label: 'Business', emoji: '📊' },
]

export default function VisitorOnboarding() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState<'welcome' | 'interests' | 'done'>('welcome')
  const [name, setName] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  useEffect(() => {
    // Only show on first or second visit, and only if name isn't set yet
    const profile = getVisitorProfile()
    if (!profile.name && profile.visitCount <= 2) {
      const timer = setTimeout(() => setVisible(true), 4000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleContinue = () => {
    if (name.trim()) {
      setVisitorName(name.trim())
    }
    setStep('interests')
  }

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleFinish = () => {
    selectedInterests.forEach((interest) => addInterest(interest))
    setStep('done')
    setTimeout(() => setVisible(false), 1500)
  }

  const handleSkip = () => {
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleSkip} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative bg-white dark:bg-[#122A1B] rounded-2xl shadow-2xl border border-border max-w-md w-full overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-charcoal/40 dark:text-white/40" />
            </button>

            {step === 'welcome' && (
              <div className="p-6 pt-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-gold" />
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">Personalized Experience</span>
                </div>
                <h2 className="text-xl font-bold text-charcoal dark:text-white mb-2">
                  Welcome to Global Experience!
                </h2>
                <p className="text-sm text-charcoal/60 dark:text-white/60 mb-6 leading-relaxed">
                  We&apos;d love to personalize your visit. What should we call you?
                </p>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name (optional)"
                  className="w-full bg-gray-50 dark:bg-[#0A1F12] rounded-xl px-4 py-3 text-sm text-charcoal dark:text-white/90 placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-vogue/30 border border-border mb-4"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleContinue}
                    className="flex-1 bg-vogue hover:bg-vogue-light text-white rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2.5 rounded-xl text-sm text-charcoal/60 dark:text-white/60 hover:text-charcoal dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            {step === 'interests' && (
              <div className="p-6 pt-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-gold" />
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">Almost there!</span>
                </div>
                <h2 className="text-xl font-bold text-charcoal dark:text-white mb-2">
                  What interests you most?
                </h2>
                <p className="text-sm text-charcoal/60 dark:text-white/60 mb-4 leading-relaxed">
                  Select all that apply so we can show you the most relevant opportunities.
                </p>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  {INTEREST_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => toggleInterest(opt.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        selectedInterests.includes(opt.id)
                          ? 'bg-vogue/10 border-vogue/30 text-vogue'
                          : 'bg-gray-50 dark:bg-[#0A1F12] border-border text-charcoal/70 dark:text-white/70 hover:border-vogue/20'
                      }`}
                    >
                      <span className="text-base">{opt.emoji}</span>
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleFinish}
                    className="flex-1 bg-vogue hover:bg-vogue-light text-white rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {selectedInterests.length > 0 ? 'Show My Recommendations' : 'Get Started'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2.5 rounded-xl text-sm text-charcoal/60 dark:text-white/60 hover:text-charcoal dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}

            {step === 'done' && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-vogue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-vogue" />
                </div>
                <h2 className="text-xl font-bold text-charcoal dark:text-white mb-2">
                  {name ? `Great, ${name}!` : 'All set!'}
                </h2>
                <p className="text-sm text-charcoal/60 dark:text-white/60">
                  Your experience is now personalized. Enjoy exploring!
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
