'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plane, Shield, Users, Luggage, Globe, Phone, Heart, ArrowRight, ArrowLeft, CheckCircle, Calendar, Clock, MapPin, User, Mail, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

const features = [
  { icon: Shield, title: 'Safe and reliable transportation from the airport', desc: 'We provide secure, well-maintained vehicles and experienced drivers to ensure your journey from the airport is comfortable and worry-free.' },
  { icon: Users, title: 'Warm welcome by our local team representatives', desc: 'Our friendly team meets you at the arrivals terminal with a welcome sign, ready to greet you and guide you through your first moments in the country.' },
  { icon: Luggage, title: 'Assistance with luggage and travel arrangements', desc: 'We help you with your bags, navigate the airport, and handle any immediate travel logistics so you can relax after your flight.' },
  { icon: Globe, title: 'Introduction to local customs and culture', desc: 'During the ride, our team shares essential cultural tips, local norms, and practical advice to help you feel at home right away.' },
  { icon: Phone, title: 'Emergency support upon arrival', desc: 'You receive a local SIM card and emergency contact numbers, ensuring you can always reach our team if you need help at any time.' },
  { icon: Heart, title: 'Direct transfer to accommodation or placement location', desc: 'We take you straight to your accommodation or placement site with no detours, so you can settle in and rest after your journey.' },
]

