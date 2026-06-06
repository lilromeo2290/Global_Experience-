'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, Send, User, Mail, Phone, MapPin, Calendar, Globe2, FileText, CalendarCheck } from 'lucide-react'
import Link from 'next/link'

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

const durations = [
  '1 Week',
  '2 Weeks',
  '3 Weeks',
  '4 Weeks',
  '6 Weeks',
  '8 Weeks',
  '3 Months',
  '6 Months',
  '12 Months',
]

const durationDaysMap: Record<string, number> = {
  '1 Week': 7,
  '2 Weeks': 14,
  '3 Weeks': 21,
  '4 Weeks': 28,
  '6 Weeks': 42,
  '8 Weeks': 56,
  '3 Months': 90,
  '6 Months': 180,
  '12 Months': 365,
}

const howDidYouHear = [
  'Google Search',
  'Social Media',
  'University/College',
  'Friend/Family Referral',
  'Past Participant',
  'Volunteer Website',
  'Other',
]

export default function ApplyPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sage flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-cornell border-t-transparent rounded-full" /></div>}>
      <ApplyPage />
    </Suspense>
  )
}

function ApplyPage() {
  const searchParams = useSearchParams()

  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    program: '',
    branch: '',
    duration: '',
    startDate: '',
    endDate: '',
    message: '',
    referral: '',
  })

  // Calculate end date from start date + duration
  const calculateEndDate = (startDate: string, duration: string): string => {
    if (!startDate || !duration) return ''
    const start = new Date(startDate)
    const days = durationDaysMap[duration]
    if (!days) return ''
    const end = new Date(start)
    end.setDate(end.getDate() + days)
    return end.toISOString().split('T')[0]
  }

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return ''
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Pre-select program from URL query param
  useEffect(() => {
    const programParam = searchParams.get('program')
    if (programParam && programs.includes(programParam)) {
      setFormData(prev => ({ ...prev, program: programParam }))
    }
    const branchParam = searchParams.get('branch')
    if (branchParam) {
      setFormData(prev => ({ ...prev, branch: branchParam }))
    }
    const startDateParam = searchParams.get('startDate')
    if (startDateParam) {
      setFormData(prev => ({ ...prev, startDate: startDateParam }))
    }
    const durationParam = searchParams.get('duration')
    if (durationParam && durations.includes(durationParam)) {
      setFormData(prev => ({ ...prev, duration: durationParam }))
    }
    const endDateParam = searchParams.get('endDate')
    if (endDateParam) {
      setFormData(prev => ({ ...prev, endDate: endDateParam }))
    }
  }, [searchParams])

  // Auto-calculate end date when start date or duration changes
  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const calculated = calculateEndDate(formData.startDate, formData.duration)
      if (calculated !== formData.endDate) {
        setFormData(prev => ({ ...prev, endDate: calculated }))
      }
    }
  }, [formData.startDate, formData.duration])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-sage flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
        >
          <div className="w-20 h-20 bg-vogue/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-vogue" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-cornell mb-3">Application Submitted!</h1>
          <p className="text-charcoal leading-relaxed mb-2">
            Thank you, <span className="font-semibold">{formData.firstName}</span>! Your application for <span className="font-semibold text-vogue">{formData.program}</span> has been received.
          </p>
          <p className="text-charcoal/70 text-sm mb-8">
            Our team will review your application and get back to you within 48 hours. Check your email at <span className="font-medium">{formData.email}</span> for a confirmation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="bg-cornell hover:bg-cornell-dark text-white rounded-full px-6">
                Back to Home
              </Button>
            </Link>
            <Link href="/placements">
              <Button variant="outline" className="border-cornell text-cornell hover:bg-cornell/5 rounded-full px-6">
                View All Programs
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sage">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cornell to-cornell-dark" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-vogue/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Apply for a Placement
            </h1>
            <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
              Take the first step toward a life-changing experience. Complete the application form below
              and our team will match you with the ideal placement opportunity.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h3 className="font-bold text-cornell mb-4">What Happens Next?</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Application Review', desc: 'We review your application within 48 hours' },
                  { step: '2', title: 'Interview & Matching', desc: 'We match you with the perfect placement' },
                  { step: '3', title: 'Confirmation & Deposit', desc: 'Secure your spot with a $295 deposit' },
                  { step: '4', title: 'Pre-Departure Prep', desc: 'Receive comprehensive travel guidance' },
                  { step: '5', title: 'Arrive & Begin', desc: 'Airport pickup, orientation, and start!' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-8 h-8 bg-cornell/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-cornell font-bold text-xs">{item.step}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-cornell">{item.title}</p>
                      <p className="text-xs text-charcoal/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
              <h3 className="font-bold text-cornell mb-4">Need Help?</h3>
              <div className="space-y-3">
                <a href="mailto:info@globalexperiencegh.org" className="flex items-center gap-2 text-sm text-charcoal hover:text-cornell transition-colors">
                  <Mail className="w-4 h-4 text-vogue" />
                  info@globalexperiencegh.org
                </a>
                <a href="mailto:globalexperiencegh@gmail.com" className="flex items-center gap-2 text-sm text-charcoal hover:text-cornell transition-colors">
                  <Mail className="w-4 h-4 text-vogue" />
                  globalexperiencegh@gmail.com
                </a>
                <a href="tel:+233544129556" className="flex items-center gap-2 text-sm text-charcoal hover:text-cornell transition-colors">
                  <Phone className="w-4 h-4 text-vogue" />
                  +233 544 129 556
                </a>
              </div>
            </div>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-cornell mb-1">Application Form</h2>
              <p className="text-charcoal/70 text-sm mb-8">All fields marked with * are required</p>

              {/* Personal Information */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-cornell/10 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-cornell" />
                  </div>
                  <h3 className="font-semibold text-cornell">Personal Information</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Nationality *</label>
                    <input
                      type="text"
                      name="nationality"
                      required
                      value={formData.nationality}
                      onChange={handleChange}
                      placeholder="e.g. British, American, German"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Program Selection */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-vogue/10 rounded-lg flex items-center justify-center">
                    <Globe2 className="w-4 h-4 text-vogue" />
                  </div>
                  <h3 className="font-semibold text-cornell">Program Selection</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Preferred Branch / Location *</label>
                    <select
                      name="branch"
                      required
                      value={formData.branch}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    >
                      <option value="">Select a branch</option>
                      <option value="Ho">Ho (Head Office)</option>
                      <option value="Cape Coast">Cape Coast (Regional Office)</option>
                      <option value="Takoradi">Takoradi (Regional Office)</option>
                      <option value="Accra">Accra (Regional Office)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Preferred Placement Program *</label>
                    <select
                      name="program"
                      required
                      value={formData.program}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    >
                      <option value="">Select a program</option>
                      {programs.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Preferred Duration *</label>
                    <select
                      name="duration"
                      required
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    >
                      <option value="">Select duration</option>
                      {durations.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Preferred Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      value={formData.startDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                  {/* End Date (Auto-calculated) */}
                  {formData.endDate && (
                    <div className="sm:col-span-2">
                      <div className="bg-vogue/5 border border-vogue/20 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-vogue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CalendarCheck className="w-5 h-5 text-vogue" />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-vogue mb-0.5 block">
                              End Date
                            </label>
                            <p className="text-sm font-semibold text-cornell">
                              {formatDate(formData.endDate)}
                            </p>
                            <p className="text-[10px] text-charcoal/50 mt-0.5">
                              Auto-calculated from start date + {formData.duration.toLowerCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-cornell/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-cornell" />
                  </div>
                  <h3 className="font-semibold text-cornell">Additional Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">How did you hear about us?</label>
                    <select
                      name="referral"
                      value={formData.referral}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    >
                      <option value="">Select an option</option>
                      {howDidYouHear.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Additional Message / Questions</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about your motivation, any specific requirements, or questions you may have..."
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Deposit Notice */}
              <div className="bg-vogue/5 border border-vogue/20 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-vogue flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-vogue">Deposit Required</p>
                    <p className="text-xs text-charcoal/70 mt-0.5">
                      A deposit of <span className="font-bold text-vogue">$295</span> is required to secure your placement after your application is approved. This covers airport pickup, orientation, and initial accommodation arrangements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-cornell hover:bg-cornell-dark text-white rounded-full text-base py-3"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </Button>

              <p className="text-[11px] text-charcoal/50 text-center mt-4">
                By submitting this application, you agree to our terms and conditions. We will respond within 48 hours.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
