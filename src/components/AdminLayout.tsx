import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, Film, MessageSquare, Settings, LogOut } from 'lucide-react'
import TkweenLogo from './TkweenLogo'

const links = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/projects', icon: Film, label: 'Projects & Videos' },
  { to: '/admin/requests', icon: MessageSquare, label: 'Client Requests' },
  { to: '/admin/settings', icon: Settings, label: 'Site Settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const nav = useNavigate()
  const loc = useLocation()

  useEffect(() => {
    if (sessionStorage.getItem('tkween_admin') !== '1') nav('/admin/login')
  }, [nav])

  const logout = () => { sessionStorage.removeItem('tkween_admin'); nav('/admin/login') }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-border flex flex-col" style={{ background: '#0d2420' }}>
        <div className="p-6">
          <TkweenLogo size={36} dark showText />
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {links.map(l => {
            const active = loc.pathname === l.to
            return (
              <Link key={l.to} to={l.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                <l.icon size={18} /> {l.label}
              </Link>
            )
          })}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-7 py-4 text-sm text-muted-foreground hover:text-foreground transition-colors border-t border-border">
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
