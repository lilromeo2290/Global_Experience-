'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { SessionProvider, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import {
  LayoutDashboard,
  Images,
  Briefcase,
  Users,
  GalleryHorizontal,
  HelpCircle,
  FileText,
  Settings,
  LogOut,
  Menu,
  Globe,
  X,
  ChevronLeft,
  Headphones,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/hero', label: 'Hero Slides', icon: Images },
  { href: '/admin/programs', label: 'Programs', icon: Briefcase },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/gallery', label: 'Gallery', icon: GalleryHorizontal },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/applications', label: 'Applications', icon: FileText },
  { href: '/admin/live-chat', label: 'Live Chat', icon: Headphones },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function SidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10 flex-shrink-0">
        <div className="w-9 h-9 bg-cornell rounded-lg flex items-center justify-center flex-shrink-0">
          <Globe className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-sm leading-tight">Global Experience</h1>
            <p className="text-white/50 text-xs">Admin CMS</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-cornell text-white shadow-md shadow-cornell/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="border-t border-white/10 p-3 flex-shrink-0">
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className={`w-full text-white/70 hover:text-white hover:bg-white/10 ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </div>
  )
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-ivory dark:bg-[#0A1F12]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col bg-gradient-to-b from-vogue-dark to-vogue transition-all duration-300 ${
          collapsed ? 'w-[68px]' : 'w-64'
        }`}
      >
        <SidebarContent collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full border shadow-md flex items-center justify-center hover:bg-ivory transition-colors"
        >
          <ChevronLeft className={`w-3.5 h-3.5 text-charcoal transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-vogue-dark to-vogue border-none">
          <div className="absolute top-3 right-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-[68px]' : 'lg:pl-64'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#122A1B]/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-charcoal dark:text-white">
                Content Management System
              </h2>
              <p className="text-xs text-muted-foreground">
                Global Experience Placements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-charcoal dark:text-white">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.email || ''}
              </p>
            </div>
            <div className="w-9 h-9 bg-vogue rounded-full flex items-center justify-center text-white text-sm font-bold">
              {(session?.user?.name || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  // Login page gets its own layout without sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  // All other admin pages get the dashboard layout
  return <DashboardLayout>{children}</DashboardLayout>
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  )
}
