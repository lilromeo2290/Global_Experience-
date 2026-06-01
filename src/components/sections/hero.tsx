'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, Users, Phone, MapPin } from 'lucide-react'

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Branded Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cornell via-cornell-dark to-cornell" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-vogue/15 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-vogue-light/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vogue/5 rounded-full blur-3xl" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                          radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-32 w-full">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl leading-relaxed"
          >
            We connect students, graduates, interns, researchers, and volunteers with life-changing placement opportunities across healthcare, education, journalism, agriculture, and community development. With offices in four regional capitals across Ghana and expansion plans to Tanzania, Kenya, Nepal, and Zambia, your next adventure awaits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <Button
              size="lg"
              className="bg-white text-cornell hover:bg-white/90 rounded-full px-8 text-base shadow-lg"
              onClick={() => {
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Apply for Placement
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 text-base backdrop-blur-sm"
              onClick={() => {
                document.querySelector('#volunteer')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Users className="mr-2 w-4 h-4" />
              Become a Volunteer
            </Button>
            <Button
              size="lg"
              className="bg-vogue hover:bg-vogue-light text-white rounded-full px-8 text-base shadow-lg shadow-vogue/30"
              onClick={() => {
                document.querySelector('#donate')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Heart className="mr-2 w-4 h-4 fill-white" />
              Donate
            </Button>
          </motion.div>

          {/* Your Project info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-6 max-w-md bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5"
          >
            <h3 className="text-white font-semibold text-base mb-1">Your project</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Applying for your dream project is quick and simple. All we need today to get you started is a deposit of <span className="text-vogue font-semibold">$295</span>.
            </p>
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-vogue flex-shrink-0" />
                <span>Select your trip</span>
              </div>
              <div className="w-px h-5 bg-white/20" />
              <a href="tel:+233244207278" className="flex items-center gap-2 text-white/60 text-sm hover:text-vogue transition-colors">
                <Phone className="w-4 h-4 text-vogue flex-shrink-0" />
                <span>Can&apos;t find your project? <span className="underline">+233 244 207 278 / +233 544 129 556</span></span>
              </a>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 flex flex-wrap items-center gap-6 text-white/60 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Trusted by 2,000+ volunteers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-vogue animate-pulse" />
              <span>4 regional offices in Ghana</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-vogue-light animate-pulse" />
              <span>10+ years of impact</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
