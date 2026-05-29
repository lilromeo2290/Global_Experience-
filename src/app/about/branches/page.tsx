'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, Phone, Mail, Clock, Globe, Users, Building2 } from 'lucide-react'
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
    description: 'Our headquarters and primary coordination centre, managing all placement programs across West Africa. The Accra office oversees volunteer onboarding, partner relations, and program development for the entire organization.',
    services: ['Volunteer Onboarding', 'Program Coordination', 'Partner Relations', 'Orientation Programs'],
    color: 'mahogany',
  },
  {
    country: 'Ghana',
    city: 'Kumasi',
    type: 'Regional Office',
    address: '45 Asante Avenue, Kumasi, Ashanti Region, Ghana',
    phone: '+233 234 567 890',
    email: 'kumasi@globalexperience.org',
    hours: 'Mon–Fri: 8:30 AM – 4:30 PM',
    description: 'Serving the Ashanti Region and central Ghana, our Kumasi office coordinates placements in teaching hospitals, schools, and community outreach programs throughout the region. This branch is essential for our medical and education placement operations.',
    services: ['Medical Placements', 'Teaching Programs', 'Community Outreach'],
    color: 'copper',
  },
  {
    country: 'Ghana',
    city: 'Tamale',
    type: 'Regional Office',
    address: '12 Dagbon Road, Tamale, Northern Region, Ghana',
    phone: '+233 345 678 901',
    email: 'tamale@globalexperience.org',
    hours: 'Mon–Fri: 8:30 AM – 4:30 PM',
    description: 'Our northernmost branch manages placements across the Northern, North East, and Savannah Regions. This office is pivotal for agriculture placements, community development projects, and bore hole water initiatives in rural communities.',
    services: ['Agriculture Placements', 'Bore Hole Projects', 'Rural Community Development'],
    color: 'brass',
  },
  {
    country: 'Kenya',
    city: 'Nairobi',
    type: 'Regional Office',
    address: '78 Kenyatta Avenue, Nairobi, Kenya',
    phone: '+254 123 456 789',
    email: 'nairobi@globalexperience.org',
    hours: 'Mon–Fri: 8:00 AM – 5:00 PM | Sat: 9:00 AM – 12:00 PM',
    description: 'Our East African hub coordinates placements across Kenya and surrounding countries. The Nairobi office manages programs in journalism, banking and finance, and tourism, leveraging Kenya\'s dynamic economy and diverse landscapes for impactful volunteer experiences.',
    services: ['Journalism Placements', 'Banking & Finance', 'Tourism & Ecotourism'],
    color: 'mahogany',
  },
  {
    country: 'Tanzania',
    city: 'Dar es Salaam',
    type: 'Regional Office',
    address: '34 Independence Road, Dar es Salaam, Tanzania',
    phone: '+255 123 456 789',
    email: 'dar@globalexperience.org',
    hours: 'Mon–Fri: 8:30 AM – 4:30 PM',
    description: 'Our Tanzania branch focuses on ecotourism placements, community health outreach, and education programs. Located in the commercial capital, this office also coordinates placements in Zanzibar and the northern safari circuit regions.',
    services: ['Ecotourism Programs', 'Community Health', 'Education Placements'],
    color: 'copper',
  },
  {
    country: 'Uganda',
    city: 'Kampala',
    type: 'Regional Office',
    address: '56 Parliament Avenue, Kampala, Uganda',
    phone: '+256 123 456 789',
    email: 'kampala@globalexperience.org',
    hours: 'Mon–Fri: 8:00 AM – 5:00 PM',
    description: 'The Kampala office oversees placements in Uganda, with a strong focus on community development, school building projects, and sports programs. Uganda\'s welcoming culture and growing economy provide rich environments for volunteer impact.',
    services: ['School Building Projects', 'Sports Programs', 'Law Placements'],
    color: 'brass',
  },
  {
    country: 'United Kingdom',
    city: 'London',
    type: 'Liaison Office',
    address: '15 Voluntary Lane, Camden, London, NW1 0AB, United Kingdom',
    phone: '+44 20 1234 5678',
    email: 'london@globalexperience.org',
    hours: 'Mon–Fri: 9:00 AM – 5:30 PM',
    description: 'Our London liaison office serves as the primary point of contact for European volunteers, handling pre-departure orientation, visa support, and partnership development with European universities and organizations. This office also manages fundraising and donor relations.',
    services: ['Pre-departure Orientation', 'Visa Support', 'University Partnerships', 'Fundraising'],
    color: 'mahogany',
  },
  {
    country: 'United States',
    city: 'Washington D.C.',
    type: 'Liaison Office',
    address: '1800 Pennsylvania Ave NW, Suite 400, Washington D.C., 20006, USA',
    phone: '+1 202 123 4567',
    email: 'dc@globalexperience.org',
    hours: 'Mon–Fri: 9:00 AM – 5:00 PM EST',
    description: 'The Washington D.C. office manages relationships with North American universities, handles volunteer recruitment from the United States and Canada, and coordinates grant applications and institutional partnerships with development organizations.',
    services: ['University Partnerships', 'Volunteer Recruitment', 'Grant Applications', 'Institutional Relations'],
    color: 'copper',
  },
]

