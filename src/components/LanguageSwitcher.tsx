'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { code: 'zh-CN', label: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺' },
  { code: 'it', label: 'Italian', flag: '🇮🇹' },
  { code: 'nl', label: 'Dutch', flag: '🇳🇱' },
  { code: 'sw', label: 'Swahili', flag: '🇰🇪' },
  { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
  { code: 'ak', label: 'Akan/Twi', flag: '🇬🇭' },
  { code: 'ee', label: 'Ewe', flag: '🇬🇭' },
  { code: 'da', label: 'Danish', flag: '🇩🇰' },
  { code: 'sv', label: 'Swedish', flag: '🇸🇪' },
  { code: 'no', label: 'Norwegian', flag: '🇳🇴' },
]

interface LanguageSwitcherProps {
  scrolled?: boolean
  className?: string
}

export default function LanguageSwitcher({ scrolled = false, className = '' }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('en')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode)
    setOpen(false)

    // Use Google Translate if available
    const googleTranslateElement = document.querySelector('.goog-te-combo') as HTMLSelectElement | null
    if (googleTranslateElement) {
      googleTranslateElement.value = langCode
      googleTranslateElement.dispatchEvent(new Event('change', { bubbles: true }))
    } else {
      // Fallback: reload with Google Translate hash
      if (langCode !== 'en') {
        window.location.hash = `googtrans(en|${langCode})`
        window.location.reload()
      } else {
        // Reset to English
        window.location.hash = ''
        window.location.reload()
      }
    }
  }

  const currentLanguage = languages.find(l => l.code === currentLang)

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
          scrolled
            ? 'text-charcoal dark:text-white/80 hover:bg-cornell/5 dark:hover:bg-white/10 border border-border dark:border-white/20'
            : 'text-white/80 hover:text-white hover:bg-white/10 border border-white/20'
        }`}
        aria-label="Change language"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{currentLanguage?.flag} {currentLanguage?.label}</span>
        <span className="sm:hidden">{currentLanguage?.flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#122A1B] rounded-xl shadow-xl border border-border overflow-hidden z-[100]">
          <div className="py-1 max-h-72 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                  currentLang === lang.code
                    ? 'text-cornell bg-cornell/10 font-medium'
                    : 'text-charcoal dark:text-white/80 hover:text-cornell dark:hover:text-white hover:bg-cornell/5 dark:hover:bg-white/10'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
                {currentLang === lang.code && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cornell" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
