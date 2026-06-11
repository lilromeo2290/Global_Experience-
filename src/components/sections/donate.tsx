'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Heart, ArrowRight, Shield, CheckCircle2,
  Stethoscope, BookOpen, Trophy, Monitor,
  Sprout, GraduationCap, Users, Wrench, Building2,
} from 'lucide-react'
import DonationModal from '@/components/DonationModal'
import OutreachDonationModal from '@/components/OutreachDonationModal'

const donationAreas = [
  { icon: Stethoscope, title: 'Medical Equipment and Items', desc: 'Essential medical supplies and equipment for clinics and hospitals serving underserved communities.' },
  { icon: BookOpen, title: 'Teaching Materials', desc: 'Books, stationery, and educational resources to support teaching programs in rural and urban schools.' },
  { icon: Trophy, title: 'Sport Items', desc: 'Footballs, jerseys, shin guards, football boots, training accessories, and other sports equipment for youth programs.' },
  { icon: Monitor, title: 'Office Equipment', desc: 'Laptops, phones, computers, and other essential office technology to support administrative and professional placements.' },
  { icon: Sprout, title: 'Agriculture Products and Equipment', desc: 'Farming tools, seeds, fertilizers, and agricultural machinery to support community farming initiatives.' },
  { icon: GraduationCap, title: 'Educational Scholarship', desc: 'Financial support for students to access quality education, vocational training, and professional development opportunities.' },
  { icon: Users, title: 'Conferences', desc: 'Funding for community conferences, workshops, and knowledge-sharing events that drive development and awareness.' },
  { icon: Wrench, title: 'NVTI / Vocational Training', desc: 'Support for vocational skills training including driving, hairdressing, forklifting, electrical installation, masonry, carpentry, welding, auto mechanics, catering, dressmaking, and more.' },
  { icon: Building2, title: 'Community Service', desc: 'Building of schools, borehole drilling for clean drinking water, and other vital community infrastructure projects.' },
]

export default function DonateSection() {
  const [donateOpen, setDonateOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState('')

  return (
    <section id="donate" className="py-20 bg-white dark:bg-[#0A1F12]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Donation Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-cornell/10 dark:bg-cornell/20 text-cornell px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Heart className="w-4 h-4" />
            Donation
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-cornell dark:text-white mb-6">
            Make a Difference Today
          </h2>
          <p className="text-charcoal dark:text-white/70 max-w-3xl mx-auto text-base leading-relaxed mb-4">
            Every day, countless individuals and communities face challenges that limit their access to education,
            healthcare, shelter, food, and opportunities for a better future. Our NGO is committed to creating lasting
            change by providing support, empowerment, and sustainable development programs to those who need it most.
          </p>
          <p className="text-charcoal dark:text-white/80 max-w-2xl mx-auto text-lg font-semibold leading-relaxed mb-4">
            Your donation is more than a financial contribution — it is an investment in hope, dignity, and transformation.
          </p>
          <p className="text-charcoal dark:text-white/70 max-w-3xl mx-auto text-base leading-relaxed mb-4">
            Global Experience, Ghana welcomes donations from NGOs, Corporate Organizations, Government Institutions,
            and Individuals for the organization&apos;s Outreach Program in the areas listed below.
          </p>
          <p className="text-cornell dark:text-vogue font-medium max-w-2xl mx-auto text-base leading-relaxed">
            Every amount donated helps us reach vulnerable individuals, support community projects, provide educational
            resources, improve livelihoods, and respond to urgent humanitarian needs.
          </p>
        </motion.div>

        {/* Donation Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-cornell">Outreach Program Areas</h3>
            <p className="text-charcoal dark:text-white/70 mt-2">By contributing to a campaign listed below, you help ensure that our work to humanity continues.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {donationAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedProgram(area.title)}
                className="bg-cream dark:bg-[#122A1B] rounded-xl p-6 shadow-sm border border-border hover:shadow-md hover:border-vogue/30 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-cornell/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cornell group-hover:text-white transition-colors">
                  <area.icon className="w-6 h-6 text-cornell group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-cornell dark:text-white mb-2 text-sm">{area.title}</h4>
                <p className="text-xs text-charcoal dark:text-white/70 leading-relaxed">{area.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-cornell text-xs font-semibold">
                  <span>Click to donate</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* General Fund & Payment Info */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* General Fund */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-cornell to-cornell-dark rounded-2xl p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6" />
                <h3 className="text-xl font-bold">General Fund</h3>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">
                Your donation and payment plan may either be a one-time gift, a monthly contribution,
                an annual contribution, or a part of a matching gift program.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-sm">One-time gift</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-sm">Monthly contribution</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-sm">Annual contribution</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <span className="text-sm">Matching gift program</span>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-white text-cornell hover:bg-white/90 rounded-full px-8"
                onClick={() => setDonateOpen(true)}
              >
                Donate Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Secure Donation Platform */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-cream dark:bg-[#122A1B] rounded-2xl p-8 border border-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-cornell" />
              <h3 className="text-xl font-bold text-cornell">Secure Donation Platform</h3>
            </div>
            <p className="text-charcoal dark:text-white/70 mb-6 text-sm leading-relaxed">
              Donations both local and international can be made through our Foundation&apos;s Online Secured
              donation platform. We ensure that every contribution is processed safely and reaches the
              communities that need it most.
            </p>
            <div className="grid gap-3 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-vogue flex-shrink-0" />
                <span className="text-sm text-charcoal dark:text-white/70">Secure online payment processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-vogue flex-shrink-0" />
                <span className="text-sm text-charcoal dark:text-white/70">Local and international donations accepted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-vogue flex-shrink-0" />
                <span className="text-sm text-charcoal dark:text-white/70">Transparent tracking of all contributions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-vogue flex-shrink-0" />
                <span className="text-sm text-charcoal dark:text-white/70">Regular impact updates to donors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-vogue flex-shrink-0" />
                <span className="text-sm text-charcoal dark:text-white/70">Tax-deductible receipts provided</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-vogue flex-shrink-0" />
                <span className="text-sm text-charcoal dark:text-white/70">Financial reports published annually</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#0A1F12] rounded-xl p-5 border border-border text-center">
              <p className="text-charcoal dark:text-white/70 text-sm leading-relaxed mb-4">
                Thank you for your kind donation and support. Your generosity makes it possible for us to continue
                serving communities across Ghana and beyond.
              </p>
              <Button
                size="lg"
                className="bg-cornell hover:bg-cornell-dark text-white rounded-full px-8"
                onClick={() => setDonateOpen(true)}
              >
                Donate Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal open={donateOpen} onClose={() => setDonateOpen(false)} />

      {/* Outreach Donation Modal */}
      <OutreachDonationModal
        open={!!selectedProgram}
        onClose={() => setSelectedProgram('')}
        programArea={selectedProgram}
      />
    </section>
  )
}
