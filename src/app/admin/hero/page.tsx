'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Pencil, Trash2, GripVertical, ImageIcon, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface HeroSlide {
  id: string
  src: string
  alt: string
  order: number
  active: boolean
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const [editing, setEditing] = useState<HeroSlide | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ src: '', alt: '', active: true })
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const loadSlides = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/hero')
      if (res.ok) {
        const data = await res.json()
        setSlides(data)
      }
    } catch (error) {
      console.error('Failed to load slides:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadSlides() }, [loadSlides])

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
        setForm((prev) => ({ ...prev, src: data.url }))
        toast({ title: 'Image uploaded successfully' })
      }
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ src: '', alt: '', active: true })
    setEditDialog(true)
  }

  const openEdit = (slide: HeroSlide) => {
    setEditing(slide)
    setForm({ src: slide.src, alt: slide.alt, active: slide.active })
    setEditDialog(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editing ? `/api/admin/hero/${editing.id}` : '/api/admin/hero'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast({ title: editing ? 'Slide updated' : 'Slide created' })
        setEditDialog(false)
        loadSlides()
      }
    } catch {
      toast({ title: 'Failed to save slide', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/hero/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Slide deleted' })
        setDeleteDialog(null)
        loadSlides()
      }
    } catch {
      toast({ title: 'Failed to delete slide', variant: 'destructive' })
    }
  }

  const toggleActive = async (slide: HeroSlide) => {
    try {
      await fetch(`/api/admin/hero/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !slide.active }),
      })
      loadSlides()
    } catch {
      toast({ title: 'Failed to toggle', variant: 'destructive' })
    }
  }

  const moveSlide = async (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newSlides.length) return

    ;[newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]]

    // Update order values
    const updates = newSlides.map((s, i) => ({
      id: s.id,
      order: i,
    }))

    setSlides(newSlides)

    try {
      await Promise.all(
        updates.map((u) =>
          fetch(`/api/admin/hero/${u.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: u.order }),
          })
        )
      )
    } catch {
      toast({ title: 'Failed to reorder', variant: 'destructive' })
      loadSlides()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Hero Slides</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage homepage carousel slides</p>
        </div>
        <Button onClick={openCreate} className="bg-cornell hover:bg-cornell-dark text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Slide
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : slides.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No hero slides yet. Add your first slide!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, index) => (
            <Card key={slide.id} className="overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveSlide(index, 'up')}
                    disabled={index === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <GripVertical className="w-4 h-4 rotate-180" />
                  </button>
                  <button
                    onClick={() => moveSlide(index, 'down')}
                    disabled={index === slides.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-32 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal dark:text-white truncate">{slide.alt}</p>
                  <p className="text-xs text-muted-foreground truncate">{slide.src}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">Order: {slide.order}</Badge>
                    <Badge variant={slide.active ? 'default' : 'secondary'} className={`text-xs ${slide.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {slide.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={slide.active} onCheckedChange={() => toggleActive(slide)} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(slide)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteDialog(slide.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Slide' : 'Add New Slide'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the hero slide details' : 'Add a new slide to the homepage carousel'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Image</Label>
              {form.src ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted">
                  <img src={form.src} alt="Preview" className="w-full h-full object-cover" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setForm((prev) => ({ ...prev, src: '' }))}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="mx-auto max-w-xs"
                  />
                  {uploading && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-1">
                <Label htmlFor="src" className="text-xs text-muted-foreground">Or enter image URL</Label>
                <Input
                  id="src"
                  value={form.src}
                  onChange={(e) => setForm((prev) => ({ ...prev, src: e.target.value }))}
                  placeholder="/images/slide.jpg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={form.alt}
                onChange={(e) => setForm((prev) => ({ ...prev, alt: e.target.value }))}
                placeholder="Describe the image"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.active}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, active: checked }))}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.src || !form.alt} className="bg-cornell hover:bg-cornell-dark text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slide</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hero slide? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteDialog && handleDelete(deleteDialog)} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
