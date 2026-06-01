'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, ArrowRight } from 'lucide-react'

export default function NewsletterSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-cornell via-cornell-dark to-[#8C1515] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 translate-x-1/2" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Stay Connected With Our Mission
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
            Subscribe to our newsletter for inspiring stories, program updates, volunteer opportunities,
            and community impact reports delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Input
              placeholder="Enter your email address"
              type="email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full px-6 py-3 focus:border-white/40 focus:ring-white/20"
            />
            <Button
              size="lg"
              className="bg-white text-cornell hover:bg-white/90 rounded-full px-8 shadow-lg"
            >
              Subscribe
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-white/40 mt-3">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
