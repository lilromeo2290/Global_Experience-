'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

const galleryItems: { src: string; alt: string; category: string }[] = [
  { src: '/gallery/gallery-1.jpg', alt: 'Volunteers making an impact in Ghana', category: 'Volunteering' },
  { src: '/gallery/gallery-2.jpg', alt: 'Community outreach and engagement', category: 'Community' },
  { src: '/gallery/gallery-3.jpg', alt: 'Experiencing the beauty of Ghana', category: 'Experience' },
]

const categories = ['All', 'Volunteering', 'Community', 'Experience']

export default function GallerySection() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<typeof galleryItems[0] | null>(null)

  const filtered = filter === 'All' ? galleryItems : galleryItems.filter(item => item.category === filter)

  return (
    <section id="gallery" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-vogue font-semibold text-sm uppercase tracking-wider">Gallery</span>
          <h2 className="text-3xl md:text-4xl font-bold text-cornell mt-2 mb-4">
            Moments of Impact & Inspiration
          </h2>
          <p className="text-charcoal max-w-2xl mx-auto leading-relaxed">
            Explore photos from our placement programs, community projects, volunteer activities,
            and the transformative moments that define our mission.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? 'bg-cornell text-white shadow-md shadow-cornell/20'
                  : 'bg-white text-charcoal hover:bg-cornell/10 hover:text-cornell border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-charcoal/50 text-lg">Gallery images coming soon.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.alt}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl"
              onClick={() => setSelected(item)}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <span className="text-xs bg-cornell/80 text-white px-2 py-0.5 rounded-full">{item.category}</span>
                  <p className="text-white text-sm font-medium mt-1">{item.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Lightbox */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-4xl p-0 bg-black border-none overflow-hidden">
            <DialogTitle className="sr-only">Gallery Image</DialogTitle>
            {selected && (
              <div className="relative">
                <img
                  src={selected.src}
                  alt={selected.alt}
                  className="w-full max-h-[80vh] object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <span className="text-xs bg-cornell/80 text-white px-2 py-0.5 rounded-full">{selected.category}</span>
                  <p className="text-white font-medium mt-1">{selected.alt}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
