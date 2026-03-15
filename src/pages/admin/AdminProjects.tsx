import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { getProjects, saveProjects, type Project } from '@/lib/storage'
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react'

const CATS = ['CONFERENCES', 'CORPORATE', 'BRAND', 'EVENTS']
const empty: Project = { id:'', title_en:'', title_ar:'', category:'CONFERENCES', thumbnail:'', video_url:'', visible:true, featured:false, display_order:0 }

export default function AdminProjects() {
  const [projects, setProjects] = useState(getProjects)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const save = (list: Project[]) => { saveProjects(list); setProjects(list) }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    const fd = new FormData(e.target as HTMLFormElement)
    const p: Project = {
      id: editing.id || crypto.randomUUID(),
      title_en: fd.get('title_en') as string,
      title_ar: fd.get('title_ar') as string,
      category: fd.get('category') as string,
      thumbnail: fd.get('thumbnail') as string,
      video_url: fd.get('video_url') as string,
      featured: fd.has('featured'),
      visible: fd.has('visible'),
      display_order: Number(fd.get('display_order')) || 0,
    }
    const list = editing.id ? projects.map(x => x.id === p.id ? p : x) : [...projects, p]
    save(list)
    setEditing(null)
  }

  const toggle = (id: string, key: 'featured' | 'visible') => {
    save(projects.map(p => p.id === id ? { ...p, [key]: !p[key] } : p))
  }

  const del = (id: string) => { save(projects.filter(p => p.id !== id)); setDeleting(null) }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Projects & Videos</h1>
        <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90">
          <Plus size={16} /> Add Project
        </button>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted text-muted-foreground">
            <th className="px-4 py-3 text-left">Thumb</th>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Video</th>
            <th className="px-4 py-3 text-center">Featured</th>
            <th className="px-4 py-3 text-center">Visible</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr></thead>
          <tbody>{projects.map(p => (
            <tr key={p.id} className="border-t border-border hover:bg-muted/50">
              <td className="px-4 py-2"><img src={p.thumbnail} alt="" className="w-16 h-10 object-cover rounded" /></td>
              <td className="px-4 py-2"><div className="text-foreground">{p.title_en}</div><div className="text-muted-foreground text-xs">{p.title_ar}</div></td>
              <td className="px-4 py-2 text-muted-foreground">{p.category}</td>
              <td className="px-4 py-2 text-muted-foreground">{p.video_url ? '✓' : '—'}</td>
              <td className="px-4 py-2 text-center"><button onClick={() => toggle(p.id, 'featured')}><Star size={16} className={p.featured ? 'text-primary fill-primary' : 'text-muted-foreground'} /></button></td>
              <td className="px-4 py-2 text-center"><button onClick={() => toggle(p.id, 'visible')}>{p.visible ? <Eye size={16} className="text-primary" /> : <EyeOff size={16} className="text-muted-foreground" />}</button></td>
              <td className="px-4 py-2 text-right space-x-2">
                <button onClick={() => setEditing(p)} className="text-muted-foreground hover:text-foreground"><Pencil size={16} /></button>
                <button onClick={() => setDeleting(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* Edit/Add Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setEditing(null)}>
          <form onSubmit={submitForm} onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-medium text-foreground">{editing.id ? 'Edit Project' : 'Add Project'}</h2>
            <input name="title_en" defaultValue={editing.title_en} placeholder="Title (English)" required className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground" />
            <input name="title_ar" defaultValue={editing.title_ar} placeholder="العنوان بالعربي" required className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground" />
            <select name="category" defaultValue={editing.category} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground">
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input name="thumbnail" defaultValue={editing.thumbnail} placeholder="Thumbnail URL" required className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground" />
            <input name="video_url" defaultValue={editing.video_url} placeholder="Video URL (YouTube/Vimeo/MP4)" className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground" />
            <input name="display_order" type="number" defaultValue={editing.display_order} placeholder="Display order" className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground" />
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-foreground text-sm"><input type="checkbox" name="featured" defaultChecked={editing.featured} /> Featured</label>
              <label className="flex items-center gap-2 text-foreground text-sm"><input type="checkbox" name="visible" defaultChecked={editing.visible} /> Visible</label>
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleting(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-medium text-foreground">Delete Project?</h2>
            <p className="text-muted-foreground text-sm">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleting(null)} className="px-4 py-2 rounded-lg border border-border text-muted-foreground">Cancel</button>
              <button onClick={() => del(deleting)} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
