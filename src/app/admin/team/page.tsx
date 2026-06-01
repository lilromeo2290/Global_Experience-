'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Users, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface TeamMember {
  id: string
  name: string
  title: string
  category: string
  bio: string
  expertise: string | null
  photo: string | null
  order: number
  active: boolean
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: '', title: '', category: '', bio: '', expertise: '', photo: '', active: true,
  })
  const { toast } = useToast()

  const loadMembers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/team')
      if (res.ok) setMembers(await res.json())
    } catch (error) {
      console.error('Failed to load team:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadMembers() }, [loadMembers])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setForm((prev) => ({ ...prev, photo: data.url }))
        toast({ title: 'Photo uploaded' })
      }
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', title: '', category: '', bio: '', expertise: '', photo: '', active: true })
    setEditDialog(true)
  }

  const openEdit = (member: TeamMember) => {
    setEditing(member)
    setForm({
      name: member.name,
      title: member.title,
      category: member.category,
      bio: member.bio,
      expertise: member.expertise || '',
      photo: member.photo || '',
      active: member.active,
    })
    setEditDialog(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editing ? `/api/admin/team/${editing.id}` : '/api/admin/team'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          expertise: form.expertise || null,
          photo: form.photo || null,
        }),
      })
      if (res.ok) {
        toast({ title: editing ? 'Member updated' : 'Member created' })
        setEditDialog(false)
        loadMembers()
      }
    } catch {
      toast({ title: 'Failed to save member', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Member deleted' })
        setDeleteDialog(null)
        loadMembers()
      }
    } catch {
      toast({ title: 'Failed to delete member', variant: 'destructive' })
    }
  }

  const toggleActive = async (member: TeamMember) => {
    try {
      await fetch(`/api/admin/team/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !member.active }),
      })
      loadMembers()
    } catch {
      toast({ title: 'Failed to toggle', variant: 'destructive' })
    }
  }

  const moveMember = async (index: number, direction: 'up' | 'down') => {
    const newMembers = [...members]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newMembers.length) return
    ;[newMembers[index], newMembers[targetIndex]] = [newMembers[targetIndex], newMembers[index]]
    const updates = newMembers.map((m, i) => ({ id: m.id, order: i }))
    setMembers(newMembers)
    try {
      await Promise.all(
        updates.map((u) =>
          fetch(`/api/admin/team/${u.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: u.order }),
          })
        )
      )
    } catch {
      toast({ title: 'Failed to reorder', variant: 'destructive' })
      loadMembers()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Team Members</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage leadership and team members</p>
        </div>
        <Button onClick={openCreate} className="bg-cornell hover:bg-cornell-dark text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : members.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No team members yet. Add your first member!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member, index) => (
            <Card key={member.id} className="overflow-hidden">
              <div className="flex gap-4 p-4">
                <div className="flex flex-col items-center gap-1">
                  <button onClick={() => moveMember(index, 'up')} disabled={index === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">▲</button>
                  <span className="text-xs text-muted-foreground">{index + 1}</span>
                  <button onClick={() => moveMember(index, 'down')} disabled={index === members.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">▼</button>
                </div>
                <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Users className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-charcoal dark:text-white truncate">{member.name}</h3>
                    <Badge variant={member.active ? 'default' : 'secondary'} className={`text-xs ${member.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {member.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-vogue font-medium">{member.title}</p>
                  <p className="text-xs text-muted-foreground">{member.category}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{member.bio}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Switch checked={member.active} onCheckedChange={() => toggleActive(member)} />
                  <Button variant="ghost" size="icon" onClick={() => openEdit(member)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteDialog(member.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
            <DialogDescription>{editing ? 'Update member details' : 'Add a new team member'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title / Position</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Chief Executive Officer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. Leadership, Technology" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Brief biography..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expertise">Expertise (optional)</Label>
              <Textarea id="expertise" value={form.expertise} onChange={(e) => setForm((p) => ({ ...p, expertise: e.target.value }))} placeholder="Skills and expertise..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Photo</Label>
              {form.photo ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted">
                  <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                  <Button variant="destructive" size="sm" className="absolute top-1 right-1 h-6 w-6 p-0" onClick={() => setForm((p) => ({ ...p, photo: '' }))}>×</Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="mx-auto max-w-xs" />
                  {uploading && <Loader2 className="w-4 h-4 animate-spin mx-auto mt-2" />}
                </div>
              )}
              <Input value={form.photo} onChange={(e) => setForm((p) => ({ ...p, photo: e.target.value }))} placeholder="Or enter photo URL" className="mt-2" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(checked) => setForm((p) => ({ ...p, active: checked }))} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name || !form.title || !form.bio} className="bg-cornell hover:bg-cornell-dark text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteDialog && handleDelete(deleteDialog)} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
