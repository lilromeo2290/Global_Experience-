'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Loader2, Save, Phone, Mail, MapPin, Share2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Settings {
  [key: string]: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) setSettings(await res.json())
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadSettings() }, [loadSettings])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        toast({ title: 'Settings saved successfully' })
      }
    } catch {
      toast({ title: 'Failed to save settings', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage site settings and configuration</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-muted animate-pulse rounded w-32" />
                  <div className="h-10 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-40" />
                  <div className="h-10 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage site settings and configuration</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-cornell hover:bg-cornell-dark text-white">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="w-5 h-5 text-cornell" />
            Contact Information
          </CardTitle>
          <CardDescription>Primary contact details for the organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Contact Email
              </Label>
              <Input
                value={settings.contact_email || ''}
                onChange={(e) => updateSetting('contact_email', e.target.value)}
                placeholder="info@globalexperiencegh.org"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Contact Phone
              </Label>
              <Input
                value={settings.contact_phone || ''}
                onChange={(e) => updateSetting('contact_phone', e.target.value)}
                placeholder="+233 244 207 278"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Address
            </Label>
            <Input
              value={settings.contact_address || ''}
              onChange={(e) => updateSetting('contact_address', e.target.value)}
              placeholder="Accra, Ghana"
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp Number</Label>
            <Input
              value={settings.whatsapp_number || ''}
              onChange={(e) => updateSetting('whatsapp_number', e.target.value)}
              placeholder="233244207278"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Share2 className="w-5 h-5 text-vogue" />
            Social Media Links
          </CardTitle>
          <CardDescription>Social media profile URLs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input
              value={settings.social_facebook || ''}
              onChange={(e) => updateSetting('social_facebook', e.target.value)}
              placeholder="https://facebook.com/globalexperiencegh"
            />
          </div>
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input
              value={settings.social_instagram || ''}
              onChange={(e) => updateSetting('social_instagram', e.target.value)}
              placeholder="https://instagram.com/globalexperiencegh"
            />
          </div>
          <div className="space-y-2">
            <Label>Twitter / X</Label>
            <Input
              value={settings.social_twitter || ''}
              onChange={(e) => updateSetting('social_twitter', e.target.value)}
              placeholder="https://twitter.com/globalexperiencegh"
            />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input
              value={settings.social_linkedin || ''}
              onChange={(e) => updateSetting('social_linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/globalexperiencegh"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-cornell hover:bg-cornell-dark text-white" size="lg">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
