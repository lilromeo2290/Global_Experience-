// Search Index for Global Experience
// Centralized index of all searchable content across the website

export type SearchCategory = 'program' | 'destination' | 'service' | 'faq' | 'team' | 'page' | 'blog'

export interface SearchItem {
  id: string
  title: string
  description: string
  category: SearchCategory
  keywords: string[]
  href: string
  tags: string[]
  icon?: string
  // For personalization boosting
  relatedInterests?: string[]
  destination?: string
  programType?: string
}

export const searchIndex: SearchItem[] = [
  // === PROGRAMS ===
  {
    id: 'prog-medical',
    title: 'Medical Placement in Teaching Hospitals',
    description: 'Gain invaluable hands-on clinical experience in leading teaching hospitals across Africa. Work alongside seasoned medical professionals in real healthcare settings.',
    category: 'program',
    keywords: ['medical', 'hospital', 'nursing', 'midwifery', 'physiotherapy', 'psychiatric', 'ent', 'healthcare', 'clinical', 'doctor', 'patient care'],
    href: '#programs',
    tags: ['Medical', 'Healthcare', 'Clinical', 'Hospital'],
    icon: 'Stethoscope',
    relatedInterests: ['medical'],
    destination: 'cape-coast',
    programType: 'medical',
  },
  {
    id: 'prog-teaching',
    title: 'Teaching',
    description: 'Inspire the next generation by teaching in local schools and educational institutions. Share your knowledge while learning innovative teaching methods.',
    category: 'program',
    keywords: ['teach', 'school', 'education', 'primary', 'secondary', 'special needs', 'adult literacy', 'children', 'youth', 'classroom'],
    href: '#programs',
    tags: ['Teaching', 'Education', 'Schools', 'Youth'],
    icon: 'BookOpen',
    relatedInterests: ['teaching'],
    programType: 'teaching',
  },
  {
    id: 'prog-journalism',
    title: 'Journalism',
    description: 'Build your media portfolio with real-world experience in broadcasting and newsrooms. Report on compelling stories and develop multimedia content.',
    category: 'program',
    keywords: ['journalism', 'media', 'broadcasting', 'television', 'radio', 'newsroom', 'reporting', 'storytelling', 'multimedia', 'press'],
    href: '#programs',
    tags: ['Journalism', 'Media', 'Broadcasting', 'TV'],
    icon: 'Radio',
    relatedInterests: ['internship', 'business'],
    programType: 'journalism',
  },
  {
    id: 'prog-community-outreach',
    title: 'Community Outreach',
    description: 'Make a lasting difference through community outreach programs that address pressing social needs. Engage with health education, youth empowerment, and women\'s initiatives.',
    category: 'program',
    keywords: ['community', 'outreach', 'social', 'health education', 'youth empowerment', 'women', 'welfare', 'grassroots', 'volunteer'],
    href: '#programs',
    tags: ['Community', 'Outreach', 'Social Impact', 'Youth'],
    icon: 'Users',
    relatedInterests: ['volunteer'],
    programType: 'community',
  },
  {
    id: 'prog-sports',
    title: 'Sports',
    description: 'Coach and develop sports programs in local communities. Use the power of sport to inspire youth, promote health and discipline.',
    category: 'program',
    keywords: ['sports', 'football', 'coaching', 'athletic', 'fitness', 'youth sports', 'soccer', 'team', 'discipline'],
    href: '#programs',
    tags: ['Sports', 'Coaching', 'Football', 'Youth'],
    icon: 'Trophy',
    relatedInterests: ['adventure', 'volunteer'],
    programType: 'sports',
  },
  {
    id: 'prog-office-admin',
    title: 'Office Administration',
    description: 'Develop essential professional skills through office administration placements in dynamic organizational settings.',
    category: 'program',
    keywords: ['office', 'administration', 'admin', 'business', 'management', 'ngo', 'corporate', 'government', 'startup', 'professional'],
    href: '#programs',
    tags: ['Administration', 'Office', 'Business', 'Professional'],
    icon: 'Building2',
    relatedInterests: ['internship', 'business'],
    programType: 'administration',
  },
  {
    id: 'prog-banking-finance',
    title: 'Banking and Finance',
    description: 'Gain valuable financial sector experience in emerging markets. Understand African banking systems, microfinance operations, and financial inclusion.',
    category: 'program',
    keywords: ['banking', 'finance', 'microfinance', 'financial', 'bank', 'emerging markets', 'economic', 'investment', 'corporate finance'],
    href: '#programs',
    tags: ['Banking', 'Finance', 'Economics', 'Business'],
    icon: 'Landmark',
    relatedInterests: ['internship', 'business'],
    destination: 'takoradi',
    programType: 'finance',
  },
  {
    id: 'prog-law',
    title: 'Law Placements',
    description: 'Experience the legal system firsthand through placements in local courts and legal organizations. Observe courtroom proceedings and assist with legal research.',
    category: 'program',
    keywords: ['law', 'legal', 'court', 'justice', 'human rights', 'lawyer', 'attorney', 'courtroom', 'legal research', 'advocacy'],
    href: '#programs',
    tags: ['Law', 'Legal', 'Courts', 'Human Rights'],
    icon: 'Scale',
    relatedInterests: ['internship'],
    destination: 'takoradi',
    programType: 'law',
  },
  {
    id: 'prog-agriculture',
    title: 'Agriculture Placement',
    description: 'Work on sustainable agriculture projects that feed communities and drive economic growth. Learn innovative farming techniques and agribusiness.',
    category: 'program',
    keywords: ['agriculture', 'farming', 'crop', 'animal', 'agribusiness', 'sustainable', 'food security', 'rural', 'livestock'],
    href: '#programs',
    tags: ['Agriculture', 'Farming', 'Sustainability', 'Food Security'],
    icon: 'Wheat',
    relatedInterests: ['volunteer', 'research'],
    programType: 'agriculture',
  },
  {
    id: 'prog-tourism',
    title: 'Tourism and Ecotourism',
    description: 'Explore the intersection of tourism, conservation, and community development. Work with eco-lodges and wildlife sanctuaries.',
    category: 'program',
    keywords: ['tourism', 'ecotourism', 'eco', 'wildlife', 'hospitality', 'conservation', 'adventure', 'travel', 'safari', 'nature'],
    href: '#programs',
    tags: ['Tourism', 'Ecotourism', 'Conservation', 'Wildlife'],
    icon: 'TreePine',
    relatedInterests: ['adventure'],
    programType: 'tourism',
  },
  {
    id: 'prog-school-building',
    title: 'Community Projects — Building of Schools',
    description: 'Participate in transformative community development by helping build schools that provide children with access to quality education.',
    category: 'program',
    keywords: ['school', 'building', 'construction', 'classroom', 'library', 'playground', 'infrastructure', 'community project', 'development'],
    href: '#programs',
    tags: ['Construction', 'Schools', 'Community', 'Infrastructure'],
    icon: 'Users',
    relatedInterests: ['volunteer'],
    destination: 'cape-coast',
    programType: 'construction',
  },
  {
    id: 'prog-boreholes',
    title: 'Bore Holes — Drinkable Water',
    description: 'Help provide communities with access to clean, safe drinking water through bore hole drilling and water infrastructure projects.',
    category: 'program',
    keywords: ['water', 'bore hole', 'drinking', 'clean water', 'sanitation', 'health', 'hygiene', 'infrastructure', 'purification'],
    href: '#programs',
    tags: ['Water', 'Health', 'Infrastructure', 'Community'],
    icon: 'Heart',
    relatedInterests: ['volunteer'],
    programType: 'water',
  },

  // === DESTINATIONS ===
  {
    id: 'dest-cape-coast',
    title: 'Cape Coast',
    description: 'Located in the historic Central Region, our Cape Coast office coordinates placements in teaching hospitals, schools, and community outreach programs.',
    category: 'destination',
    keywords: ['cape coast', 'central region', 'ghana', 'castle', 'historical', 'beach', 'coastal', 'fort', 'slave castle', 'kakum'],
    href: '#cape-coast',
    tags: ['Ghana', 'Central Region', 'Coastal', 'Historical'],
    icon: 'MapPin',
    relatedInterests: ['medical', 'teaching', 'volunteer', 'adventure'],
    destination: 'cape-coast',
  },
  {
    id: 'dest-volta-ho',
    title: 'Volta – HO',
    description: 'Our headquarters and primary coordination centre in the Volta Region, managing all placement programs across Ghana and West Africa.',
    category: 'destination',
    keywords: ['volta', 'ho', 'ghana', 'head office', 'headquarters', 'volta region', 'mountains', 'adaklu', 'wli falls', 'togbe'],
    href: '#volta-ho',
    tags: ['Ghana', 'Volta Region', 'Head Office', 'Mountains'],
    icon: 'MapPin',
    relatedInterests: ['adventure', 'volunteer'],
    destination: 'volta-ho',
  },
  {
    id: 'dest-takoradi',
    title: 'Takoradi',
    description: 'Serving the Western Region, our Takoradi office coordinates placements in banking and finance, office administration, and law.',
    category: 'destination',
    keywords: ['takoradi', 'western region', 'ghana', 'sekondi', 'oil city', 'harbour', 'beach', 'busua', 'corporate'],
    href: '#takoradi',
    tags: ['Ghana', 'Western Region', 'Corporate', 'Finance'],
    icon: 'MapPin',
    relatedInterests: ['internship', 'business'],
    destination: 'takoradi',
  },
  {
    id: 'dest-accra',
    title: 'Accra',
    description: 'Our Accra office in the Greater Accra Region coordinates placements across the capital city, focusing on corporate, legal, and administrative settings.',
    category: 'destination',
    keywords: ['accra', 'greater accra', 'ghana', 'capital', 'city', 'urban', 'corporate', 'business', 'kotoka', 'labadi'],
    href: '#accra',
    tags: ['Ghana', 'Greater Accra', 'Urban', 'Corporate'],
    icon: 'MapPin',
    relatedInterests: ['internship', 'business'],
    destination: 'accra',
  },

  // === COMING SOON DESTINATIONS ===
  {
    id: 'dest-tanzania',
    title: 'Tanzania (Coming Soon)',
    description: 'Ecotourism placements, community health outreach, and education programs near the Serengeti and Mount Kilimanjaro.',
    category: 'destination',
    keywords: ['tanzania', 'serengeti', 'kilimanjaro', 'safari', 'africa', 'coming soon', 'ecotourism', 'wildlife', 'zanzibar'],
    href: '#destinations',
    tags: ['Tanzania', 'Coming Soon', 'Safari', 'Ecotourism'],
    icon: 'Mountain',
    relatedInterests: ['adventure', 'medical', 'teaching'],
  },
  {
    id: 'dest-kenya',
    title: 'Kenya (Coming Soon)',
    description: 'Journalism, banking and finance, and tourism placements in a dynamic economy with world-famous national parks.',
    category: 'destination',
    keywords: ['kenya', 'nairobi', 'masai mara', 'safari', 'africa', 'coming soon', 'media', 'finance', 'wildlife'],
    href: '#destinations',
    tags: ['Kenya', 'Coming Soon', 'Media', 'Finance'],
    icon: 'Globe',
    relatedInterests: ['internship', 'adventure', 'business'],
  },
  {
    id: 'dest-nepal',
    title: 'Nepal (Coming Soon)',
    description: 'Community development, teaching, and healthcare placements amid breathtaking Himalayan landscapes.',
    category: 'destination',
    keywords: ['nepal', 'himalaya', 'asia', 'coming soon', 'mountains', 'teaching', 'healthcare', 'kathmandu', 'trekking'],
    href: '#destinations',
    tags: ['Nepal', 'Coming Soon', 'Himalayas', 'Teaching'],
    icon: 'Mountain',
    relatedInterests: ['teaching', 'medical', 'adventure'],
  },
  {
    id: 'dest-zambia',
    title: 'Zambia (Coming Soon)',
    description: 'Agriculture placements, school building projects, and bore hole water initiatives near the stunning Victoria Falls.',
    category: 'destination',
    keywords: ['zambia', 'victoria falls', 'africa', 'coming soon', 'agriculture', 'water', 'community', 'lusaka'],
    href: '#destinations',
    tags: ['Zambia', 'Coming Soon', 'Agriculture', 'Victoria Falls'],
    icon: 'Palmtree',
    relatedInterests: ['volunteer', 'research'],
  },

  // === SERVICES ===
  {
    id: 'svc-airport',
    title: 'Airport Pickups',
    description: 'Seamless airport transfer services ensuring safe and comfortable arrival. Our team greets you at the airport 24/7.',
    category: 'service',
    keywords: ['airport', 'pickup', 'transfer', 'arrival', 'kotka', 'travel', 'transport', 'safe arrival', 'greet'],
    href: '#services',
    tags: ['Airport', 'Transfer', 'Arrival', 'Safety'],
    icon: 'Plane',
    relatedInterests: ['volunteer', 'internship'],
  },
  {
    id: 'svc-orientation',
    title: 'Local Orientations',
    description: 'Comprehensive orientation programs covering local culture, customs, safety guidelines, and essential information.',
    category: 'service',
    keywords: ['orientation', 'local', 'culture', 'customs', 'safety', 'settle in', 'guide', 'briefing', 'preparation'],
    href: '#services',
    tags: ['Orientation', 'Culture', 'Safety', 'Guide'],
    icon: 'MapPin',
    relatedInterests: ['volunteer', 'adventure'],
  },
  {
    id: 'svc-placement',
    title: 'Placement Organisation',
    description: 'Expert matching of your skills and interests with the perfect placement opportunity across 12 professional categories.',
    category: 'service',
    keywords: ['placement', 'organisation', 'matching', 'skills', 'career', 'professional', 'internship', 'volunteer', 'opportunity'],
    href: '/placements',
    tags: ['Placement', 'Matching', 'Skills', 'Career'],
    icon: 'Briefcase',
    relatedInterests: ['internship', 'volunteer', 'business'],
  },
  {
    id: 'svc-accommodation',
    title: 'Accommodation',
    description: 'Safe, comfortable, and affordable housing options carefully vetted by our team. Host families and shared volunteer houses.',
    category: 'service',
    keywords: ['accommodation', 'housing', 'host family', 'volunteer house', 'stay', 'live', 'room', 'home', 'safe', 'comfortable'],
    href: '#services',
    tags: ['Accommodation', 'Housing', 'Host Family', 'Safety'],
    icon: 'Home',
    relatedInterests: ['volunteer', 'internship'],
  },
  {
    id: 'svc-feeding',
    title: 'Feeding',
    description: 'Nutritious meal plans and daily feeding support throughout your stay with local and familiar cuisine.',
    category: 'service',
    keywords: ['feeding', 'food', 'meals', 'nutrition', 'cuisine', 'dining', 'eat', 'cooking', 'local food'],
    href: '#services',
    tags: ['Feeding', 'Meals', 'Nutrition', 'Local Cuisine'],
    icon: 'UtensilsCrossed',
    relatedInterests: ['volunteer', 'adventure'],
  },

  // === FAQS ===
  {
    id: 'faq-apply',
    title: 'How do I apply for a placement?',
    description: 'Simply navigate to our Contact page and fill out the application form. Select your preferred program type and indicate your availability.',
    category: 'faq',
    keywords: ['apply', 'application', 'how to', 'sign up', 'register', 'enroll', 'get started', 'form'],
    href: '#faq',
    tags: ['Application', 'Getting Started', 'Process'],
    relatedInterests: ['volunteer', 'internship'],
  },
  {
    id: 'faq-fee',
    title: 'What is included in the placement fee?',
    description: 'Airport pickup, local orientation, accommodation, feeding, placement organization, 24/7 support, and pre-departure information.',
    category: 'faq',
    keywords: ['fee', 'cost', 'price', 'payment', 'included', 'what covers', 'budget', 'money', 'expense'],
    href: '#faq',
    tags: ['Fees', 'Costs', 'Pricing', 'What\'s Included'],
    relatedInterests: ['volunteer', 'internship'],
  },
  {
    id: 'faq-experience',
    title: 'Do I need previous experience to volunteer?',
    description: 'While some placements require specific qualifications, many welcome participants of all experience levels with comprehensive training provided.',
    category: 'faq',
    keywords: ['experience', 'qualifications', 'requirements', 'skills needed', 'beginner', 'no experience', 'training'],
    href: '#faq',
    tags: ['Experience', 'Qualifications', 'Requirements'],
    relatedInterests: ['volunteer'],
  },
  {
    id: 'faq-duration',
    title: 'How long do placements typically last?',
    description: 'Placements vary from 2 weeks to 6 months. Short-term programs range 2-8 weeks, while professional placements run 8-24 weeks.',
    category: 'faq',
    keywords: ['duration', 'length', 'how long', 'weeks', 'months', 'short term', 'long term', 'time'],
    href: '#faq',
    tags: ['Duration', 'Timeline', 'Schedule'],
    relatedInterests: ['volunteer', 'internship'],
  },
  {
    id: 'faq-safety',
    title: 'Is it safe to volunteer in Africa?',
    description: 'Safety is our top priority. We provide 24/7 support, vetted accommodations, insurance, local coordinators, and emergency protocols.',
    category: 'faq',
    keywords: ['safety', 'safe', 'security', 'risk', 'danger', 'emergency', 'insurance', 'health'],
    href: '#faq',
    tags: ['Safety', 'Security', 'Health', 'Insurance'],
    relatedInterests: ['volunteer', 'adventure'],
  },
  {
    id: 'faq-credit',
    title: 'Can I get academic credit for my placement?',
    description: 'Yes, many programs qualify for academic credit. We work with universities worldwide and provide all necessary documentation.',
    category: 'faq',
    keywords: ['academic', 'credit', 'university', 'college', 'degree', 'study', 'thesis', 'academic credit', 'student'],
    href: '#faq',
    tags: ['Academic', 'Credit', 'University', 'Education'],
    relatedInterests: ['internship', 'research', 'teaching'],
  },
  {
    id: 'faq-after-apply',
    title: 'What happens after I submit my application?',
    description: 'Our team reviews within 48 hours, followed by an informal video call interview, then matching and pre-departure pack.',
    category: 'faq',
    keywords: ['after apply', 'process', 'next steps', 'review', 'interview', 'matching', 'timeline'],
    href: '#faq',
    tags: ['Process', 'Next Steps', 'Timeline'],
    relatedInterests: ['volunteer', 'internship'],
  },
  {
    id: 'faq-age',
    title: 'Are there age restrictions for volunteering?',
    description: 'Participants must be at least 18 years old. There is no upper age limit for volunteers in good health.',
    category: 'faq',
    keywords: ['age', 'age limit', 'old', 'young', 'minimum age', '18', 'restrictions'],
    href: '#faq',
    tags: ['Age', 'Requirements', 'Eligibility'],
    relatedInterests: ['volunteer'],
  },
  {
    id: 'faq-donations',
    title: 'How are donations used?',
    description: '90% of donations go directly to programs and community projects. We publish annual financial reports for transparency.',
    category: 'faq',
    keywords: ['donation', 'donate', 'money', 'transparency', 'fund', 'support', 'contribute', 'charity'],
    href: '#faq',
    tags: ['Donations', 'Transparency', 'Funding'],
    relatedInterests: ['donate'],
  },
  {
    id: 'faq-group',
    title: 'Can I bring a group or organize a team trip?',
    description: 'Yes! We customize programs for university groups, corporate teams, and friends with additional benefits and discounted fees.',
    category: 'faq',
    keywords: ['group', 'team', 'team trip', 'corporate', 'university group', 'friends', 'bulk', 'discount'],
    href: '#faq',
    tags: ['Groups', 'Team Trips', 'Corporate', 'Discounts'],
    relatedInterests: ['volunteer', 'business'],
  },

  // === KEY PAGES ===
  {
    id: 'page-apply',
    title: 'Apply for a Placement',
    description: 'Start your transformative journey by applying for a volunteer or professional placement in Ghana.',
    category: 'page',
    keywords: ['apply', 'application form', 'sign up', 'volunteer form', 'placement form', 'enroll'],
    href: '#volunteer',
    tags: ['Apply', 'Form', 'Getting Started'],
    icon: 'FileText',
    relatedInterests: ['volunteer', 'internship'],
  },
  {
    id: 'page-donate',
    title: 'Donate to Our Programs',
    description: 'Support our mission through donations to any of our 9 outreach program areas including school building, water projects, and medical supplies.',
    category: 'page',
    keywords: ['donate', 'donation', 'contribute', 'support', 'give', 'charity', 'fund', 'outreach', 'help'],
    href: '#donate',
    tags: ['Donate', 'Support', 'Charity', 'Outreach'],
    icon: 'Heart',
    relatedInterests: ['donate'],
  },
  {
    id: 'page-gallery',
    title: 'Photo Gallery',
    description: 'Browse photos from our placements, community projects, volunteer experiences, and events across Ghana.',
    category: 'page',
    keywords: ['gallery', 'photos', 'pictures', 'images', 'album', 'media', 'visuals'],
    href: '#gallery',
    tags: ['Gallery', 'Photos', 'Media'],
    icon: 'Camera',
    relatedInterests: ['volunteer', 'adventure'],
  },
  {
    id: 'page-contact',
    title: 'Contact Us',
    description: 'Get in touch with our team for inquiries about placements, partnerships, or general information.',
    category: 'page',
    keywords: ['contact', 'email', 'phone', 'reach out', 'inquiry', 'question', 'help', 'support', 'message'],
    href: '#contact',
    tags: ['Contact', 'Support', 'Inquiry'],
    icon: 'Mail',
  },
  {
    id: 'page-about',
    title: 'About Global Experience',
    description: 'Learn about our mission, vision, team, and 10+ years of impact aligning skills with corporate goals across Africa.',
    category: 'page',
    keywords: ['about', 'mission', 'vision', 'who we are', 'history', 'team', 'organization', 'ngo'],
    href: '#about',
    tags: ['About', 'Mission', 'Vision', 'Team'],
    icon: 'Info',
  },
  {
    id: 'page-placements',
    title: 'Placement Programs Overview',
    description: 'Explore all 12 professional placement categories from medical to agriculture, with detailed information about each program.',
    category: 'page',
    keywords: ['placements', 'programs', 'internship', 'volunteer', 'opportunities', 'categories', 'sectors'],
    href: '/placements',
    tags: ['Placements', 'Programs', 'Categories'],
    icon: 'Briefcase',
    relatedInterests: ['volunteer', 'internship'],
  },
  {
    id: 'page-airport-pickup',
    title: 'Airport Pickup Service',
    description: 'Book our airport pickup service for safe and comfortable arrival at Kotoka International Airport.',
    category: 'page',
    keywords: ['airport', 'pickup', 'arrival', 'kotoka', 'transfer', 'transport'],
    href: '/services/airport-pickups',
    tags: ['Airport', 'Pickup', 'Transport'],
    icon: 'Plane',
    relatedInterests: ['volunteer', 'internship'],
  },
]

