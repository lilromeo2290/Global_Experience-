// Hyper-Personalization Engine for Global Experience
// Tracks visitor behavior, stores preferences, and provides personalized recommendations

export interface VisitorProfile {
  name?: string
  email?: string
  visitCount: number
  firstVisit: string
  lastVisit: string
  interests: string[] // e.g., 'volunteer', 'medical', 'teaching', 'donate', 'internship'
  viewedDestinations: string[] // e.g., 'cape-coast', 'volta-ho', 'takoradi', 'accra'
  viewedSections: string[] // e.g., 'about', 'destinations', 'services', 'volunteer', 'donate'
  preferredProgram?: string
  hasDonated: boolean
  hasApplied: boolean
  chatHistory: number // number of chat interactions
}

const STORAGE_KEY = 'ge_visitor_profile'

const INTEREST_KEYWORDS: Record<string, string[]> = {
  volunteer: ['volunteer', 'volunteering', 'help', 'community', 'give back'],
  medical: ['medical', 'health', 'hospital', 'nursing', 'healthcare', 'clinic'],
  teaching: ['teach', 'teaching', 'education', 'school', 'children', 'youth'],
  internship: ['internship', 'intern', 'placement', 'career', 'professional', 'graduate'],
  donate: ['donate', 'donation', 'contribute', 'support', 'give', 'fund'],
  adventure: ['adventure', 'paragliding', 'hiking', 'travel', 'explore', 'tourism'],
  research: ['research', 'study', 'academic', 'thesis', 'fieldwork'],
  business: ['business', 'entrepreneurship', 'startup', 'corporate'],
}

export function getVisitorProfile(): VisitorProfile {
  if (typeof window === 'undefined') {
    return createDefaultProfile()
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {}
  return createDefaultProfile()
}

function createDefaultProfile(): VisitorProfile {
  return {
    visitCount: 0,
    firstVisit: new Date().toISOString(),
    lastVisit: new Date().toISOString(),
    interests: [],
    viewedDestinations: [],
    viewedSections: [],
    hasDonated: false,
    hasApplied: false,
    chatHistory: 0,
  }
}

export function saveVisitorProfile(profile: VisitorProfile): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {}
}

export function updateVisit(): VisitorProfile {
  const profile = getVisitorProfile()
  profile.visitCount += 1
  profile.lastVisit = new Date().toISOString()
  saveVisitorProfile(profile)
  return profile
}

export function addViewedSection(section: string): VisitorProfile {
  const profile = getVisitorProfile()
  if (!profile.viewedSections.includes(section)) {
    profile.viewedSections.push(section)
  }
  saveVisitorProfile(profile)
  return profile
}

export function addViewedDestination(destination: string): VisitorProfile {
  const profile = getVisitorProfile()
  if (!profile.viewedDestinations.includes(destination)) {
    profile.viewedDestinations.push(destination)
  }
  saveVisitorProfile(profile)
  return profile
}

export function addInterest(interest: string): VisitorProfile {
  const profile = getVisitorProfile()
  if (!profile.interests.includes(interest)) {
    profile.interests.push(interest)
  }
  saveVisitorProfile(profile)
  return profile
}

export function detectInterestsFromText(text: string): string[] {
  const lower = text.toLowerCase()
  const detected: string[] = []
  for (const [interest, keywords] of Object.entries(INTEREST_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      detected.push(interest)
    }
  }
  return detected
}

export function setVisitorName(name: string): VisitorProfile {
  const profile = getVisitorProfile()
  profile.name = name
  saveVisitorProfile(profile)
  return profile
}

export function setVisitorEmail(email: string): VisitorProfile {
  const profile = getVisitorProfile()
  profile.email = email
  saveVisitorProfile(profile)
  return profile
}

export function setPreferredProgram(program: string): VisitorProfile {
  const profile = getVisitorProfile()
  profile.preferredProgram = program
  saveVisitorProfile(profile)
  return profile
}

export function markDonated(): VisitorProfile {
  const profile = getVisitorProfile()
  profile.hasDonated = true
  saveVisitorProfile(profile)
  return profile
}

export function markApplied(): VisitorProfile {
  const profile = getVisitorProfile()
  profile.hasApplied = true
  saveVisitorProfile(profile)
  return profile
}

export function incrementChatHistory(): VisitorProfile {
  const profile = getVisitorProfile()
  profile.chatHistory += 1
  saveVisitorProfile(profile)
  return profile
}

// Get personalized recommendations based on profile
export interface PersonalizedRecommendation {
  title: string
  description: string
  cta: string
  href: string
  icon: string
}

