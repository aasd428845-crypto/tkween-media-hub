import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { getSettings, saveSettings, type Settings } from '@/lib/storage'
import { Save, Trash2, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AdminSettings() {
  const [settings, setSettings] = useState(getSettings)
  const { toast } = useToast()
  const [newImg, setNewImg] = useState('')

  const update = (key: keyof Settings, value: string) => {
    setSettings(s => ({ ...s, [key]: value }))
  }

  const saveSingle = (key: keyof Settings) => {
    saveSettings(settings)
    toast({ title: 'Saved', description: `${key} updated successfully.` })
  }

  const heroImages: string[] = (() => { try { return JSON.parse(settings.hero_images) } catch { return [] } })()

  const removeHero = (i: number) => {
    const imgs = heroImages.filter((_, idx) => idx !== i)
    const s = { ...settings, hero_images: JSON.stringify(imgs) }
    setSettings(s); saveSettings(s)
  }

  const addHero = () => {
    if (!newImg.trim()) return
    const imgs = [...heroImages, newImg.trim()]
    const s = { ...settings, hero_images: JSON.stringify(imgs) }
    setSettings(s); saveSettings(s); setNewImg('')
  }

  const Field = ({ label, sKey }: { label: string; sKey: keyof Settings }) => (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <label className="text-muted-foreground text-xs mb-1 block">{label}</label>
        <input value={settings[sKey]} onChange={e => update(sKey, e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm" />
      </div>
      <button onClick={() => saveSingle(sKey)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
        <Save size={16} />
      </button>
    </div>
  )

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Site Settings</h1>
      <div className="max-w-2xl space-y-8">
        {/* Contact & Social */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">Contact & Social</h2>
          <Field label="Phone" sKey="phone" />
          <Field label="Email" sKey="email" />
          <Field label="WhatsApp" sKey="whatsapp" />
          <Field label="Address" sKey="address" />
          <Field label="Instagram" sKey="instagram" />
          <Field label="Twitter / X" sKey="twitter" />
          <Field label="Snapchat" sKey="snapchat" />
        </section>

        {/* Password */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">Admin Password</h2>
          <Field label="Password" sKey="admin_password" />
        </section>

        {/* Visit Counter */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">Visit Counter</h2>
          <Field label="Current Count" sKey="visit_count" />
        </section>

        {/* Hero Images */}
        <section className="space-y-4">
          <h2 className="text-lg font-medium text-foreground border-b border-border pb-2">Hero Background Images</h2>
          <div className="space-y-3">
            {heroImages.map((url, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg border border-border bg-background">
                <img src={url} alt="" className="w-24 h-14 object-cover rounded" />
                <span className="flex-1 text-xs text-muted-foreground truncate">{url}</span>
                <button onClick={() => removeHero(i)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input value={newImg} onChange={e => setNewImg(e.target.value)} placeholder="New image URL"
              className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm" />
            <button onClick={addHero} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
              <Plus size={16} />
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
