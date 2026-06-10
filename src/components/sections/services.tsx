'use client'

import { motion } from 'framer-motion'
import { Plane, MapPin, Briefcase, Home, UtensilsCrossed, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    id: 'airport-pickups',
    icon: Plane,
    title: 'Airport Pickups',
    desc: 'We provide reliable airport pickup services to ensure smooth and stress-free arrival. Our team welcomes clients at the airport, assists with luggage, and arranges comfortable transportation to their destination.',
    color: 'cornell',
    link: null,
  },
  {
    id: 'local-orientations',
    icon: MapPin,
    title: 'Local Orientation',
    desc: 'Our local orientation service helps newcomers quickly adapt to their new environment. We provide guidance on transportation, shopping centers, healthcare facilities, banking services, cultural practices, and other essential information to make settling in easier.',
    color: 'vogue',
    link: null,
  },
  {
    id: 'placement-organisation',
    icon: Briefcase,
    title: 'Placement Organization',
    desc: 'We assist with placement arrangements by connecting individuals with suitable institutions, workplaces, training centers, or opportunities that match their goals and qualifications. Our team ensures a seamless placement process from start to finish.',
    color: 'vogue-light',
    link: '/placements',
  },
  {
    id: 'accommodation',
    icon: Home,
    title: 'Accommodation',
    desc: 'Finding safe and comfortable accommodation is one of our priorities. We help clients secure suitable housing options based on their preferences, budget, and location requirements, ensuring a convenient and welcoming living environment.',
    color: 'cornell',
    link: null,
  },
  {
    id: 'feeding',
    icon: UtensilsCrossed,
    title: 'Feeding',
    desc: 'We provide feeding arrangements to ensure clients have access to nutritious and quality meals. Whether for short-term stays or extended periods, we help organize meal plans and catering services that meet individual dietary needs and preferences.',
    color: 'vogue',
    link: null,
  },
]

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  cornell: { bg: 'bg-cornell/10', icon: 'text-cornell', border: 'group-hover:border-cornell/40' },
  vogue: { bg: 'bg-vogue/10', icon: 'text-vogue', border: 'group-hover:border-vogue/40' },
  'vogue-light': { bg: 'bg-vogue-light/10', icon: 'text-vogue-light', border: 'group-hover:border-vogue-light/40' },
}

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white dark:bg-[#0A1F12]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold text-cornell mt-2 mb-4">
            What's Included
          </h2>
          <p className="text-charcoal max-w-2xl mx-auto leading-relaxed">
            Everything you need for a smooth and fulfilling placement experience in Ghana is covered in our pricing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const colors = colorMap[service.color]
            const cardContent = (
              <>
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <h3 className="text-lg font-bold text-cornell mb-2">{service.title}</h3>
                <p className="text-sm text-charcoal leading-relaxed">{service.desc}</p>
                {service.link && (
                  <div className="mt-4 inline-flex items-center gap-1 text-vogue hover:text-cornell text-sm font-semibold transition-colors">
                    View Placements <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </>
            )

            if (service.link) {
              return (
                <motion.div
                  key={service.title}
                  id={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Link
                    href={service.link}
                    className="group block bg-white rounded-2xl p-6 shadow-sm border-2 border-vogue-light/30 hover:shadow-xl hover:border-vogue-light/60 transition-all duration-300"
                  >
                    {cardContent}
                  </Link>
                </motion.div>
              )
            }

            return (
              <motion.div
                key={service.title}
                id={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-xl hover:border-cornell/20 transition-all duration-300"
              >
                {cardContent}
              </motion.div>
            )
          })}
        </div>

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
