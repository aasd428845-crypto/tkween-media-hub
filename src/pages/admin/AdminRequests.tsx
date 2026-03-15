import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { getRequests, saveRequests, type Request as Req } from '@/lib/storage'
import { X, Trash2, Search } from 'lucide-react'

const STATUSES = ['all', 'new', 'reviewed', 'contacted', 'closed']

export default function AdminRequests() {
  const [requests, setRequests] = useState(getRequests)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Req | null>(null)

  const save = (list: Req[]) => { saveRequests(list); setRequests(list) }

  const filtered = requests.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false
    if (search && !r.full_name.toLowerCase().includes(search.toLowerCase()) && !r.organization.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => b.created_at.localeCompare(a.created_at))

  const changeStatus = (id: string, status: string) => {
    const list = requests.map(r => r.id === id ? { ...r, status } : r)
    save(list)
    if (selected?.id === id) setSelected({ ...selected, status })
  }

  const del = (id: string) => {
    save(requests.filter(r => r.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Client Requests</h1>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize transition-colors ${filter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {s}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="pl-9 pr-4 py-1.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm" />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted text-muted-foreground">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Organization</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No requests found</td></tr>}
              {filtered.map(r => (
                <tr key={r.id} onClick={() => setSelected(r)}
                  className={`border-t border-border cursor-pointer transition-colors ${selected?.id === r.id ? 'bg-muted' : 'hover:bg-muted/50'}`}>
                  <td className="px-4 py-3 text-foreground">{r.full_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.organization}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.service_type}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs capitalize" style={{
                    background: r.status === 'new' ? '#f59e0b20' : r.status === 'contacted' ? '#2dd4bf20' : '#94a3b820',
                    color: r.status === 'new' ? '#f59e0b' : r.status === 'contacted' ? '#2dd4bf' : '#94a3b8',
                  }}>{r.status}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="w-80 rounded-xl border border-border bg-card p-5 space-y-4 h-fit sticky top-8">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground font-medium">Request Details</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            {[
              ['Name', selected.full_name], ['Organization', selected.organization],
              ['Service', selected.service_type], ['Phone', selected.phone], ['Email', selected.email],
              ['Date', selected.event_date], ['Location', selected.location], ['Details', selected.details],
            ].map(([l, v]) => v ? (
              <div key={l}><p className="text-muted-foreground text-xs mb-1">{l}</p><p className="text-foreground text-sm">{v}</p></div>
            ) : null)}
            <div>
              <p className="text-muted-foreground text-xs mb-2">Change Status</p>
              <div className="flex flex-wrap gap-2">
                {['new', 'reviewed', 'contacted', 'closed'].map(s => (
                  <button key={s} onClick={() => changeStatus(selected.id, s)}
                    className={`px-3 py-1 rounded-full text-xs capitalize ${selected.status === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => del(selected.id)} className="flex items-center gap-2 text-destructive text-sm hover:underline">
              <Trash2 size={14} /> Delete Request
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
