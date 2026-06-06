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
import {
  User, Mail, Phone, MapPin, Truck, Package, ArrowRight, X, CheckCircle2,
  Globe2, ClipboardList,
  Stethoscope, BookOpen, Trophy, Monitor, Sprout, GraduationCap, Users, Wrench, Building2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

const deliveryMethods = [
  'I will ship it myself',
  'I need pickup from my location',
  'I will deliver in person',
  'Please arrange collection',
  'Other (specify in message)',
]

interface ProgramConfig {
  title: string
  icon: LucideIcon
  subtitle: string
  color: string
  categories: string[]
  conditions: string[]
  categoryLabel: string
  quantityLabel: string
  descriptionPlaceholder: string
  showCondition: boolean
  showQuantity: boolean
}

const programConfigs: Record<string, ProgramConfig> = {
  'Medical Equipment and Items': {
    title: 'Medical Equipment Donation',
    icon: Stethoscope,
    subtitle: 'Help equip clinics and hospitals serving underserved communities',
    color: 'from-cornell to-cornell-dark',
    categoryLabel: 'Category of Equipment',
    quantityLabel: 'Quantity',
    descriptionPlaceholder: 'Please describe the equipment you wish to donate, including brand, model, specifications, and any other relevant details...',
    categories: [
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
    ],
    conditions: ['New / Unused', 'Like New / Excellent', 'Good / Working', 'Fair / Needs Minor Repairs', 'Refurbished'],
    showCondition: true,
    showQuantity: true,
  },
  'Teaching Materials': {
    title: 'Teaching Materials Donation',
    icon: BookOpen,
    subtitle: 'Support teaching programs in rural and urban schools with educational resources',
    color: 'from-vogue to-vogue-dark',
    categoryLabel: 'Category of Materials',
    quantityLabel: 'Quantity',
    descriptionPlaceholder: 'Please describe the teaching materials you wish to donate, including subjects, grade levels, and any other relevant details...',
    categories: [
      'Textbooks & Workbooks',
      'Stationery (Pens, Pencils, Notebooks)',
      'Teaching Aids & Charts',
      'Children\'s Storybooks',
      'Science Lab Supplies',
      'Art & Craft Supplies',
      'Mathematical Instruments',
      'Maps & Globes',
      'Computers & Tablets for Schools',
      'Other Teaching Materials',
    ],
    conditions: ['New / Unused', 'Like New', 'Good / Usable', 'Fair / Slightly Worn'],
    showCondition: true,
    showQuantity: true,
  },
  'Sport Items': {
    title: 'Sport Items Donation',
    icon: Trophy,
    subtitle: 'Provide sports equipment for youth development programs',
    color: 'from-cornell to-cornell-dark',
    categoryLabel: 'Category of Sport Items',
    quantityLabel: 'Quantity',
    descriptionPlaceholder: 'Please describe the sport items you wish to donate, including sizes, brands, and any other relevant details...',
    categories: [
      'Footballs & Football Boots',
      'Jerseys & Team Kits',
      'Shin Guards & Protective Gear',
      'Training Equipment (Cones, Whistles, etc.)',
      'Volleyball & Netball Equipment',
      'Athletics Equipment',
      'Table Tennis Equipment',
      'Basketball Equipment',
      'Other Sport Items',
    ],
    conditions: ['New / Unused', 'Like New', 'Good / Usable', 'Fair / Slightly Worn'],
    showCondition: true,
    showQuantity: true,
  },
  'Office Equipment': {
    title: 'Office Equipment Donation',
    icon: Monitor,
    subtitle: 'Support administrative and professional placements with essential technology',
    color: 'from-vogue to-vogue-dark',
    categoryLabel: 'Category of Equipment',
    quantityLabel: 'Quantity',
    descriptionPlaceholder: 'Please describe the office equipment you wish to donate, including brand, model, specifications, and any other relevant details...',
    categories: [
      'Laptops & Desktop Computers',
      'Printers & Scanners',
      'Mobile Phones & Tablets',
      'Office Furniture (Desks, Chairs)',
      'Projectors & Display Screens',
      'Networking Equipment (Routers, Switches)',
      'Stationery & Office Supplies',
      'Filing & Storage Solutions',
      'Other Office Equipment',
    ],
    conditions: ['New / Unused', 'Like New / Excellent', 'Good / Working', 'Fair / Needs Minor Repairs', 'Refurbished'],
    showCondition: true,
    showQuantity: true,
  },
  'Agriculture Products and Equipment': {
    title: 'Agriculture Equipment Donation',
    icon: Sprout,
    subtitle: 'Support community farming initiatives with tools, seeds, and machinery',
    color: 'from-vogue to-vogue-dark',
    categoryLabel: 'Category of Items',
    quantityLabel: 'Quantity',
    descriptionPlaceholder: 'Please describe the agricultural items you wish to donate, including types, quantities, and any other relevant details...',
    categories: [
      'Farming Tools (Hoes, Cutlasses, Shovels)',
      'Seeds & Seedlings',
      'Fertilizers & Agrochemicals',
      'Irrigation Equipment',
      'Processing Equipment (Mills, Dryers)',
      'Storage Facilities & Containers',
      'Protective Gear (Boots, Gloves, Hats)',
      'Tractors & Power Equipment',
      'Other Agriculture Items',
    ],
    conditions: ['New / Unused', 'Like New', 'Good / Usable', 'Fair / Needs Minor Repairs'],
    showCondition: true,
    showQuantity: true,
  },
  'Educational Scholarship': {
    title: 'Educational Scholarship Donation',
    icon: GraduationCap,
    subtitle: 'Support students to access quality education and professional development',
    color: 'from-cornell to-cornell-dark',
    categoryLabel: 'Type of Scholarship Support',
    quantityLabel: 'Number of Students to Sponsor',
    descriptionPlaceholder: 'Please describe the scholarship support you wish to provide, including the level of education, duration, and any preferences...',
    categories: [
      'Primary / Junior High School Fees',
      'Senior High School Fees',
      'University / College Tuition',
      'Vocational Training Fees',
      'Professional Certification Programs',
      'Study Materials & Textbooks',
      'Accommodation & Living Expenses',
      'Other Scholarship Support',
    ],
    conditions: [],
    showCondition: false,
    showQuantity: false,
  },
  'Conferences': {
    title: 'Conference Donation',
    icon: Users,
    subtitle: 'Fund community conferences, workshops, and knowledge-sharing events',
    color: 'from-vogue to-vogue-dark',
    categoryLabel: 'Type of Conference Support',
    quantityLabel: 'Number of Participants to Sponsor',
    descriptionPlaceholder: 'Please describe the conference support you wish to provide, including the type of event, target audience, and any preferences...',
    categories: [
      'Venue & Facilities Sponsorship',
      'Speaker / Facilitator Funding',
      'Participant Travel & Accommodation',
      'Event Materials & Supplies',
      'Catering & Refreshments',
      'Audio-Visual & Technology Support',
      'Community Health Workshops',
      'Youth Development Conferences',
      'Other Conference Support',
    ],
    conditions: [],
    showCondition: false,
    showQuantity: false,
  },
  'NVTI / Vocational Training': {
    title: 'Vocational Training Donation',
    icon: Wrench,
    subtitle: 'Support vocational skills training for community development',
    color: 'from-cornell to-cornell-dark',
    categoryLabel: 'Type of Vocational Training Support',
    quantityLabel: 'Number of Trainees to Sponsor',
    descriptionPlaceholder: 'Please describe the vocational training support you wish to provide, including the trade area, duration, and any preferences...',
    categories: [
      'Driving School Fees',
      'Hairdressing & Beauty Training',
      'Forklift Operation Training',
      'Electrical Installation Training',
      'Masonry & Construction Training',
      'Carpentry & Woodwork Training',
      'Welding & Metalwork Training',
      'Auto Mechanics Training',
      'Catering & Hospitality Training',
      'Dressmaking & Fashion Design',
      'ICT / Computer Training',
      'Other Vocational Training',
    ],
    conditions: [],
    showCondition: false,
    showQuantity: false,
  },
  'Community Service': {
    title: 'Community Service Donation',
    icon: Building2,
    subtitle: 'Help build schools, drill boreholes, and develop vital community infrastructure',
    color: 'from-vogue to-vogue-dark',
    categoryLabel: 'Type of Community Service',
    quantityLabel: 'Estimated Number of Beneficiaries',
    descriptionPlaceholder: 'Please describe the community service support you wish to provide, including the project type, location preferences, and any other relevant details...',
    categories: [
      'School Building Projects',
      'Borehole Drilling for Clean Water',
      'Community Centre Construction',
      'Library / Resource Centre Setup',
      'Health Facility Construction',
      'Road & Bridge Construction',
      'Sanitation Facilities (Toilets, Drains)',
      'Solar Power Installation',
      'Other Community Infrastructure',
    ],
    conditions: [],
    showCondition: false,
    showQuantity: false,
  },
}

export default function OutreachDonationModal({
  open,
  onClose,
  programArea,
}: {
  open: boolean
  onClose: () => void
  programArea: string
}) {
  const config = programConfigs[programArea]
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    country: '',
    city: '',
    category: '',
    itemCondition: '',
    quantity: '',
    description: '',
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
      category: '',
      itemCondition: '',
      quantity: '',
      description: '',
      deliveryMethod: '',
      pickupAddress: '',
      message: '',
    })
    onClose()
  }

  if (!config) return null

  const ConfigIcon = config.icon

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
                Your donation offer for <span className="font-semibold text-cornell">{programArea}</span> has been received.
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
        <DialogTitle className="sr-only">Donate - {config.title}</DialogTitle>

        {/* Header */}
        <div className={`bg-gradient-to-br ${config.color} p-6 text-white relative`}>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ConfigIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{config.title}</h2>
              <p className="text-white/70 text-xs mt-0.5">{config.subtitle}</p>
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

          {/* Item Details */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-vogue/10 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-vogue" />
              </div>
              <h3 className="font-bold text-cornell dark:text-white text-sm">Donation Details</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className={config.showCondition ? '' : 'sm:col-span-2'}>
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  {config.categoryLabel} *
                </Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                  <SelectTrigger className="w-full rounded-lg border-border bg-cream dark:bg-[#122A1B] focus:border-cornell focus:ring-cornell h-10">
                    <SelectValue placeholder="-- Select Category --" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {config.categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-sm">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {config.showCondition && (
                <div>
                  <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                    Condition *
                  </Label>
                  <Select value={formData.itemCondition} onValueChange={(val) => setFormData({ ...formData, itemCondition: val })}>
                    <SelectTrigger className="w-full rounded-lg border-border bg-cream dark:bg-[#122A1B] focus:border-cornell focus:ring-cornell h-10">
                      <SelectValue placeholder="-- Select Condition --" />
                    </SelectTrigger>
                    <SelectContent>
                      {config.conditions.map((cond) => (
                        <SelectItem key={cond} value={cond} className="text-sm">
                          {cond}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {config.showQuantity && (
                <div>
                  <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                    {config.quantityLabel} *
                  </Label>
                  <input
                    type="text"
                    name="quantity"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 5 hospital beds, 2 wheelchairs"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-cream dark:bg-[#122A1B] text-charcoal dark:text-white text-sm focus:border-cornell focus:ring-cornell focus:outline-none"
                  />
                </div>
              )}
              <div className="sm:col-span-2">
                <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1.5 block">
                  Description *
                </Label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder={config.descriptionPlaceholder}
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
                  How would you like the items to be delivered? *
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
                      placeholder="Enter the full address where the items can be collected from..."
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
                  All donations are documented and tracked to ensure they reach the communities that need them most.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={!formData.category || !formData.deliveryMethod || (config.showCondition && !formData.itemCondition)}
            className="w-full bg-cornell hover:bg-cornell-dark text-white rounded-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Donation Offer
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="text-[10px] text-center text-charcoal/40 dark:text-white/30 mt-3">
            By submitting this form, you agree that the details provided are accurate. We will contact you to finalize the donation.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
