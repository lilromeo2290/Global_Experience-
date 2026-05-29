'use client'

import { motion } from 'framer-motion'
import { Heart, Target, Eye, Shield, Users, Globe, Award, HandHeart } from 'lucide-react'

const values = [
  { icon: Heart, title: 'Compassion', desc: 'We lead with empathy and genuine care for every individual and community we serve.' },
  { icon: Shield, title: 'Integrity', desc: 'Transparency and accountability guide every action and decision we make.' },
  { icon: Users, title: 'Inclusivity', desc: 'We embrace diversity and create opportunities accessible to all backgrounds.' },
  { icon: Globe, title: 'Global Impact', desc: 'Our reach extends across borders, connecting communities worldwide.' },
  { icon: Award, title: 'Excellence', desc: 'We strive for the highest standards in placement quality and support.' },
  { icon: HandHeart, title: 'Empowerment', desc: 'We equip individuals with skills and experiences that transform their futures.' },
]

const milestones = [
  { year: '2014', title: 'Founded', desc: 'Started with a vision to connect international volunteers with African communities.' },
  { year: '2016', title: 'First 100 Volunteers', desc: 'Reached our first major milestone of placing 100 international volunteers.' },
  { year: '2018', title: 'Multi-Country Expansion', desc: 'Expanded placement programs to 5 countries across West and East Africa.' },
  { year: '2020', title: 'Digital Transformation', desc: 'Launched online application system and virtual orientation programs.' },
  { year: '2022', title: '1,000 Volunteers', desc: 'Celebrated placing over 1,000 volunteers across diverse professional sectors.' },
  { year: '2024', title: 'Global Recognition', desc: 'Received international recognition for excellence in volunteer placement services.' },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-warm-cream">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-copper font-semibold text-sm uppercase tracking-wider">About Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-mahogany mt-2 mb-4">
            Who We Are & What Drives Us
          </h2>
          <p className="text-dove max-w-2xl mx-auto leading-relaxed">
            For over a decade, Global Experience Placements has been the bridge between passionate individuals
            and communities in need. We believe that meaningful cultural exchange and professional placements
            have the power to transform both volunteers and the communities they serve.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div id="mission-vision" className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-md border border-border relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-mahogany/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-14 h-14 bg-mahogany/10 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-mahogany" />
              </div>
              <h3 className="text-xl font-bold text-mahogany mb-3">Our Mission</h3>
              <p className="text-dove leading-relaxed">
                To deliver high-quality placement and support services that connect students, graduates,
                volunteers, and professionals with impactful opportunities across diverse sectors worldwide.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-md border border-border relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-copper/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-14 h-14 bg-copper/10 rounded-xl flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-copper" />
              </div>
              <h3 className="text-xl font-bold text-mahogany mb-3">Our Vision</h3>
              <p className="text-dove leading-relaxed">
                To be the most trusted international placement organization fostering professional growth,
                global partnerships, and community transformation.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-mahogany">Our Core Values</h3>
            <p className="text-dove mt-2">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md hover:border-copper/30 transition-all duration-300 text-center group"
              >
                <div className="w-12 h-12 bg-mahogany/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-mahogany group-hover:text-white transition-colors">
                  <val.icon className="w-6 h-6 text-mahogany group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-semibold text-mahogany mb-1">{val.title}</h4>
                <p className="text-sm text-dove">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className=""
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-mahogany">Our Journey</h3>
            <p className="text-dove mt-2">Key milestones in our mission to empower communities</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-mahogany/20 -translate-x-1/2" />
            <div className="space-y-8">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-4 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-border inline-block">
                      <span className="text-copper font-bold text-lg">{milestone.year}</span>
                      <h4 className="font-semibold text-mahogany">{milestone.title}</h4>
                      <p className="text-sm text-dove mt-1">{milestone.desc}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-mahogany rounded-full border-4 border-white shadow-md z-10 flex-shrink-0" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
