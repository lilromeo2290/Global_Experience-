'use client'

import { motion } from 'framer-motion'
import { Plane, MapPin, Briefcase, Home, UtensilsCrossed, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    id: 'airport-pickups',
    icon: Plane,
    title: 'Airport Pickups',
    desc: 'Seamless airport transfer services ensuring safe and comfortable arrival. Our team greets you at the airport and ensures you reach your accommodation without any hassle, 24/7.',
    color: 'mahogany',
    link: null,
  },
  {
    id: 'local-orientations',
    icon: MapPin,
    title: 'Local Orientations',
    desc: 'Comprehensive orientation programs covering local culture, customs, safety guidelines, transportation, and essential information to help you settle in quickly and confidently.',
    color: 'copper',
    link: null,
  },
  {
    id: 'placement-organisation',
    icon: Briefcase,
    title: 'Placement Organisation',
    desc: 'Expert matching of your skills and interests with the perfect placement opportunity. We organize placements across 12 professional categories including medical, teaching, journalism, and more.',
    color: 'brass',
    link: '/placements',
  },
  {
    id: 'accommodation',
    icon: Home,
    title: 'Accommodation',
    desc: 'Safe, comfortable, and affordable housing options carefully vetted by our team. From host families to shared volunteer houses, we ensure you have a secure and welcoming home throughout your placement.',
    color: 'mahogany',
    link: null,
  },
  {
    id: 'feeding',
    icon: UtensilsCrossed,
    title: 'Feeding',
    desc: 'Nutritious meal plans and daily feeding support throughout your stay. We ensure you are well-nourished with local and familiar cuisine so you can focus on your placement and enjoy your experience.',
    color: 'copper',
    link: null,
  },
]

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  mahogany: { bg: 'bg-mahogany/10', icon: 'text-mahogany', border: 'group-hover:border-mahogany/40' },
  copper: { bg: 'bg-copper/10', icon: 'text-copper', border: 'group-hover:border-copper/40' },
  brass: { bg: 'bg-brass/10', icon: 'text-brass', border: 'group-hover:border-brass/40' },
}

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-copper font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-mahogany mt-2 mb-4">
            Comprehensive Support Every Step of the Way
          </h2>
          <p className="text-dove max-w-2xl mx-auto leading-relaxed">
            From the moment you arrive until your placement is complete, our dedicated team provides
            end-to-end support to ensure a safe, enriching, and transformative experience.
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
                <h3 className="text-lg font-bold text-mahogany mb-2">{service.title}</h3>
                <p className="text-sm text-dove leading-relaxed">{service.desc}</p>
                {service.link && (
                  <div className="mt-4 inline-flex items-center gap-1 text-copper hover:text-mahogany text-sm font-semibold transition-colors">
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
                    className="group block bg-white rounded-2xl p-6 shadow-sm border-2 border-brass/30 hover:shadow-xl hover:border-brass/60 transition-all duration-300"
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
                className="group bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-xl hover:border-mahogany/20 transition-all duration-300"
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
          className="mt-16 bg-gradient-to-r from-mahogany to-copper rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
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
