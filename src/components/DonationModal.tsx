'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Heart, CheckCircle2, X, CreditCard, User, Mail, Phone, AlertCircle,
  Package, Truck,
} from 'lucide-react'

const presetAmounts = [50, 100, 250, 500, 1000, 5000]
const currencies = ['GHS', 'USD']

const itemCategories = [
  'Medical Equipment & Supplies',
  'Teaching Materials & Books',
  'Sport Items & Equipment',
  'Office Equipment & Technology',
  'Agriculture Products & Tools',
  'Clothing & Footwear',
  'Food & Nutrition Supplies',
  'Building Materials',
  'Household Items',
  'Vocational Training Tools',
  'Other Items',
]

const itemConditions = [
  'New / Unused',
  'Like New / Excellent',
  'Good / Working',
  'Fair / Needs Minor Repairs',
  'Refurbished',
]

const deliveryMethods = [
  'I will ship it myself',
  'I need pickup from my location',
  'I will deliver in person',
  'Please arrange collection',
  'Other (specify in message)',
]

// Extend Window type for Paystack
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: Record<string, unknown>) => { openIframe: () => void }
    }
  }
}

function DonationModalInner({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [donationType, setDonationType] = useState<'money' | 'items'>('money')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('GHS')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form')
  const [paymentDetails, setPaymentDetails] = useState<{ amount: number; reference: string } | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [validationError, setValidationError] = useState('')
  const [paystackLoaded, setPaystackLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Item donation fields
  const [itemCategory, setItemCategory] = useState('')
  const [itemCondition, setItemCondition] = useState('')
  const [itemQuantity, setItemQuantity] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [itemDelivery, setItemDelivery] = useState('')
  const [itemLocation, setItemLocation] = useState('')

  // Track when Paystack popup is active so we hide our dialog overlay
  const [paystackActive, setPaystackActive] = useState(false)
  // Prevent onOpenChange from resetting state when we close dialog for Paystack
  const skipCloseRef = useRef(false)

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''

  const numericAmount = parseFloat(amount) || 0

  // Load Paystack inline script
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if already loaded
    if (window.PaystackPop) {
      setPaystackLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v2/inline.js'
    script.async = true
    script.onload = () => {
      setPaystackLoaded(true)
    }
    script.onerror = () => {
      console.error('Failed to load Paystack script')
    }
    document.body.appendChild(script)

    return () => {
      // Don't remove script on cleanup as it may be needed again
    }
  }, [])

  const onSuccess = useCallback(async (reference: string) => {
    try {
      const res = await fetch('/api/donate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      })
      const data = await res.json()

      if (data.success) {
        setPaymentDetails({
          amount: data.data.amount,
          reference: data.data.reference,
        })
        setStep('success')
      } else {
        setErrorMessage(data.message || 'Payment verification failed. Please contact us.')
        setStep('error')
      }
    } catch {
      setErrorMessage('Could not verify payment. Please contact us with your reference.')
      setStep('error')
    }
    // Reopen our dialog with the result
    setPaystackActive(false)
  }, [])

  const openPaystackPopup = useCallback(() => {
    if (!window.PaystackPop) {
      setValidationError('Payment system is still loading. Please wait a moment and try again.')
      setPaystackActive(false)
      return
    }

    const reference = `GEP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: email,
      amount: numericAmount * 100, // Paystack expects amount in kobo/cents
      currency: currency,
      ref: reference,
      metadata: {
        name,
        phone,
        custom_fields: [
          { display_name: 'Donor Name', variable_name: 'name', value: name },
          { display_name: 'Donor Phone', variable_name: 'phone', value: phone },
        ],
      },
      callback: (response: { reference: string }) => {
        onSuccess(response.reference)
      },
      onClose: () => {
        // User closed the Paystack popup — bring our dialog back
        setPaystackActive(false)
      },
    })

    handler.openIframe()
  }, [publicKey, email, numericAmount, currency, name, phone, onSuccess])

  const handleMoneyDonate = () => {
    setValidationError('')

    // Validate fields
    if (!name.trim()) {
      setValidationError('Please enter your full name.')
      return
    }
    if (!email.trim()) {
      setValidationError('Please enter your email address.')
      return
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.')
      return
    }
    if (numericAmount <= 0) {
      setValidationError('Please select or enter a donation amount.')
      return
    }
    if (numericAmount < 1) {
      setValidationError('Minimum donation amount is ' + (currency === 'GHS' ? '₵1' : '$1') + '.')
      return
    }

    if (!paystackLoaded) {
      setValidationError('Payment system is still loading. Please wait a moment and try again.')
      return
    }

    // Hide our dialog so Paystack popup is fully interactive
    setPaystackActive(true)
    skipCloseRef.current = true

    // Small delay to let our dialog close first, then open Paystack
    setTimeout(() => {
      openPaystackPopup()
    }, 100)
  }

  const handleItemDonate = async () => {
    setValidationError('')

    if (!name.trim()) {
      setValidationError('Please enter your full name.')
      return
    }
    if (!email.trim()) {
      setValidationError('Please enter your email address.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.')
      return
    }
    if (!itemCategory) {
      setValidationError('Please select a category of items you wish to donate.')
      return
    }
    if (!itemDescription.trim()) {
      setValidationError('Please describe the items you wish to donate.')
      return
    }
    if (!itemDelivery) {
      setValidationError('Please select a delivery method.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/outreach-donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: name,
          donorEmail: email,
          donorPhone: phone,
          programArea: `General Fund - Item Donation (${itemCategory})`,
          category: itemCategory,
          condition: itemCondition || 'Not specified',
          quantity: itemQuantity || 'Not specified',
          description: itemDescription,
          deliveryMethod: itemDelivery,
          location: itemLocation || 'Not specified',
          donationType: 'item',
        }),
      })

      if (res.ok) {
        setStep('success')
      } else {
        setErrorMessage('Failed to submit your item donation. Please try again.')
        setStep('error')
      }
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.')
      setStep('error')
    } finally {
      setSubmitting(false)
    }
  }

  const resetAndClose = () => {
    setDonationType('money')
    setAmount('')
    setEmail('')
    setName('')
    setPhone('')
    setStep('form')
    setPaymentDetails(null)
    setErrorMessage('')
    setValidationError('')
    setPaystackActive(false)
    setItemCategory('')
    setItemCondition('')
    setItemQuantity('')
    setItemDescription('')
    setItemDelivery('')
    setItemLocation('')
    setSubmitting(false)
    onClose()
  }

  // Handle Dialog open/close changes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && skipCloseRef.current) {
      // This close was triggered by us (for Paystack), ignore it
      skipCloseRef.current = false
      return
    }
    if (!isOpen) {
      resetAndClose()
    }
  }

  // Dialog is open when parent says so AND Paystack popup is not active
  const isDialogOpen = open && !paystackActive

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-white dark:bg-[#0A1F12] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Make a Donation</DialogTitle>

        {step === 'form' && (
          <>
            {/* Donation Type Toggle */}
            <div className="flex border-b border-border">
              <button
                onClick={() => { setDonationType('money'); setValidationError('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all ${
                  donationType === 'money'
                    ? 'text-cornell border-b-2 border-cornell bg-cornell/5 dark:bg-cornell/10'
                    : 'text-charcoal/60 dark:text-white/40 hover:text-charcoal dark:hover:text-white/70'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Monetary Donation
              </button>
              <button
                onClick={() => { setDonationType('items'); setValidationError('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all ${
                  donationType === 'items'
                    ? 'text-cornell border-b-2 border-cornell bg-cornell/5 dark:bg-cornell/10'
                    : 'text-charcoal/60 dark:text-white/40 hover:text-charcoal dark:hover:text-white/70'
                }`}
              >
                <Package className="w-4 h-4" />
                Donate Items
              </button>
            </div>

            {/* ===== MONETARY DONATION FORM ===== */}
            {donationType === 'money' && (
              <div className="grid md:grid-cols-2">
                {/* Left Side — Amount Selection */}
                <div className="bg-gradient-to-br from-cornell to-cornell-dark p-6 md:p-8 text-white relative">
                  <button
                    onClick={resetAndClose}
                    className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Make a Donation</h2>
                      <p className="text-white/70 text-sm">Support our mission across Ghana</p>
                    </div>
                  </div>

                  {/* Currency Selector */}
                  <div className="mb-5">
                    <label className="text-xs font-medium text-white/70 mb-2 block">Currency</label>
                    <div className="flex gap-2">
                      {currencies.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setCurrency(c); setAmount('') }}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                            currency === c
                              ? 'bg-white text-cornell shadow-md'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {c === 'GHS' ? '🇬🇭 GHS' : '🇺🇸 USD'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preset Amounts */}
                  <div className="mb-5">
                    <label className="text-xs font-medium text-white/70 mb-2 block">
                      Select Amount ({currency})
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {presetAmounts.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setAmount(preset.toString())}
                          className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                            amount === preset.toString()
                              ? 'bg-white text-cornell shadow-md'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {currency === 'GHS' ? `₵${preset}` : `$${preset}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="text-xs font-medium text-white/70 mb-2 block">
                      Or enter custom amount ({currency})
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 font-semibold">
                        {currency === 'GHS' ? '₵' : '$'}
                      </span>
                      <Input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-white/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side — Donor Info */}
                <div className="p-6 md:p-8 flex flex-col">
                  <h3 className="text-lg font-bold text-cornell dark:text-white mb-1">Your Information</h3>
                  <p className="text-xs text-charcoal dark:text-white/50 mb-5">Fill in your details to proceed with payment</p>

                  {/* Validation Error */}
                  {validationError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-red-700 dark:text-red-300">{validationError}</p>
                    </div>
                  )}

                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1 block">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50 dark:text-white/40" />
                        <Input
                          value={name}
                          onChange={(e) => { setName(e.target.value); setValidationError('') }}
                          placeholder="Enter your full name"
                          className="pl-9 bg-cream dark:bg-[#122A1B] border-border"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1 block">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50 dark:text-white/40" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setValidationError('') }}
                          placeholder="Enter your email"
                          className="pl-9 bg-cream dark:bg-[#122A1B] border-border"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1 block">Phone Number (Optional)</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50 dark:text-white/40" />
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+233 XXX XXX XXX"
                          className="pl-9 bg-cream dark:bg-[#122A1B] border-border"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <Button
                    onClick={handleMoneyDonate}
                    disabled={!email || !name || numericAmount <= 0 || !paystackLoaded}
                    className="w-full bg-cornell hover:bg-cornell-dark text-white rounded-full py-3 text-base font-semibold mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {numericAmount > 0
                      ? `Donate ${currency === 'GHS' ? '₵' : '$'}${numericAmount.toLocaleString()}`
                      : 'Donate Now'}
                  </Button>

                  <p className="text-[10px] text-center text-charcoal/50 dark:text-white/30 mt-3">
                    Payments are securely processed by Paystack. Your data is encrypted and protected.
                  </p>
                </div>
              </div>
            )}

            {/* ===== ITEM DONATION FORM ===== */}
            {donationType === 'items' && (
              <div className="p-6 md:p-8">
                <button
                  onClick={resetAndClose}
                  className="absolute top-3 right-4 text-charcoal/40 dark:text-white/40 hover:text-charcoal dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-vogue/10 dark:bg-vogue/20 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-vogue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-cornell dark:text-white">Donate Items</h2>
                    <p className="text-charcoal/60 dark:text-white/50 text-sm">Contribute goods, equipment, or supplies to support our programs</p>
                  </div>
                </div>

                {/* Validation Error */}
                {validationError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">{validationError}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Left column — Item details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-cornell dark:text-white flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Item Details
                    </h3>

                    <div>
                      <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1">Category of Items *</Label>
                      <Select value={itemCategory} onValueChange={(v) => { setItemCategory(v); setValidationError('') }}>
                        <SelectTrigger className="bg-cream dark:bg-[#122A1B] border-border">
                          <SelectValue placeholder="Select item category" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1">Condition of Items</Label>
                      <Select value={itemCondition} onValueChange={setItemCondition}>
                        <SelectTrigger className="bg-cream dark:bg-[#122A1B] border-border">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemConditions.map((cond) => (
                            <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1">Quantity</Label>
                      <Input
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(e.target.value)}
                        placeholder="e.g. 5 boxes, 10 laptops, 20 books"
                        className="bg-cream dark:bg-[#122A1B] border-border"
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1">Describe the Items *</Label>
                      <Textarea
                        value={itemDescription}
                        onChange={(e) => { setItemDescription(e.target.value); setValidationError('') }}
                        placeholder="Please describe the items you wish to donate, including brand, model, specifications, sizes, and any other relevant details..."
                        className="bg-cream dark:bg-[#122A1B] border-border min-h-[100px] resize-none"
                      />
                    </div>
                  </div>

                  {/* Right column — Donor info & delivery */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-cornell dark:text-white flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Your Information
                    </h3>

                    <div>
                      <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50 dark:text-white/40" />
                        <Input
                          value={name}
                          onChange={(e) => { setName(e.target.value); setValidationError('') }}
                          placeholder="Enter your full name"
                          className="pl-9 bg-cream dark:bg-[#122A1B] border-border"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50 dark:text-white/40" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setValidationError('') }}
                          placeholder="Enter your email"
                          className="pl-9 bg-cream dark:bg-[#122A1B] border-border"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1">Phone Number (Optional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50 dark:text-white/40" />
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+233 XXX XXX XXX"
                          className="pl-9 bg-cream dark:bg-[#122A1B] border-border"
                        />
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-cornell dark:text-white flex items-center gap-2 pt-2">
                      <Truck className="w-4 h-4" />
                      Delivery Details
                    </h3>

                    <div>
                      <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1">Delivery Method *</Label>
                      <Select value={itemDelivery} onValueChange={(v) => { setItemDelivery(v); setValidationError('') }}>
                        <SelectTrigger className="bg-cream dark:bg-[#122A1B] border-border">
                          <SelectValue placeholder="How will items be delivered?" />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryMethods.map((method) => (
                            <SelectItem key={method} value={method}>{method}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1">Your Location / Address</Label>
                      <Input
                        value={itemLocation}
                        onChange={(e) => setItemLocation(e.target.value)}
                        placeholder="City, country, or full address for pickup"
                        className="bg-cream dark:bg-[#122A1B] border-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleItemDonate}
                  disabled={submitting || !name || !email || !itemCategory || !itemDescription || !itemDelivery}
                  className="w-full bg-vogue hover:bg-vogue-light text-white rounded-full py-3 text-base font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Package className="w-4 h-4 mr-2" />
                  {submitting ? 'Submitting...' : 'Submit Item Donation'}
                </Button>

                <p className="text-[10px] text-center text-charcoal/50 dark:text-white/30 mt-3">
                  Our team will review your donation and contact you to arrange delivery or pickup.
                </p>
              </div>
            )}
          </>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 text-charcoal/40 dark:text-white/40 hover:text-charcoal dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-cornell mb-2">Thank You!</h2>
            {donationType === 'money' && paymentDetails ? (
              <>
                <p className="text-charcoal dark:text-white/70 mb-4 leading-relaxed">
                  Your generous monetary donation has been received. Thank you for supporting our mission to serve communities across Ghana.
                </p>
                <div className="bg-cream dark:bg-[#122A1B] rounded-xl p-4 mb-6 text-left max-w-sm mx-auto">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-charcoal dark:text-white/60">Amount</span>
                    <span className="text-sm font-bold text-cornell">
                      {currency === 'GHS' ? '₵' : '$'}{paymentDetails.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-charcoal dark:text-white/60">Reference</span>
                    <span className="text-sm font-mono text-charcoal dark:text-white/70">{paymentDetails.reference}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-charcoal dark:text-white/70 mb-4 leading-relaxed">
                Your item donation has been submitted successfully. Our team will review your donation and contact you shortly to arrange delivery or pickup. Thank you for your generosity!
              </p>
            )}
            <Button
              onClick={resetAndClose}
              className="bg-cornell hover:bg-cornell-dark text-white rounded-full px-8"
            >
              Close
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="p-8 text-center">
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 text-charcoal/40 dark:text-white/40 hover:text-charcoal dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-cornell mb-2">
              {donationType === 'money' ? 'Payment Issue' : 'Submission Issue'}
            </h2>
            <p className="text-charcoal dark:text-white/70 mb-6 leading-relaxed">
              {errorMessage || 'There was an issue processing your donation. Please try again or contact us for assistance.'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => { setStep('form'); setErrorMessage('') }}
                variant="outline"
                className="rounded-full px-6"
              >
                Try Again
              </Button>
              <Button
                onClick={resetAndClose}
                className="bg-cornell hover:bg-cornell-dark text-white rounded-full px-6"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function DonationModal(props: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <DonationModalInner {...props} />
}
