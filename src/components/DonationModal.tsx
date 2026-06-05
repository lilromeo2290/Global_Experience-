'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Heart, CheckCircle2, X, CreditCard, User, Mail, Phone, AlertCircle } from 'lucide-react'

const presetAmounts = [50, 100, 250, 500, 1000, 5000]
const currencies = ['GHS', 'USD']

// Extend Window type for Paystack
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: Record<string, unknown>) => { openIframe: () => void }
    }
  }
}

function DonationModalInner({ open, onClose }: { open: boolean; onClose: () => void }) {
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

  const handleDonate = () => {
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

  const resetAndClose = () => {
    setAmount('')
    setEmail('')
    setName('')
    setPhone('')
    setStep('form')
    setPaymentDetails(null)
    setErrorMessage('')
    setValidationError('')
    setPaystackActive(false)
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
      <DialogContent className="sm:max-w-3xl bg-white dark:bg-[#0A1F12] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Make a Donation</DialogTitle>

        {step === 'form' && (
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
                onClick={handleDonate}
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

        {step === 'success' && paymentDetails && (
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
            <p className="text-charcoal dark:text-white/70 mb-4 leading-relaxed">
              Your generous donation has been received. Thank you for supporting our mission to serve communities across Ghana.
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
            <h2 className="text-2xl font-bold text-cornell mb-2">Payment Issue</h2>
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
