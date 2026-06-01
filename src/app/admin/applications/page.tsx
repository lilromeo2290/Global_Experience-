'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Eye, Trash2, Filter, Loader2, Mail, Phone, Globe, Calendar } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  nationality: string | null
  program: string
  branch: string | null
  duration: string | null
  startDate: string | null
  message: string | null
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
  accepted: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [viewDialog, setViewDialog] = useState<Application | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  const loadApplications = useCallback(async () => {
    try {
      const url = statusFilter === 'all' ? '/api/admin/applications' : `/api/admin/applications?status=${statusFilter}`
      const res = await fetch(url)
      if (res.ok) setApplications(await res.json())
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { loadApplications() }, [loadApplications])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        toast({ title: `Application ${status}` })
        loadApplications()
        if (viewDialog?.id === id) {
          setViewDialog({ ...viewDialog, status })
        }
      }
    } catch {
      toast({ title: 'Failed to update status', variant: 'destructive' })
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Application deleted' })
        setDeleteDialog(null)
        loadApplications()
      }
    } catch {
      toast({ title: 'Failed to delete application', variant: 'destructive' })
    }
  }

  const statusCounts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    reviewed: applications.filter((a) => a.status === 'reviewed').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Applications</h1>
          <p className="text-muted-foreground text-sm mt-1">View and manage placement applications</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'reviewed', 'accepted', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setLoading(true) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
              statusFilter === status
                ? 'bg-cornell text-white shadow-md shadow-cornell/20'
                : 'bg-white text-charcoal hover:bg-cornell/10 hover:text-cornell border border-border'
            }`}
          >
            {status} ({statusCounts[status] ?? 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />)}</div>
      ) : applications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No applications found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id} className="hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 bg-cornell/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-cornell font-bold text-sm">
                    {app.firstName[0]}{app.lastName[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-medium text-charcoal dark:text-white">{app.firstName} {app.lastName}</h3>
                    <Badge variant="outline" className={`text-xs ${statusColors[app.status] || ''}`}>
                      {app.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{app.program} • {app.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Applied: {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={app.status} onValueChange={(value) => updateStatus(app.id, value)}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => setViewDialog(app)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteDialog(app.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Detail Dialog */}
      <Dialog open={!!viewDialog} onOpenChange={() => setViewDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {viewDialog?.firstName} {viewDialog?.lastName}&apos;s application
            </DialogDescription>
          </DialogHeader>
          {viewDialog && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-cornell/10 rounded-full flex items-center justify-center">
                  <span className="text-cornell font-bold">
                    {viewDialog.firstName[0]}{viewDialog.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal dark:text-white">{viewDialog.firstName} {viewDialog.lastName}</h3>
                  <Badge variant="outline" className={`text-xs ${statusColors[viewDialog.status] || ''}`}>
                    {viewDialog.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-charcoal dark:text-white">{viewDialog.email}</span>
                </div>
                {viewDialog.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-charcoal dark:text-white">{viewDialog.phone}</span>
                  </div>
                )}
                {viewDialog.nationality && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-charcoal dark:text-white">{viewDialog.nationality}</span>
                  </div>
                )}
                {viewDialog.duration && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-charcoal dark:text-white">{viewDialog.duration}</span>
                  </div>
                )}
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div><span className="text-xs font-semibold text-muted-foreground">Program:</span> <span className="text-sm text-charcoal dark:text-white">{viewDialog.program}</span></div>
                {viewDialog.branch && <div><span className="text-xs font-semibold text-muted-foreground">Branch:</span> <span className="text-sm text-charcoal dark:text-white">{viewDialog.branch}</span></div>}
                {viewDialog.startDate && <div><span className="text-xs font-semibold text-muted-foreground">Start Date:</span> <span className="text-sm text-charcoal dark:text-white">{viewDialog.startDate}</span></div>}
                <div><span className="text-xs font-semibold text-muted-foreground">Applied:</span> <span className="text-sm text-charcoal dark:text-white">{new Date(viewDialog.createdAt).toLocaleDateString()}</span></div>
              </div>

              {viewDialog.message && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">Message:</span>
                  <p className="text-sm text-charcoal dark:text-white mt-1 bg-muted/50 rounded-lg p-3">{viewDialog.message}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => updateStatus(viewDialog.id, 'accepted')}
                  disabled={updating || viewDialog.status === 'accepted'}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => updateStatus(viewDialog.id, 'rejected')}
                  disabled={updating || viewDialog.status === 'rejected'}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  size="sm"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => updateStatus(viewDialog.id, 'reviewed')}
                  disabled={updating || viewDialog.status === 'reviewed'}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  Mark Reviewed
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
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
