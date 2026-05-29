'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, Users, Globe, ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    image: '/images/slider-1.jpg',
    description: 'We connect students, graduates, interns, researchers, and volunteers with life-changing placement opportunities across healthcare, education, journalism, agriculture, and community development.',
  },
  {
    image: '/images/slider-2.jpg',
    description: 'From medical placements in teaching hospitals to community outreach programs, your skills can create lasting change in communities that need it most.',
  },
  {
    image: '/images/slider-3.jpg',
    description: 'Join our community projects building schools and drilling bore holes to provide clean, drinkable water — creating infrastructure that serves generations.',
  },
  {
    image: '/images/slider-4.jpg',
    description: 'Gain invaluable professional experience through placements in banking, law, journalism, sports, tourism, and more — all while making a genuine difference.',
  },
  {
    image: '/images/slider-5.jpg',
    description: 'With offices in four regional capitals across Ghana and expansion plans to Tanzania, Kenya, Nepal, and Zambia, your next adventure awaits.',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  // Auto-advance
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sliding Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].highlight}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Bright overlay - lighter than typical so images are more visible */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-mahogany/15 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-copper/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-32 w-full">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/25">
                <Globe className="w-4 h-4 text-copper" />
                <span className="text-sm text-white/90 font-medium">International Volunteer & Placement Organization</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Empowering Communities Through{' '}
            <span className="bg-gradient-to-r from-[#DA8A67] to-[#C88A3D] bg-clip-text text-transparent">
              Global Volunteerism
            </span>{' '}
            &amp; Professional Placements
          </motion.h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${current}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl leading-relaxed"
            >
              {slides[current].description}
            </motion.p>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-3"
          >
            <Button
              size="lg"
              className="bg-mahogany hover:bg-mahogany-dark text-white rounded-full px-8 text-base shadow-lg shadow-mahogany/30"
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
              className="bg-copper hover:bg-copper-light text-white rounded-full px-8 text-base shadow-lg shadow-copper/30"
              onClick={() => {
                document.querySelector('#donate')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Heart className="mr-2 w-4 h-4 fill-white" />
              Donate
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12 flex flex-wrap items-center gap-6 text-white/60 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Trusted by 2,000+ volunteers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-copper animate-pulse" />
              <span>4 regional offices in Ghana</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brass animate-pulse" />
              <span>10+ years of impact</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slider Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slider Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative group"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              className={`transition-all duration-500 rounded-full ${
                i === current
                  ? 'w-10 h-3 bg-copper'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/70'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex items-center gap-2 text-white/50 text-sm">
        <span className="text-white font-bold text-lg">{String(current + 1).padStart(2, '0')}</span>
        <span>/</span>
        <span>{String(slides.length).padStart(2, '0')}</span>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/10">
        <motion.div
          key={current}
          initial={{ width: '0%' }}
          animate={{ width: isPaused ? undefined : '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-copper"
          onAnimationComplete={() => {
            if (!isPaused) nextSlide()
          }}
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 hidden md:block"
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
