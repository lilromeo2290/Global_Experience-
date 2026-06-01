'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, Users, Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    src: '/images/slider-3.jpg',
    alt: 'Global Experience - Making a Difference',
    position: 'center center',
  },
  {
    src: '/images/slider-volunteer-ghana.jpg',
    alt: 'Volunteer Programs in Ghana',
    position: 'center center',
  },
  {
    src: '/images/slider-adaklu-mountains.jpg',
    alt: 'Adaklu Mountains - Paragliding Excellence',
    position: 'center center',
  },
  {
    src: '/images/slider-1.jpg',
    alt: 'Community Development Projects',
    position: 'center center',
  },
  {
    src: '/images/slider-5.jpg',
    alt: 'Explore Ghana with Global Experience',
    position: 'center center',
  },
  {
    src: '/images/slider-2.jpg',
    alt: 'Life-Changing Placements Abroad',
    position: 'center center',
  },
  {
    src: '/images/slider-4.jpg',
    alt: 'Discover New Horizons',
    position: 'center center',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index: number) => {
    setCurrent(index)
  }

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent((c) => (c + 1) % slides.length)

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Slider Background Images - background-size:cover NEVER stretches, only crops edges */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${slides[current].src})`,
            backgroundSize: 'cover',
            backgroundPosition: slides[current].position,
            backgroundRepeat: 'no-repeat',
          }}
        />
      </AnimatePresence>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                          radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Slider Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-8 h-3 bg-white'
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-32 w-full z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <Button
              size="lg"
              className="bg-cornell hover:bg-cornell-dark text-white rounded-full px-8 text-base shadow-lg"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block z-10"
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
