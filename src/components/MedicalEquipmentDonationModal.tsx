'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Stethoscope, User, Mail, Phone, MapPin, Truck, Package, ArrowRight, X, CheckCircle2, Globe2, ClipboardList } from 'lucide-react'
import { motion } from 'framer-motion'

const deliveryMethods = [
  'I will ship it myself',
  'I need pickup from my location',
  'I will deliver in person',
  'Please arrange collection',
  'Other (specify in message)',
]

const equipmentCategories = [
  'Hospital Beds & Stretchers',
  'Medical Imaging Equipment',
  'Surgical Instruments',
  'Diagnostic Equipment',
  'Patient Monitors',
  'Laboratory Equipment',
  'First Aid & Emergency Supplies',
  'Mobility Aids (Wheelchairs, Crutches)',
  'PPE & Protective Gear',
  'Pharmaceutical Supplies',
  'Other Medical Equipment',
]

export default function MedicalEquipmentDonationModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    country: '',
    city: '',
    equipmentCategory: '',
    equipmentDescription: '',
    equipmentQuantity: '',
    equipmentCondition: '',
    deliveryMethod: '',
    pickupAddress: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleClose = () => {
    setSubmitted(false)
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      organization: '',
      country: '',
      city: '',
      equipmentCategory: '',
      equipmentDescription: '',
      equipmentQuantity: '',
      equipmentCondition: '',
      deliveryMethod: '',
      pickupAddress: '',
      message: '',
    })
    onClose()
  }

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-[#0A1F12] p-0 overflow-hidden">
          <DialogTitle className="sr-only">Donation Submitted</DialogTitle>
          <div className="p-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-20 h-20 bg-vogue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-vogue" />
              </div>
              <h2 className="text-2xl font-bold text-cornell mb-3">Thank You!</h2>
              <p className="text-charcoal dark:text-white/70 mb-2">
                Your medical equipment donation offer has been received.
              </p>
              <p className="text-sm text-charcoal/70 dark:text-white/50 mb-6">
                Our team will review your submission and contact you at <span className="font-semibold">{formData.email}</span> within 48 hours to coordinate the donation and delivery details.
              </p>
              <Button
                onClick={handleClose}
                className="bg-cornell hover:bg-cornell-dark text-white rounded-full px-8"
              >
                Close
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#0A1F12] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Donate Medical Equipment</DialogTitle>

        {/* Header */}
        <div className="bg-gradient-to-br from-cornell to-cornell-dark p-6 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Medical Equipment Donation</h2>
              <p className="text-white/70 text-xs mt-0.5">Help equip clinics and hospitals serving underserved communities</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Donor Details */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-cornell/10 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-cornell" />
              </div>
              <h3 className="font-bold text-cornell dark:text-white text-sm">Your Details</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  Full Name *
                </Label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full h-10 px-3 rounded-lg border border-border bg-cream dark:bg-[#122A1B] text-charcoal dark:text-white text-sm focus:border-cornell focus:ring-cornell focus:outline-none"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 dark:text-white/30" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full h-10 pl-10 pr-3 rounded-lg border border-border bg-cream dark:bg-[#122A1B] text-charcoal dark:text-white text-sm focus:border-cornell focus:ring-cornell focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 dark:text-white/30" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    className="w-full h-10 pl-10 pr-3 rounded-lg border border-border bg-cream dark:bg-[#122A1B] text-charcoal dark:text-white text-sm focus:border-cornell focus:ring-cornell focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  Organization (Optional)
                </Label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Hospital, NGO, Company, etc."
                  className="w-full h-10 px-3 rounded-lg border border-border bg-cream dark:bg-[#122A1B] text-charcoal dark:text-white text-sm focus:border-cornell focus:ring-cornell focus:outline-none"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  Country *
                </Label>
                <div className="relative">
                  <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 dark:text-white/30" />
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. United Kingdom"
                    className="w-full h-10 pl-10 pr-3 rounded-lg border border-border bg-cream dark:bg-[#122A1B] text-charcoal dark:text-white text-sm focus:border-cornell focus:ring-cornell focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  City *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 dark:text-white/30" />
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. London"
                    className="w-full h-10 pl-10 pr-3 rounded-lg border border-border bg-cream dark:bg-[#122A1B] text-charcoal dark:text-white text-sm focus:border-cornell focus:ring-cornell focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Details */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-vogue/10 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-vogue" />
              </div>
              <h3 className="font-bold text-cornell dark:text-white text-sm">Equipment Details</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  Category of Equipment *
                </Label>
                <Select value={formData.equipmentCategory} onValueChange={(val) => setFormData({ ...formData, equipmentCategory: val })}>
                  <SelectTrigger className="w-full rounded-lg border-border bg-cream dark:bg-[#122A1B] focus:border-cornell focus:ring-cornell h-10">
                    <SelectValue placeholder="-- Select Category --" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {equipmentCategories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-sm">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  Equipment Condition *
                </Label>
                <Select value={formData.equipmentCondition} onValueChange={(val) => setFormData({ ...formData, equipmentCondition: val })}>
                  <SelectTrigger className="w-full rounded-lg border-border bg-cream dark:bg-[#122A1B] focus:border-cornell focus:ring-cornell h-10">
                    <SelectValue placeholder="-- Select Condition --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New" className="text-sm">New / Unused</SelectItem>
                    <SelectItem value="Like New" className="text-sm">Like New / Excellent</SelectItem>
                    <SelectItem value="Good" className="text-sm">Good / Working</SelectItem>
                    <SelectItem value="Fair" className="text-sm">Fair / Needs Minor Repairs</SelectItem>
                    <SelectItem value="Refurbished" className="text-sm">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  Quantity *
                </Label>
                <input
                  type="text"
                  name="equipmentQuantity"
                  required
                  value={formData.equipmentQuantity}
                  onChange={handleChange}
                  placeholder="e.g. 5 hospital beds, 2 wheelchairs"
                  className="w-full h-10 px-3 rounded-lg border border-border bg-cream dark:bg-[#122A1B] text-charcoal dark:text-white text-sm focus:border-cornell focus:ring-cornell focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  Description of Equipment *
                </Label>
                <textarea
                  name="equipmentDescription"
                  required
                  value={formData.equipmentDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Please describe the equipment you wish to donate, including brand, model, specifications, and any other relevant details..."
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-cream dark:bg-[#122A1B] text-charcoal dark:text-white text-sm focus:border-cornell focus:ring-cornell focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-cornell/10 rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-cornell" />
              </div>
              <h3 className="font-bold text-cornell dark:text-white text-sm">Delivery Method</h3>
            </div>
            <div className="grid gap-4">
              <div>
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  How would you like the equipment to be delivered? *
                </Label>
                <Select value={formData.deliveryMethod} onValueChange={(val) => setFormData({ ...formData, deliveryMethod: val })}>
                  <SelectTrigger className="w-full rounded-lg border-border bg-cream dark:bg-[#122A1B] focus:border-cornell focus:ring-cornell h-10">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-charcoal/40 dark:text-white/30" />
                      <SelectValue placeholder="-- Select Delivery Method --" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryMethods.map((method) => (
                      <SelectItem key={method} value={method} className="text-sm">
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(formData.deliveryMethod === 'I need pickup from my location' ||
                formData.deliveryMethod === 'Please arrange collection') && (
                <div>
                  <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                    Pickup / Collection Address *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-charcoal/40 dark:text-white/30" />
                    <textarea
                      name="pickupAddress"
                      required
                      value={formData.pickupAddress}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Enter the full address where the equipment can be collected from..."
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border bg-cream dark:bg-[#122A1B] text-charcoal dark:text-white text-sm focus:border-cornell focus:ring-cornell focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Message */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-vogue/10 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-vogue" />
              </div>
              <h3 className="font-bold text-cornell dark:text-white text-sm">Additional Information</h3>
            </div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional details, special instructions, or questions you may have about the donation process..."
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-cream dark:bg-[#122A1B] text-charcoal dark:text-white text-sm focus:border-cornell focus:ring-cornell focus:outline-none resize-none"
            />
          </div>

          {/* Info Notice */}
          <div className="bg-vogue/5 dark:bg-vogue/10 border border-vogue/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-vogue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-vogue">What Happens Next?</p>
                <p className="text-[11px] text-charcoal/70 dark:text-white/50 mt-0.5">
                  Our team will review your donation offer and contact you within 48 hours to coordinate
                  delivery logistics, provide shipping instructions, and answer any questions you may have.
                  All equipment donations are documented and tracked to ensure they reach the communities that need them most.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={!formData.equipmentCategory || !formData.equipmentCondition || !formData.deliveryMethod}
            className="w-full bg-cornell hover:bg-cornell-dark text-white rounded-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Donation Offer
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="text-[10px] text-center text-charcoal/40 dark:text-white/30 mt-3">
            By submitting this form, you agree that the equipment details provided are accurate. We will contact you to finalize the donation.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
