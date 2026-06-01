'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Heart, Users, GraduationCap, Droplets, ArrowRight, CheckCircle2, Shield } from 'lucide-react'

const impactStories = [
  {
    icon: Heart,
    title: 'Healthcare Access',
    desc: 'Our medical placements have facilitated over 500 hours of direct patient care in underserved communities, providing essential health services to those who need them most.',
    stat: '500+',
    statLabel: 'Patient care hours',
  },
  {
    icon: GraduationCap,
    title: 'Education Empowerment',
    desc: 'Teaching volunteers have helped educate over 1,200 students, improving literacy rates and opening doors to brighter futures for children in rural communities.',
    stat: '1,200+',
    statLabel: 'Students educated',
  },
  {
    icon: Droplets,
    title: 'Clean Water Projects',
    desc: 'Through community development placements, we have helped install 15 borehole water systems providing clean drinking water to over 8,000 community members.',
    stat: '8,000+',
    statLabel: 'People with clean water',
  },
  {
    icon: Users,
    title: 'Youth Empowerment',
    desc: 'Sports and mentorship programs have engaged over 600 young people, building confidence, teamwork skills, and pathways to professional development.',
    stat: '600+',
    statLabel: 'Youth empowered',
  },
]

const sponsorPrograms = [
  { title: 'Sponsor a Student', amount: '$50/month', desc: 'Fund a student placement including accommodation, meals, and program fees for a life-changing volunteer experience.' },
  { title: 'Build a Classroom', amount: '$2,000 one-time', desc: 'Contribute to school building projects that create safe learning environments for children in underserved communities.' },
  { title: 'Clean Water Fund', amount: '$5,000 one-time', desc: 'Sponsor a complete borehole water system providing clean drinking water to an entire village for decades.' },
  { title: 'Medical Supplies', amount: '$100 one-time', desc: 'Provide essential medical supplies and equipment to clinics serving communities with limited healthcare access.' },
]

const accountabilityItems = [
  'Financial reports published annually',
  'Third-party audited accounts',
  'Donor impact updates every quarter',
  '90% of funds go directly to programs',
  'Transparent allocation of resources',
  'Community feedback integration',
]

export default function DonateSection() {
  return (
    <section id="donate" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden mb-16"
        >
          <img
            src="/images/donate-hero.png"
            alt="Support our humanitarian mission"
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cornell/90 via-cornell/70 to-transparent" />
          <div className="absolute inset-0 flex items-center p-8 md:p-12">
            <div className="max-w-lg text-white">
              <span className="text-sm uppercase tracking-wider font-semibold text-vogue-light">Make a Difference</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Your Generosity Changes Lives</h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Every donation directly supports community development projects, volunteer placements,
                and humanitarian programs that transform lives across Africa.
              </p>
              <Button
                size="lg"
                className="bg-white text-cornell hover:bg-white/90 rounded-full px-8"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Donate Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Impact Stories */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-cornell">Impact Stories</h3>
            <p className="text-charcoal mt-2">See how your support transforms communities</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStories.map((story, i) => (
              <motion.div
                key={story.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md hover:border-vogue/30 transition-all text-center"
              >
                <div className="w-12 h-12 bg-cornell/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <story.icon className="w-6 h-6 text-cornell" />
                </div>
                <div className="text-3xl font-bold text-cornell mb-1">{story.stat}</div>
                <div className="text-xs text-vogue font-medium mb-2">{story.statLabel}</div>
                <h4 className="font-semibold text-cornell mb-1">{story.title}</h4>
                <p className="text-xs text-charcoal leading-relaxed">{story.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sponsorship Programs */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-cornell">Sponsorship Programs</h3>
            <p className="text-charcoal mt-2">Choose a program that resonates with your passion</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {sponsorPrograms.map((prog, i) => (
              <motion.div
                key={prog.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-cream rounded-xl p-6 border border-border hover:border-cornell/20 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-cornell">{prog.title}</h4>
                  <span className="text-vogue font-bold text-lg">{prog.amount}</span>
                </div>
                <p className="text-sm text-charcoal mb-4">{prog.desc}</p>
                <Button
                  size="sm"
                  className="bg-cornell hover:bg-cornell-dark text-white rounded-full"
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Sponsor Now
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Community Fundraising + Accountability */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Fundraising */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-cornell to-cornell-dark rounded-2xl p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <h3 className="text-xl font-bold mb-3">Community Fundraising</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Organize fundraising events in your community to support our programs. Whether it is a charity
                run, bake sale, or corporate giving campaign, every effort counts toward transforming lives.
                We provide all the resources and support you need to run a successful fundraiser.
              </p>
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-sm">Register your fundraising event with us</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-sm">Receive your fundraising toolkit and materials</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-sm">Host your event and make a difference</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Accountability */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-cream rounded-2xl p-8 border border-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-cornell" />
              <h3 className="text-xl font-bold text-cornell">Transparent Accountability</h3>
            </div>
            <p className="text-charcoal mb-6 text-sm leading-relaxed">
              We are committed to complete financial transparency. Every donation is tracked, reported,
              and directed toward maximum community impact. Here is how we ensure accountability:
            </p>
            <div className="grid gap-3">
              {accountabilityItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-vogue flex-shrink-0" />
                  <span className="text-sm text-charcoal">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-white rounded-xl p-4 border border-border text-center">
              <div className="text-4xl font-bold text-cornell">90%</div>
              <div className="text-sm text-charcoal">of all funds go directly to programs</div>
              <div className="w-full bg-cornell/10 rounded-full h-3 mt-3">
                <div className="bg-gradient-hero h-3 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
