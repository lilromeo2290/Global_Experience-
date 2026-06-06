'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiry: '',
    program: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSubmitted(true)
        setFormData({ firstName: '', lastName: '', email: '', phone: '', inquiry: '', program: '', message: '' })
        setTimeout(() => setSubmitted(false), 4000)
      }
    } catch (err) {
      console.error('Message send failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-sage dark:bg-[#122A1B]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Contact Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-cornell mt-2 mb-4">
            Get In Touch — We Would Love to Hear From You
          </h2>
          <p className="text-charcoal max-w-2xl mx-auto leading-relaxed">
            Whether you have questions about our programs, want to apply for a placement, or are
            interested in partnering with us, our team is ready to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Office Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
              <h3 className="font-bold text-cornell text-lg mb-4">Our Office</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cornell/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-cornell" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-cornell">Location</h4>
                    <p className="text-sm text-charcoal dark:text-white/80">PMB Ho, Volta Region, Ghana, West Africa</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cornell/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-cornell" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-cornell">Email</h4>
                    <a href="mailto:info@globalexperiencegh.org" className="text-sm text-vogue hover:text-cornell transition-colors">info@globalexperiencegh.org</a>
                    <br />
                    <a href="mailto:globalexperiencegh@gmail.com" className="text-sm text-vogue hover:text-cornell transition-colors">globalexperiencegh@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cornell/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-cornell" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-cornell">Phone</h4>
                    <a href="tel:+233544129556" className="text-sm text-vogue hover:text-cornell transition-colors">+233 544 129 556</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cornell/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-cornell" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-cornell">Office Hours</h4>
                    <p className="text-sm text-charcoal dark:text-white/80">Mon - Fri: 8:00 AM - 5:00 PM (GMT)</p>
                    <p className="text-sm text-charcoal dark:text-white/80">Sat: 9:00 AM - 1:00 PM (GMT)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
              <div className="h-48 bg-ivory flex items-center justify-center">
                <iframe
                  src="https://maps.google.com/maps?q=Ho,+Volta+Region,+Ghana&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Head Office Location - Ho, Volta Region, Ghana"
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border">
              <h3 className="font-bold text-cornell text-xl mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm text-cornell font-medium">First Name *</Label>
                    <Input id="firstName" name="firstName" placeholder="John" required value={formData.firstName} onChange={handleChange} className="mt-1 rounded-lg border-border focus:border-cornell focus:ring-cornell" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm text-cornell font-medium">Last Name *</Label>
                    <Input id="lastName" name="lastName" placeholder="Doe" required value={formData.lastName} onChange={handleChange} className="mt-1 rounded-lg border-border focus:border-cornell focus:ring-cornell" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm text-cornell font-medium">Email *</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} className="mt-1 rounded-lg border-border focus:border-cornell focus:ring-cornell" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm text-cornell font-medium">Phone</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1 234 567 890" value={formData.phone} onChange={handleChange} className="mt-1 rounded-lg border-border focus:border-cornell focus:ring-cornell" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inquiry" className="text-sm text-cornell font-medium">Inquiry Type *</Label>
                    <Select value={formData.inquiry} onValueChange={(val) => setFormData({ ...formData, inquiry: val })}>
                      <SelectTrigger className="mt-1 rounded-lg border-border focus:border-cornell">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Placement Inquiry">Placement Inquiry</SelectItem>
                        <SelectItem value="Volunteer Application">Volunteer Application</SelectItem>
                        <SelectItem value="Donation Query">Donation Query</SelectItem>
                        <SelectItem value="Partnership Opportunity">Partnership Opportunity</SelectItem>
                        <SelectItem value="Media / Press">Media / Press</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="program" className="text-sm text-cornell font-medium">Interested Program</Label>
                    <Select value={formData.program} onValueChange={(val) => setFormData({ ...formData, program: val })}>
                      <SelectTrigger className="mt-1 rounded-lg border-border focus:border-cornell">
                        <SelectValue placeholder="Select a program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Medical Placement in Teaching Hospitals">Medical Placement in Teaching Hospitals</SelectItem>
                        <SelectItem value="Teaching">Teaching</SelectItem>
                        <SelectItem value="Journalism">Journalism</SelectItem>
                        <SelectItem value="Community Outreach">Community Outreach</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Office Administration">Office Administration</SelectItem>
                        <SelectItem value="Banking and Finance">Banking and Finance</SelectItem>
                        <SelectItem value="Law Placements">Law Placements</SelectItem>
                        <SelectItem value="Agriculture Placement">Agriculture Placement</SelectItem>
                        <SelectItem value="Tourism and Ecotourism">Tourism and Ecotourism</SelectItem>
                        <SelectItem value="Community Projects — Building of Schools">Community Projects — Building of Schools</SelectItem>
                        <SelectItem value="Bore Holes — Drinkable Water">Bore Holes — Drinkable Water</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm text-cornell font-medium">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about yourself and how we can help..."
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 rounded-lg border-border focus:border-cornell focus:ring-cornell"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="w-full bg-cornell hover:bg-cornell-dark text-white rounded-full text-base"
                >
                  {submitted ? 'Message Sent!' : submitting ? 'Sending...' : 'Send Message'}
                  <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
