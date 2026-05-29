'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Stethoscope, BookOpen, Radio, Users, Trophy, Building2, Landmark, Scale, Wheat, TreePine, Heart } from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    icon: Stethoscope,
    title: 'Medical Placement in Teaching Hospitals',
    img: '/images/medical-placement.png',
    desc: 'Gain invaluable hands-on clinical experience in leading teaching hospitals across Africa. Work alongside seasoned medical professionals in real healthcare settings, developing practical skills that will shape your career in medicine, nursing, or allied health sciences.',
    benefits: ['Direct patient care experience', 'Cross-cultural medical practice', 'Professional mentorship from specialists', 'Clinical skills certification'],
    requirements: ['Medical/nursing enrollment', 'Basic language willingness', 'Immunization records', 'Professional references'],
    subtypes: ['Nursing', 'Midwifery', 'Physiotherapy', 'Psychiatric Care', 'Ear, Nose & Throat (ENT)'],
    color: 'mahogany',
  },
  {
    icon: BookOpen,
    title: 'Teaching',
    img: '/images/teaching-placement.png',
    desc: 'Inspire the next generation by teaching in local schools and educational institutions. Share your knowledge while learning innovative teaching methods in resource-diverse environments, making a direct impact on students\' academic journeys and future opportunities.',
    benefits: ['Curriculum development skills', 'Cross-cultural teaching experience', 'Language immersion', 'Community integration'],
    requirements: ['Teaching qualification or interest', 'Fluent English', 'Patience & adaptability', 'Cultural sensitivity'],
    subtypes: ['Primary Schools', 'Secondary Schools', 'Special Needs Education', 'Adult Literacy'],
    color: 'copper',
  },
  {
    icon: Radio,
    title: 'Journalism',
    img: '/images/journalism-placement.png',
    desc: 'Build your media portfolio with real-world experience in broadcasting and newsrooms. Report on compelling stories, develop multimedia content, and gain unique perspectives on African media landscapes while working alongside experienced journalists and producers.',
    benefits: ['Published portfolio pieces', 'Multimedia storytelling', 'International reporting experience', 'Professional network building'],
    requirements: ['Journalism/media enrollment', 'Writing samples', 'Digital literacy', 'Storytelling passion'],
    subtypes: ['Television', 'Radio Stations'],
    color: 'brass',
  },
  {
    icon: Users,
    title: 'Community Outreach',
    img: '/images/community-project.png',
    desc: 'Make a lasting difference through community outreach programs that address pressing social needs. Engage directly with local communities on health education, youth empowerment, women\'s initiatives, and social welfare projects that create sustainable change.',
    benefits: ['Direct community impact', 'Grassroots development experience', 'Cultural immersion', 'Program design skills'],
    requirements: ['Community development interest', 'Strong communication skills', 'Cultural sensitivity', 'Passion for social change'],
    subtypes: ['Health Education', 'Youth Empowerment', 'Women\'s Initiatives', 'Social Welfare Programs'],
    color: 'mahogany',
  },
  {
    icon: Trophy,
    title: 'Sports',
    img: '/images/sports-placement.png',
    desc: 'Coach and develop sports programs in local communities. Use the power of sport to inspire youth, promote health and discipline, and build teamwork across cultural boundaries while gaining valuable coaching and athletic development experience.',
    benefits: ['Coaching certification path', 'Youth development impact', 'Athletic program design', 'Community engagement'],
    requirements: ['Sports background', 'Coaching interest', 'Physical fitness', 'Youth mentoring skills'],
    subtypes: ['Football Clubs'],
    color: 'copper',
  },
  {
    icon: Building2,
    title: 'Office Administration',
    img: '/images/community-project.png',
    desc: 'Develop essential professional skills through office administration placements in dynamic organizational settings. Gain hands-on experience in business operations, management systems, and administrative processes that are transferable across any industry.',
    benefits: ['Professional office skills', 'Business operations exposure', 'Management systems knowledge', 'Organizational communication'],
    requirements: ['Business/admin interest', 'Computer literacy', 'Organizational skills', 'Professional demeanor'],
    subtypes: ['NGO Administration', 'Corporate Offices', 'Government Agencies', 'Startup Operations'],
    color: 'brass',
  },
  {
    icon: Landmark,
    title: 'Banking and Finance',
    img: '/images/community-project.png',
    desc: 'Gain valuable financial sector experience in emerging markets. Understand African banking systems, microfinance operations, and financial inclusion initiatives that are transforming communities and driving economic growth across the continent.',
    benefits: ['Emerging market exposure', 'Financial systems knowledge', 'Professional networking', 'Cross-border finance insight'],
    requirements: ['Finance/business studies', 'Analytical skills', 'Professional demeanor', 'Cultural adaptability'],
    subtypes: ['Local Banks'],
    color: 'mahogany',
  },
  {
    icon: Scale,
    title: 'Law Placements',
    img: '/images/community-project.png',
    desc: 'Experience the legal system firsthand through placements in local courts and legal organizations. Observe courtroom proceedings, assist with legal research, and understand justice systems and human rights advocacy within African legal contexts.',
    benefits: ['Courtroom experience', 'Legal research skills', 'Human rights exposure', 'Comparative law knowledge'],
    requirements: ['Law studies enrollment', 'Research proficiency', 'Professional ethics', 'Communication skills'],
    subtypes: ['Local Courts'],
    color: 'copper',
  },
  {
    icon: Wheat,
    title: 'Agriculture Placement',
    img: '/images/agriculture-placement.png',
    desc: 'Work on sustainable agriculture projects that feed communities and drive economic growth. Learn innovative farming techniques, contribute to food security initiatives, and gain practical experience in agribusiness and rural development.',
    benefits: ['Sustainable farming skills', 'Food security impact', 'Agribusiness knowledge', 'Rural development insight'],
    requirements: ['Agricultural interest', 'Physical stamina', 'Environmental awareness', 'Community focus'],
    subtypes: ['Crop Farming', 'Animal Husbandry', 'Agribusiness', 'Sustainable Agriculture'],
    color: 'brass',
  },
  {
    icon: TreePine,
    title: 'Tourism and Ecotourism',
    img: '/images/tourism-placement.png',
    desc: 'Explore the intersection of tourism, conservation, and community development. Work with eco-lodges, wildlife sanctuaries, and sustainable tourism enterprises while gaining hospitality skills and contributing to environmental preservation efforts.',
    benefits: ['Eco-tourism expertise', 'Conservation experience', 'Hospitality skills', 'Cultural preservation'],
    requirements: ['Tourism/hospitality interest', 'Environmental awareness', 'Customer service skills', 'Adventure mindset'],
    subtypes: ['Eco-Lodges', 'Wildlife Tours', 'Cultural Tourism', 'Adventure Tourism'],
    color: 'mahogany',
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

export default function PlacementsPage() {
  return (
    <div className="min-h-screen bg-warm-beige">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-mahogany to-mahogany-dark" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-copper/10 rounded-full translate-y-1/2 -translate-x-1/2" />
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
              Placement Organization
            </h1>
            <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
              We organize professional placements across diverse sectors, carefully matching your skills and
              career goals with impactful opportunities. Explore our placement categories and find the
              perfect fit for your professional development journey.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Placement Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="grid lg:grid-cols-5 gap-0">
                {/* Image */}
                <div className={`lg:col-span-1 ${i % 2 !== 0 ? 'lg:order-last' : ''}`}>
                  <div className="h-48 lg:h-full bg-warm-sand overflow-hidden">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-4 p-6 md:p-8">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-11 h-11 ${colorMapBg[cat.color]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <cat.icon className={`w-5 h-5 ${colorMapText[cat.color]}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-mahogany">{cat.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {cat.subtypes.map((sub) => (
                          <span key={sub} className="text-xs bg-warm-sand text-dove px-2 py-0.5 rounded-full">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-dove mb-5 leading-relaxed text-sm">{cat.desc}</p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    <div>
                      <h4 className="text-sm font-semibold text-mahogany mb-2 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-copper" /> Benefits
                      </h4>
                      <ul className="space-y-1">
                        {cat.benefits.map((b) => (
                          <li key={b} className="text-xs text-dove flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 bg-copper rounded-full mt-1.5 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-mahogany mb-2 flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-brass" /> Requirements
                      </h4>
                      <ul className="space-y-1">
                        {cat.requirements.map((r) => (
                          <li key={r} className="text-xs text-dove flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 bg-brass rounded-full mt-1.5 flex-shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link href="/#contact">
                    <Button
                      className="bg-mahogany hover:bg-mahogany-dark text-white rounded-full"
                      size="sm"
                    >
                      Apply for This Placement
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-mahogany to-copper rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to Start Your Placement?</h3>
            <p className="text-white/80 max-w-xl mx-auto mb-6 leading-relaxed">
              Take the first step toward a transformative professional experience. Contact us today
              to discuss which placement category best aligns with your skills and career goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#contact">
                <Button size="lg" className="bg-white text-mahogany hover:bg-white/90 rounded-full px-8">
                  Apply Now
                  <ArrowRight className="ml-2 w-4 h-4" />
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
    </div>
  )
}
