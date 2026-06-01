'use client'

import { useState, useEffect } from 'react'
import { SlidersHorizontal, Plus, Trash2, Save, RefreshCw, Eye, X } from 'lucide-react'

interface Slide {
  id: string
  src: string
  alt: string | null
  overlay: string
  order: number
  active: boolean
}

export default function AdminSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [previewSlide, setPreviewSlide] = useState<Slide | null>(null)
  const [form, setForm] = useState({ src: '', alt: '', overlay: 'dark' })

  useEffect(() => {
    fetch('/api/slides').then(r => r.json()).then(data => {
      setSlides(data)
      setLoading(false)
    })
  }, [])

  const handleAdd = async () => {
    if (!form.src) return
    const res = await fetch('/api/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, order: slides.length }),
    })
    const added = await res.json()
    setSlides([...slides, added])
    setShowAdd(false)
    setForm({ src: '', alt: '', overlay: 'dark' })
  }

  const handleUpdate = async (id: string, data: Partial<Slide>) => {
    setSaving(id)
    await fetch('/api/slides', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    })
    setSlides(slides.map(s => s.id === id ? { ...s, ...data } : s))
    setEditing(null)
    setSaving(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this slide?')) return
    await fetch('/api/slides', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSlides(slides.filter(s => s.id !== id))
  }

  if (loading) return <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 text-mahogany animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mahogany">Hero Slider</h1>
          <p className="text-dove text-sm">{slides.length} slides in the hero section</p>
        </div>
        <button
          onClick={() => { setForm({ src: '', alt: '', overlay: 'dark' }); setShowAdd(true) }}
          className="flex items-center gap-2 bg-mahogany hover:bg-mahogany-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Slide
        </button>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-mahogany">Add Slide</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-dove" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dove mb-1">Image URL / Path *</label>
                <input value={form.src} onChange={e => setForm({ ...form, src: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-mahogany focus:outline-none" placeholder="/images/slider-new.jpg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dove mb-1">Description</label>
                <input value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-mahogany focus:outline-none" placeholder="Explore the serene beauty of..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-dove mb-1">Overlay Mode</label>
                <select value={form.overlay} onChange={e => setForm({ ...form, overlay: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-mahogany focus:outline-none">
                  <option value="dark">Dark (for light images)</option>
                  <option value="light">Light (for dark images)</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAdd} className="flex-1 h-10 bg-mahogany hover:bg-mahogany-dark text-white rounded-lg text-sm font-medium transition-colors">Add Slide</button>
                <button onClick={() => setShowAdd(false)} className="flex-1 h-10 border border-gray-200 text-dove rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewSlide && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreviewSlide(null)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewSlide(null)} className="absolute -top-10 right-0 text-white hover:text-white/80"><X className="w-6 h-6" /></button>
            <div className="relative rounded-xl overflow-hidden">
              <img src={previewSlide.src} alt={previewSlide.alt || ''} className="w-full max-h-[60vh] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 flex items-end p-6">
                <p className="text-white text-lg max-w-xl">{previewSlide.alt}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slides Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slides.map((slide, i) => (
          <div key={slide.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
            <div className="aspect-video bg-gray-100 relative">
              <img src={slide.src} alt={slide.alt || ''} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 flex gap-1">
                <span className="px-2 py-0.5 bg-mahogany text-white text-[10px] font-bold rounded-md">{i + 1}</span>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md ${slide.overlay === 'dark' ? 'bg-black/60 text-white' : 'bg-white/80 text-black'}`}>{slide.overlay}</span>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setPreviewSlide(slide)} className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white shadow-sm"><Eye className="w-3.5 h-3.5 text-mahogany" /></button>
                <button onClick={() => handleDelete(slide.id)} className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-red-50 shadow-sm"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
              </div>
            </div>
            <div className="p-3">
              {editing === slide.id ? (
                <div className="space-y-2">
                  <input value={slide.alt || ''} onChange={e => setSlides(slides.map(s => s.id === slide.id ? { ...s, alt: e.target.value } : s))} className="w-full h-8 px-2 rounded border border-gray-200 text-xs focus:border-mahogany focus:outline-none" />
                  <select value={slide.overlay} onChange={e => setSlides(slides.map(s => s.id === slide.id ? { ...s, overlay: e.target.value } : s))} className="w-full h-8 px-2 rounded border border-gray-200 text-xs focus:border-mahogany focus:outline-none">
                    <option value="dark">Dark overlay</option>
                    <option value="light">Light overlay</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(slide.id, { alt: slide.alt, overlay: slide.overlay })} disabled={saving === slide.id} className="flex items-center gap-1 px-3 py-1.5 bg-mahogany hover:bg-mahogany-dark text-white rounded text-[10px] font-medium disabled:opacity-50">
                      {saving === slide.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Save
                    </button>
                    <button onClick={() => setEditing(null)} className="px-3 py-1.5 border border-gray-200 text-dove rounded text-[10px] font-medium hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-dove truncate flex-1">{slide.alt || 'No description'}</p>
                  <button onClick={() => setEditing(slide.id)} className="text-xs text-mahogany hover:bg-mahogany/5 px-2 py-1 rounded font-medium ml-2">Edit</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="text-center py-20"><SlidersHorizontal className="w-12 h-12 text-dove/30 mx-auto mb-3" /><p className="text-dove">No slides yet</p></div>
      )}
    </div>
  )
}