export default function AirportPickupsPage() {
  return (
    <div className="min-h-screen bg-warm-beige">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-mahogany to-copper" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
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
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Our Services</span>
                <h1 className="text-3xl md:text-5xl font-bold text-white">
                  Airport Pickup Services
                </h1>
              </div>
            </div>
            <p className="text-white/80 max-w-2xl text-lg leading-relaxed">
              At our organization, we understand that arriving in a new country can be both exciting and overwhelming.
              To ensure a smooth and stress-free transition, we provide reliable airport pickup services for all our
              volunteers, interns, students, and placement participants.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-10 mb-8"
        >
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-mahogany mb-4">
              Welcome from the Moment You Land
            </h2>
            <p className="text-dove leading-relaxed mb-4">
              Our friendly and experienced team welcomes participants upon arrival and assists them with
              transportation from the airport to their accommodation. This service is designed to provide
              comfort, safety, and peace of mind, especially for first-time visitors unfamiliar with the
              local environment.
            </p>
            <p className="text-dove leading-relaxed mb-4">
              We coordinate arrival schedules in advance, monitor flight updates, and ensure that participants
              are received promptly and professionally. During the journey, participants are introduced to the
              local community and provided with essential information to help them settle in comfortably.
            </p>
            <p className="text-dove leading-relaxed">
              Through this service, we strive to make every participant feel welcomed, valued, and supported
              from the moment they arrive, creating a positive foundation for their placement experience and
              community engagement journey.
            </p>
          </div>
        </motion.div>

        {/* Service Features */}
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-mahogany mb-2"
          >
            Our Airport Pickup Service Includes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-dove mb-8"
          >
            Everything you need for a safe and comfortable arrival
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover:border-mahogany/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-mahogany/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-mahogany" />
                </div>
                <h3 className="text-base font-bold text-mahogany mb-2">{feature.title}</h3>
                <p className="text-sm text-dove leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-10 mb-8"
        >
          <h2 className="text-2xl font-bold text-mahogany mb-6">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Share Your Flight Details', desc: 'Provide us with your flight number, arrival date, and time when you confirm your placement.' },
              { step: '2', title: 'We Monitor Your Flight', desc: 'Our team tracks your flight in real-time to adjust for any delays or early arrivals.' },
              { step: '3', title: 'Meet at the Airport', desc: 'A team representative will be waiting for you at the arrivals area with a welcome sign.' },
              { step: '4', title: 'Transfer to Your Accommodation', desc: 'We drive you safely to your accommodation, sharing local tips along the way.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-mahogany text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-mahogany mb-1">{item.title}</h4>
                <p className="text-sm text-dove leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Airport Pickup Request Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-10"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-mahogany/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Plane className="w-7 h-7 text-mahogany" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-mahogany mb-2">
              Request Your Airport Pickup
            </h2>
            <p className="text-dove max-w-2xl mx-auto leading-relaxed">
              Fill out the form below to arrange your airport pickup. Our team will confirm your booking and be ready to welcome you upon arrival.
            </p>
          </div>

          <AirportPickupForm />
        </motion.div>
      </div>
    </div>
  )
}

function AirportPickupForm() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    participantType: '',
    arrivalDate: '',
    arrivalTime: '',
    flightNumber: '',
    airline: '',
    departureCity: '',
    destinationAirport: '',
    numberOfLuggage: '',
    accommodationName: '',
    accommodationAddress: '',
    specialRequirements: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSubmitted(true)
      }
    } catch (err) {
      console.error('Pickup request failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-mahogany mb-3">Pickup Request Submitted!</h3>
        <p className="text-dove max-w-md mx-auto mb-2">
          Thank you, <span className="font-semibold text-mahogany">{formData.fullName}</span>. Your airport pickup request has been received.
        </p>
        <p className="text-dove max-w-md mx-auto mb-6">
          Our team will review your details and send a confirmation to <span className="font-semibold text-mahogany">{formData.email}</span> shortly.
          We will monitor your flight and be ready to welcome you at the airport.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button className="bg-mahogany hover:bg-mahogany-dark text-white rounded-full px-6">
              Back to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-mahogany text-mahogany hover:bg-mahogany/5 rounded-full px-6"
            onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', phone: '', nationality: '', participantType: '', arrivalDate: '', arrivalTime: '', flightNumber: '', airline: '', departureCity: '', destinationAirport: '', numberOfLuggage: '', accommodationName: '', accommodationAddress: '', specialRequirements: '' }) }}
          >
            Submit Another Request
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-bold text-mahogany mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-copper" />
          Personal Information
        </h3>
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
            <label className="block text-sm font-medium text-dove mb-1.5">Phone Number *</label>
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              required
              className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dove mb-1.5">Nationality *</label>
            <Input
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="e.g. British, American, German"
              required
              className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-dove mb-1.5">Participant Type *</label>
            <select
              name="participantType"
              value={formData.participantType}
              onChange={handleChange}
              required
              className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:border-mahogany focus:ring-mahogany/20 focus:outline-none"
            >
              <option value="">Select your participant type</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Intern">Intern</option>
              <option value="Student">Student</option>
              <option value="Researcher">Researcher</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flight Details */}
      <div>
        <h3 className="text-lg font-bold text-mahogany mb-4 flex items-center gap-2">
          <Plane className="w-5 h-5 text-copper" />
          Flight Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dove mb-1.5">Arrival Date *</label>
            <Input
              name="arrivalDate"
              type="date"
              value={formData.arrivalDate}
              onChange={handleChange}
              required
              className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dove mb-1.5">Arrival Time *</label>
            <Input
              name="arrivalTime"
              type="time"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
              className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dove mb-1.5">Flight Number *</label>
            <Input
              name="flightNumber"
              value={formData.flightNumber}
              onChange={handleChange}
              placeholder="e.g. BA081, DL156"
              required
              className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dove mb-1.5">Airline *</label>
            <Input
              name="airline"
              value={formData.airline}
              onChange={handleChange}
              placeholder="e.g. British Airways, Delta"
              required
              className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dove mb-1.5">Departure City *</label>
            <Input
              name="departureCity"
              value={formData.departureCity}
              onChange={handleChange}
              placeholder="e.g. London, New York"
              required
              className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dove mb-1.5">Destination Airport *</label>
            <select
              name="destinationAirport"
              value={formData.destinationAirport}
              onChange={handleChange}
              required
              className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:border-mahogany focus:ring-mahogany/20 focus:outline-none"
            >
              <option value="">Select airport</option>
              <option value="Kotoka International Airport (ACC)">Kotoka International Airport (ACC) — Accra</option>
              <option value="Kumasi Airport (KMS)">Kumasi Airport (KMS) — Kumasi</option>
              <option value="Tamale Airport (TML)">Tamale Airport (TML) — Tamale</option>
              <option value="Takoradi Airport (TKD)">Takoradi Airport (TKD) — Takoradi</option>
              <option value="Other">Other Airport</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dove mb-1.5">Number of Luggage</label>
            <select
              name="numberOfLuggage"
              value={formData.numberOfLuggage}
              onChange={handleChange}
              className="w-full h-10 rounded-lg border border-border bg-white px-3 text-sm focus:border-mahogany focus:ring-mahogany/20 focus:outline-none"
            >
              <option value="">Select number</option>
              <option value="1">1 piece</option>
              <option value="2">2 pieces</option>
              <option value="3">3 pieces</option>
              <option value="4+">4+ pieces</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accommodation Details */}
      <div>
        <h3 className="text-lg font-bold text-mahogany mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-copper" />
          Accommodation Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dove mb-1.5">Accommodation Name</label>
            <Input
              name="accommodationName"
              value={formData.accommodationName}
              onChange={handleChange}
              placeholder="e.g. Global Experience Volunteer House"
              className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dove mb-1.5">Accommodation Address</label>
            <Input
              name="accommodationAddress"
              value={formData.accommodationAddress}
              onChange={handleChange}
              placeholder="e.g. 123 Volunteer Lane, Accra"
              className="rounded-lg border-border focus:border-mahogany focus:ring-mahogany/20"
            />
          </div>
        </div>
      </div>

      {/* Special Requirements */}
      <div>
        <h3 className="text-lg font-bold text-mahogany mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-copper" />
          Special Requirements
        </h3>
        <textarea
          name="specialRequirements"
          value={formData.specialRequirements}
          onChange={handleChange}
          rows={4}
          placeholder="Any special requirements, medical needs, or additional information we should know about..."
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-mahogany focus:ring-mahogany/20 focus:outline-none resize-y"
        />
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-dove">
          By submitting this form, you agree to our airport pickup terms and conditions. We will confirm your booking via email.
        </p>
        <Button
          type="submit"
          size="lg"
          className="bg-mahogany hover:bg-mahogany-dark text-white rounded-full px-10 w-full sm:w-auto"
        >
          {submitting ? 'Submitting...' : 'Submit Pickup Request'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
