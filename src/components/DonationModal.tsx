'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Heart, CheckCircle2, X, CreditCard, User, Mail, Phone } from 'lucide-react'
import dynamic from 'next/dynamic'

const usePaystackPayment = dynamic(
  () => import('react-paystack').then((mod) => mod.usePaystackPayment),
  { ssr: false }
)

const presetAmounts = [50, 100, 250, 500, 1000, 5000]
const currencies = ['GHS', 'USD']

function DonationModalInner({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('GHS')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form')
  const [paymentDetails, setPaymentDetails] = useState<{ amount: number; reference: string } | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''

  const numericAmount = parseFloat(amount) || 0

  const config = {
    reference: `GEP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email: email,
    amount: numericAmount * 100,
    publicKey: publicKey,
    currency: currency,
    metadata: {
      name,
      phone,
      custom_fields: [
        { display_name: 'Donor Name', variable_name: 'name', value: name },
        { display_name: 'Donor Phone', variable_name: 'phone', value: phone },
      ],
    },
  }

  const onSuccess = async (reference: { reference: string }) => {
    try {
      const res = await fetch('/api/donate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: reference.reference }),
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
  }

  const onClosePaystack = () => {
    // User closed the Paystack popup
  }

  const initializePayment = usePaystackPayment(config)

  const handleDonate = () => {
    if (!email || !name || numericAmount <= 0) return

    initializePayment({
      onSuccess: (reference: unknown) => onSuccess(reference as { reference: string }),
      onClose: onClosePaystack,
    })
  }

  const resetAndClose = () => {
    setAmount('')
    setEmail('')
    setName('')
    setPhone('')
    setStep('form')
    setPaymentDetails(null)
    setErrorMessage('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
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
                      onClick={() => setCurrency(c)}
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
                    className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </div>
            </div>

            {/* Right Side — Donor Info */}
            <div className="p-6 md:p-8 flex flex-col">
              <h3 className="text-lg font-bold text-cornell dark:text-white mb-1">Your Information</h3>
              <p className="text-xs text-charcoal dark:text-white/50 mb-5">Fill in your details to proceed with payment</p>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-xs font-medium text-charcoal dark:text-white/70 mb-1 block">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/50 dark:text-white/40" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      onChange={(e) => setEmail(e.target.value)}
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
                disabled={!email || !name || numericAmount <= 0}
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
