import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db, isDatabaseAvailable } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // If database is not available, no admin login possible
        if (!isDatabaseAvailable()) {
          console.warn('Database not available - admin login disabled')
          return null
        }

        try {
          const admin = await db.adminUser.findUnique({
            where: { email: credentials.email },
          })

          if (!admin) {
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, admin.password)
          if (!isValid) {
            return null
          }

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          }
        } catch (error) {
          console.error('Error during admin authorization:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string
        ;(session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
}

export async function getServerSession() {
  const { getServerSession } = await import("next-auth")
  return getServerSession(authOptions)
}

// Admin sections for permission management
export const ADMIN_SECTIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'hero', label: 'Hero / Slides' },
  { key: 'programs', label: 'Programs' },
  { key: 'team', label: 'Team' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'faqs', label: 'FAQs' },
  { key: 'applications', label: 'Applications' },
  { key: 'messages', label: 'Messages' },
  { key: 'content', label: 'Content' },
  { key: 'settings', label: 'Settings' },
  { key: 'pickups', label: 'Pickups' },
  { key: 'users', label: 'User Management' },
  { key: 'live-chat', label: 'Live Chat' },
]

// Check if the current client-side user is a super admin
export function isSuperAdmin(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem('adminUser')
    if (!stored) return false
    const user = JSON.parse(stored)
    return user?.role === 'super_admin'
  } catch {
    return false
  }
}

// Get admin auth token from localStorage (client-side)
export function getAdminAuthToken(): string {
  if (typeof window === 'undefined') return ''
  try {
    return localStorage.getItem('adminToken') || ''
  } catch {
    return ''
  }
}

// Extract admin user info from request headers (server-side)
export function getAdminUserFromRequest(req: { headers: { get: (name: string) => string | null } }) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  // In a real implementation this would verify the JWT token
  // For now, return a basic user object
  try {
    const token = authHeader.replace('Bearer ', '')
    const payload = JSON.parse(atob(token.split('.')[1] || ''))
    return payload
  } catch {
    return null
  }
}

// Check if a user has permission for a specific section
export function userHasPermission(
  user: { role?: string; permissions?: string[] } | null,
  section: string
): boolean {
  if (!user) return false
  if (user.role === 'super_admin') return true
  if (user.role === 'admin') return section !== 'users'
  return Array.isArray(user.permissions) && user.permissions.includes(section)
}
