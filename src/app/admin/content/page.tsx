'use client'

import { useState, useEffect } from 'react'
import { Save, RefreshCw, CheckCircle } from 'lucide-react'

interface ContentItem {
  id: string
  section: string
  key: string
  value: string
  type: string
}

const sections = [
  { id: 'hero', label: 'Hero Section', icon: '🏠' },
  { id: 'about', label: 'About Section', icon: '📖' },
  { id: 'contact_info', label: 'Contact Information', icon: '📞' },
  { id: 'footer', label: 'Footer', icon: '📋' },
]

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [activeSection, setActiveSection] = useState('hero')
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(data => {
      setContent(data)
      setLoading(false)
    })
  }, [])

  const sectionContent = content.filter(c => c.section === activeSection)

  const handleSave = async (id: string, value: string) => {
    setSaving(id)
    await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, value }),
    })
    setContent(content.map(c => c.id === id ? { ...c, value } : c))
    setSaving(null)
    setSaved(id)
    setTimeout(() => setSaved(null), 2000)
  }

  const handleSaveAll = async () => {
    for (const item of sectionContent) {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, value: item.value }),
      })
    }
    setSaved('all')
    setTimeout(() => setSaved(null), 2000)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 text-mahogany animate-spin" /></div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-mahogany">Website Content</h1>
        <p className="text-dove text-sm">Edit the text content displayed on your website pages</p>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === s.id
                ? 'bg-mahogany text-white'
                : 'bg-white text-dove hover:bg-mahogany/5 hover:text-mahogany border border-gray-200'
            }`}
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Content Fields */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-mahogany">{sections.find(s => s.id === activeSection)?.label}</h2>
            <p className="text-xs text-dove mt-1">{sectionContent.length} editable fields</p>
          </div>
          {sectionContent.length > 0 && (
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-4 py-2 bg-mahogany hover:bg-mahogany-dark text-white rounded-lg text-sm font-medium transition-colors"
            >
              {saved === 'all' ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved === 'all' ? 'All Saved!' : 'Save All'}
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {sectionContent.map((item) => (
            <div key={item.id} className="p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <label className="text-sm font-medium text-mahogany capitalize">
                  {item.key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1')}
                </label>
                <button
                  onClick={() => handleSave(item.id, item.value)}
                  disabled={saving === item.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-mahogany hover:bg-mahogany-dark text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {saving === item.id ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : saved === item.id ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Save className="w-3 h-3" />
                  )}
                  {saving === item.id ? 'Saving...' : saved === item.id ? 'Saved!' : 'Save'}
                </button>
              </div>
              {item.value.length > 150 ? (
                <textarea
                  value={item.value}
                  onChange={(e) => setContent(content.map(c => c.id === item.id ? { ...c, value: e.target.value } : c))}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-mahogany focus:outline-none resize-y"
                />
              ) : (
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => setContent(content.map(c => c.id === item.id ? { ...c, value: e.target.value } : c))}
                  className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:border-mahogany focus:outline-none"
                />
              )}
            </div>
          ))}
          {sectionContent.length === 0 && (
            <div className="p-10 text-center text-dove text-sm">No content fields for this section yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
