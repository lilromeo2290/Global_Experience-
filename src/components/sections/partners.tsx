'use client'

import { motion } from 'framer-motion'

const partners = [
  { name: 'UNICEF', desc: 'Child welfare & education' },
  { name: 'WHO', desc: 'Health programs' },
  { name: 'UNESCO', desc: 'Cultural exchange' },
  { name: 'Red Cross', desc: 'Humanitarian support' },
  { name: 'African Union', desc: 'Continental development' },
  { name: 'British Council', desc: 'Educational partnerships' },
  { name: 'USAID', desc: 'Development assistance' },
  { name: 'GIZ', desc: 'International cooperation' },
]

export default function PartnersSection() {
  return (
    <section className="py-16 bg-white border-y border-border">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Partners & Affiliations</span>
          <h2 className="text-2xl md:text-3xl font-bold text-cornell mt-2 mb-3">
            Trusted by Leading Organizations
          </h2>
          <p className="text-charcoal max-w-xl mx-auto text-sm">
            We collaborate with internationally recognized organizations to deliver impactful programs
            and ensure the highest standards of volunteer placement services.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="bg-cream rounded-xl p-5 text-center border border-border hover:border-cornell/20 hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 bg-cornell/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-cornell font-bold text-sm">{partner.name.charAt(0)}</span>
              </div>
              <h4 className="font-bold text-cornell text-sm">{partner.name}</h4>
              <p className="text-xs text-charcoal mt-0.5">{partner.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
