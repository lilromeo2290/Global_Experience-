'use client'

import { useState, useEffect } from 'react'
import { getAdminAuthToken, ADMIN_SECTIONS, isSuperAdmin } from '@/lib/auth'
import { UserPlus, Pencil, Trash2, Shield, ShieldCheck, ShieldAlert, Eye, X, Check, AlertTriangle } from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  name: string | null
  role: string
  permissions: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

const ROLES = [
  { value: 'super_admin', label: 'Super Admin', description: 'Full access to everything including user management', icon: ShieldAlert, color: 'text-red-600 bg-red-50' },
  { value: 'admin', label: 'Admin', description: 'Access to all sections except user management', icon: ShieldCheck, color: 'text-amber-600 bg-amber-50' },
  { value: 'editor', label: 'Editor', description: 'Can only access assigned sections', icon: Shield, color: 'text-blue-600 bg-blue-50' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access to assigned sections', icon: Eye, color: 'text-gray-600 bg-gray-50' },
]

export default function UsersManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'editor',
    permissions: [] as string[],
    active: true,
  })

  const canManageUsers = isSuperAdmin()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = getAdminAuthToken()
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'editor',
      permissions: [],
      active: true,
    })
    setEditingUser(null)
    setShowForm(false)
    setError('')
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: '',
      name: user.name || '',
      role: user.role,
      permissions: [...user.permissions],
      active: user.active,
    })
    setShowForm(true)
    setError('')
  }

  const handleRoleChange = (role: string) => {
    if (role === 'super_admin') {
      // Super admin gets all permissions
      setFormData({
        ...formData,
        role,
        permissions: ADMIN_SECTIONS.map(s => s.key),
      })
    } else if (role === 'admin') {
      // Admin gets all permissions except users
      setFormData({
        ...formData,
        role,
        permissions: ADMIN_SECTIONS.map(s => s.key).filter(k => k !== 'users'),
      })
    } else {
      setFormData({ ...formData, role, permissions: [] })
    }
  }

  const togglePermission = (key: string) => {
    if (formData.role === 'super_admin' || formData.role === 'admin') return // Auto-managed
    const perms = formData.permissions.includes(key)
      ? formData.permissions.filter(p => p !== key)
      : [...formData.permissions, key]
    setFormData({ ...formData, permissions: perms })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }

    if (!editingUser && !formData.password.trim()) {
      setError('Password is required for new users')
      return
    }

    try {
      const token = getAdminAuthToken()
      const url = editingUser ? '/api/admin/users' : '/api/admin/users'
      const method = editingUser ? 'PUT' : 'POST'
      const body = editingUser
        ? {
            id: editingUser.id,
            email: formData.email,
            password: formData.password || undefined,
            name: formData.name,
            role: formData.role,
            permissions: formData.permissions,
            active: formData.active,
          }
        : {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: formData.role,
            permissions: formData.permissions,
          }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to save user')
        return
      }

      setSuccess(editingUser ? 'User updated successfully!' : 'User created successfully!')
      resetForm()
      fetchUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to save user. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const token = getAdminAuthToken()
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to delete user')
        return
      }

      setConfirmDelete(null)
      setSuccess('User deleted successfully!')
      fetchUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete user. Please try again.')
    }
  }

  const getRoleBadge = (role: string) => {
    const roleInfo = ROLES.find(r => r.value === role)
    if (!roleInfo) return null
    const Icon = roleInfo.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {roleInfo.label}
      </span>
    )
  }

  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ShieldAlert className="w-16 h-16 text-mahogany/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-mahogany mb-2">Access Denied</h2>
          <p className="text-dove">Only Super Admins can manage users.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-mahogany border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mahogany">User Management</h1>
          <p className="text-dove text-sm">Manage admin users and their access permissions.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-mahogany hover:bg-mahogany-dark text-white rounded-lg text-sm font-medium transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 flex items-center gap-2">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => resetForm()}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-mahogany">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button onClick={resetForm} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-dove" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-dove mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:border-mahogany focus:ring-mahogany/20 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-dove mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@globalexperience.org"
                  required
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:border-mahogany focus:ring-mahogany/20 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-dove mb-1.5">
                  Password {editingUser ? '(leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
                  required={!editingUser}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:border-mahogany focus:ring-mahogany/20 focus:outline-none"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-dove mb-2">Role *</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.filter(r => r.value !== 'super_admin' || isSuperAdmin()).map(role => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleRoleChange(role.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        formData.role === role.value
                          ? 'border-mahogany bg-mahogany/5'
                          : 'border-gray-200 hover:border-mahogany/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <role.icon className={`w-4 h-4 ${formData.role === role.value ? 'text-mahogany' : 'text-dove'}`} />
                        <span className={`text-sm font-medium ${formData.role === role.value ? 'text-mahogany' : 'text-dove'}`}>
                          {role.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-dove/70 leading-tight">{role.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions - only for editor/viewer roles */}
              {(formData.role === 'editor' || formData.role === 'viewer') && (
                <div>
                  <label className="block text-sm font-medium text-dove mb-2">
                    Section Access Permissions
                  </label>
                  <p className="text-xs text-dove/60 mb-3">
                    Select which sections this user can access. {formData.role === 'viewer' ? 'Viewers can only view, not edit.' : 'Editors can view and edit.'}
                  </p>
                  <div className="space-y-2">
                    {ADMIN_SECTIONS.map(section => (
                      <label
                        key={section.key}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                          formData.permissions.includes(section.key)
                            ? 'border-mahogany bg-mahogany/5'
                            : 'border-gray-200 hover:border-mahogany/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(section.key)}
                          onChange={() => togglePermission(section.key)}
                          className="w-4 h-4 rounded border-gray-300 text-mahogany focus:ring-mahogany/20"
                        />
                        <span className={`text-sm font-medium ${formData.permissions.includes(section.key) ? 'text-mahogany' : 'text-dove'}`}>
                          {section.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Active toggle - only for editing */}
              {editingUser && (
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={e => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-mahogany focus:ring-mahogany/20"
                    />
                    <div>
                      <span className="text-sm font-medium text-dove">Active</span>
                      <p className="text-xs text-dove/60">Inactive users cannot log in.</p>
                    </div>
                  </label>
                </div>
              )}

              {/* Submit buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 h-11 border border-gray-200 text-dove rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 bg-mahogany hover:bg-mahogany-dark text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-mahogany mb-2">Delete User?</h3>
              <p className="text-sm text-dove mb-6">
                This action cannot be undone. The user will permanently lose access to the admin panel.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 h-11 border border-gray-200 text-dove rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-dove uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-dove uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-dove uppercase tracking-wider">Access</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-dove uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-dove uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-mahogany/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-mahogany text-sm font-bold">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-mahogany">{user.name || 'No name'}</p>
                        <p className="text-xs text-dove">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-5 py-4">
                    {user.role === 'super_admin' ? (
                      <span className="text-xs text-dove">All sections</span>
                    ) : user.role === 'admin' ? (
                      <span className="text-xs text-dove">All except Users</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.length === 0 ? (
                          <span className="text-xs text-dove/50">No access</span>
                        ) : (
                          user.permissions.map(perm => {
                            const section = ADMIN_SECTIONS.find(s => s.key === perm)
                            return section ? (
                              <span key={perm} className="inline-block px-2 py-0.5 bg-mahogany/5 text-mahogany text-[10px] rounded-md font-medium">
                                {section.label}
                              </span>
                            ) : null
                          })
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.active
                        ? 'text-green-700 bg-green-50'
                        : 'text-gray-500 bg-gray-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 rounded-lg hover:bg-mahogany/5 text-dove hover:text-mahogany transition-colors"
                        title="Edit user"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(user.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-dove hover:text-red-600 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <p className="text-dove text-sm">No users found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Legend */}
      <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-mahogany mb-3">Role Permissions Guide</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {ROLES.map(role => (
            <div key={role.value} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <role.icon className="w-5 h-5 text-dove mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-mahogany">{role.label}</p>
                <p className="text-xs text-dove mt-0.5">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
