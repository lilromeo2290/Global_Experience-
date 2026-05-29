'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Stethoscope, BookOpen, Newspaper, Trophy, Building2, Scale, Wheat, TreePine, Hammer, Droplets, Heart } from 'lucide-react'

const categories = [
  {
    icon: Stethoscope,
    title: 'Medical Placements',
    img: '/images/medical-placement.png',
    desc: 'Gain hands-on clinical experience in diverse healthcare settings across Africa. Work alongside experienced professionals in hospitals, clinics, and community health centers.',
    benefits: ['Direct patient care experience', 'Cross-cultural medical practice', 'Professional mentorship', 'Certification support'],
    requirements: ['Medical/nursing enrollment', 'Basic language willingness', 'Immunization records', 'Professional references'],
    subtypes: ['Nursing', 'Midwifery', 'Physiotherapy', 'Psychiatric Care', 'Ear, Nose & Throat (ENT)'],
    color: 'mahogany',
  },
  {
    icon: BookOpen,
    title: 'Teaching Placements',
    img: '/images/teaching-placement.png',
    desc: 'Inspire the next generation by teaching in local schools and educational institutions. Share your knowledge while learning innovative teaching methods in resource-diverse environments.',
    benefits: ['Curriculum development skills', 'Cross-cultural teaching', 'Language immersion', 'Community integration'],
    requirements: ['Teaching qualification or interest', 'Fluent English', 'Patience & adaptability', 'Cultural sensitivity'],
    subtypes: ['Primary Education', 'Secondary Education', 'Special Needs', 'Adult Literacy'],
    color: 'copper',
  },
  {
    icon: Newspaper,
    title: 'Journalism Placements',
    img: '/images/journalism-placement.png',
    desc: 'Build your media portfolio with real-world experience in African newsrooms. Report on compelling stories, develop multimedia content, and gain unique perspectives on global issues.',
    benefits: ['Published portfolio pieces', 'Multimedia storytelling', 'International reporting', 'Network building'],
    requirements: ['Journalism/media enrollment', 'Writing samples', 'Digital literacy', 'Storytelling passion'],
    subtypes: ['TV Stations', 'Radio Stations', 'Print Media', 'Digital Media'],
    color: 'brass',
  },
  {
    icon: Trophy,
    title: 'Sports Placements',
    img: '/images/sports-placement.png',
    desc: 'Coach and develop sports programs in local communities. Use the power of sport to inspire youth, promote health, and build teamwork across cultural boundaries.',
    benefits: ['Coaching certification path', 'Youth development impact', 'Athletic program design', 'Community engagement'],
    requirements: ['Sports background', 'Coaching interest', 'Physical fitness', 'Youth mentoring skills'],
    subtypes: ['Football Clubs', 'Athletics Programs', 'Community Sports', 'Youth Development'],
    color: 'mahogany',
  },
  {
    icon: Building2,
    title: 'Banking & Finance',
    img: '/images/community-project.png',
    desc: 'Gain valuable financial sector experience in emerging markets. Understand African banking systems, microfinance, and financial inclusion initiatives transforming communities.',
    benefits: ['Emerging market exposure', 'Financial systems knowledge', 'Professional networking', 'Cross-border finance'],
    requirements: ['Finance/business studies', 'Analytical skills', 'Professional demeanor', 'Cultural adaptability'],
    subtypes: ['Local Banks', 'Microfinance', 'Insurance', 'Financial Consulting'],
    color: 'copper',
  },
  {
    icon: Scale,
    title: 'Law Placements',
    img: '/images/community-project.png',
    desc: 'Experience the legal system firsthand through placements in local courts, law firms, and legal aid organizations. Understand justice systems and human rights advocacy in African contexts.',
    benefits: ['Courtroom experience', 'Legal research skills', 'Human rights exposure', 'Comparative law knowledge'],
    requirements: ['Law studies enrollment', 'Research proficiency', 'Professional ethics', 'Communication skills'],
    subtypes: ['Local Courts', 'Legal Aid', 'Human Rights Orgs', 'Corporate Law'],
    color: 'brass',
  },
  {
    icon: Wheat,
    title: 'Agriculture Placements',
    img: '/images/agriculture-placement.png',
    desc: 'Work on sustainable agriculture projects that feed communities and drive economic growth. Learn innovative farming techniques and contribute to food security initiatives.',
    benefits: ['Sustainable farming skills', 'Food security impact', 'Agribusiness knowledge', 'Rural development insight'],
    requirements: ['Agricultural interest', 'Physical stamina', 'Environmental awareness', 'Community focus'],
    subtypes: ['Crop Farming', 'Animal Husbandry', 'Agribusiness', 'Sustainable Agriculture'],
    color: 'mahogany',
  },
  {
    icon: TreePine,
    title: 'Tourism & Ecotourism',
    img: '/images/tourism-placement.png',
    desc: 'Explore the intersection of tourism, conservation, and community development. Work with eco-lodges, wildlife sanctuaries, and sustainable tourism enterprises.',
    benefits: ['Eco-tourism expertise', 'Conservation experience', 'Hospitality skills', 'Cultural preservation'],
    requirements: ['Tourism/hospitality interest', 'Environmental awareness', 'Customer service skills', 'Adventure mindset'],
    subtypes: ['Eco-Lodges', 'Wildlife Tours', 'Cultural Tourism', 'Adventure Tourism'],
    color: 'copper',
  },
  {
    icon: Hammer,
    title: 'Community Development',
    img: '/images/school-building.png',
    desc: 'Make a lasting impact through hands-on community infrastructure projects. From building schools to installing water systems, your work directly improves quality of life.',
    benefits: ['Tangible community impact', 'Project management skills', 'Construction experience', 'Team leadership'],
    requirements: ['Physical fitness', 'Teamwork mindset', 'Cultural sensitivity', 'Hands-on attitude'],
    subtypes: ['School Building', 'Borehole Water Projects', 'Rural Community Support', 'Infrastructure Development'],
    color: 'brass',
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

export default function ProgramsSection() {
  return (
    <section id="programs" className="py-20 bg-warm-beige">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-copper font-semibold text-sm uppercase tracking-wider">Placement Programs</span>
          <h2 className="text-3xl md:text-4xl font-bold text-mahogany mt-2 mb-4">
            Explore Our Professional Placement Categories
          </h2>
          <p className="text-dove max-w-2xl mx-auto leading-relaxed">
            Choose from a wide range of professional placement opportunities designed to match your skills,
            interests, and career goals while making a meaningful impact in communities across Africa.
          </p>
        </motion.div>

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
              <div className={`grid lg:grid-cols-5 gap-0`}>
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

                  <Button
                    onClick={() => {
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="bg-mahogany hover:bg-mahogany-dark text-white rounded-full"
                    size="sm"
                  >
                    Apply for This Placement
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
