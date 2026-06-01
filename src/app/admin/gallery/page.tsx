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
import { Plus, Pencil, Trash2, GalleryHorizontal, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface GalleryImage {
  id: string
  src: string
  alt: string
  category: string
  order: number
  active: boolean
}

const categories = ['Volunteering', 'Community', 'Experience', 'Other']

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const [editing, setEditing] = useState<GalleryImage | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState('All')
  const [form, setForm] = useState({ src: '', alt: '', category: 'Volunteering', active: true })
  const { toast } = useToast()

  const loadImages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/gallery')
      if (res.ok) setImages(await res.json())
    } catch (error) {
      console.error('Failed to load gallery:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadImages() }, [loadImages])

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
        toast({ title: 'Image uploaded' })
      }
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ src: '', alt: '', category: 'Volunteering', active: true })
    setEditDialog(true)
  }

  const openEdit = (image: GalleryImage) => {
    setEditing(image)
    setForm({ src: image.src, alt: image.alt, category: image.category, active: image.active })
    setEditDialog(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editing ? `/api/admin/gallery/${editing.id}` : '/api/admin/gallery'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({ title: editing ? 'Image updated' : 'Image created' })
        setEditDialog(false)
        loadImages()
      }
    } catch {
      toast({ title: 'Failed to save image', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Image deleted' })
        setDeleteDialog(null)
        loadImages()
      }
    } catch {
      toast({ title: 'Failed to delete image', variant: 'destructive' })
    }
  }

  const toggleActive = async (image: GalleryImage) => {
    try {
      await fetch(`/api/admin/gallery/${image.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !image.active }),
      })
      loadImages()
    } catch {
      toast({ title: 'Failed to toggle', variant: 'destructive' })
    }
  }

  const filtered = filter === 'All' ? images : images.filter((img) => img.category === filter)
  const allCategories = ['All', ...new Set(images.map((img) => img.category))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Gallery</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage gallery images and categories</p>
        </div>
        <Button onClick={openCreate} className="bg-cornell hover:bg-cornell-dark text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Image
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-cornell text-white shadow-md shadow-cornell/20'
                : 'bg-white text-charcoal hover:bg-cornell/10 hover:text-cornell border border-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <GalleryHorizontal className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No gallery images found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((image) => (
            <Card key={image.id} className="overflow-hidden group">
              <div className="aspect-square relative bg-muted">
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => openEdit(image)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setDeleteDialog(image.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {!image.active && (
                  <Badge className="absolute top-2 left-2 bg-gray-500 text-white text-xs">Inactive</Badge>
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">{image.category}</Badge>
                  <Switch checked={image.active} onCheckedChange={() => toggleActive(image)} className="scale-75" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{image.alt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Image' : 'Add New Image'}</DialogTitle>
            <DialogDescription>{editing ? 'Update image details' : 'Add a new gallery image'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Image</Label>
              {form.src ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <img src={form.src} alt="Preview" className="w-full h-full object-cover" />
                  <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setForm((p) => ({ ...p, src: '' }))}>Remove</Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="mx-auto max-w-xs" />
                  {uploading && <Loader2 className="w-4 h-4 animate-spin mx-auto mt-2" />}
                </div>
              )}
              <Input value={form.src} onChange={(e) => setForm((p) => ({ ...p, src: e.target.value }))} placeholder="Or enter image URL" className="mt-2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt">Alt Text</Label>
              <Input id="alt" value={form.alt} onChange={(e) => setForm((p) => ({ ...p, alt: e.target.value }))} placeholder="Describe the image" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(checked) => setForm((p) => ({ ...p, active: checked }))} />
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

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
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
