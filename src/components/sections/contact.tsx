'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Phone, MapPin, Clock, MessageCircle, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section id="contact" className="py-20 bg-warm-beige">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-copper font-semibold text-sm uppercase tracking-wider">Contact Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-mahogany mt-2 mb-4">
            Get In Touch — We Would Love to Hear From You
          </h2>
          <p className="text-dove max-w-2xl mx-auto leading-relaxed">
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
              <h3 className="font-bold text-mahogany text-lg mb-4">Our Office</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-mahogany/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-mahogany" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-mahogany">Location</h4>
                    <p className="text-sm text-dove">123 Volunteer Lane, Osu, Accra, Ghana, West Africa</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-mahogany/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-mahogany" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-mahogany">Email</h4>
                    <a href="mailto:info@globalvolunteer.org" className="text-sm text-copper hover:text-mahogany transition-colors">info@globalvolunteer.org</a>
                    <br />
                    <a href="mailto:placements@globalvolunteer.org" className="text-sm text-copper hover:text-mahogany transition-colors">placements@globalvolunteer.org</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-mahogany/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-mahogany" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-mahogany">Phone</h4>
                    <a href="tel:+233123456789" className="text-sm text-copper hover:text-mahogany transition-colors">+233 123 456 789</a>
                    <br />
                    <a href="tel:+233987654321" className="text-sm text-copper hover:text-mahogany transition-colors">+233 987 654 321</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-mahogany/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-mahogany" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-mahogany">Office Hours</h4>
                    <p className="text-sm text-dove">Mon - Fri: 8:00 AM - 5:00 PM (GMT)</p>
                    <p className="text-sm text-dove">Sat: 9:00 AM - 1:00 PM (GMT)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/233123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white rounded-xl p-4 shadow-sm transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <div>
                <div className="font-semibold text-sm">Chat on WhatsApp</div>
                <div className="text-xs text-white/80">Quick response, available 24/7</div>
              </div>
            </a>

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
              <h3 className="font-bold text-mahogany text-sm mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-10 h-10 bg-mahogany/10 hover:bg-mahogany hover:text-white rounded-lg flex items-center justify-center text-mahogany transition-colors"
                  >
                    <s.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
              <div className="h-48 bg-warm-sand flex items-center justify-center">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.2%2C5.5%2C-0.1%2C5.6&layer=mapnik"
                  className="w-full h-full border-0"
                  loading="lazy"
                  title="Office Location Map"
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
              <h3 className="font-bold text-mahogany text-xl mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm text-mahogany font-medium">First Name *</Label>
                    <Input id="firstName" placeholder="John" required className="mt-1 rounded-lg border-border focus:border-mahogany focus:ring-mahogany" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm text-mahogany font-medium">Last Name *</Label>
                    <Input id="lastName" placeholder="Doe" required className="mt-1 rounded-lg border-border focus:border-mahogany focus:ring-mahogany" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm text-mahogany font-medium">Email *</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required className="mt-1 rounded-lg border-border focus:border-mahogany focus:ring-mahogany" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm text-mahogany font-medium">Phone</Label>
                    <Input id="phone" type="tel" placeholder="+1 234 567 890" className="mt-1 rounded-lg border-border focus:border-mahogany focus:ring-mahogany" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="inquiry" className="text-sm text-mahogany font-medium">Inquiry Type *</Label>
                  <Select>
                    <SelectTrigger className="mt-1 rounded-lg border-border focus:border-mahogany">
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="placement">Placement Inquiry</SelectItem>
                      <SelectItem value="volunteer">Volunteer Application</SelectItem>
                      <SelectItem value="donation">Donation Query</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                      <SelectItem value="media">Media / Press</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="program" className="text-sm text-mahogany font-medium">Interested Program</Label>
                  <Select>
                    <SelectTrigger className="mt-1 rounded-lg border-border focus:border-mahogany">
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical Placement in Teaching Hospitals</SelectItem>
                      <SelectItem value="teaching">Teaching</SelectItem>
                      <SelectItem value="journalism">Journalism</SelectItem>
                      <SelectItem value="community">Community Outreach</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="admin">Office Administration</SelectItem>
                      <SelectItem value="finance">Banking and Finance</SelectItem>
                      <SelectItem value="law">Law Placements</SelectItem>
                      <SelectItem value="agriculture">Agriculture Placement</SelectItem>
                      <SelectItem value="tourism">Tourism and Ecotourism</SelectItem>
                      <SelectItem value="schools">Community Projects — Building of Schools</SelectItem>
                      <SelectItem value="boreholes">Bore Holes — Drinkable Water</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm text-mahogany font-medium">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about yourself and how we can help..."
                    required
                    rows={5}
                    className="mt-1 rounded-lg border-border focus:border-mahogany focus:ring-mahogany"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-mahogany hover:bg-mahogany-dark text-white rounded-full text-base"
                >
                  {submitted ? 'Message Sent!' : 'Send Message'}
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
