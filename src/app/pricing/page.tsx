'use client'

import { motion } from 'framer-motion'
import { Plane, MapPin, Briefcase, Home, UtensilsCrossed, CheckCircle2, ArrowLeft, Shield, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const included = [
  { icon: Plane, title: 'Airport Pickups', desc: 'We provide reliable airport pickup services to ensure smooth and stress-free arrival. Our team welcomes clients at the airport, assists with luggage, and arranges comfortable transportation to their destination.' },
  { icon: MapPin, title: 'Local Orientation', desc: 'Our local orientation service helps newcomers quickly adapt to their new environment. We provide guidance on transportation, shopping centers, healthcare facilities, banking services, cultural practices, and other essential information to make settling in easier.' },
  { icon: UtensilsCrossed, title: 'Feeding', desc: 'We provide feeding arrangements to ensure clients have access to nutritious and quality meals. Whether for short-term stays or extended periods, we help organize meal plans and catering services that meet individual dietary needs and preferences.' },
  { icon: Home, title: 'Accommodation', desc: 'Finding safe and comfortable accommodation is one of our priorities. We help clients secure suitable housing options based on their preferences, budget, and location requirements, ensuring a convenient and welcoming living environment.' },
  { icon: Briefcase, title: 'Placement Organization', desc: 'We assist with placement arrangements by connecting individuals with suitable institutions, workplaces, training centers, or opportunities that match their goals and qualifications. Our team ensures a seamless placement process from start to finish.' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
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
                Pricing
              </h1>
              <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
                Everything you need for a smooth and fulfilling placement experience in Ghana is covered in our pricing.
              </p>
            </motion.div>
          </div>
        </div>

        {/* What's Included */}
        <div className="max-w-5xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-cornell mb-4">
              What&apos;s Included
            </h2>
            <p className="text-charcoal max-w-2xl mx-auto leading-relaxed">
              Our pricing covers all the essential services to ensure your placement in Ghana is safe, comfortable, and rewarding.
            </p>
          </motion.div>

          <div className="space-y-6">
            {included.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-5 bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg hover:border-cornell/20 transition-all"
              >
                <div className="w-12 h-12 bg-cornell/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-cornell" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-cornell">{item.title}</h3>
                    <CheckCircle2 className="w-5 h-5 text-vogue flex-shrink-0" />
                  </div>
                  <p className="text-sm text-charcoal/80 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Registration Fee Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-cornell/10 border-2 border-cornell/40 rounded-xl p-6 shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-cornell rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-cornell uppercase tracking-wide">Registration / Application Fee</p>
                <p className="text-sm text-charcoal/90 mt-1 font-semibold">
                  A Registration / Application fee of <span className="text-lg font-black text-cornell">$200</span> is required to secure your placement after your application is approved.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-cornell to-vogue rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Global Experience?</h3>
                <p className="text-white/80 leading-relaxed">
                  With over a decade of experience, we provide the most comprehensive and trusted
                  volunteer placement services in Africa. Our dedicated team, extensive local network,
                  and commitment to your safety and growth set us apart.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: '24/7', label: 'On-ground Support' },
                  { num: '100%', label: 'Placement Guarantee' },
                  { num: '15+', label: 'Countries Covered' },
                  { num: '10+', label: 'Years Experience' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{item.num}</div>
                    <div className="text-sm text-white/70">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link href="/apply">
              <Button size="lg" className="bg-cornell hover:bg-cornell-dark text-white rounded-full px-8 text-base">
                Apply for a Placement
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
