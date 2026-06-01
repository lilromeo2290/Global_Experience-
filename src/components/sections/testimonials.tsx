'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Emily Thompson',
    role: 'Medical Volunteer, UK',
    text: 'My medical placement in Ghana was truly life-changing. The team at Global Experience Placements made everything seamless — from airport pickup to my daily clinical rotations. I gained hands-on experience that I could never have gotten at home, while making genuine connections with patients and colleagues.',
    rating: 5,
  },
  {
    name: 'James Okafor',
    role: 'Teaching Volunteer, Nigeria',
    text: 'Teaching in a rural school opened my eyes to the power of education. The children were incredibly eager to learn, and the local teachers were so welcoming. The orientation program prepared me well, and the ongoing support made me feel safe and valued throughout my placement.',
    rating: 5,
  },
  {
    name: 'Sarah Mitchell',
    role: 'Journalism Intern, Australia',
    text: 'Working at a local radio station gave me real-world reporting experience that transformed my career. I covered stories that mattered, learned from seasoned journalists, and built a portfolio that helped me land my dream job. The cultural immersion was an added bonus.',
    rating: 5,
  },
  {
    name: 'Daniel Asante',
    role: 'Community Development Volunteer, Ghana',
    text: 'Being part of the borehole water project was the most fulfilling experience of my life. Seeing clean water flow for the first time in a village that had struggled for decades — the joy on people\'s faces is something I will carry with me forever. This organization truly delivers on its promises.',
    rating: 5,
  },
  {
    name: 'Maria Garcia',
    role: 'Sports Coach, Spain',
    text: 'Coaching football to youth in the community taught me as much about myself as it did about coaching. The children\'s enthusiasm was infectious, and the structured program ensured I could make a real impact. I returned home with new perspectives and lifelong friendships.',
    rating: 5,
  },
  {
    name: 'Liam Chen',
    role: 'Finance Intern, Singapore',
    text: 'My banking placement exceeded all expectations. Working in an emerging market gave me insights into financial systems and microfinance that no textbook could provide. The professional mentorship was exceptional, and the cultural experience enriched both my career and personal growth.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-sage dark:bg-[#122A1B]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-cornell mt-2 mb-4">
            Stories From Our Global Community
          </h2>
          <p className="text-charcoal max-w-2xl mx-auto leading-relaxed">
            Hear from volunteers, interns, and partners who have experienced the transformative
            power of our placement programs firsthand.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md hover:border-vogue/20 transition-all relative"
            >
              <Quote className="w-8 h-8 text-cornell/15 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <span key={idx} className="text-gold text-sm">&#9733;</span>
                ))}
              </div>
              <p className="text-sm text-charcoal leading-relaxed mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-cornell text-sm">{t.name}</h4>
                  <p className="text-xs text-charcoal">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