// === SEARCH ENGINE ===

// Fuzzy match score - returns a score from 0 to 1
function fuzzyMatch(query: string, text: string): number {
  const q = query.toLowerCase().trim()
  const t = text.toLowerCase().trim()

  // Exact match
  if (t === q) return 1.0
  // Starts with
  if (t.startsWith(q)) return 0.9
  // Contains
  if (t.includes(q)) return 0.8
  // Word boundary match
  const words = t.split(/\s+/)
  if (words.some(w => w.startsWith(q))) return 0.7
  // Any word contains
  if (words.some(w => w.includes(q))) return 0.6

  // Character-by-character fuzzy match
  let qi = 0
  let score = 0
  let lastMatchIndex = -1

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 1
      // Bonus for consecutive matches
      if (lastMatchIndex === ti - 1) score += 0.5
      lastMatchIndex = ti
      qi++
    }
  }

  // If we didn't match all query characters, it's not a match
  if (qi < q.length) return 0

  return (score / q.length) * 0.5
}

export interface SearchResult {
  item: SearchItem
  score: number
  matchReason: string
}

export interface SearchFilters {
  category?: SearchCategory
  destination?: string
  programType?: string
  interests?: string[]
}

export function search(
  query: string,
  filters?: SearchFilters,
  limit: number = 20
): SearchResult[] {
  if (!query.trim()) return []

  const results: SearchResult[] = []

  for (const item of searchIndex) {
    // Apply filters first
    if (filters?.category && item.category !== filters.category) continue
    if (filters?.destination && item.destination !== filters.destination) continue
    if (filters?.programType && item.programType !== filters.programType) continue

    // Calculate match score
    let bestScore = 0
    let matchReason = ''

    // Title match (highest weight)
    const titleScore = fuzzyMatch(query, item.title)
    if (titleScore > bestScore) {
      bestScore = titleScore * 1.5
      matchReason = 'title'
    }

    // Keywords match
    for (const keyword of item.keywords) {
      const kwScore = fuzzyMatch(query, keyword)
      if (kwScore * 1.2 > bestScore) {
        bestScore = kwScore * 1.2
        matchReason = 'keyword'
      }
    }

    // Description match (lower weight)
    const descScore = fuzzyMatch(query, item.description)
    if (descScore * 0.8 > bestScore) {
      bestScore = descScore * 0.8
      matchReason = 'description'
    }

    // Tags match
    for (const tag of item.tags) {
      const tagScore = fuzzyMatch(query, tag)
      if (tagScore * 1.1 > bestScore) {
        bestScore = tagScore * 1.1
        matchReason = 'tag'
      }
    }

    // Personalization boost based on interests
    if (filters?.interests && item.relatedInterests) {
      const overlap = filters.interests.filter(i => item.relatedInterests!.includes(i))
      if (overlap.length > 0) {
        bestScore += overlap.length * 0.15
      }
    }

    if (bestScore >= 0.3) {
      results.push({
        item,
        score: Math.min(bestScore, 1.0),
        matchReason,
      })
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score)

  return results.slice(0, limit)
}

// Type-ahead suggestions - returns quick suggestions as user types
export function getSuggestions(query: string, limit: number = 8): SearchResult[] {
  if (!query.trim() || query.length < 2) return []

  return search(query, undefined, limit)
}

// Get popular/trending searches
export function getPopularSearches(): string[] {
  return [
    'Medical placement',
    'Volunteer in Ghana',
    'Teaching program',
    'Cape Coast',
    'Airport pickup',
    'How to apply',
    'Fees and costs',
    'Donate',
  ]
}

// Get personalized search suggestions based on visitor profile
export function getPersonalizedSuggestions(interests: string[]): SearchResult[] {
  if (interests.length === 0) {
    // Return a mix of popular items
    return searchIndex
      .filter(item => item.category === 'program')
      .slice(0, 4)
      .map(item => ({ item, score: 0.5, matchReason: 'popular' }))
  }

  const results: SearchResult[] = []
  for (const item of searchIndex) {
    if (item.relatedInterests) {
      const overlap = interests.filter(i => item.relatedInterests!.includes(i))
      if (overlap.length > 0) {
        results.push({
          item,
          score: overlap.length * 0.3,
          matchReason: 'personalized',
        })
      }
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 6)
}

// Category display helpers
export const categoryLabels: Record<SearchCategory, string> = {
  program: 'Programs',
  destination: 'Destinations',
  service: 'Services',
  faq: 'FAQs',
  team: 'Team',
  page: 'Pages',
  blog: 'Blog',
}

export const categoryColors: Record<SearchCategory, string> = {
  program: 'bg-cornell/10 text-cornell',
  destination: 'bg-vogue/10 text-vogue',
  service: 'bg-vogue-light/10 text-vogue-light',
  faq: 'bg-amber-100 text-amber-700',
  team: 'bg-purple-100 text-purple-700',
  page: 'bg-blue-100 text-blue-700',
  blog: 'bg-pink-100 text-pink-700',
}
