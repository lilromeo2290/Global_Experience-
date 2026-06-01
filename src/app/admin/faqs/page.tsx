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
import { Plus, Pencil, Trash2, HelpCircle, Loader2, ChevronUp, ChevronDown } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FAQ {
  id: string
  question: string
  answer: string
  order: number
  active: boolean
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ question: '', answer: '', active: true })
  const { toast } = useToast()

  const loadFAQs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/faqs')
      if (res.ok) setFaqs(await res.json())
    } catch (error) {
      console.error('Failed to load FAQs:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadFAQs() }, [loadFAQs])

  const openCreate = () => {
    setEditing(null)
    setForm({ question: '', answer: '', active: true })
    setEditDialog(true)
  }

  const openEdit = (faq: FAQ) => {
    setEditing(faq)
    setForm({ question: faq.question, answer: faq.answer, active: faq.active })
    setEditDialog(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editing ? `/api/admin/faqs/${editing.id}` : '/api/admin/faqs'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast({ title: editing ? 'FAQ updated' : 'FAQ created' })
        setEditDialog(false)
        loadFAQs()
      }
    } catch {
      toast({ title: 'Failed to save FAQ', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'FAQ deleted' })
        setDeleteDialog(null)
        loadFAQs()
      }
    } catch {
      toast({ title: 'Failed to delete FAQ', variant: 'destructive' })
    }
  }

  const toggleActive = async (faq: FAQ) => {
    try {
      await fetch(`/api/admin/faqs/${faq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !faq.active }),
      })
      loadFAQs()
    } catch {
      toast({ title: 'Failed to toggle', variant: 'destructive' })
    }
  }

  const moveFAQ = async (index: number, direction: 'up' | 'down') => {
    const newFAQs = [...faqs]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newFAQs.length) return
    ;[newFAQs[index], newFAQs[targetIndex]] = [newFAQs[targetIndex], newFAQs[index]]
    const updates = newFAQs.map((f, i) => ({ id: f.id, order: i }))
    setFaqs(newFAQs)
    try {
      await Promise.all(
        updates.map((u) =>
          fetch(`/api/admin/faqs/${u.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: u.order }),
          })
        )
      )
    } catch {
      toast({ title: 'Failed to reorder', variant: 'destructive' })
      loadFAQs()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">FAQs</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage frequently asked questions</p>
        </div>
        <Button onClick={openCreate} className="bg-cornell hover:bg-cornell-dark text-white">
          <Plus className="w-4 h-4 mr-2" /> Add FAQ
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />)}</div>
      ) : faqs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No FAQs yet. Add your first FAQ!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Card key={faq.id}>
              <div className="flex items-start gap-3 p-4">
                <div className="flex flex-col gap-0.5 mt-1">
                  <button onClick={() => moveFAQ(index, 'up')} disabled={index === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveFAQ(index, 'down')} disabled={index === faqs.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-charcoal dark:text-white">{faq.question}</h3>
                    <Badge variant={faq.active ? 'default' : 'secondary'} className={`text-xs ${faq.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {faq.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={faq.active} onCheckedChange={() => toggleActive(faq)} />
                  <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteDialog(faq.id)} className="text-destructive hover:text-destructive">
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
            <DialogTitle>{editing ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
            <DialogDescription>{editing ? 'Update FAQ details' : 'Add a new frequently asked question'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input id="question" value={form.question} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} placeholder="Enter the question" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea id="answer" value={form.answer} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} placeholder="Enter the answer..." rows={6} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(checked) => setForm((p) => ({ ...p, active: checked }))} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.question || !form.answer} className="bg-cornell hover:bg-cornell-dark text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
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
