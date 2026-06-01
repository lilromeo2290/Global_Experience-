'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, Phone, Mail, Clock, Globe, Users, Building2, Rocket } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const branches = [
  {
    country: 'Ghana',
    city: 'Accra',
    type: 'Head Office',
    address: '123 Volunteer Lane, Osu, Accra, Ghana',
    phone: '+233 123 456 789',
    email: 'accra@globalexperience.org',
    hours: 'Mon–Fri: 8:00 AM – 5:00 PM | Sat: 9:00 AM – 1:00 PM',
    description: 'Our headquarters and primary coordination centre, managing all placement programs across Ghana and West Africa. The Accra office oversees volunteer onboarding, partner relations, program development, and serves as the main hub for airport pickups and orientation programs for all arriving volunteers.',
    services: ['Volunteer Onboarding', 'Program Coordination', 'Partner Relations', 'Orientation Programs', 'Airport Pickups'],
    color: 'cornell',
  },
  {
    country: 'Ghana',
    city: 'Cape Coast',
    type: 'Regional Office',
    address: '45 Castle Road, Cape Coast, Central Region, Ghana',
    phone: '+233 234 567 890',
    email: 'capecoast@globalexperience.org',
    hours: 'Mon–Fri: 8:30 AM – 4:30 PM',
    description: 'Located in the historic Central Region, our Cape Coast office coordinates placements in teaching hospitals, schools, and community outreach programs. This branch also manages our school building projects and bore hole water initiatives in the surrounding coastal and inland communities.',
    services: ['Medical Placements', 'Teaching Programs', 'School Building Projects', 'Community Outreach'],
    color: 'vogue',
  },
  {
    country: 'Ghana',
    city: 'Ho',
    type: 'Regional Office',
    address: '12 Volta Avenue, Ho, Volta Region, Ghana',
    phone: '+233 345 678 901',
    email: 'ho@globalexperience.org',
    hours: 'Mon–Fri: 8:30 AM – 4:30 PM',
    description: 'Our Volta Regional office in Ho manages placements across one of Ghana\'s most scenic and culturally rich regions. This branch specializes in agriculture placements, ecotourism programs, and community development projects, leveraging the region\'s natural beauty and farming heritage for impactful volunteer experiences.',
    services: ['Agriculture Placements', 'Ecotourism Programs', 'Community Development', 'Bore Hole Projects'],
    color: 'vogue-light',
  },
  {
    country: 'Ghana',
    city: 'Takoradi',
    type: 'Regional Office',
    address: '78 Market Circle Road, Takoradi, Western Region, Ghana',
    phone: '+233 456 789 012',
    email: 'takoradi@globalexperience.org',
    hours: 'Mon–Fri: 8:30 AM – 4:30 PM',
    description: 'Serving the Western Region, our Takoradi office coordinates placements in banking and finance, office administration, and law. The region\'s growing oil and gas industry and commercial activity provide unique opportunities for professional placements in corporate and legal settings.',
    services: ['Banking & Finance', 'Office Administration', 'Law Placements', 'Sports Programs'],
    color: 'cornell',
  },
]

const expansionCountries = [
  {
    country: 'Tanzania',
    flag: '🇹🇿',
    description: 'We plan to establish operations in Tanzania, focusing on ecotourism placements, community health outreach, and education programs. Tanzania\'s rich wildlife heritage, including the Serengeti and Mount Kilimanjaro, offers extraordinary opportunities for conservation and tourism-focused volunteer placements.',
    focusAreas: ['Ecotourism', 'Community Health', 'Education', 'Wildlife Conservation'],
  },
  {
    country: 'Kenya',
    flag: '🇰🇪',
    description: 'Our Kenya expansion will centre on journalism, banking and finance, and tourism placements. Kenya\'s dynamic economy, vibrant media landscape, and world-famous national parks create an ideal environment for professional development and impactful community engagement.',
    focusAreas: ['Journalism & Media', 'Banking & Finance', 'Tourism', 'Sports Development'],
  },
  {
    country: 'Nepal',
    flag: '🇳🇵',
    description: 'Nepal represents our first expansion into Asia, with planned placements in community development, teaching, and healthcare. The country\'s breathtaking Himalayan landscapes and resilient communities offer volunteers a truly unique cultural immersion and meaningful service opportunity.',
    focusAreas: ['Teaching', 'Healthcare', 'Community Development', 'Mountain Ecotourism'],
  },
  {
    country: 'Zambia',
    flag: '🇿🇲',
    description: 'In Zambia, we intend to focus on agriculture placements, school building projects, and bore hole water initiatives. Zambia\'s commitment to community development and its stunning natural wonders, including Victoria Falls, provide a powerful backdrop for transformative volunteer work.',
    focusAreas: ['Agriculture', 'School Building', 'Bore Hole Projects', 'Community Outreach'],
  },
]

