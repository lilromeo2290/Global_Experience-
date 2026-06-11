'use client'

import { motion } from 'framer-motion'
import { MapPin, Building2, Globe, Palmtree, Mountain, Briefcase, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const currentDestinations = [
  {
    city: 'Cape Coast',
    slug: 'cape-coast',
    country: 'Ghana',
    type: 'Regional Office',
    description: 'Located in the historic Central Region, our Cape Coast office coordinates placements in teaching hospitals, schools, and community outreach programs. It also manages school building projects and bore hole water initiatives in surrounding communities.',
    highlights: ['Medical Placements', 'Teaching Programs', 'School Building', 'Community Outreach'],
    color: 'vogue',
  },
  {
    city: 'Volta \u2013 HO',
    slug: 'volta-ho',
    country: 'Ghana',
    type: 'Head Office',
    description: 'Our headquarters and primary coordination centre in the Volta Region, managing all placement programs across Ghana and West Africa. The Ho office oversees volunteer onboarding, partner relations, and serves as the main hub for airport pickups and orientation programs.',
    highlights: ['Volunteer Onboarding', 'Program Coordination', 'Airport Pickups', 'Orientation Programs'],
    color: 'cornell',
  },
  {
    city: 'Takoradi',
    slug: 'takoradi',
    country: 'Ghana',
    type: 'Regional Office',
    description: 'Serving the Western Region, our Takoradi office coordinates placements in banking and finance, office administration, and law. The region\'s growing commercial activity provides unique opportunities for professional placements in corporate and legal settings.',
    highlights: ['Banking & Finance', 'Office Administration', 'Law Placements', 'Sports Programs'],
    color: 'cornell',
  },
  {
    city: 'Accra',
    slug: 'accra',
    country: 'Ghana',
    type: 'Regional Office',
    description: 'Our Accra office in the Greater Accra Region coordinates placements across the capital city, focusing on professional placements in corporate, legal, and administrative settings. Accra\'s vibrant economy and diverse industries provide excellent opportunities for volunteer and professional development.',
    highlights: ['Corporate Placements', 'Office Administration', 'Law Placements', 'Finance'],
    color: 'vogue',
  },
]

const comingSoonDestinations = [
  {
    country: 'Tanzania',
    flag: '\uD83C\uDDF9\uD83C\uDDFF',
    description: 'Ecotourism placements, community health outreach, and education programs near the Serengeti and Mount Kilimanjaro.',
    focus: ['Ecotourism', 'Community Health', 'Education', 'Wildlife Conservation'],
    icon: Mountain,
  },
  {
    country: 'Kenya',
    flag: '\uD83C\uDDF0\uD83C\uDDEA',
    description: 'Journalism, banking and finance, and tourism placements in a dynamic economy with world-famous national parks.',
    focus: ['Journalism & Media', 'Banking & Finance', 'Tourism', 'Sports Development'],
    icon: Globe,
  },
  {
    country: 'Nepal',
    flag: '\uD83C\uDDF3\uD83C\uDDF5',
    description: 'Community development, teaching, and healthcare placements amid breathtaking Himalayan landscapes and resilient communities.',
    focus: ['Teaching', 'Healthcare', 'Community Development', 'Mountain Ecotourism'],
    icon: Mountain,
  },
  {
    country: 'Zambia',
    flag: '\uD83C\uDDFF\uD83C\uDDF2',
    description: 'Agriculture placements, school building projects, and bore hole water initiatives near the stunning Victoria Falls.',
    focus: ['Agriculture', 'School Building', 'Bore Hole Projects', 'Community Outreach'],
    icon: Palmtree,
  },
]

const branchSlugMap: Record<string, string> = {
  'cape-coast': 'Cape Coast',
  'volta-ho': 'Ho',
  'takoradi': 'Takoradi',
  'accra': 'Accra',
}

export default function DestinationsSection() {

  return (
    <section id="destinations" className="py-20 bg-white dark:bg-[#0A1F12]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Destinations</span>
          <h2 className="text-3xl md:text-4xl font-bold text-cornell mt-2 mb-4">
            Where We Operate
          </h2>
          <p className="text-charcoal dark:text-white/70 max-w-2xl mx-auto leading-relaxed">
            Global Experience Placements currently operates across four regional capitals in Ghana,
            with plans to expand into new countries across Africa and Asia. Each destination offers
            unique cultural experiences and impactful volunteer opportunities.
          </p>
        </motion.div>

        {/* Current Destinations Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {currentDestinations.map((dest, i) => (
            <Link
              key={dest.city}
              href={`/apply?branch=${encodeURIComponent(branchSlugMap[dest.slug] || dest.city)}`}
              className="block group"
            >
              <motion.div
                id={dest.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-cream dark:bg-[#122A1B] rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full"
              >
                {/* Card Header */}
                <div className={`${
                  dest.type === 'Head Office'
                    ? 'bg-gradient-to-r from-cornell to-cornell-dark'
                    : 'bg-gradient-to-r from-vogue to-vogue-dark'
                } p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-white/80" />
                        <span className="text-white/70 text-xs uppercase tracking-wider">{dest.country}</span>
                      </div>
                      <h3 className="text-2xl font-bold">{dest.city}</h3>
                    </div>
                    <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  {dest.type === 'Head Office' && (
                    <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full">
                      Head Office
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-charcoal dark:text-white/70 text-sm leading-relaxed mb-4">
                    {dest.description}
                  </p>
                  <div className="mb-5">
                    <div className="flex flex-wrap gap-2">
                      {dest.highlights.map((h) => (
                        <span
                          key={h}
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            dest.color === 'cornell'
                              ? 'bg-cornell/10 text-cornell dark:bg-cornell/20 dark:text-white'
                              : 'bg-vogue/10 text-vogue dark:bg-vogue/20 dark:text-vogue-light'
                          }`}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Apply Now Button */}
                  <div className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                    dest.type === 'Head Office'
                      ? 'bg-cornell group-hover:bg-cornell-dark text-white'
                      : 'bg-vogue group-hover:bg-vogue-dark text-white'
                  }`}>
                    <Briefcase className="w-4 h-4" />
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-center mb-10">
            <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Coming Soon</span>
            <h3 className="text-2xl md:text-3xl font-bold text-cornell mt-2 mb-3">
              Expanding To New Countries
            </h3>
            <p className="text-charcoal dark:text-white/70 max-w-2xl mx-auto leading-relaxed">
              We are actively working to establish offices in these countries, bringing our trusted placement
              services and community development programs to even more communities across Africa and Asia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {comingSoonDestinations.map((dest, i) => (
              <motion.div
                key={dest.country}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-cream dark:bg-[#122A1B] rounded-xl p-5 border-2 border-dashed border-vogue/30 hover:border-vogue/50 hover:shadow-md transition-all duration-300 relative group"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-vogue/10 text-vogue px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{dest.flag}</span>
                  <div>
                    <h4 className="text-lg font-bold text-cornell">{dest.country}</h4>
                    <span className="text-xs text-vogue font-medium">Planned Expansion</span>
                  </div>
                </div>
                <p className="text-xs text-charcoal dark:text-white/70 leading-relaxed mb-3">
                  {dest.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {dest.focus.map((area) => (
                    <span key={area} className="text-[10px] bg-vogue/10 text-vogue dark:bg-vogue/20 dark:text-vogue-light px-2 py-0.5 rounded-full font-medium">
                      {area}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
