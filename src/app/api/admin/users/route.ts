import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAdminUserFromRequest, userHasPermission } from '@/lib/auth'

// GET - List all admin users
export async function GET(req: NextRequest) {
  try {
    const currentUser = getAdminUserFromRequest(req)
    if (!currentUser || !userHasPermission(currentUser, 'users')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await db.adminUser.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Parse permissions for each user
    const usersWithParsedPermissions = users.map(user => ({
      ...user,
      permissions: JSON.parse(user.permissions || '[]'),
    }))

    return NextResponse.json(usersWithParsedPermissions)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST - Create a new admin user
export async function POST(req: NextRequest) {
  try {
    const currentUser = getAdminUserFromRequest(req)
    if (!currentUser || !userHasPermission(currentUser, 'users')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { email, password, name, role, permissions } = data

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await db.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    })
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 })
    }

    // Only super_admin can create super_admin users
    if (role === 'super_admin' && currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admins can create super admin accounts' }, { status: 403 })
    }

    const newUser = await db.adminUser.create({
      data: {
        email: email.toLowerCase().trim(),
        password,
        name: name || null,
        role: role || 'editor',
        permissions: JSON.stringify(permissions || []),
        active: true,
      },
    })

    // Return without password
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json({
      ...userWithoutPassword,
      permissions: JSON.parse(newUser.permissions || '[]'),
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

// PUT - Update an admin user
export async function PUT(req: NextRequest) {
  try {
    const currentUser = getAdminUserFromRequest(req)
    if (!currentUser || !userHasPermission(currentUser, 'users')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { id, email, password, name, role, permissions, active } = data

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check if the user being updated exists
    const existingUser = await db.adminUser.findUnique({ where: { id } })
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only super_admin can modify super_admin users
    if (existingUser.role === 'super_admin' && currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admins can modify super admin accounts' }, { status: 403 })
    }

    // Only super_admin can assign super_admin role
    if (role === 'super_admin' && currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admins can assign super admin role' }, { status: 403 })
    }

    // Build update data
    const updateData: Record<string, any> = {}
    if (email !== undefined) updateData.email = email.toLowerCase().trim()
    if (password !== undefined && password !== '') updateData.password = password
    if (name !== undefined) updateData.name = name || null
    if (role !== undefined) updateData.role = role
    if (permissions !== undefined) updateData.permissions = JSON.stringify(permissions)
    if (active !== undefined) updateData.active = active

    const updatedUser = await db.adminUser.update({
      where: { id },
      data: updateData,
    })

    // Return without password
    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json({
      ...userWithoutPassword,
      permissions: JSON.parse(updatedUser.permissions || '[]'),
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE - Delete an admin user
export async function DELETE(req: NextRequest) {
  try {
    const currentUser = getAdminUserFromRequest(req)
    if (!currentUser || !userHasPermission(currentUser, 'users')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Prevent deleting yourself
    if (id === currentUser.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })
    }

    // Check if the user being deleted exists
    const existingUser = await db.adminUser.findUnique({ where: { id } })
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only super_admin can delete super_admin users
    if (existingUser.role === 'super_admin' && currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admins can delete super admin accounts' }, { status: 403 })
    }

    await db.adminUser.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
