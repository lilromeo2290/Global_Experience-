'use client'

import { motion } from 'framer-motion'
import { Linkedin, Mail } from 'lucide-react'

export default function TeamSection() {
  return (
    <section id="team" className="py-20 bg-white dark:bg-[#0A1F12]">
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

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* CEO Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-[#122A1B] rounded-2xl overflow-hidden shadow-md border border-border hover:shadow-xl hover:border-vogue/30 transition-all duration-300 group">
              {/* Photo */}
              <div className="aspect-[4/3] bg-ivory overflow-hidden relative">
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
              <div className="p-6 md:p-8">
                <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Leadership</span>
                <h3 className="text-xl md:text-2xl font-bold text-cornell mt-2 mb-1">John Success Akotia</h3>
                <p className="text-vogue font-medium mb-3">Chief Executive Officer (CEO)</p>
                <p className="text-charcoal dark:text-white/80 text-sm leading-relaxed mb-4">
                  As the founder and driving force behind Global Experience Placements, John Success Akotia
                  leads the organization with a clear vision: to deliver high-quality placement and support
                  services that connect students, graduates, volunteers, and professionals with impactful
                  opportunities across diverse sectors worldwide.
                </p>
                <div className="flex items-center gap-3">
                  <a href="#" className="w-9 h-9 bg-cornell/10 rounded-full flex items-center justify-center hover:bg-cornell hover:text-white transition-all group/icon">
                    <Linkedin className="w-4 h-4 text-cornell group-hover/icon:text-white" />
                  </a>
                  <a href="mailto:info@globalexperiencegh.org" className="w-9 h-9 bg-cornell/10 rounded-full flex items-center justify-center hover:bg-cornell hover:text-white transition-all group/icon">
                    <Mail className="w-4 h-4 text-cornell group-hover/icon:text-white" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* IT Director Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-[#122A1B] rounded-2xl overflow-hidden shadow-md border border-border hover:shadow-xl hover:border-vogue/30 transition-all duration-300 group">
              {/* Photo */}
              <div className="aspect-[4/3] bg-ivory overflow-hidden relative">
                <img
                  src="/images/team-it-director.png"
                  alt="Raymond Romeo Dravie"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
                  <a href="#" aria-label="Raymond Romeo Dravie LinkedIn" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                  <a href="mailto:info@globalexperiencegh.org" aria-label="Email Raymond Romeo Dravie" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                    <Mail className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 md:p-8">
                <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Technology</span>
                <h3 className="text-xl md:text-2xl font-bold text-cornell mt-2 mb-1">Raymond Romeo Dravie</h3>
                <p className="text-vogue font-medium mb-3">Director of IT</p>
                <p className="text-charcoal dark:text-white/80 text-sm leading-relaxed mb-3">
                  Has more than 10 years experience in ICT with a strong background in Algorithmic Designs,
                  Data Centers, IT Infrastructure, Software Development, Network, Management and Leadership.
                </p>
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-cornell mb-1.5">Expertise:</h4>
                  <p className="text-charcoal dark:text-white/80 text-xs leading-relaxed">
                    Knowledge and experience in Networking, Programming &amp; Databases: C++, PHP, CSS, JavaScript,
                    VB.NET, Java, MySQL, Website Development
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a href="#" className="w-9 h-9 bg-cornell/10 rounded-full flex items-center justify-center hover:bg-cornell hover:text-white transition-all group/icon">
                    <Linkedin className="w-4 h-4 text-cornell group-hover/icon:text-white" />
                  </a>
                  <a href="mailto:info@globalexperiencegh.org" className="w-9 h-9 bg-cornell/10 rounded-full flex items-center justify-center hover:bg-cornell hover:text-white transition-all group/icon">
                    <Mail className="w-4 h-4 text-cornell group-hover/icon:text-white" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

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
