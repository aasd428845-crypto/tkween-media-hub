import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSettings } from '@/lib/storage'
import TkweenLogo from '@/components/TkweenLogo'

export default function AdminLogin() {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const nav = useNavigate()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === getSettings().admin_password) {
      sessionStorage.setItem('tkween_admin', '1')
      nav('/admin/dashboard')
    } else setErr(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={submit} className="w-full max-w-sm p-8 rounded-2xl border border-border bg-card space-y-6">
        <div className="flex justify-center"><TkweenLogo size={48} dark showText /></div>
        <h1 className="text-center text-foreground text-lg font-medium">Admin Login</h1>
        <input
          type="password" placeholder="Password" value={pw}
          onChange={e => { setPw(e.target.value); setErr(false) }}
          className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {err && <p className="text-destructive text-sm text-center">Wrong password</p>}
        <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
          LOGIN
        </button>
      </form>
    </div>
  )
}