const colorMapBg: Record<string, string> = {
  cornell: 'bg-cornell/10',
  vogue: 'bg-vogue/10',
  'vogue-light': 'bg-vogue-light/10',
}
const colorMapText: Record<string, string> = {
  cornell: 'text-cornell',
  vogue: 'text-vogue',
  'vogue-light': 'text-vogue-light',
}
const colorMapBorder: Record<string, string> = {
  cornell: 'border-cornell/30',
  vogue: 'border-vogue/30',
  'vogue-light': 'border-vogue-light/30',
}

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-cornell to-cornell-dark" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-vogue/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2" />
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white/60 text-sm uppercase tracking-wider">About Us</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Our Branches
            </h1>
            <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
              Currently operating across four regional capitals in Ghana, Global Experience Placements
              is expanding to new countries across Africa and Asia. Each branch is staffed by dedicated
              professionals who ensure our volunteers receive the highest quality support and placement services.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Globe, num: '4', label: 'Regional Capitals in Ghana' },
              { icon: Building2, num: '4', label: 'Offices Nationwide' },
              { icon: Users, num: '30+', label: 'Local Staff' },
              { icon: Rocket, num: '4', label: 'Countries Expanding To' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-5 h-5 text-vogue mx-auto mb-1" />
                <div className="text-2xl font-bold text-cornell">{stat.num}</div>
                <div className="text-xs text-charcoal">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branches List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Head Office */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cornell mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6" /> Head Office
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-md border-2 border-cornell/20 overflow-hidden"
          >
            <div className="grid lg:grid-cols-3 gap-0">
              <div className="lg:col-span-1 bg-gradient-to-br from-cornell to-cornell-dark p-8 text-white flex flex-col justify-center">
                <span className="text-white/60 text-xs uppercase tracking-wider mb-2">Head Office</span>
                <h3 className="text-2xl font-bold mb-1">Accra, Ghana</h3>
                <p className="text-white/70 text-sm">National Headquarters</p>
              </div>
              <div className="lg:col-span-2 p-8">
                <p className="text-charcoal leading-relaxed mb-6">{branches[0].description}</p>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-cornell mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-charcoal">{branches[0].address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-cornell flex-shrink-0" />
                    <a href={`tel:${branches[0].phone.replace(/\s/g, '')}`} className="text-sm text-charcoal hover:text-cornell transition-colors">{branches[0].phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-cornell flex-shrink-0" />
                    <a href={`mailto:${branches[0].email}`} className="text-sm text-charcoal hover:text-cornell transition-colors">{branches[0].email}</a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-cornell mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-charcoal">{branches[0].hours}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-cornell mb-2">Services Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {branches[0].services.map((s) => (
                      <span key={s} className="text-xs bg-cornell/10 text-cornell px-3 py-1 rounded-full font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Regional Offices */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-cornell mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6" /> Regional Offices
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.filter(b => b.type === 'Regional Office').map((branch, i) => (
              <motion.div
                key={branch.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-2xl shadow-sm border ${colorMapBorder[branch.color]} overflow-hidden hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className={`w-4 h-4 ${colorMapText[branch.color]}`} />
                        <span className="text-xs font-medium text-charcoal uppercase tracking-wider">{branch.country}</span>
                      </div>
                      <h3 className="text-xl font-bold text-cornell">{branch.city}</h3>
                    </div>
                    <div className={`w-10 h-10 ${colorMapBg[branch.color]} rounded-lg flex items-center justify-center`}>
                      <Building2 className={`w-5 h-5 ${colorMapText[branch.color]}`} />
                    </div>
                  </div>

                  <p className="text-sm text-charcoal leading-relaxed mb-5">{branch.description}</p>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-charcoal mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-charcoal">{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-charcoal flex-shrink-0" />
                      <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="text-xs text-charcoal hover:text-cornell transition-colors">{branch.phone}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-charcoal flex-shrink-0" />
                      <a href={`mailto:${branch.email}`} className="text-xs text-charcoal hover:text-cornell transition-colors">{branch.email}</a>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-charcoal mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-charcoal">{branch.hours}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-cornell mb-2">Services</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {branch.services.map((s) => (
                        <span key={s} className={`text-[11px] ${colorMapBg[branch.color]} ${colorMapText[branch.color]} px-2.5 py-0.5 rounded-full font-medium`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Expansion Plans */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Coming Soon</span>
              <h2 className="text-2xl md:text-3xl font-bold text-cornell mt-2 mb-3 flex items-center justify-center gap-2">
                <Rocket className="w-7 h-7" /> Expanding To New Countries
              </h2>
              <p className="text-charcoal max-w-2xl mx-auto leading-relaxed">
                We are actively working to establish offices in these countries, bringing our trusted placement
                services and community development programs to even more communities across Africa and Asia.
              </p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {expansionCountries.map((country, i) => (
              <motion.div
                key={country.country}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-vogue/30 overflow-hidden hover:shadow-lg hover:border-vogue/50 transition-all duration-300 relative"
              >
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-vogue/10 text-vogue px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{country.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold text-cornell">{country.country}</h3>
                      <span className="text-xs text-vogue font-medium">Planned Expansion</span>
                    </div>
                  </div>

                  <p className="text-sm text-charcoal leading-relaxed mb-5">{country.description}</p>

                  <div>
                    <h4 className="text-xs font-semibold text-cornell mb-2">Planned Focus Areas</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {country.focusAreas.map((area) => (
                        <span key={area} className="text-[11px] bg-vogue/10 text-vogue px-2.5 py-0.5 rounded-full font-medium">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-cornell to-vogue rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to Visit One of Our Offices?</h3>
            <p className="text-white/80 max-w-xl mx-auto mb-6 leading-relaxed">
              Whether you want to learn more about our programs in person or need assistance with your application,
              our friendly team at any branch is ready to help you get started on your journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#contact">
                <Button size="lg" className="bg-white text-cornell hover:bg-white/90 rounded-full px-8">
                  Contact Us
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
