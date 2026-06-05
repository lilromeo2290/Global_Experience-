// Simple in-memory data store for admin
// In production, replace with a proper database (Prisma + PostgreSQL)

export interface PickupRequest {
  id: string
  fullName: string
  email: string
  phone: string
  nationality: string
  participantType: string
  arrivalDate: string
  arrivalTime: string
  flightNumber: string
  airline: string
  departureCity: string
  destinationAirport: string
  numberOfLuggage: string
  accommodationName: string
  accommodationAddress: string
  specialRequirements: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

export interface ContactMessage {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  inquiryType: string
  program: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: string
}

export interface Application {
  id: string
  fullName: string
  email: string
  phone: string
  program: string
  nationality: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  createdAt: string
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  category: string
  uploadedAt: string
}

// Sample data for demonstration
const pickupRequests: PickupRequest[] = [
  {
    id: 'PK-001',
    fullName: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+44 7911 123456',
    nationality: 'British',
    participantType: 'Volunteer',
    arrivalDate: '2025-07-15',
    arrivalTime: '14:30',
    flightNumber: 'BA081',
    airline: 'British Airways',
    departureCity: 'London',
    destinationAirport: 'Kotoka International Airport (ACC)',
    numberOfLuggage: '2',
    accommodationName: 'Global Experience Volunteer House',
    accommodationAddress: 'PMB Ho, Volta Region',
    specialRequirements: 'Vegetarian meals preferred',
    status: 'pending',
    createdAt: '2025-06-20T10:30:00Z',
  },
  {
    id: 'PK-002',
    fullName: 'Marco Schmidt',
    email: 'marco.s@email.de',
    phone: '+49 170 9876543',
    nationality: 'German',
    participantType: 'Intern',
    arrivalDate: '2025-08-01',
    arrivalTime: '09:15',
    flightNumber: 'LH576',
    airline: 'Lufthansa',
    departureCity: 'Frankfurt',
    destinationAirport: 'Kotoka International Airport (ACC)',
    numberOfLuggage: '1',
    accommodationName: 'Homestay - Adenta',
    accommodationAddress: '45 Adenta Road, Adenta, Accra',
    specialRequirements: '',
    status: 'confirmed',
    createdAt: '2025-06-18T14:15:00Z',
  },
]

const contactMessages: ContactMessage[] = [
  {
    id: 'MSG-001',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@email.com',
    phone: '+1 555 123 4567',
    inquiryType: 'placement',
    program: 'Medical Placement in Teaching Hospitals',
    message: 'I am a nursing student from Canada and I would like to know more about the medical placement program. What are the requirements and how long is the typical placement duration?',
    status: 'new',
    createdAt: '2025-06-22T08:45:00Z',
  },
  {
    id: 'MSG-002',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'j.wilson@email.co.uk',
    phone: '+44 20 7946 0958',
    inquiryType: 'volunteer',
    program: 'Community Outreach',
    message: 'Hello, I am interested in volunteering with community outreach programs this summer. Could you provide more details about the projects available and accommodation options?',
    status: 'read',
    createdAt: '2025-06-21T16:30:00Z',
  },
]

const applications: Application[] = [
  {
    id: 'APP-001',
    fullName: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+44 7911 123456',
    program: 'Medical Placement in Teaching Hospitals',
    nationality: 'British',
    status: 'pending',
    createdAt: '2025-06-20T10:30:00Z',
  },
  {
    id: 'APP-002',
    fullName: 'Yuki Tanaka',
    email: 'yuki.t@email.jp',
    phone: '+81 90 1234 5678',
    program: 'Teaching',
    nationality: 'Japanese',
    status: 'reviewed',
    createdAt: '2025-06-19T12:00:00Z',
  },
]

const galleryImages: GalleryImage[] = [
  { id: 'G-001', src: '/images/gallery-5.jpg', alt: 'Global Experience photo', category: 'Gallery', uploadedAt: '2025-06-15T10:00:00Z' },
  { id: 'G-002', src: '/images/gallery-6.jpg', alt: 'Global Experience photo', category: 'Gallery', uploadedAt: '2025-06-15T10:00:00Z' },
  { id: 'G-003', src: '/images/gallery-7.jpg', alt: 'Global Experience photo', category: 'Gallery', uploadedAt: '2025-06-15T10:00:00Z' },
  { id: 'G-004', src: '/images/gallery-8.jpg', alt: 'Global Experience photo', category: 'Gallery', uploadedAt: '2025-06-15T10:00:00Z' },
  { id: 'G-005', src: '/images/gallery-9.jpg', alt: 'Global Experience photo', category: 'Gallery', uploadedAt: '2025-06-15T10:00:00Z' },
  { id: 'G-006', src: '/images/gallery-10.jpg', alt: 'Global Experience photo', category: 'Gallery', uploadedAt: '2025-06-15T10:00:00Z' },
  { id: 'G-007', src: '/images/gallery-11.jpg', alt: 'Global Experience photo', category: 'Gallery', uploadedAt: '2025-06-15T10:00:00Z' },
  { id: 'G-008', src: '/images/gallery-12.jpg', alt: 'Global Experience photo', category: 'Gallery', uploadedAt: '2025-06-15T10:00:00Z' },
  { id: 'G-009', src: '/images/gallery-13.jpg', alt: 'Global Experience photo', category: 'Gallery', uploadedAt: '2025-06-15T10:00:00Z' },
  { id: 'G-010', src: '/images/gallery-14.jpg', alt: 'Global Experience photo', category: 'Gallery', uploadedAt: '2025-06-15T10:00:00Z' },
]

// API to access data
export function getPickupRequests() { return pickupRequests }
export function getContactMessages() { return contactMessages }
export function getApplications() { return applications }
export function getGalleryImages() { return galleryImages }

export function updatePickupStatus(id: string, status: PickupRequest['status']) {
  const item = pickupRequests.find(p => p.id === id)
  if (item) item.status = status
}

export function updateMessageStatus(id: string, status: ContactMessage['status']) {
  const item = contactMessages.find(m => m.id === id)
  if (item) item.status = status
}

export function updateApplicationStatus(id: string, status: Application['status']) {
  const item = applications.find(a => a.id === id)
  if (item) item.status = status
}

export function addGalleryImage(image: Omit<GalleryImage, 'id' | 'uploadedAt'>) {
  const newImage: GalleryImage = {
    ...image,
    id: `G-${String(galleryImages.length + 1).padStart(3, '0')}`,
    uploadedAt: new Date().toISOString(),
  }
  galleryImages.push(newImage)
  return newImage
}

export function deleteGalleryImage(id: string) {
  const index = galleryImages.findIndex(g => g.id === id)
  if (index !== -1) galleryImages.splice(index, 1)
}
