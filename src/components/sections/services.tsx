'use client'

import { motion } from 'framer-motion'
import { Plane, MapPin, Briefcase, Home, UtensilsCrossed, CheckCircle2 } from 'lucide-react'

const included = [
  { icon: Plane, title: 'Airport Pickups' },
  { icon: MapPin, title: 'Local Orientation' },
  { icon: UtensilsCrossed, title: 'Feeding' },
  { icon: Home, title: 'Accommodation' },
  { icon: Briefcase, title: 'Placement Organization' },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white dark:bg-[#0A1F12]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold text-cornell mt-2 mb-4">
            What's Included
          </h2>
          <p className="text-charcoal max-w-2xl mx-auto leading-relaxed">
            Everything you need for a smooth and fulfilling placement experience in Ghana is covered in our pricing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <ul className="space-y-5">
            {included.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-border hover:shadow-md hover:border-cornell/20 transition-all"
              >
                <div className="w-10 h-10 bg-cornell/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-cornell" />
                </div>
                <span className="text-lg font-semibold text-charcoal">{item.title}</span>
                <CheckCircle2 className="w-5 h-5 text-vogue ml-auto flex-shrink-0" />
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Why choose us */}
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
      </div>
    </section>
  )
}
