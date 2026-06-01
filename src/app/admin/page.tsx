'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Briefcase,
  Users,
  GalleryHorizontal,
  FileText,
  HelpCircle,
  Images,
  ArrowRight,
  Clock,
  TrendingUp,
} from 'lucide-react'

interface Stats {
  programs: number
  teamMembers: number
  galleryImages: number
  applications: number
  faqs: number
  heroSlides: number
  pendingApplications: number
}

interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  program: string
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
  accepted: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentApps, setRecentApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, appsRes] = await Promise.all([
          fetch('/api/admin/dashboard/stats'),
          fetch('/api/admin/applications?limit=5'),
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        if (appsRes.ok) {
          const appsData = await appsRes.json()
          setRecentApps(appsData.slice(0, 5))
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const statCards = [
    {
      title: 'Programs',
      value: stats?.programs ?? 0,
      icon: Briefcase,
      href: '/admin/programs',
      color: 'text-cornell',
      bgColor: 'bg-cornell/10',
    },
    {
      title: 'Team Members',
      value: stats?.teamMembers ?? 0,
      icon: Users,
      href: '/admin/team',
      color: 'text-vogue',
      bgColor: 'bg-vogue/10',
    },
    {
      title: 'Gallery Images',
      value: stats?.galleryImages ?? 0,
      icon: GalleryHorizontal,
      href: '/admin/gallery',
      color: 'text-vogue-light',
      bgColor: 'bg-vogue-light/10',
    },
    {
      title: 'Applications',
      value: stats?.applications ?? 0,
      icon: FileText,
      href: '/admin/applications',
      color: 'text-cornell',
      bgColor: 'bg-cornell/10',
      sub: stats?.pendingApplications ? `${stats.pendingApplications} pending` : undefined,
    },
    {
      title: 'FAQs',
      value: stats?.faqs ?? 0,
      icon: HelpCircle,
      href: '/admin/faqs',
      color: 'text-vogue',
      bgColor: 'bg-vogue/10',
    },
    {
      title: 'Hero Slides',
      value: stats?.heroSlides ?? 0,
      icon: Images,
      href: '/admin/hero',
      color: 'text-vogue-light',
      bgColor: 'bg-vogue-light/10',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-charcoal dark:text-white">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back! Here&apos;s an overview of your website content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:shadow-md transition-shadow border-border cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                    <p className="text-3xl font-bold text-charcoal dark:text-white mt-1">
                      {loading ? '...' : card.value}
                    </p>
                    {card.sub && (
                      <p className="text-xs text-cornell font-medium mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {card.sub}
                      </p>
                    )}
                  </div>
                  <div className={`w-11 h-11 ${card.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Applications */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cornell" />
                Recent Applications
              </CardTitle>
              <CardDescription>Latest placement applications received</CardDescription>
            </div>
            <Link href="/admin/applications">
              <Button variant="outline" size="sm" className="text-cornell border-cornell/30 hover:bg-cornell/10">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : recentApps.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal dark:text-white truncate">
                      {app.firstName} {app.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {app.program} • {app.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <Badge
                      variant="outline"
                      className={`text-xs ${statusColors[app.status] || ''}`}
                    >
                      {app.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/admin/hero">
              <Button variant="outline" className="w-full justify-start h-auto py-3 text-left" >
                <Images className="w-4 h-4 mr-2 text-cornell flex-shrink-0" />
                <span className="text-xs">Manage Hero Slides</span>
              </Button>
            </Link>
            <Link href="/admin/programs">
              <Button variant="outline" className="w-full justify-start h-auto py-3 text-left">
                <Briefcase className="w-4 h-4 mr-2 text-vogue flex-shrink-0" />
                <span className="text-xs">Add New Program</span>
              </Button>
            </Link>
            <Link href="/admin/team">
              <Button variant="outline" className="w-full justify-start h-auto py-3 text-left">
                <Users className="w-4 h-4 mr-2 text-vogue-light flex-shrink-0" />
                <span className="text-xs">Add Team Member</span>
              </Button>
            </Link>
            <Link href="/admin/gallery">
              <Button variant="outline" className="w-full justify-start h-auto py-3 text-left">
                <GalleryHorizontal className="w-4 h-4 mr-2 text-cornell flex-shrink-0" />
                <span className="text-xs">Upload Gallery Image</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