const colorMapBg: Record<string, string> = {
  mahogany: 'bg-mahogany/10',
  copper: 'bg-copper/10',
  brass: 'bg-brass/10',
}
const colorMapText: Record<string, string> = {
  mahogany: 'text-mahogany',
  copper: 'text-copper',
  brass: 'text-brass',
}
const colorMapBorder: Record<string, string> = {
  mahogany: 'border-mahogany/30',
  copper: 'border-copper/30',
  brass: 'border-brass/30',
}

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-warm-cream">
      <Navbar />

      {/* Header */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-mahogany to-mahogany-dark" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-copper/10 rounded-full translate-y-1/2 -translate-x-1/2" />
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
              With offices across Africa and liaison offices in Europe and North America, Global Experience
              Placements maintains a truly global presence. Each branch is staffed by dedicated professionals
              who ensure our volunteers receive the highest quality support and placement services.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Globe, num: '5', label: 'Countries' },
              { icon: Building2, num: '8', label: 'Offices Worldwide' },
              { icon: Users, num: '50+', label: 'Local Staff' },
              { icon: MapPin, num: '3', label: 'Continents Covered' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-5 h-5 text-copper mx-auto mb-1" />
                <div className="text-2xl font-bold text-mahogany">{stat.num}</div>
                <div className="text-xs text-dove">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branches List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Head Office first */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-mahogany mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6" /> Head Office
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-md border-2 border-mahogany/20 overflow-hidden"
          >
            <div className="grid lg:grid-cols-3 gap-0">
              <div className="lg:col-span-1 bg-gradient-to-br from-mahogany to-mahogany-dark p-8 text-white flex flex-col justify-center">
                <span className="text-white/60 text-xs uppercase tracking-wider mb-2">Head Office</span>
                <h3 className="text-2xl font-bold mb-1">Accra, Ghana</h3>
                <p className="text-white/70 text-sm">West Africa Regional Hub</p>
              </div>
              <div className="lg:col-span-2 p-8">
                <p className="text-dove leading-relaxed mb-6">{branches[0].description}</p>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-mahogany mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-dove">{branches[0].address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-mahogany flex-shrink-0" />
                    <a href={`tel:${branches[0].phone.replace(/\s/g, '')}`} className="text-sm text-dove hover:text-mahogany transition-colors">{branches[0].phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-mahogany flex-shrink-0" />
                    <a href={`mailto:${branches[0].email}`} className="text-sm text-dove hover:text-mahogany transition-colors">{branches[0].email}</a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-mahogany mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-dove">{branches[0].hours}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-mahogany mb-2">Services Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {branches[0].services.map((s) => (
                      <span key={s} className="text-xs bg-mahogany/10 text-mahogany px-3 py-1 rounded-full font-medium">
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-mahogany mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6" /> Regional Offices
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
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
                        <span className="text-xs font-medium text-dove uppercase tracking-wider">{branch.country}</span>
                      </div>
                      <h3 className="text-xl font-bold text-mahogany">{branch.city}</h3>
                    </div>
                    <div className={`w-10 h-10 ${colorMapBg[branch.color]} rounded-lg flex items-center justify-center`}>
                      <Building2 className={`w-5 h-5 ${colorMapText[branch.color]}`} />
                    </div>
                  </div>

                  <p className="text-sm text-dove leading-relaxed mb-5">{branch.description}</p>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-dove mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-dove">{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-dove flex-shrink-0" />
                      <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="text-xs text-dove hover:text-mahogany transition-colors">{branch.phone}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-dove flex-shrink-0" />
                      <a href={`mailto:${branch.email}`} className="text-xs text-dove hover:text-mahogany transition-colors">{branch.email}</a>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-dove mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-dove">{branch.hours}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-mahogany mb-2">Services</h4>
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

        {/* Liaison Offices */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-mahogany mb-6 flex items-center gap-2">
            <Users className="w-6 h-6" /> Liaison Offices
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {branches.filter(b => b.type === 'Liaison Office').map((branch, i) => (
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
                        <span className="text-xs font-medium text-dove uppercase tracking-wider">{branch.country}</span>
                      </div>
                      <h3 className="text-xl font-bold text-mahogany">{branch.city}</h3>
                      <span className="text-xs text-copper font-medium">Liaison &amp; Recruitment</span>
                    </div>
                    <div className={`w-10 h-10 ${colorMapBg[branch.color]} rounded-lg flex items-center justify-center`}>
                      <Globe className={`w-5 h-5 ${colorMapText[branch.color]}`} />
                    </div>
                  </div>

                  <p className="text-sm text-dove leading-relaxed mb-5">{branch.description}</p>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-dove mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-dove">{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-dove flex-shrink-0" />
                      <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="text-xs text-dove hover:text-mahogany transition-colors">{branch.phone}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-dove flex-shrink-0" />
                      <a href={`mailto:${branch.email}`} className="text-xs text-dove hover:text-mahogany transition-colors">{branch.email}</a>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-dove mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-dove">{branch.hours}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-mahogany mb-2">Services</h4>
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

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-mahogany to-copper rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden"
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
                <Button size="lg" className="bg-white text-mahogany hover:bg-white/90 rounded-full px-8">
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
