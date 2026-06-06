'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

const events = [
  { title: 'Summer Volunteer Program Open Day', date: 'Jun 15, 2025', location: 'Accra, Ghana', type: 'Open Day' },
  { title: 'International Youth Day Community Event', date: 'Aug 12, 2025', location: 'Kumasi, Ghana', type: 'Community' },
  { title: 'Medical Placement Information Session', date: 'Jul 20, 2025', location: 'Virtual (Zoom)', type: 'Webinar' },
  { title: 'Annual Fundraising Gala', date: 'Sep 5, 2025', location: 'Accra, Ghana', type: 'Fundraiser' },
]

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 bg-cream dark:bg-[#0F1F15]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Blog & Events</span>
          <h2 className="text-3xl md:text-4xl font-bold text-cornell mt-2 mb-4">
            Latest News & Upcoming Events
          </h2>
          <p className="text-charcoal max-w-2xl mx-auto leading-relaxed">
            Stay informed about our impact stories, volunteer experiences, upcoming events,
            and the latest developments in our programs and community projects.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white dark:bg-[#122A1B] rounded-xl p-6 shadow-sm border border-border">
              <h3 className="font-bold text-cornell text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-vogue" /> Upcoming Events
              </h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.title} className="border-l-3 border-cornell pl-4 py-1">
                    <span className="text-[10px] uppercase tracking-wider text-vogue font-semibold">{event.type}</span>
                    <h4 className="font-semibold text-cornell text-sm mt-0.5">{event.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-charcoal flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {event.date}
                      </span>
                      <span className="text-xs text-charcoal dark:text-white/80">{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 border-cornell text-cornell hover:bg-cornell hover:text-white rounded-full"
              >
                View All Events
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
