'use client'

import { motion } from 'framer-motion'
import { Linkedin, Mail } from 'lucide-react'

export default function TeamSection() {
  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Our Team</span>
          <h2 className="text-3xl md:text-4xl font-bold text-cornell mt-2 mb-4">
            Meet Our Leadership
          </h2>
          <p className="text-charcoal max-w-2xl mx-auto leading-relaxed">
            Our dedicated team of professionals brings together diverse expertise in international
            development, volunteer coordination, community engagement, and humanitarian support.
            Together, we are committed to making every placement a transformative experience.
          </p>
        </motion.div>

        {/* CEO Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-border hover:shadow-xl hover:border-vogue/30 transition-all duration-300 group">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Photo */}
              <div className="aspect-square md:aspect-auto md:min-h-[420px] bg-ivory overflow-hidden relative">
                <img
                  src="/images/team-ceo.jpg"
                  alt="John Success Akotia"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
                  <a href="#" aria-label="John Success Akotia LinkedIn" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                  <a href="mailto:info@globalexperiencegh.org" aria-label="Email John Success Akotia" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                    <Mail className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Leadership</span>
                <h3 className="text-2xl md:text-3xl font-bold text-cornell mt-2 mb-1">John Success Akotia</h3>
                <p className="text-vogue font-medium text-lg mb-4">Chief Executive Officer (CEO)</p>
                <p className="text-charcoal leading-relaxed mb-6">
                  As the founder and driving force behind Global Experience Placements, John Success Akotia
                  leads the organization with a clear vision: to deliver high-quality placement and support
                  services that connect students, graduates, volunteers, and professionals with impactful
                  opportunities across diverse sectors worldwide. With deep expertise in international
                  volunteer coordination and community development, he has built a trusted organization
                  that fosters professional growth, global partnerships, and community transformation.
                </p>
                <div className="flex items-center gap-4">
                  <a href="#" className="w-10 h-10 bg-cornell/10 rounded-full flex items-center justify-center hover:bg-cornell hover:text-white transition-all group/icon">
                    <Linkedin className="w-5 h-5 text-cornell group-hover/icon:text-white" />
                  </a>
                  <a href="mailto:info@globalexperiencegh.org" className="w-10 h-10 bg-cornell/10 rounded-full flex items-center justify-center hover:bg-cornell hover:text-white transition-all group/icon">
                    <Mail className="w-5 h-5 text-cornell group-hover/icon:text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-cream rounded-2xl p-8 md:p-12 text-center border border-border"
        >
          <h3 className="text-2xl font-bold text-cornell mb-3">Want to Join Our Team?</h3>
          <p className="text-charcoal max-w-xl mx-auto mb-6 leading-relaxed">
            We are always looking for passionate, dedicated individuals who share our vision of
            empowering communities through global volunteerism. If you want to make a difference,
            we would love to hear from you.
          </p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 bg-cornell hover:bg-cornell-dark text-white rounded-full px-8 py-3 font-medium transition-colors"
          >
            Get In Touch
          </button>
        </motion.div>
      </div>
    </section>
  )
}