export function getPersonalizedRecommendations(profile: VisitorProfile): PersonalizedRecommendation[] {
  const recommendations: PersonalizedRecommendation[] = []

  // If interested in volunteering but hasn't applied
  if (profile.interests.includes('volunteer') && !profile.hasApplied) {
    recommendations.push({
      title: 'Volunteer in Ghana',
      description: 'Based on your interest in volunteering, explore our life-changing placement opportunities across Ghana.',
      cta: 'Apply Now',
      href: '#volunteer',
      icon: 'volunteer',
    })
  }

  // If interested in medical placements
  if (profile.interests.includes('medical')) {
    recommendations.push({
      title: 'Medical & Healthcare Placements',
      description: 'Gain hands-on experience in hospitals and clinics across Ghana while making a real difference.',
      cta: 'Learn More',
      href: '#services',
      icon: 'medical',
    })
  }

  // If interested in teaching
  if (profile.interests.includes('teaching')) {
    recommendations.push({
      title: 'Teaching & Education Programs',
      description: 'Share your knowledge and inspire young minds in schools and communities throughout Ghana.',
      cta: 'Explore Programs',
      href: '#volunteer',
      icon: 'teaching',
    })
  }

  // If they've viewed destinations but not applied
  if (profile.viewedDestinations.length > 0 && !profile.hasApplied) {
    const dest = profile.viewedDestinations[profile.viewedDestinations.length - 1]
    const destNames: Record<string, string> = {
      'cape-coast': 'Cape Coast',
      'volta-ho': 'Volta Region',
      takoradi: 'Takoradi',
      accra: 'Accra',
    }
    recommendations.push({
      title: `Explore ${destNames[dest] || dest}`,
      description: `You showed interest in ${destNames[dest] || dest}. Discover available programs and start your journey there.`,
      cta: 'View Programs',
      href: `#${dest}`,
      icon: 'destination',
    })
  }

  // If interested in donations but hasn't donated
  if (profile.interests.includes('donate') && !profile.hasDonated) {
    recommendations.push({
      title: 'Support Our Mission',
      description: 'Your generosity can transform communities. Choose from 9 outreach program areas to make your impact.',
      cta: 'Donate Now',
      href: '#donate',
      icon: 'donate',
    })
  }

  // If interested in adventure
  if (profile.interests.includes('adventure')) {
    recommendations.push({
      title: 'Paragliding at Adaklu Mountains',
      description: 'Experience the thrill of paragliding over the breathtaking Adaklu Mountains in the Volta Region.',
      cta: 'Discover More',
      href: '#volta-ho',
      icon: 'adventure',
    })
  }

  // If interested in internship
  if (profile.interests.includes('internship')) {
    recommendations.push({
      title: 'Professional Internship Placements',
      description: 'Build your career with international work experience in journalism, business, IT, and more.',
      cta: 'Apply for Internship',
      href: '#volunteer',
      icon: 'internship',
    })
  }

  // Default recommendations if none matched
  if (recommendations.length === 0) {
    recommendations.push(
      {
        title: 'Apply for a Placement',
        description: 'Start your transformative journey with Global Experience Placements in Ghana.',
        cta: 'Apply Now',
        href: '#volunteer',
        icon: 'volunteer',
      },
      {
        title: 'Support Our Outreach',
        description: 'Make a difference through donations to any of our 9 program areas.',
        cta: 'Donate',
        href: '#donate',
        icon: 'donate',
      }
    )
  }

  return recommendations.slice(0, 3) // Max 3 recommendations
}

// Get personalized greeting
export function getPersonalizedGreeting(profile: VisitorProfile): {
  greeting: string
  subtitle: string
} {
  const isReturning = profile.visitCount > 1
  const name = profile.name

  if (name && isReturning) {
    return {
      greeting: `Welcome back, ${name}!`,
      subtitle: profile.hasApplied
        ? 'Your application is being processed. Explore more opportunities below.'
        : profile.hasDonated
        ? 'Thank you for your generosity! Continue exploring our programs.'
        : "We're excited to see you again. Ready to start your journey?",
    }
  }

  if (name) {
    return {
      greeting: `Hello, ${name}!`,
      subtitle: 'Welcome to Global Experience Placements. Let us help you find the perfect opportunity.',
    }
  }

  if (isReturning) {
    return {
      greeting: 'Welcome Back!',
      subtitle: profile.interests.length > 0
        ? `Continue exploring ${profile.interests[0]} opportunities and more.`
        : "Great to see you again! Let's find your perfect placement.",
    }
  }

  return {
    greeting: 'Transform Lives. Including Yours.',
    subtitle: 'Join 2,000+ volunteers and professionals making a real difference through international placements in Ghana.',
  }
}
