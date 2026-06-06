'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Briefcase, ArrowRight, X } from 'lucide-react'

const placementPrograms = [
  'Medical Placement in Teaching Hospitals',
  'Teaching',
  'Journalism',
  'Community Outreach',
  'Sports',
  'Office Administration',
  'Banking and Finance',
  'Law Placements',
  'Agriculture Placement',
  'Tourism and Ecotourism',
  'Community Projects — Building of Schools',
  'Bore Holes — Drinkable Water',
  'Gap Year',
]

const destinationInfo: Record<string, { name: string; description: string; color: string }> = {
  'cape-coast': {
    name: 'Cape Coast',
    description: 'Explore placement opportunities in Cape Coast, home to historic castles, beautiful beaches, and vibrant community projects.',
    color: 'from-cornell to-cornell-dark',
  },
  'volta-ho': {
    name: 'Volta – HO',
    description: 'Discover programs in Ho, the capital of the Volta Region — our Head Office location with diverse placement opportunities.',
    color: 'from-vogue to-vogue-dark',
  },
  'takoradi': {
    name: 'Takoradi',
    description: 'Find placements in Takoradi, a bustling port city with opportunities in oil & gas, fisheries, and community development.',
    color: 'from-cornell to-vogue',
  },
  'accra': {
    name: 'Accra',
    description: 'Explore opportunities in Accra, Ghana\'s capital — a dynamic city offering professional placements in corporate, legal, and administrative settings.',
    color: 'from-vogue to-cornell',
  },
}

export default function DestinationProgramModal({
  open,
  onClose,
  destination,
}: {
  open: boolean
  onClose: () => void
  destination: string
}) {
  const [selectedProgram, setSelectedProgram] = useState('')

  const info = destinationInfo[destination]

  const handleApply = () => {
    if (!selectedProgram) return
    onClose()
    setSelectedProgram('')
    // Scroll to volunteer/apply section
    const el = document.querySelector('#volunteer')
    if (el) {
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const handleClose = () => {
    setSelectedProgram('')
    onClose()
  }

  if (!info) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-[#0A1F12] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Placement Programs in {info.name}</DialogTitle>

        {/* Header */}
        <div className={`bg-gradient-to-br ${info.color} p-6 text-white relative`}>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">{info.name}</h2>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">{info.description}</p>
        </div>

        {/* Program Selection */}
        <div className="p-6">
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-cornell" />
              <h3 className="font-bold text-cornell dark:text-white text-base">Select a Placement Program</h3>
            </div>
            <p className="text-xs text-charcoal dark:text-white/50 mb-4">
              Choose the program you are interested in to get started with your application.
            </p>

            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="w-full rounded-lg border-border bg-cream dark:bg-[#122A1B] focus:border-cornell focus:ring-cornell h-12">
                <SelectValue placeholder="-- Select a Placement Program --" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {placementPrograms.map((program) => (
                  <SelectItem key={program} value={program} className="text-sm">
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleApply}
            disabled={!selectedProgram}
            className="w-full bg-cornell hover:bg-cornell-dark text-white rounded-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="text-[10px] text-center text-charcoal/50 dark:text-white/30 mt-4">
            Select a program and click Apply Now to start your application for {info.name}.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
