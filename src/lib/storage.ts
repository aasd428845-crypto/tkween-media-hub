export interface Settings {
  phone: string
  email: string
  whatsapp: string
  address: string
  instagram: string
  twitter: string
  snapchat: string
  admin_password: string
  visit_count: string
  hero_images: string
}

export interface Project {
  id: string
  title_en: string
  title_ar: string
  category: string
  thumbnail: string
  video_url: string
  visible: boolean
  featured: boolean
  display_order: number
}

export interface Request {
  id: string
  full_name: string
  organization: string
  service_type: string
  event_date: string
  location: string
  details: string
  phone: string
  email: string
  status: string
  created_at: string
}

const DEFAULT_SETTINGS: Settings = {
  phone: '0553120141',
  email: 'sales@tkweensa.com',
  whatsapp: '966553120141',
  address: 'الرياض، المملكة العربية السعودية',
  instagram: 'https://instagram.com/Tkweensa',
  twitter: 'https://twitter.com/Tkweensa',
  snapchat: 'https://snapchat.com/add/Tkweensa',
  admin_password: 'tkween2025',
  visit_count: '0',
  hero_images: JSON.stringify([
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=85',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=85',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=85',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1920&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=85',
  ]),
}

const DEFAULT_PROJECTS: Project[] = [
  { id:'1', title_en:'Saudi Vision Forum 2024', title_ar:'منتدى رؤية السعودية 2024', category:'CONFERENCES', thumbnail:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', video_url:'', visible:true, featured:true, display_order:1 },
  { id:'2', title_en:'Aramco Annual Summit', title_ar:'قمة أرامكو السنوية', category:'CONFERENCES', thumbnail:'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80', video_url:'', visible:true, featured:false, display_order:2 },
  { id:'3', title_en:'NEOM Brand Campaign', title_ar:'حملة علامة نيوم', category:'CORPORATE', thumbnail:'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80', video_url:'', visible:true, featured:false, display_order:3 },
  { id:'4', title_en:'Red Sea Film Series', title_ar:'سلسلة أفلام البحر الأحمر', category:'BRAND', thumbnail:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', video_url:'', visible:true, featured:true, display_order:4 },
  { id:'5', title_en:'Riyadh Season', title_ar:'موسم الرياض', category:'EVENTS', thumbnail:'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80', video_url:'', visible:true, featured:false, display_order:5 },
  { id:'6', title_en:'Future Investment Forum', title_ar:'منتدى مستقبل الاستثمار', category:'CONFERENCES', thumbnail:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', video_url:'', visible:true, featured:false, display_order:6 },
]

function init<T>(key: string, defaults: T): T {
  const stored = localStorage.getItem(key)
  if (stored) return JSON.parse(stored)
  localStorage.setItem(key, JSON.stringify(defaults))
  return defaults
}

export function getSettings(): Settings {
  return init('tkween_settings', DEFAULT_SETTINGS)
}
export function saveSettings(s: Settings) {
  localStorage.setItem('tkween_settings', JSON.stringify(s))
}
export function updateSetting(key: keyof Settings, value: string) {
  const s = getSettings()
  ;(s as any)[key] = value
  saveSettings(s)
}

export function getProjects(): Project[] {
  return init('tkween_projects', DEFAULT_PROJECTS)
}
export function saveProjects(p: Project[]) {
  localStorage.setItem('tkween_projects', JSON.stringify(p))
}

export function getRequests(): Request[] {
  return init('tkween_requests', [])
}
export function saveRequests(r: Request[]) {
  localStorage.setItem('tkween_requests', JSON.stringify(r))
}
export function addRequest(r: Omit<Request, 'id' | 'status' | 'created_at'>) {
  const all = getRequests()
  all.push({ ...r, id: crypto.randomUUID(), status: 'new', created_at: new Date().toISOString() })
  saveRequests(all)
}
