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
import { Plus, Pencil, Trash2, Briefcase, Loader2, GripVertical } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Program {
  id: string
  title: string
  sector: string
  description: string | null
  order: number
  active: boolean
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const [editing, setEditing] = useState<Program | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', sector: '', description: '', active: true })
  const { toast } = useToast()

  const loadPrograms = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/programs')
      if (res.ok) setPrograms(await res.json())
    } catch (error) {
      console.error('Failed to load programs:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadPrograms() }, [loadPrograms])

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', sector: '', description: '', active: true })
    setEditDialog(true)
  }

  const openEdit = (program: Program) => {
    setEditing(program)
    setForm({ title: program.title, sector: program.sector, description: program.description || '', active: program.active })
    setEditDialog(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editing ? `/api/admin/programs/${editing.id}` : '/api/admin/programs'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({ title: editing ? 'Program updated' : 'Program created' })
        setEditDialog(false)
        loadPrograms()
      }
    } catch {
      toast({ title: 'Failed to save program', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/programs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Program deleted' })
        setDeleteDialog(null)
        loadPrograms()
      }
    } catch {
      toast({ title: 'Failed to delete program', variant: 'destructive' })
    }
  }

  const toggleActive = async (program: Program) => {
    try {
      await fetch(`/api/admin/programs/${program.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !program.active }),
      })
      loadPrograms()
    } catch {
      toast({ title: 'Failed to toggle', variant: 'destructive' })
    }
  }

  const moveProgram = async (index: number, direction: 'up' | 'down') => {
    const newPrograms = [...programs]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newPrograms.length) return
    ;[newPrograms[index], newPrograms[targetIndex]] = [newPrograms[targetIndex], newPrograms[index]]
    const updates = newPrograms.map((p, i) => ({ id: p.id, order: i }))
    setPrograms(newPrograms)
    try {
      await Promise.all(
        updates.map((u) =>
          fetch(`/api/admin/programs/${u.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: u.order }),
          })
        )
      )
    } catch {
      toast({ title: 'Failed to reorder', variant: 'destructive' })
      loadPrograms()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Programs</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage placement programs and categories</p>
        </div>
        <Button onClick={openCreate} className="bg-cornell hover:bg-cornell-dark text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Program
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />)}</div>
      ) : programs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No programs yet. Add your first program!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {programs.map((program, index) => (
            <Card key={program.id}>
              <div className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveProgram(index, 'up')} disabled={index === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                    <GripVertical className="w-4 h-4 rotate-180" />
                  </button>
                  <button onClick={() => moveProgram(index, 'down')} disabled={index === programs.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-charcoal dark:text-white">{program.title}</h3>
                    <Badge variant="outline" className="text-xs">{program.sector}</Badge>
                    <Badge variant={program.active ? 'default' : 'secondary'} className={`text-xs ${program.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {program.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {program.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={program.active} onCheckedChange={() => toggleActive(program)} />
                  <Button variant="ghost" size="icon" onClick={() => openEdit(program)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteDialog(program.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Program' : 'Add New Program'}</DialogTitle>
            <DialogDescription>{editing ? 'Update program details' : 'Add a new placement program'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Medical Placement in Teaching Hospitals" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input id="sector" value={form.sector} onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value }))} placeholder="e.g. Healthcare, Education, Media" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Describe this placement program..." rows={4} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(checked) => setForm((p) => ({ ...p, active: checked }))} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.sector} className="bg-cornell hover:bg-cornell-dark text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program</AlertDialogTitle>
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
