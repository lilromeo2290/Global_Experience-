'use client'

import { useState, useEffect } from 'react'
import { Plane, Clock, CheckCircle, XCircle, Eye, X, ChevronDown } from 'lucide-react'

interface PickupRequest {
  id: string
  fullName: string
  email: string
  phone: string
  nationality: string
  participantType: string
  arrivalDate: string
  arrivalTime: string
  flightNumber: string
  airline: string
  departureCity: string
  destinationAirport: string
  numberOfLuggage: string
  accommodationName: string
  accommodationAddress: string
  specialRequirements: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  pending: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock },
  confirmed: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: CheckCircle },
  completed: { color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: CheckCircle },
  cancelled: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle },
}

export default function AdminPickupsPage() {
  const [pickups, setPickups] = useState<PickupRequest[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [selected, setSelected] = useState<PickupRequest | null>(null)

  useEffect(() => {
    fetch('/api/pickups').then(r => r.json()).then(setPickups)
  }, [])

  const updateStatus = async (id: string, status: PickupRequest['status']) => {
    await fetch('/api/pickups', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setPickups(pickups.map(p => p.id === id ? { ...p, status } : p))
    if (selected?.id === id) setSelected({ ...selected, status })
  }

  const filtered = filter === 'all' ? pickups : pickups.filter(p => p.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mahogany">Pickup Requests</h1>
          <p className="text-dove text-sm">{pickups.length} total requests</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-dove">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-mahogany focus:outline-none"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => {
          const cfg = statusConfig[status]
          const count = pickups.filter(p => p.status === status).length
          return (
            <button
              key={status}
              onClick={() => setFilter(filter === status ? 'all' : status)}
              className={`p-3 rounded-xl border ${filter === status ? cfg.bg : 'bg-white border-gray-100'} transition-colors text-center`}
            >
              <p className={`text-xl font-bold ${cfg.color}`}>{count}</p>
              <p className="text-xs text-dove capitalize">{status}</p>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dove uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dove uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dove uppercase tracking-wider hidden md:table-cell">Flight</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dove uppercase tracking-wider hidden lg:table-cell">Arrival</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dove uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-dove uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((pickup) => {
                const cfg = statusConfig[pickup.status]
                return (
                  <tr key={pickup.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-mono text-dove">{pickup.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-mahogany">{pickup.fullName}</p>
                      <p className="text-xs text-dove">{pickup.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm text-mahogany">{pickup.flightNumber}</p>
                      <p className="text-xs text-dove">{pickup.airline}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-sm text-mahogany">{pickup.arrivalDate}</p>
                      <p className="text-xs text-dove">{pickup.arrivalTime}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                        <cfg.icon className="w-3 h-3" />
                        {pickup.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelected(pickup)}
                          className="w-7 h-7 rounded-lg hover:bg-mahogany/10 flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4 text-mahogany" />
                        </button>
                        <select
                          value={pickup.status}
                          onChange={(e) => updateStatus(pickup.id, e.target.value as PickupRequest['status'])}
                          className="h-7 px-2 rounded-lg border border-gray-200 text-xs focus:border-mahogany focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Plane className="w-10 h-10 text-dove/30 mx-auto mb-2" />
            <p className="text-dove text-sm">No pickup requests found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-mahogany">Pickup Request — {selected.id}</h2>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-dove" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-dove text-xs">Full Name</p><p className="font-medium text-mahogany">{selected.fullName}</p></div>
                <div><p className="text-dove text-xs">Email</p><p className="font-medium text-mahogany">{selected.email}</p></div>
                <div><p className="text-dove text-xs">Phone</p><p className="font-medium text-mahogany">{selected.phone}</p></div>
                <div><p className="text-dove text-xs">Nationality</p><p className="font-medium text-mahogany">{selected.nationality}</p></div>
                <div><p className="text-dove text-xs">Participant Type</p><p className="font-medium text-mahogany">{selected.participantType}</p></div>
                <div><p className="text-dove text-xs">Status</p><p className="font-medium capitalize text-mahogany">{selected.status}</p></div>
              </div>
              <hr className="border-gray-100" />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-dove text-xs">Flight Number</p><p className="font-medium text-mahogany">{selected.flightNumber}</p></div>
                <div><p className="text-dove text-xs">Airline</p><p className="font-medium text-mahogany">{selected.airline}</p></div>
                <div><p className="text-dove text-xs">Arrival Date</p><p className="font-medium text-mahogany">{selected.arrivalDate}</p></div>
                <div><p className="text-dove text-xs">Arrival Time</p><p className="font-medium text-mahogany">{selected.arrivalTime}</p></div>
                <div><p className="text-dove text-xs">Departure City</p><p className="font-medium text-mahogany">{selected.departureCity}</p></div>
                <div><p className="text-dove text-xs">Destination</p><p className="font-medium text-mahogany">{selected.destinationAirport}</p></div>
                <div><p className="text-dove text-xs">Luggage</p><p className="font-medium text-mahogany">{selected.numberOfLuggage}</p></div>
              </div>
              <hr className="border-gray-100" />
              <div className="text-sm">
                <p className="text-dove text-xs">Accommodation</p>
                <p className="font-medium text-mahogany">{selected.accommodationName || 'N/A'}</p>
                <p className="text-dove">{selected.accommodationAddress || 'N/A'}</p>
              </div>
              {selected.specialRequirements && (
                <div className="text-sm">
                  <p className="text-dove text-xs">Special Requirements</p>
                  <p className="text-mahogany">{selected.specialRequirements}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
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
