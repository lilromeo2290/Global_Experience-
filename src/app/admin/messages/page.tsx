'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Eye, X, Clock, CheckCircle, Archive } from 'lucide-react'

interface ContactMessage {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  inquiryType: string
  program: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: string
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  new: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  read: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  replied: { color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  archived: { color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' },
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [selected, setSelected] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetch('/api/messages').then(r => r.json()).then(setMessages)
  }, [])

  const updateStatus = async (id: string, status: ContactMessage['status']) => {
    await fetch('/api/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setMessages(messages.map(m => m.id === id ? { ...m, status } : m))
    if (selected?.id === id) setSelected({ ...selected, status })
  }

  const filtered = filter === 'all' ? messages : messages.filter(m => m.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mahogany">Messages</h1>
          <p className="text-dove text-sm">{messages.filter(m => m.status === 'new').length} new messages</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-mahogany focus:outline-none"
        >
          <option value="all">All Messages</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filtered.map((msg) => {
          const cfg = statusConfig[msg.status]
          return (
            <div
              key={msg.id}
              onClick={() => { setSelected(msg); if (msg.status === 'new') updateStatus(msg.id, 'read') }}
              className={`bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow ${msg.status === 'new' ? 'border-blue-200' : 'border-gray-100'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-mahogany">{msg.firstName} {msg.lastName}</p>
                    {msg.status === 'new' && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${cfg.bg} ${cfg.color}`}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-xs text-dove mb-1">{msg.email} · {msg.inquiryType}</p>
                  <p className="text-sm text-dove truncate">{msg.message}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-dove">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  <button className="mt-2 w-7 h-7 rounded-lg hover:bg-mahogany/10 flex items-center justify-center ml-auto">
                    <Eye className="w-4 h-4 text-mahogany" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <MessageSquare className="w-10 h-10 text-dove/30 mx-auto mb-2" />
          <p className="text-dove text-sm">No messages found</p>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-mahogany">Message — {selected.id}</h2>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-dove" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-dove text-xs">From</p><p className="font-medium text-mahogany">{selected.firstName} {selected.lastName}</p></div>
                <div><p className="text-dove text-xs">Email</p><p className="font-medium text-mahogany">{selected.email}</p></div>
                <div><p className="text-dove text-xs">Phone</p><p className="font-medium text-mahogany">{selected.phone || 'N/A'}</p></div>
                <div><p className="text-dove text-xs">Inquiry Type</p><p className="font-medium text-mahogany capitalize">{selected.inquiryType}</p></div>
                <div><p className="text-dove text-xs">Program</p><p className="font-medium text-mahogany">{selected.program || 'N/A'}</p></div>
                <div><p className="text-dove text-xs">Date</p><p className="font-medium text-mahogany">{new Date(selected.createdAt).toLocaleDateString()}</p></div>
              </div>
              <hr className="border-gray-100" />
              <div>
                <p className="text-dove text-xs mb-1">Message</p>
                <p className="text-sm text-mahogany leading-relaxed">{selected.message}</p>
              </div>
              <div className="flex gap-2 pt-2">
                {(['new', 'read', 'replied', 'archived'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors capitalize ${
                      selected.status === s
                        ? `${statusConfig[s].bg} ${statusConfig[s].color} border-current`
                        : 'border-gray-200 text-dove hover:bg-gray-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
