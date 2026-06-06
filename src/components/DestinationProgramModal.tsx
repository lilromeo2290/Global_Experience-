'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { MapPin, Briefcase, ArrowRight, Calendar, Clock, X, ChevronLeft } from 'lucide-react'

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

const durations = [
  '1 Week',
  '2 Weeks',
  '3 Weeks',
  '4 Weeks',
  '6 Weeks',
  '8 Weeks',
  '3 Months',
  '6 Months',
  '12 Months',
]

const destinationInfo: Record<string, { name: string; description: string; color: string }> = {
  'cape-coast': {
    name: 'Cape Coast',
    description: 'Explore placement opportunities in Cape Coast, home to historic castles, beautiful beaches, and vibrant community projects.',
    color: 'from-cornell to-cornell-dark',
  },
  'volta-ho': {
    name: 'Volta \u2013 HO',
    description: 'Discover programs in Ho, the capital of the Volta Region \u2014 our Head Office location with diverse placement opportunities.',
    color: 'from-vogue to-vogue-dark',
  },
  'takoradi': {
    name: 'Takoradi',
    description: 'Find placements in Takoradi, a bustling port city with opportunities in oil & gas, fisheries, and community development.',
    color: 'from-cornell to-vogue',
  },
  'accra': {
    name: 'Accra',
    description: 'Explore opportunities in Accra, Ghana\'s capital \u2014 a dynamic city offering professional placements in corporate, legal, and administrative settings.',
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
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedProgram, setSelectedProgram] = useState('')
  const [startDate, setStartDate] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('')

  const info = destinationInfo[destination]

  // Reset state when destination changes
  useEffect(() => {
    setStep(1)
    setSelectedProgram('')
    setStartDate('')
    setSelectedDuration('')
  }, [destination])

  const handleProceed = () => {
    if (!selectedProgram) return
    setStep(2)
  }

  const handleApply = () => {
    if (!selectedProgram || !startDate || !selectedDuration) return
    const program = selectedProgram
    const duration = selectedDuration
    const date = startDate
    const dest = destination
    onClose()
    resetState()

    // Navigate to apply page with all params
    const params = new URLSearchParams({
      program,
      branch: info?.name || dest,
      startDate: date,
      duration,
    })
    window.location.href = `/apply?${params.toString()}`
  }

  const resetState = () => {
    setStep(1)
    setSelectedProgram('')
    setStartDate('')
    setSelectedDuration('')
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  // Get tomorrow's date as minimum for start date
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
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
            <div>
              <h2 className="text-xl font-bold">{info.name}</h2>
              {step === 2 && selectedProgram && (
                <p className="text-white/70 text-xs mt-0.5">{selectedProgram}</p>
              )}
            </div>
          </div>
          {step === 1 && (
            <p className="text-white/80 text-sm leading-relaxed">{info.description}</p>
          )}
          {step === 2 && (
            <p className="text-white/80 text-sm leading-relaxed">Choose your preferred start date and duration for this placement.</p>
          )}
        </div>

        {step === 1 && (
          /* Step 1: Program Selection */
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

            {/* Next Button */}
            <Button
              onClick={handleProceed}
              disabled={!selectedProgram}
              className="w-full bg-cornell hover:bg-cornell-dark text-white rounded-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-[10px] text-center text-charcoal/50 dark:text-white/30 mt-4">
              Select a program and click Next to choose your start date and duration.
            </p>
          </div>
        )}

        {step === 2 && (
          /* Step 2: Start Date & Duration */
          <div className="p-6">
            <div className="space-y-5">
              {/* Start Date */}
              <div>
                <Label className="text-sm font-medium text-cornell dark:text-white mb-2 block">
                  Start Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50 dark:text-white/40" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={getMinDate()}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-cream dark:bg-[#122A1B] text-charcoal dark:text-white text-sm focus:border-cornell focus:ring-cornell focus:outline-none"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <Label className="text-sm font-medium text-cornell dark:text-white mb-2 block">
                  Duration
                </Label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger className="w-full rounded-lg border-border bg-cream dark:bg-[#122A1B] focus:border-cornell focus:ring-cornell h-12">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-charcoal/50 dark:text-white/40" />
                      <SelectValue placeholder="Select a duration" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {durations.map((dur) => (
                      <SelectItem key={dur} value={dur} className="text-sm">
                        {dur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Button
                onClick={handleApply}
                disabled={!startDate || !selectedDuration}
                className="w-full bg-cornell hover:bg-cornell-dark text-white rounded-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <button
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-1 py-2 text-sm text-charcoal/60 dark:text-white/50 hover:text-cornell dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to program selection
              </button>
            </div>

            <p className="text-[10px] text-center text-charcoal/50 dark:text-white/30 mt-4">
              Select a start date and duration, then click Apply Now to proceed.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
