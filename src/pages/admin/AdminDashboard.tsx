import AdminLayout from '@/components/AdminLayout'
import { getProjects, getRequests, getSettings } from '@/lib/storage'
import { Film, MessageSquare, Bell, Eye } from 'lucide-react'

export default function AdminDashboard() {
  const projects = getProjects()
  const requests = getRequests()
  const settings = getSettings()
  const newReqs = requests.filter(r => r.status === 'new')

  const stats = [
    { icon: Film, label: 'Total Projects', value: projects.length, color: '#2dd4bf' },
    { icon: MessageSquare, label: 'Total Requests', value: requests.length, color: '#60a5fa' },
    { icon: Bell, label: 'New Requests', value: newReqs.length, color: '#f59e0b' },
    { icon: Eye, label: 'Visit Count', value: settings.visit_count, color: '#a78bfa' },
  ]

  const recent = [...requests].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 8)

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg" style={{ background: s.color + '20' }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <span className="text-muted-foreground text-sm">{s.label}</span>
            </div>
            <p className="text-3xl font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-medium text-foreground mb-4">Recent Requests</h2>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Organization</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No requests yet</td></tr>
            )}
            {recent.map(r => (
              <tr key={r.id} className="border-t border-border hover:bg-muted/50">
                <td className="px-4 py-3 text-foreground">{r.full_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.organization}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.service_type}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs" style={{
                    background: r.status === 'new' ? '#f59e0b20' : r.status === 'contacted' ? '#2dd4bf20' : '#94a3b820',
                    color: r.status === 'new' ? '#f59e0b' : r.status === 'contacted' ? '#2dd4bf' : '#94a3b8',
                  }}>{r.status}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
