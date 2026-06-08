'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, Send, User, Mail, Phone, MapPin, Calendar, Globe2, FileText, CalendarCheck, GraduationCap, Plane, Clock, CreditCard, AlertCircle, Shield } from 'lucide-react'
import Link from 'next/link'

// Extend Window type for Paystack
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: Record<string, unknown>) => { openIframe: () => void }
    }
  }
}

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
  const [submitting, setSubmitting] = useState(false)
  const [paystackLoaded, setPaystackLoaded] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentReference, setPaymentReference] = useState('')
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
    school: '',
    courseOfStudy: '',
    countryOfOrigin: '',
    flightNumber: '',
    airline: '',
    arrivalDate: '',
    arrivalTime: '',
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

  // Load Paystack inline script
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.PaystackPop) {
      setPaystackLoaded(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v2/inline.js'
    script.async = true
    script.onload = () => setPaystackLoaded(true)
    script.onerror = () => console.error('Failed to load Paystack script')
    document.body.appendChild(script)
  }, [])

  const submitApplication = useCallback(async (ref: string) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          nationality: formData.nationality,
          program: formData.program,
          branch: formData.branch,
          duration: formData.duration,
          startDate: formData.startDate,
          endDate: formData.endDate,
          message: formData.message,
          school: formData.school,
          courseOfStudy: formData.courseOfStudy,
          countryOfOrigin: formData.countryOfOrigin,
          flightNumber: formData.flightNumber,
          airline: formData.airline,
          arrivalDate: formData.arrivalDate,
          arrivalTime: formData.arrivalTime,
          paymentReference: ref,
          paymentStatus: 'paid',
        }),
      })
      if (res.ok) {
        setPaymentReference(ref)
        setSubmitted(true)
      } else {
        setPaymentError('Application submission failed after payment. Please contact us with your payment reference: ' + ref)
      }
    } catch (err) {
      console.error('Application submission failed:', err)
      setPaymentError('Application submission failed after payment. Please contact us with your payment reference: ' + ref)
    } finally {
      setSubmitting(false)
    }
  }, [formData])

  const onPaymentSuccess = useCallback(async (reference: string) => {
    try {
      // Verify payment on backend
      const res = await fetch('/api/donate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      })
      const data = await res.json()

      if (data.success) {
        // Payment verified — now submit the application
        await submitApplication(reference)
      } else {
        setPaymentError(data.message || 'Payment verification failed. Please contact us.')
        setSubmitting(false)
      }
    } catch {
      setPaymentError('Could not verify payment. Please contact us with your reference.')
      setSubmitting(false)
    }
  }, [submitApplication])

  const openPaystackPopup = useCallback(() => {
    if (!window.PaystackPop) {
      setPaymentError('Payment system is still loading. Please wait a moment and try again.')
      setSubmitting(false)
      return
    }

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''
    if (!publicKey) {
      setPaymentError('Payment system is not configured. Please contact us.')
      setSubmitting(false)
      return
    }

    const reference = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: formData.email,
      amount: 20000, // $200 in cents (Paystack expects amount in kobo/cents)
      currency: 'USD',
      ref: reference,
      metadata: {
        custom_fields: [
          { display_name: 'Applicant Name', variable_name: 'applicant_name', value: `${formData.firstName} ${formData.lastName}` },
          { display_name: 'Program', variable_name: 'program', value: formData.program },
        ],
      },
      callback: (response: { reference: string }) => {
        onPaymentSuccess(response.reference)
      },
      onClose: () => {
        // User closed the Paystack popup without paying
        setSubmitting(false)
      },
    })

    handler.openIframe()
  }, [formData, onPaymentSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setPaymentError('')

    // Open Paystack payment popup first
    openPaystackPopup()
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
          <div className="bg-vogue/5 border border-vogue/20 rounded-xl p-4 my-4 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-vogue" />
              <span className="text-sm font-semibold text-vogue">Payment Confirmed</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-charcoal/60">Registration Fee</span>
              <span className="text-xs font-bold text-vogue">$200.00</span>
            </div>
            {paymentReference && (
              <div className="flex justify-between">
                <span className="text-xs text-charcoal/60">Reference</span>
                <span className="text-xs font-mono text-charcoal/70">{paymentReference}</span>
              </div>
            )}
          </div>
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
                  { step: '3', title: 'Confirmation & Registration', desc: 'Secure your spot with a $200 registration fee' },
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

              {/* Educational Information */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-vogue/10 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-vogue" />
                  </div>
                  <h3 className="font-semibold text-cornell">Educational Information</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">School / University *</label>
                    <input
                      type="text"
                      name="school"
                      required
                      value={formData.school}
                      onChange={handleChange}
                      placeholder="e.g. University of Oxford, Harvard University"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Course of Study</label>
                    <input
                      type="text"
                      name="courseOfStudy"
                      value={formData.courseOfStudy}
                      onChange={handleChange}
                      placeholder="e.g. Medicine, Business Administration"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-cornell/10 rounded-lg flex items-center justify-center">
                    <Plane className="w-4 h-4 text-cornell" />
                  </div>
                  <h3 className="font-semibold text-cornell">Flight Details</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Country You Are Coming From *</label>
                    <input
                      type="text"
                      name="countryOfOrigin"
                      required
                      value={formData.countryOfOrigin}
                      onChange={handleChange}
                      placeholder="e.g. United Kingdom, United States, Germany"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Airline</label>
                    <input
                      type="text"
                      name="airline"
                      value={formData.airline}
                      onChange={handleChange}
                      placeholder="e.g. British Airways, Emirates, KLM"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Flight Number</label>
                    <input
                      type="text"
                      name="flightNumber"
                      value={formData.flightNumber}
                      onChange={handleChange}
                      placeholder="e.g. BA789, EK501"
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Arrival Date *</label>
                    <input
                      type="date"
                      name="arrivalDate"
                      required
                      value={formData.arrivalDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">Arrival Time *</label>
                    <input
                      type="time"
                      name="arrivalTime"
                      required
                      value={formData.arrivalTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cornell/20 focus:border-cornell transition-colors"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 w-full">
                      <p className="text-xs text-blue-700">
                        <Plane className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                        Airport pickup is included. Our team will be waiting for you at Kotoka International Airport (ACC).
                      </p>
                    </div>
                  </div>
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

              {/* Registration Fee Notice */}
              <div className="bg-cornell/10 border-2 border-cornell/40 rounded-xl p-5 mb-6 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cornell rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-cornell uppercase tracking-wide">Registration / Application Fee</p>
                    <p className="text-sm text-charcoal/90 mt-1 font-semibold">
                      A Registration / Application fee of <span className="text-lg font-black text-cornell">$200</span> is required upon submission. You will be prompted to complete payment before your application is finalized.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Error */}
              {paymentError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">Payment Issue</p>
                    <p className="text-xs text-red-600 mt-0.5">{paymentError}</p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full bg-cornell hover:bg-cornell-dark text-white rounded-full text-base py-3"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {submitting ? 'Processing Payment...' : 'Submit Application & Pay $200'}
              </Button>

              <p className="text-[11px] text-charcoal/50 text-center mt-4">
                By submitting this application, you agree to our terms and conditions. A $200 registration fee will be processed via Paystack. We will respond within 48 hours.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
