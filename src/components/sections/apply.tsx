'use client'

import { motion } from 'framer-motion'
import { Phone, MapPin, ArrowRight, CheckCircle, Send } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const placementPrograms = [
  { value: 'medical', label: 'Medical Placement in Teaching Hospitals', country: 'Ghana' },
  { value: 'teaching', label: 'Teaching', country: 'Ghana' },
  { value: 'journalism', label: 'Journalism', country: 'Ghana' },
  { value: 'community', label: 'Community Outreach', country: 'Ghana' },
  { value: 'sports', label: 'Sports', country: 'Ghana' },
  { value: 'admin', label: 'Office Administration', country: 'Ghana' },
  { value: 'finance', label: 'Banking and Finance', country: 'Ghana' },
  { value: 'law', label: 'Law Placements', country: 'Ghana' },
  { value: 'agriculture', label: 'Agriculture Placement', country: 'Ghana' },
  { value: 'tourism', label: 'Tourism and Ecotourism', country: 'Ghana' },
  { value: 'schools', label: 'Community Projects — Building of Schools', country: 'Ghana' },
  { value: 'boreholes', label: 'Bore Holes — Drinkable Water', country: 'Ghana' },
]

function ApplyForm({ program }: { program: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    startDate: '',
    duration: '',
    message: '',
  })

  const programLabel = placementPrograms.find(p => p.value === program)?.label || program

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          program: programLabel,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      }
    } catch (err) {
      console.error('Application submission failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-mahogany mb-3">Application Submitted!</h3>
        <p className="text-dove max-w-md mx-auto mb-2">
          Thank you, <span className="font-semibold text-mahogany">{formData.fullName}</span>. Your application for <span className="font-semibold text-mahogany">{programLabel}</span> has been received.
        </p>
        <p className="text-dove max-w-md mx-auto mb-6">
          Our team will review your application and get back to you at <span className="font-semibold text-mahogany">{formData.email}</span> shortly.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button className="bg-mahogany hover:bg-mahogany-dark text-white rounded-full px-6">
              Back to Home
            </Button>
          </Link>
          <Link href="/apply">
            <Button
              variant="outline"
              className="border-mahogany text-mahogany hover:bg-mahogany/5 rounded-full px-6"
            >
              Apply for Another Program
            </Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-copper text-sm font-semibold mb-2">
            <MapPin className="w-4 h-4" />
            {programLabel}
          </div>
          <h3 className="text-xl font-bold text-mahogany">Application Form</h3>
          <p className="text-dove text-sm mt-1">Fill out the form below to apply for this program.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dove mb-1.5">Full Name *</label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dove mb-1.5">Email Address *</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dove mb-1.5">Phone Number</label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dove mb-1.5">Nationality</label>
              <Input
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                placeholder="e.g. British, American, German"
                className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dove mb-1.5">Preferred Start Date</label>
              <Input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dove mb-1.5">Duration</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:border-mahogany focus:ring-mahogany/20 focus:outline-none"
              >
                <option value="">Select duration</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="2-4 weeks">2-4 weeks</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6+ months">6+ months</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dove mb-1.5">Additional Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about yourself, your motivation, and any questions..."
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-mahogany focus:ring-mahogany/20 focus:outline-none resize-y"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Link href="/apply" className="text-sm text-copper hover:text-mahogany transition-colors">
              &larr; Back to programs
            </Link>
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="bg-mahogany hover:bg-mahogany-dark text-white rounded-full px-10 w-full sm:w-auto"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
              <Send className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ApplyContent() {
  const searchParams = useSearchParams()
  const selectedProgram = searchParams.get('program') || ''

  if (selectedProgram) {
    return (
      <section className="py-20 min-h-[80vh] bg-gradient-to-br from-mahogany/5 via-white to-copper/5">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span className="text-copper font-semibold text-sm uppercase tracking-wider">Apply Now</span>
            <h2 className="text-3xl md:text-4xl font-bold text-mahogany mt-2 mb-4">
              Your project
            </h2>
          </motion.div>
          <ApplyForm program={selectedProgram} />
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 min-h-[80vh] bg-gradient-to-br from-mahogany/5 via-white to-copper/5">
      <div className="max-w-7xl mx-auto px-4 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="text-copper font-semibold text-sm uppercase tracking-wider">Apply Now</span>
          <h2 className="text-3xl md:text-4xl font-bold text-mahogany mt-2 mb-4">
            Your project
          </h2>
          <p className="text-dove text-lg leading-relaxed max-w-xl mb-6">
            Applying for your dream project is quick and simple.
          </p>

          <div className="flex flex-wrap items-center gap-6 text-dove text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-copper flex-shrink-0" />
              <span>Select your trip</span>
            </div>
            <div className="w-px h-5 bg-mahogany/15" />
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-copper flex-shrink-0 mt-0.5" />
              <span>
                Can&apos;t find your project?{' '}
                <a href="tel:+233244207278" className="text-mahogany font-semibold hover:text-copper transition-colors underline">+233 244 207 278</a>
                {' / '}
                <a href="tel:+233544129556" className="text-mahogany font-semibold hover:text-copper transition-colors underline">+233 544 129 556</a>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Select Your Trip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-mahogany mb-6">Select your trip</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {placementPrograms.map((program) => (
              <Link
                key={program.value}
                href={`/apply?program=${program.value}`}
                className="group bg-white hover:bg-mahogany border border-border hover:border-mahogany rounded-xl p-5 transition-all duration-300 shadow-sm hover:shadow-md hover:text-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-sm group-hover:text-white transition-colors">{program.label}</h4>
                    <span className="text-xs text-dove group-hover:text-white/70 mt-1 inline-flex items-center gap-1 transition-colors">
                      <MapPin className="w-3 h-3" />
                      {program.country}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-copper group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function ApplySection() {
  return (
    <Suspense fallback={
      <section className="py-20 min-h-[80vh] bg-gradient-to-br from-mahogany/5 via-white to-copper/5">
        <div className="max-w-7xl mx-auto px-4 w-full text-center">
          <p className="text-dove">Loading...</p>
        </div>
      </section>
    }>
      <ApplyContent />
    </Suspense>
  )
}
