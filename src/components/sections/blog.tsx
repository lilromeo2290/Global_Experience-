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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-vogue" />
            <h3 className="font-bold text-cornell text-lg">Upcoming Events</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {events.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-[#122A1B] rounded-xl p-5 shadow-sm border border-border hover:shadow-md hover:border-vogue/30 transition-all"
              >
                <span className="text-[10px] uppercase tracking-wider text-vogue font-semibold bg-vogue/10 px-2 py-0.5 rounded-full">{event.type}</span>
                <h4 className="font-semibold text-cornell text-sm mt-3 mb-2">{event.title}</h4>
                <div className="flex items-center gap-1 text-xs text-charcoal dark:text-white/70 mb-1">
                  <Calendar className="w-3 h-3" /> {event.date}
                </div>
                <p className="text-xs text-charcoal/70 dark:text-white/50">{event.location}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="sm"
              className="border-cornell text-cornell hover:bg-cornell hover:text-white rounded-full px-8"
            >
              View All Events
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
