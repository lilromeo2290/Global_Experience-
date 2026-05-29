'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react'

const blogPosts = [
  {
    title: 'How Medical Volunteers Are Transforming Rural Healthcare in Ghana',
    excerpt: 'Discover how our medical placement volunteers have provided over 500 hours of essential healthcare services to communities with limited access to medical facilities.',
    category: 'Impact Stories',
    date: 'May 15, 2025',
    readTime: '5 min read',
    img: '/images/medical-placement.png',
  },
  {
    title: 'A Complete Guide to Volunteering Abroad: Everything You Need to Know',
    excerpt: 'From choosing the right program to preparing for your journey, this comprehensive guide covers everything first-time international volunteers need to know.',
    category: 'Volunteer Guide',
    date: 'May 8, 2025',
    readTime: '8 min read',
    img: '/images/volunteer-group.png',
  },
  {
    title: 'Clean Water Changes Everything: Our Borehole Project Impact Report',
    excerpt: 'Our latest community development project has brought clean drinking water to over 8,000 people. Read the full impact report and see how your support makes a difference.',
    category: 'Project Update',
    date: 'Apr 28, 2025',
    readTime: '6 min read',
    img: '/images/community-project.png',
  },
]

const events = [
  { title: 'Summer Volunteer Program Open Day', date: 'Jun 15, 2025', location: 'Accra, Ghana', type: 'Open Day' },
  { title: 'International Youth Day Community Event', date: 'Aug 12, 2025', location: 'Kumasi, Ghana', type: 'Community' },
  { title: 'Medical Placement Information Session', date: 'Jul 20, 2025', location: 'Virtual (Zoom)', type: 'Webinar' },
  { title: 'Annual Fundraising Gala', date: 'Sep 5, 2025', location: 'Accra, Ghana', type: 'Fundraiser' },
]

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 bg-warm-cream">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-copper font-semibold text-sm uppercase tracking-wider">Blog & Events</span>
          <h2 className="text-3xl md:text-4xl font-bold text-mahogany mt-2 mb-4">
            Latest News & Upcoming Events
          </h2>
          <p className="text-dove max-w-2xl mx-auto leading-relaxed">
            Stay informed about our impact stories, volunteer experiences, upcoming events,
            and the latest developments in our programs and community projects.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Blog Posts */}
          <div className="lg:col-span-2 space-y-6">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md hover:border-copper/20 transition-all group flex flex-col sm:flex-row"
              >
                <div className="sm:w-1/3 h-48 sm:h-auto bg-warm-sand overflow-hidden flex-shrink-0">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs bg-mahogany/10 text-mahogany px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {post.category}
                    </span>
                    <span className="text-xs text-dove flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                    <span className="text-xs text-dove flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-mahogany mb-2 group-hover:text-copper transition-colors text-sm leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-dove leading-relaxed mb-3">{post.excerpt}</p>
                  <button className="text-copper hover:text-mahogany text-xs font-semibold flex items-center gap-1 transition-colors">
                    Read More <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Events Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border sticky top-24">
              <h3 className="font-bold text-mahogany text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-copper" /> Upcoming Events
              </h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.title} className="border-l-3 border-mahogany pl-4 py-1">
                    <span className="text-[10px] uppercase tracking-wider text-copper font-semibold">{event.type}</span>
                    <h4 className="font-semibold text-mahogany text-sm mt-0.5">{event.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-dove flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {event.date}
                      </span>
                      <span className="text-xs text-dove">{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 border-mahogany text-mahogany hover:bg-mahogany hover:text-white rounded-full"
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
