'use client'

import { motion } from 'framer-motion'
import { Linkedin, Mail, Twitter } from 'lucide-react'

const team = [
  {
    name: 'Dr. Kwame Mensah',
    role: 'Founder & Executive Director',
    img: '/images/about-team.png',
    bio: 'With over 15 years in international development, Dr. Mensah founded Global Experience Placements to bridge the gap between skilled volunteers and communities in need across Africa.',
  },
  {
    name: 'Sarah Johnson',
    role: 'Director of Programs',
    img: '/images/volunteer-group.png',
    bio: 'Sarah brings a decade of experience in volunteer coordination and program design, ensuring every placement delivers maximum impact for both participants and communities.',
  },
  {
    name: 'Ama Osei',
    role: 'Head of Volunteer Services',
    img: '/images/community-project.png',
    bio: 'Ama oversees all volunteer welfare and support services, from airport pickups to daily check-ins, making sure every volunteer feels safe, valued, and supported.',
  },
  {
    name: 'David Chen',
    role: 'International Partnerships Lead',
    img: '/images/hero-volunteers.png',
    bio: 'David builds and maintains relationships with universities, NGOs, and corporate partners worldwide, expanding the reach and diversity of our placement network.',
  },
  {
    name: 'Fatima Ibrahim',
    role: 'Community Development Coordinator',
    img: '/images/school-building.png',
    bio: 'Fatima works directly with local communities to identify needs, design projects, and ensure our programs create sustainable, lasting change on the ground.',
  },
  {
    name: 'Michael Agyeman',
    role: 'Finance & Operations Manager',
    img: '/images/agriculture-placement.png',
    bio: 'Michael ensures transparent financial management and smooth operational logistics, maintaining the trust and accountability our donors and partners expect.',
  },
  {
    name: 'Ruth Adjei',
    role: 'Medical Placements Supervisor',
    img: '/images/medical-placement.png',
    bio: 'As a trained nurse, Ruth coordinates all healthcare placements, ensuring compliance with medical standards and meaningful clinical experiences for every volunteer.',
  },
  {
    name: 'Kofi Asante',
    role: 'Communications & Media Lead',
    img: '/images/journalism-placement.png',
    bio: 'Kofi manages our digital presence, storytelling, and media relations, sharing the inspiring stories of our volunteers and the communities they transform.',
  },
]

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
          <span className="text-copper font-semibold text-sm uppercase tracking-wider">Our Team</span>
          <h2 className="text-3xl md:text-4xl font-bold text-mahogany mt-2 mb-4">
            Meet the People Behind Our Mission
          </h2>
          <p className="text-dove max-w-2xl mx-auto leading-relaxed">
            Our dedicated team of professionals brings together diverse expertise in international
            development, volunteer coordination, community engagement, and humanitarian support.
            Together, we are committed to making every placement a transformative experience.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl hover:border-copper/30 transition-all duration-300 group"
            >
              <div className="aspect-[4/5] bg-warm-sand overflow-hidden relative">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3">
                  <a href="#" aria-label={`${member.name} LinkedIn`} className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                    <Linkedin className="w-3.5 h-3.5 text-white" />
                  </a>
                  <a href="#" aria-label={`Email ${member.name}`} className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-white" />
                  </a>
                  <a href="#" aria-label={`${member.name} Twitter`} className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors">
                    <Twitter className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-mahogany">{member.name}</h4>
                <p className="text-sm text-copper font-medium mt-0.5">{member.role}</p>
                <p className="text-xs text-dove mt-2 leading-relaxed">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-warm-cream rounded-2xl p-8 md:p-12 text-center border border-border"
        >
          <h3 className="text-2xl font-bold text-mahogany mb-3">Want to Join Our Team?</h3>
          <p className="text-dove max-w-xl mx-auto mb-6 leading-relaxed">
            We are always looking for passionate, dedicated individuals who share our vision of
            empowering communities through global volunteerism. If you want to make a difference,
            we would love to hear from you.
          </p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 bg-mahogany hover:bg-mahogany-dark text-white rounded-full px-8 py-3 font-medium transition-colors"
          >
            Get In Touch
          </button>
        </motion.div>
      </div>
    </section>
  )
}
