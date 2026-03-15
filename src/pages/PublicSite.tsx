import { useState, useEffect, useRef, useCallback } from 'react'
import { useLang } from '@/context/LanguageContext'
import { getSettings, getProjects, addRequest, type Settings, type Project } from '@/lib/storage'
import TkweenLogo from '@/components/TkweenLogo'
import { Menu, X, Play, Camera, Video, Plane, Radio, Phone, Mail, MapPin, ChevronDown } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

/* ───── Helpers ───── */
function getVideoEmbed(url: string) {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`
  return url // mp4
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0
        const step = Math.max(1, Math.floor(target / 60))
        const id = setInterval(() => {
          start += step
          if (start >= target) { setCount(target); clearInterval(id) }
          else setCount(start)
        }, 20)
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <div ref={ref} className="text-4xl md:text-5xl font-semibold text-primary">{count}{suffix}</div>
}

const CATS = ['ALL', 'CONFERENCES', 'CORPORATE', 'BRAND', 'EVENTS'] as const

const CLIENTS = [
  'Saudi Aramco', 'NEOM', 'Ministry of Culture', 'Saudi Tourism Authority',
  'King Salman Foundation', 'Riyadh Season', 'SABIC', 'STC',
  'Vision 2030', 'Royal Commission', 'KAUST', 'Saudi Airlines',
  'Red Sea Global', 'ACWA Power', 'Diriyah Gate', 'Ministry of Investment',
]

export default function PublicSite() {
  const { t, lang, setLang, isAr } = useLang()
  const { toast } = useToast()
  const [settings, setSettings] = useState<Settings>(getSettings)
  const [projects] = useState<Project[]>(() => getProjects().filter(p => p.visible))
  const [heroIdx, setHeroIdx] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [catFilter, setCatFilter] = useState<string>('ALL')
  const [videoModal, setVideoModal] = useState<string | null>(null)

  // Increment visit count
  useEffect(() => {
    const s = getSettings()
    s.visit_count = String(Number(s.visit_count || 0) + 1)
    localStorage.setItem('tkween_settings', JSON.stringify(s))
    setSettings(s)
  }, [])

  // Hero slideshow
  const heroImages: string[] = (() => { try { return JSON.parse(settings.hero_images) } catch { return [] } })()
  useEffect(() => {
    if (heroImages.length <= 1) return
    const id = setInterval(() => setHeroIdx(i => (i + 1) % heroImages.length), 6000)
    return () => clearInterval(id)
  }, [heroImages.length])

  // Scroll handler
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const filteredProjects = catFilter === 'ALL' ? projects : projects.filter(p => p.category === catFilter)

  const navLinks = [
    { href: '#work', label: t('nav_work') },
    { href: '#services', label: t('nav_services') },
    { href: '#about', label: t('nav_about') },
    { href: '#contact', label: t('nav_contact') },
  ]

  const services = [
    { icon: Camera, num: '01', title: t('s1'), desc: t('s1d') },
    { icon: Video, num: '02', title: t('s2'), desc: t('s2d') },
    { icon: Plane, num: '03', title: t('s3'), desc: t('s3d') },
    { icon: Radio, num: '04', title: t('s4'), desc: t('s4d') },
  ]

  const stats = [
    { value: 150, suffix: '+', label: t('st1l') },
    { value: 8, suffix: '+', label: t('st2l') },
    { value: 50, suffix: '+', label: t('st3l') },
    { value: 16, suffix: '', label: t('st4l') },
  ]

  // Contact form
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData(e.target as HTMLFormElement)
    addRequest({
      full_name: fd.get('full_name') as string,
      organization: fd.get('organization') as string,
      service_type: fd.get('service_type') as string,
      event_date: fd.get('event_date') as string || '',
      location: fd.get('location') as string || '',
      details: fd.get('details') as string || '',
      phone: fd.get('phone') as string,
      email: fd.get('email') as string,
    })
    toast({ title: isAr ? 'تم الإرسال' : 'Sent!', description: t('f_ok') })
    ;(e.target as HTMLFormElement).reset()
  }, [t, isAr, toast])

  const catKeys: Record<string, string> = { ALL: t('f_all'), CONFERENCES: t('f_conf'), CORPORATE: t('f_corp'), BRAND: t('f_brand'), EVENTS: t('f_events') }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur border-b border-border shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          <TkweenLogo size={32} dark showText={false} />
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wider">{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
              {isAr ? 'EN' : 'AR'}
            </button>
            <a href="#contact" className="hidden md:inline-flex px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity">
              {t('nav_quote')}
            </a>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-foreground">
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden bg-background/95 backdrop-blur border-t border-border px-6 py-4 space-y-3">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileMenu(false)} className="block text-muted-foreground hover:text-primary py-2">{l.label}</a>
            ))}
            <a href="#contact" onClick={() => setMobileMenu(false)} className="block px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm text-center">{t('nav_quote')}</a>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroImages.map((img, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: i === heroIdx ? 1 : 0 }}>
            <img src={img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,30,26,0.7), rgba(10,30,26,0.9))' }} />
          </div>
        ))}
        <div className="relative z-10 text-center max-w-4xl px-6">
          <p className="text-primary text-sm tracking-[0.3em] mb-4">{t('hero_tag')}</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground mb-2" style={{ fontFamily: isAr ? 'Tajawal' : 'Inter' }}>
            {t('hero_main')}
          </h1>
          <h2 className="text-2xl md:text-4xl text-muted-foreground font-light mb-6">{t('hero_sub')}</h2>
          <p className="text-muted-foreground mb-8 text-sm md:text-base tracking-wide">{t('hero_desc')}</p>
          <a href="#work" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all text-sm tracking-wider">
            {t('hero_cta')}
          </a>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted-foreground text-xs tracking-widest">
          {t('scroll')} <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ═══ WORK ═══ */}
      <section id="work" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">{t('work_title')}</h2>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATS.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${catFilter === c ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground hover:border-primary'}`}>
              {catKeys[c]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(p => (
            <div key={p.id} className="group relative rounded-xl overflow-hidden cursor-pointer border border-border hover:border-primary transition-colors"
              onClick={() => p.video_url && setVideoModal(p.video_url)}>
              <img src={p.thumbnail} alt={isAr ? p.title_ar : p.title_en} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                {p.video_url && <Play size={40} className="text-primary" />}
                <p className="text-foreground font-medium text-center px-4">{isAr ? p.title_ar : p.title_en}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="services" className="py-24 px-6" style={{ background: '#0d2420' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16">{t('srv_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map(s => (
              <div key={s.num} className="relative p-8 rounded-2xl border border-border bg-card hover:border-primary transition-colors group">
                <span className="absolute top-4 right-6 text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">{s.num}</span>
                <s.icon size={32} className="text-primary mb-4" />
                <h3 className="text-xl font-medium text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16">{t('stats_title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <AnimatedCounter target={s.value} suffix={s.suffix} />
              <p className="text-muted-foreground text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="py-24 px-6" style={{ background: '#0d2420' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80" alt="About" className="w-full rounded-2xl" />
          </div>
          <div>
            <p className="text-primary text-sm tracking-[0.3em] mb-3">{t('about_tag')}</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">{t('about_title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{t('about_body')}</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: isAr ? 'الجودة' : 'Quality', d: isAr ? 'أعلى معايير الإنتاج' : 'Top production standards' },
                { n: isAr ? 'الإبداع' : 'Creativity', d: isAr ? 'رؤية فنية متميزة' : 'Distinctive artistic vision' },
                { n: isAr ? 'الاحتراف' : 'Professionalism', d: isAr ? 'فريق مؤهل ومدرب' : 'Qualified trained team' },
                { n: isAr ? 'الالتزام' : 'Commitment', d: isAr ? 'تسليم في الموعد' : 'On-time delivery' },
              ].map(v => (
                <div key={v.n} className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-foreground font-medium mb-1">{v.n}</p>
                  <p className="text-muted-foreground text-xs">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY US ═══ */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <p className="text-primary text-sm tracking-[0.3em] mb-3">{t('why_tag')}</p>
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">{t('why_title')}</h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">{t('why_body')}</p>
      </section>

      {/* ═══ CLIENTS ═══ */}
      <section className="py-24 px-6" style={{ background: '#0d2420' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">{t('clients_title')}</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">{t('clients_sub')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CLIENTS.map(c => (
              <div key={c} className="p-5 rounded-xl border border-border bg-card text-center text-foreground text-sm hover:border-primary transition-colors cursor-default">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">{t('contact_title')}</h2>
        <p className="text-muted-foreground text-center mb-12">{t('contact_sub')}</p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="full_name" required placeholder={t('f_name')} className="px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground" />
          <input name="organization" required placeholder={t('f_org')} className="px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground" />
          <select name="service_type" required className="px-4 py-3 rounded-lg bg-card border border-border text-foreground">
            <option value="">{t('f_svc_ph')}</option>
            <option value="photography">{t('f_s1')}</option>
            <option value="video">{t('f_s2')}</option>
            <option value="drone">{t('f_s3')}</option>
            <option value="live">{t('f_s4')}</option>
            <option value="other">{t('f_s5')}</option>
          </select>
          <input name="event_date" type="date" placeholder={t('f_date')} className="px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground" />
          <input name="location" placeholder={t('f_loc')} className="md:col-span-2 px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground" />
          <textarea name="details" rows={3} placeholder={t('f_det')} className="md:col-span-2 px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground resize-none" />
          <input name="phone" required placeholder={t('f_phone')} className="px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground" />
          <input name="email" type="email" required placeholder={t('f_email')} className="px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground" />
          <button type="submit" className="md:col-span-2 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity tracking-wider">
            {t('f_submit')}
          </button>
        </form>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border py-16 px-6" style={{ background: '#0d2420' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <TkweenLogo size={40} dark showText />
            <p className="text-muted-foreground text-sm mt-4 leading-relaxed">{t('about_body')}</p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-4">{isAr ? 'روابط سريعة' : 'Quick Links'}</h3>
            <div className="space-y-2">
              {navLinks.map(l => <a key={l.href} href={l.href} className="block text-muted-foreground text-sm hover:text-primary">{l.label}</a>)}
            </div>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-4">{isAr ? 'تواصل معنا' : 'Contact Us'}</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Phone size={14} className="text-primary" /> {settings.phone}</div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-primary" /> {settings.email}</div>
              <div className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {settings.address}</div>
            </div>
            <div className="flex gap-4 mt-4">
              {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener" className="text-muted-foreground hover:text-primary text-sm">Instagram</a>}
              {settings.twitter && <a href={settings.twitter} target="_blank" rel="noopener" className="text-muted-foreground hover:text-primary text-sm">X</a>}
              {settings.snapchat && <a href={settings.snapchat} target="_blank" rel="noopener" className="text-muted-foreground hover:text-primary text-sm">Snapchat</a>}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-border text-center text-muted-foreground text-xs">
          {t('footer_rights')}
        </div>
      </footer>

      {/* ═══ WHATSAPP FAB ═══ */}
      <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        style={{ background: '#25d366' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* ═══ VIDEO MODAL ═══ */}
      {videoModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80" onClick={() => setVideoModal(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-4xl aspect-video relative">
            <button onClick={() => setVideoModal(null)} className="absolute -top-10 right-0 text-foreground hover:text-primary"><X size={24} /></button>
            {videoModal.match(/\.(mp4|webm)$/i)
              ? <video src={videoModal} controls autoPlay className="w-full h-full rounded-xl" />
              : <iframe src={getVideoEmbed(videoModal)!} className="w-full h-full rounded-xl" allow="autoplay; fullscreen" allowFullScreen />
            }
          </div>
        </div>
      )}
    </div>
  )
}
