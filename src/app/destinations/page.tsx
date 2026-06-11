'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import DestinationsSection from '@/components/sections/destinations'

export default function DestinationsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header Banner */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-vogue to-vogue-dark" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cornell/10 rounded-full translate-y-1/2 -translate-x-1/2" />
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
                Destinations
              </h1>
              <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
                Explore our current and upcoming destination offices across Ghana and beyond.
                Each location offers unique cultural experiences and impactful volunteer opportunities.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <DestinationsSection />
      </main>
      <Footer />
    </div>
  )
}
