import { NextRequest, NextResponse } from 'next/server'
import { db, isDatabaseAvailable } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ success: false, error: 'Database not available. Please try again later.' }, { status: 503 })
    }

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    // Find user in database
    const user = await db.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 })
    }

    // Check if user is active
    if (!user.active) {
      return NextResponse.json({ success: false, error: 'Account is disabled. Contact administrator.' }, { status: 403 })
    }

    // Check password (plaintext for now - same as existing system)
    if (user.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 })
    }

    // Parse permissions
    let permissions: string[] = []
    try {
      permissions = JSON.parse(user.permissions)
    } catch {
      permissions = []
    }

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions,
      active: user.active,
    }

    return NextResponse.json({ success: true, user: userData })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
